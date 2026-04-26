

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const likeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  trending: { type: Boolean, required: true },
  coverImage: { type: String, required: true },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  reviews: [reviewSchema],
  likes: [likeSchema],
  
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;





