const axios = require("axios");
const crypto = require("crypto");
const { EsewaCheckStatus } = require("esewajs");
const Transaction = require("../model/Transation.model");

const generateEsEwaSignature = (data, secret) => {
  return crypto.createHmac("sha256", secret).update(data).digest("base64");
};

const EsewaInitiatePayment = async (req, res) => {
  const { amount, productId } = req.body;
  const {
    MERCHANT_ID,
    SECRET,
    SUCCESS_URL,
    FAILURE_URL,
    ESEWAPAYMENT_URL,
    LOCAL_PAYMENT_FALLBACK_URL,
  } = process.env;

  if (!MERCHANT_ID || !SECRET || !SUCCESS_URL || !FAILURE_URL || !ESEWAPAYMENT_URL) {
    const localFallbackUrl =
      LOCAL_PAYMENT_FALLBACK_URL ||
      "http://localhost:5173/payment-success?mock=true";

    console.warn("eSewa configuration is missing. Using local mock payment redirect.");
    return res.status(200).json({
      url: localFallbackUrl,
      message:
        "eSewa is not configured on the backend. Redirecting to local mock payment success page.",
    });
  }

  try {
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const signatureString = `total_amount=${amount}&transaction_uuid=${productId}&product_code=${productId}`;
    const signature = generateEsEwaSignature(signatureString, SECRET);

    const paymentParams = new URLSearchParams({
      amount,
      total_amount: amount,
      transaction_uuid: productId,
      product_code: productId,
      merchant_id: MERCHANT_ID,
      signature,
      success_url: SUCCESS_URL,
      failure_url: FAILURE_URL,
      signed_field_names: signedFieldNames,
    });

    const response = await axios.post(
      ESEWAPAYMENT_URL,
      paymentParams.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        maxRedirects: 0,
        validateStatus: (status) => status < 400,
      }
    );

    const paymentUrl =
      response?.headers?.location ||
      response?.data?.paymentUrl ||
      response?.data?.redirectUrl ||
      response?.request?.res?.responseUrl ||
      response?.request?.res?.responseURL;

    if (!paymentUrl) {
      console.error("Unable to determine eSewa redirect URL from payment response", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });
      return res.status(500).json({ message: "Unable to determine eSewa payment URL." });
    }

    const transaction = new Transaction({
      product_id: productId,
      amount,
    });
    await transaction.save();

    return res.json({ url: paymentUrl });
  } catch (error) {
    console.error("eSewa initiation error:", error.response?.data || error.message || error);
    return res.status(500).json({
      message: "Error sending data to eSewa",
      error: error.response?.data || error.message,
    });
  }
};

const paymentStatus = async (req, res) => {
  const { product_id } = req.body;
  try {
    const transaction = await Transaction.findOne({ product_id });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.product_id,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusCheck.status === 200) {
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();
      return res.status(200).json({ message: "Transaction status updated successfully" });
    }

    return res.status(500).json({ message: "Unable to verify eSewa payment status." });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { EsewaInitiatePayment, paymentStatus };
