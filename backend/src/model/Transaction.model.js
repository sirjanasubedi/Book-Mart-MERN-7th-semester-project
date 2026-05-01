const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transaction_uuid: {
    type: String,
    required: true,
    unique: true,
  },
  product_code: {
    type: String,
    required: true,
  },
  product_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
  amount: {
    type: Number,
    required: true,
    min: 0, // Amount should not be negative
  },
  ref_id: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: [
      "PENDING",
      "COMPLETE",
      "FULL_REFUND",
      "PARTIAL_REFUND",
      "AMBIGUOUS",
      "NOT_FOUND",
      "CANCELED",
      "FAILED",
      "REFUNDED",
    ],
    default: "PENDING",
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
