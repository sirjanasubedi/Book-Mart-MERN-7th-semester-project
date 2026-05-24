const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transaction_uuid: { type: String, required: true, unique: true },
    product_code: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["esewa", "khalti"], default: "esewa" },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETE", "FULL_REFUND", "PARTIAL_REFUND",
             "AMBIGUOUS", "NOT_FOUND", "CANCELED", "FAILED"],
      default: "PENDING",
    },
    ref_id: { type: String, default: null },
    khalti_pidx: { type: String, default: null },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    product_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);