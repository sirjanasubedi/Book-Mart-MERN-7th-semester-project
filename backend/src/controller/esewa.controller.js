const axios = require("axios");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Payment = require("../model/Payment");

const SIGNED_FIELD_NAMES = "total_amount,transaction_uuid,product_code";

const ESEWA_STATUSES = new Set([
  "PENDING", "COMPLETE", "FULL_REFUND", "PARTIAL_REFUND",
  "AMBIGUOUS", "NOT_FOUND", "CANCELED",
]);

const generateEsewaSignature = (message, secret) =>
  crypto.createHmac("sha256", secret).update(message).digest("base64");

const getBackendUrl = () =>
  process.env.SERVER_URL || process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const getEsewaConfig = () => {
  const isProduction = process.env.ESEWA_ENV === "production";
  const backendUrl = getBackendUrl();
  return {
    productCode: process.env.ESEWA_PRODUCT_CODE,
    secret: process.env.ESEWA_SECRET,
    paymentUrl: process.env.ESEWA_PAYMENT_URL || (
      isProduction
        ? "https://epay.esewa.com.np/api/epay/main/v2/form"
        : "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
    ),
    statusUrl: process.env.ESEWA_STATUS_CHECK_URL || (
      isProduction
        ? "https://esewa.com.np/api/epay/transaction/status/"
        : "https://rc-epay.esewa.com.np/api/epay/transaction/status/"
    ),
    successUrl: process.env.ESEWA_SUCCESS_URL || `${backendUrl}/esewa/success`,
    failureUrl: process.env.ESEWA_FAILURE_URL || `${backendUrl}/esewa/failure`,
  };
};

const getKhaltiConfig = () => ({
  secretKey: process.env.KHALTI_SECRET_KEY,
  initiateUrl: process.env.KHALTI_INITIATE_URL || "https://a.khalti.com/api/v2/epayment/initiate/",
  verifyUrl: process.env.KHALTI_VERIFY_URL || "https://a.khalti.com/api/v2/epayment/lookup/",
  successUrl: process.env.KHALTI_SUCCESS_URL || `${process.env.CLIENT_URL}/payment-success`,
  failureUrl: process.env.ESEWA_FAILURE_URL || `${process.env.CLIENT_URL}/payment-failure`,
});

const normalizeAmount = (amount) => {
  const parsed = Number(amount);
  if (!Number.isFinite(parsed) || parsed <= 0)
    throw new Error("A valid payment amount is required.");
  return parsed;
};

const decodeEsewaData = (encodedData) =>
  JSON.parse(Buffer.from(encodedData, "base64").toString("utf8"));

// ── Tries multiple amount formats because eSewa UAT returns inconsistent formats
const verifyEsewaSignature = (payload, secret) => {
  if (!payload?.signed_field_names || !payload?.signature) return false;

  const fields = payload.signed_field_names.split(",");
  const received = payload.signature;
  const amount = Number(payload.total_amount);

  // Build all possible messages with different amount formats
  const amountVariants = new Set([
    payload.total_amount,          // original string from eSewa
    String(amount),                // e.g. "70"
    amount.toFixed(1),             // e.g. "70.0"
    amount.toFixed(2),             // e.g. "70.00"
  ]);

  for (const variant of amountVariants) {
    const modified = { ...payload, total_amount: variant };
    const message = fields.map((f) => `${f}=${modified[f]}`).join(",");
    const expected = generateEsewaSignature(message, secret);

    try {
      const expectedBuf = Buffer.from(expected);
      const receivedBuf = Buffer.from(received);
      if (
        expectedBuf.length === receivedBuf.length &&
        crypto.timingSafeEqual(expectedBuf, receivedBuf)
      ) {
        return true;
      }
    } catch {
      // continue trying other variants
    }
  }

  return false;
};

const normalizeProductIds = (productIds = []) =>
  productIds.map((item) => item?._id || item).filter(Boolean);

const sanitizeOrderId = (orderId) =>
  orderId && mongoose.Types.ObjectId.isValid(orderId) ? orderId : null;

// ─── eSewa: POST /initiate-payment ───────────────────────────────────────────
const EsewaInitiatePayment = async (req, res) => {
  const { amount, productId, productIds, orderId } = req.body;
  const config = getEsewaConfig();

  if (!config.productCode || !config.secret) {
    return res.status(500).json({ message: "eSewa is not configured on the server." });
  }

  try {
    const totalAmount = normalizeAmount(amount);
    const transactionUuid =
      productId || `BM-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    if (!/^[A-Za-z0-9-]+$/.test(transactionUuid)) {
      return res.status(400).json({
        message: "transaction_uuid can only contain alphanumeric characters and hyphens.",
      });
    }

    const signatureMessage = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${config.productCode}`;
    const signature = generateEsewaSignature(signatureMessage, config.secret);

    const formData = {
      amount: String(totalAmount),
      tax_amount: "0",
      total_amount: String(totalAmount),
      transaction_uuid: transactionUuid,
      product_code: config.productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: config.successUrl,
      failure_url: config.failureUrl,
      signed_field_names: SIGNED_FIELD_NAMES,
      signature,
    };

    await Payment.findOneAndUpdate(
      { transaction_uuid: transactionUuid },
      {
        transaction_uuid: transactionUuid,
        product_code: config.productCode,
        product_ids: normalizeProductIds(productIds),
        order_id: sanitizeOrderId(orderId),
        amount: totalAmount,
        status: "PENDING",
        method: "esewa",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ paymentUrl: config.paymentUrl, formData });
  } catch (error) {
    console.error("eSewa initiation error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// ─── eSewa: POST /payment-status ─────────────────────────────────────────────
const paymentStatus = async (req, res) => {
  const { data } = req.body;
  const config = getEsewaConfig();

  if (!config.productCode || !config.secret) {
    return res.status(500).json({ message: "eSewa is not configured on the server." });
  }

  try {
    if (!data) return res.status(400).json({ message: "Missing eSewa data parameter." });

    // Step 1: Decode base64 payload
    let decodedPayload;
try {
  // Handle case where data is already an object (double-wrapped)
  const rawData = typeof data === "object" && data.data ? data.data : data;
  decodedPayload = decodeEsewaData(rawData);
} catch {
  return res.status(400).json({ message: "Invalid eSewa data payload." });
}

    console.log("eSewa decoded payload:", JSON.stringify(decodedPayload, null, 2));

    // Step 2: Verify signature
    const signatureValid = verifyEsewaSignature(decodedPayload, config.secret);
    console.log("Signature valid:", signatureValid);

    if (!signatureValid) {
      console.error("Signature mismatch. Secret used:", config.secret);
      return res.status(400).json({ message: "Invalid eSewa response signature." });
    }

    // Step 3: Check payment status
    if (decodedPayload.status !== "COMPLETE") {
      return res.status(400).json({
        message: `Payment status is ${decodedPayload.status}, not COMPLETE.`,
      });
    }

    const transactionUuid = decodedPayload.transaction_uuid;

    // Step 4: Find payment in DB
    const payment = await Payment.findOne({ transaction_uuid: transactionUuid });
    if (!payment) {
      console.error("Transaction not found in DB:", transactionUuid);
      return res.status(404).json({ message: "Transaction not found in database." });
    }

    // Step 5: Prevent double processing
    if (payment.status === "COMPLETE") {
      return res.status(200).json({
        message: "Payment already verified.",
        transaction: payment,
      });
    }

    // Step 6: Verify with eSewa server
    let verifyResponse;
    try {
      verifyResponse = await axios.get(config.statusUrl, {
        params: {
          product_code: payment.product_code,
          total_amount: payment.amount,
          transaction_uuid: payment.transaction_uuid,
        },
        timeout: 10000,
      });
      console.log("eSewa verify response:", verifyResponse.data);
    } catch (verifyErr) {
      console.error("eSewa server verify failed:", verifyErr.message);
      // If eSewa UAT server is down, trust the decoded payload signature instead
      payment.status = decodedPayload.status;
      payment.ref_id = decodedPayload.transaction_code || null;
      await payment.save();
      return res.status(200).json({
        message: "Payment verified via payload (eSewa server unreachable).",
        transaction: payment,
      });
    }

    const esewaStatus = verifyResponse.data?.status;
    if (!ESEWA_STATUSES.has(esewaStatus)) {
      return res.status(502).json({
        message: "Unexpected eSewa status.",
        data: verifyResponse.data,
      });
    }

    // Step 7: Amount fraud check
    const verifiedAmount = Number(verifyResponse.data?.total_amount);
    if (verifiedAmount && Math.abs(verifiedAmount - payment.amount) > 0.01) {
      console.error("FRAUD ALERT: Amount mismatch", {
        expected: payment.amount,
        received: verifiedAmount,
      });
      return res.status(400).json({ message: "Payment amount mismatch detected." });
    }

    // Step 8: Update payment record
    payment.status = esewaStatus;
    payment.ref_id = verifyResponse.data?.ref_id || decodedPayload?.transaction_code || null;
    await payment.save();

    return res.status(200).json({
      message: "Payment verified successfully.",
      transaction: payment,
      esewa: verifyResponse.data,
    });
  } catch (error) {
    console.error("eSewa status error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Server error while verifying eSewa payment.",
      error: error.response?.data || error.message,
    });
  }
};

const buildEsewaCallbackPayload = (req) => ({
  ...req.query,
  ...req.body,
});

const handleEsewaSuccess = (req, res) => {
  const payload = buildEsewaCallbackPayload(req);
  console.log("eSewa success callback payload:", payload);

  const rawData = typeof payload.data === "string" ? payload.data : Buffer.from(JSON.stringify(payload)).toString("base64");
  const redirectUrl = `${process.env.CLIENT_URL}/payment-success?data=${encodeURIComponent(rawData)}`;
  return res.redirect(302, redirectUrl);
};

const handleEsewaFailure = (req, res) => {
  const payload = buildEsewaCallbackPayload(req);
  console.log("eSewa failure callback payload:", payload);

  const errorMessage = payload.error || payload.status || "eSewa payment failed.";
  const redirectUrl = `${process.env.CLIENT_URL}/payment-failure?error=${encodeURIComponent(errorMessage)}`;
  return res.redirect(302, redirectUrl);
};

// ─── Khalti: POST /initiate-khalti ───────────────────────────────────────────
const KhaltiInitiatePayment = async (req, res) => {
  const { amount, productIds, orderId, productName } = req.body;
  const config = getKhaltiConfig();

  try {
    const totalAmount = normalizeAmount(amount);
    const transactionUuid = `BM-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    // ── Simulation mode (no Khalti key configured) ──────────────────────────
    if (!config.secretKey) {
      console.log("Khalti not configured — running in simulation mode");
      const pidx = `SIM-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

      await Payment.findOneAndUpdate(
        { transaction_uuid: transactionUuid },
        {
          transaction_uuid: transactionUuid,
          product_code: "KHALTI",
          product_ids: normalizeProductIds(productIds),
          order_id: sanitizeOrderId(orderId),
          amount: totalAmount,
          status: "PENDING",
          method: "khalti",
          khalti_pidx: pidx,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const khaltiPaymentUrl = `${process.env.CLIENT_URL}/payment-success?method=khalti&pidx=${encodeURIComponent(pidx)}&sim=true`;
      return res.status(200).json({ khaltiPaymentUrl, pidx, transactionUuid });
    }

    // ── Real Khalti payment ─────────────────────────────────────────────────
    const khaltiPayload = {
      return_url: `${config.successUrl}?method=khalti`,
      website_url: process.env.CLIENT_URL || "http://localhost:5173",
      amount: Math.round(totalAmount * 100),
      purchase_order_id: transactionUuid,
      purchase_order_name: productName || "Book Purchase",
      customer_info: {
        name: "Customer",
        email: "customer@bookbazar.com",
        phone: "9800000000",
      },
    };

    const response = await axios.post(config.initiateUrl, khaltiPayload, {
      headers: {
        Authorization: `Key ${config.secretKey}`,
        "Content-Type": "application/json",
      },
    });

    await Payment.findOneAndUpdate(
      { transaction_uuid: transactionUuid },
      {
        transaction_uuid: transactionUuid,
        product_code: "KHALTI",
        product_ids: normalizeProductIds(productIds),
        order_id: sanitizeOrderId(orderId),
        amount: totalAmount,
        status: "PENDING",
        method: "khalti",
        khalti_pidx: response.data.pidx,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      khaltiPaymentUrl: response.data.payment_url,
      pidx: response.data.pidx,
      transactionUuid,
    });
  } catch (error) {
    console.error("Khalti initiation error:", error.response?.data || error.message);
    return res.status(400).json({
      message: error.response?.data?.detail || "Khalti payment initiation failed.",
    });
  }
};

// ─── Khalti: POST /verify-khalti ─────────────────────────────────────────────
const KhaltiVerifyPayment = async (req, res) => {
  const { pidx, transactionUuid } = req.body;
  const config = getKhaltiConfig();

  try {
    if (!pidx) return res.status(400).json({ message: "Missing Khalti pidx." });

    // ── Simulation mode ─────────────────────────────────────────────────────
    if (!config.secretKey || pidx.startsWith("SIM-")) {
      console.log("Khalti verify — simulation mode, pidx:", pidx);

      let payment = await Payment.findOne({
        $or: [
          { khalti_pidx: pidx },
          { transaction_uuid: transactionUuid },
        ],
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment record not found." });
      }

      if (payment.status === "COMPLETE") {
        return res.status(200).json({ message: "Payment already verified.", transaction: payment });
      }

      payment.status = "COMPLETE";
      payment.khalti_pidx = pidx;
      payment.ref_id = `SIM-REF-${Date.now()}`;
      await payment.save();

      return res.status(200).json({
        message: "Khalti payment verified (simulation).",
        transaction: payment,
      });
    }

    // ── Real Khalti verification ────────────────────────────────────────────
    const verifyResponse = await axios.post(
      config.verifyUrl,
      { pidx },
      {
        headers: {
          Authorization: `Key ${config.secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const json = verifyResponse.data;
    console.log("Khalti verify response:", json);

    if (json.status !== "Completed") {
      return res.status(400).json({
        message: `Khalti payment not completed. Status: ${json.status}`,
      });
    }

    const payment = await Payment.findOne({
      $or: [
        { khalti_pidx: pidx },
        { transaction_uuid: transactionUuid },
      ],
    });

    if (!payment) return res.status(404).json({ message: "Payment record not found." });
    if (payment.status === "COMPLETE") {
      return res.status(200).json({ message: "Payment already verified.", transaction: payment });
    }

    const verifiedAmount = json.total_amount / 100;
    if (Math.abs(verifiedAmount - payment.amount) > 0.01) {
      console.error("FRAUD ALERT: Khalti amount mismatch", {
        expected: payment.amount,
        received: verifiedAmount,
      });
      return res.status(400).json({ message: "Payment amount mismatch detected." });
    }

    payment.status = "COMPLETE";
    payment.khalti_pidx = pidx;
    payment.ref_id = json.transaction_id || null;
    await payment.save();

    return res.status(200).json({
      message: "Khalti payment verified successfully.",
      transaction: payment,
      khalti: json,
    });
  } catch (error) {
    console.error("Khalti verify error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Server error while verifying Khalti payment.",
    });
  }
};

module.exports = {
  EsewaInitiatePayment,
  paymentStatus,
  handleEsewaSuccess,
  handleEsewaFailure,
  KhaltiInitiatePayment,
  KhaltiVerifyPayment,
};