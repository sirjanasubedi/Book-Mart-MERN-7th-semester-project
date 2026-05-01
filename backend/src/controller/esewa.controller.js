const axios = require("axios");
const crypto = require("crypto");
const Transaction = require("../model/Transaction.model");

const SIGNED_FIELD_NAMES = "total_amount,transaction_uuid,product_code";
const ESEWA_STATUSES = new Set([
  "PENDING",
  "COMPLETE",
  "FULL_REFUND",
  "PARTIAL_REFUND",
  "AMBIGUOUS",
  "NOT_FOUND",
  "CANCELED",
]);

const generateEsewaSignature = (message, secret) =>
  crypto.createHmac("sha256", secret).update(message).digest("base64");

const getEsewaConfig = () => {
  const isProduction = process.env.ESEWA_ENV === "production";

  return {
    productCode: process.env.ESEWA_PRODUCT_CODE || process.env.MERCHANT_ID,
    secret: process.env.ESEWA_SECRET || process.env.SECRET,
    paymentUrl:
      process.env.ESEWA_PAYMENT_URL ||
      process.env.ESEWAPAYMENT_URL ||
      (isProduction
        ? "https://epay.esewa.com.np/api/epay/main/v2/form"
        : "https://rc-epay.esewa.com.np/api/epay/main/v2/form"),
    statusUrl:
      process.env.ESEWA_STATUS_CHECK_URL ||
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL ||
      (isProduction
        ? "https://esewa.com.np/api/epay/transaction/status/"
        : "https://rc.esewa.com.np/api/epay/transaction/status/"),
    successUrl:
      process.env.ESEWA_SUCCESS_URL ||
      process.env.SUCCESS_URL ||
      `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-success`,
    failureUrl:
      process.env.ESEWA_FAILURE_URL ||
      process.env.FAILURE_URL ||
      `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-failure`,
    localFallbackUrl:
      process.env.LOCAL_PAYMENT_FALLBACK_URL ||
      `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-success?mock=true`,
  };
};

const normalizeAmount = (amount) => {
  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new Error("A valid payment amount is required.");
  }

  return String(parsedAmount);
};

const decodeEsewaData = (encodedData) => {
  const decoded = Buffer.from(encodedData, "base64").toString("utf8");
  return JSON.parse(decoded);
};

const buildSignedMessage = (payload) =>
  payload.signed_field_names
    .split(",")
    .map((fieldName) => `${fieldName}=${payload[fieldName]}`)
    .join(",");

const buildSignedMessageVariants = (payload) => {
  const messages = new Set([buildSignedMessage(payload)]);
  const amount = Number(payload.total_amount);

  if (Number.isFinite(amount)) {
    [String(amount), amount.toFixed(1), amount.toFixed(2)].forEach((amountValue) => {
      messages.add(buildSignedMessage({ ...payload, total_amount: amountValue }));
    });
  }

  return [...messages];
};

const verifyEsewaPayloadSignature = (payload, secret) => {
  if (!payload?.signed_field_names || !payload?.signature) return false;

  const received = Buffer.from(payload.signature);

  return buildSignedMessageVariants(payload).some((message) => {
    const expected = Buffer.from(generateEsewaSignature(message, secret));
    return expected.length === received.length && crypto.timingSafeEqual(expected, received);
  });
};

const normalizeProductIds = (productIds = []) =>
  productIds
    .map((item) => item?._id || item)
    .filter(Boolean);

const EsewaInitiatePayment = async (req, res) => {
  const { amount, productId, productIds, orderId } = req.body;
  const config = getEsewaConfig();

  if (!config.productCode || !config.secret) {
    console.warn("eSewa configuration is missing. Using local mock payment redirect.");
    return res.status(200).json({
      mock: true,
      url: config.localFallbackUrl,
      message:
        "eSewa is not configured on the backend. Redirecting to local mock payment success page.",
    });
  }

  try {
    const totalAmount = normalizeAmount(amount);
    const transactionUuid =
      productId || `BM-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    if (!/^[A-Za-z0-9-]+$/.test(transactionUuid)) {
      return res.status(400).json({
        message: "transaction_uuid can only contain alphanumeric characters and hyphen.",
      });
    }

    const signatureMessage = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${config.productCode}`;
    const signature = generateEsewaSignature(signatureMessage, config.secret);

    const formData = {
      amount: totalAmount,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: config.productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: config.successUrl,
      failure_url: config.failureUrl,
      signed_field_names: SIGNED_FIELD_NAMES,
      signature,
    };

    await Transaction.findOneAndUpdate(
      { transaction_uuid: transactionUuid },
      {
        transaction_uuid: transactionUuid,
        product_code: config.productCode,
        product_ids: normalizeProductIds(productIds),
        order_id: orderId || null,
        amount: Number(totalAmount),
        status: "PENDING",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      paymentUrl: config.paymentUrl,
      formData,
    });
  } catch (error) {
    console.error("eSewa initiation error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

const paymentStatus = async (req, res) => {
  const { product_id, transaction_uuid, data } = req.body;
  const config = getEsewaConfig();

  if (!config.productCode || !config.secret) {
    return res.status(400).json({ message: "eSewa is not configured." });
  }

  try {
    const decodedPayload = data ? decodeEsewaData(data) : null;

    if (decodedPayload && !verifyEsewaPayloadSignature(decodedPayload, config.secret)) {
      return res.status(400).json({ message: "Invalid eSewa response signature." });
    }

    const transactionUuid =
      decodedPayload?.transaction_uuid || transaction_uuid || product_id;
    const transaction = await Transaction.findOne({ transaction_uuid: transactionUuid });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const response = await axios.get(config.statusUrl, {
      params: {
        product_code: transaction.product_code,
        total_amount: transaction.amount,
        transaction_uuid: transaction.transaction_uuid,
      },
      timeout: 10000,
    });

    const esewaStatus = response.data?.status || decodedPayload?.status;
    if (!ESEWA_STATUSES.has(esewaStatus)) {
      return res.status(502).json({
        message: "Unexpected eSewa status response.",
        data: response.data,
      });
    }

    transaction.status = esewaStatus;
    transaction.ref_id = response.data?.ref_id || decodedPayload?.transaction_code || null;
    await transaction.save();

    return res.status(200).json({
      message: "Transaction status updated successfully",
      transaction,
      esewa: response.data,
      decoded: decodedPayload,
    });
  } catch (error) {
    console.error("Error updating transaction status:", error.response?.data || error.message);
    res.status(500).json({
      message: "Server error while verifying eSewa payment",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { EsewaInitiatePayment, paymentStatus };
