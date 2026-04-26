

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    city: {
      type: String,
      required: true,
    },
    country: String,
    state: String,
    zipcode: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "COMPLETE", "FAILED", "REFUNDED"],
    default: 'PENDING',
    required: true,
  },
  paymentMethod: {
    type: String,
    default: 'eSewa',
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});


orderSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

//  this is the Query helper to exclude deleted orders by default
orderSchema.pre(/^find/, function(next) {
  this.where({ isDeleted: false });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
