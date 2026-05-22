const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
  address: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  // Profile data used for simple content-based recommendations
  purchasedBooks: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
  ],
  likedBooks: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
  ],
  // category -> count map (e.g. { "Fiction": 3 })
  preferences: {
    categories: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  // Cached recommendations (optional) - array of Book refs
  recommendations: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
  ],
});

module.exports = mongoose.model("User", userSchema);