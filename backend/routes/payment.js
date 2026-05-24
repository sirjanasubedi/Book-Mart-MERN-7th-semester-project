const express = require("express");
const router = express.Router();
const {
  EsewaInitiatePayment,
  paymentStatus,
  KhaltiInitiatePayment,
  KhaltiVerifyPayment,
} = require("../src/controller/esewa.controller");

// eSewa initiate and verify
router.post("/initiate-payment", EsewaInitiatePayment);
router.post("/payment-status", paymentStatus);

// eSewa redirects back to backend first, then backend sends to frontend
router.get("/esewa/success", (req, res) => {
  const data = req.query.data;
  if (!data) {
    return res.redirect(`${process.env.CLIENT_URL}/payment-failure`);
  }
  res.redirect(`${process.env.CLIENT_URL}/payment-success?data=${encodeURIComponent(data)}`);
});

router.get("/esewa/failure", (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/payment-failure`);
});

// Khalti
router.post("/initiate-khalti", KhaltiInitiatePayment);
router.post("/verify-khalti", KhaltiVerifyPayment);

module.exports = router;