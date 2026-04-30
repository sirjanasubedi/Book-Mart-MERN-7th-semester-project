import React from "react";
import {
  FiShoppingCart,
  FiEye,
  FiStar,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";
import LikeButton from "../../components/LikeButton";
import { useAuth } from "../../context/AuthContext";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (!book) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    dispatch(addToCart(book));
  };

  const discount =
    book.oldPrice > book.newPrice
      ? Math.round(
          ((book.oldPrice - book.newPrice) /
            book.oldPrice) *
            100
        )
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      {/* IMAGE */}
      <div className="relative h-72 bg-indigo-50 overflow-hidden">
        <Link to={`/books/${book._id}`}>
          <img
            src={getImgUrl(book.coverImage)}
            alt={book.title}
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
            {discount}% OFF
          </span>
        )}

        {/* Like Button */}
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
          <LikeButton
            bookId={book._id}
            initialLikes={book.likes?.length || 0}
            initialLiked={false}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* Category */}
        <p className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-2">
          {book.category}
        </p>

        {/* Title */}
        <Link to={`/books/${book._id}`}>
          <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 line-clamp-2 min-h-[56px] transition">
            {book.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-500 mt-2">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} className="fill-current" />
          ))}
          <span className="text-sm text-gray-500 ml-1">
            (4.8)
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-2 min-h-[40px]">
          {book.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-3 mt-4">
          <h4 className="text-2xl font-bold text-indigo-700">
            Rs. {book.newPrice}
          </h4>

          {book.oldPrice && (
            <p className="text-sm text-gray-400 line-through">
              Rs. {book.oldPrice}
            </p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-2 gap-3 mt-5">

          {/* View Details */}
          <Link
            to={`/books/${book._id}`}
            className="bg-indigo-50 text-indigo-700 py-2.5 rounded-xl text-center font-semibold hover:bg-indigo-100 transition flex items-center justify-center gap-2"
          >
            <FiEye />
            Details
          </Link>

          {/* Logged In */}
          {currentUser ? (
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md"
            >
              <FiShoppingCart />
              Add to Cart
            </button>
          ) : (
            /* Not Logged In */
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition shadow-md"
            >
              Login to Buy
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default BookCard;
