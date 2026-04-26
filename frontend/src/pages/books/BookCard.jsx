import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import LikeButton from "../../components/LikeButton";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();

  if (!book) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(book));
  };

  return (
    <div className="rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 bg-white">

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">

        {/* IMAGE */}
        <div className="sm:w-40 flex-shrink-0 border rounded-md overflow-hidden">
          <Link to={`/books/${book._id}`}>
            <img
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className="w-full h-full object-cover p-2 hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* CONTENT */}
        <div className="flex-1">

          {/* TITLE */}
          <Link to={`/books/${book._id}`}>
            <h3 className="text-lg font-semibold hover:text-blue-600 mb-2">
              {book.title}
            </h3>
          </Link>

          {/* LIKE BUTTON */}
          <div className="mb-2">
            <LikeButton
              bookId={book._id}
              initialLikes={book.likes?.length || 0}
              initialLiked={false}
            />
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {book.description}
          </p>

          {/* PRICE */}
          <div className="flex items-center gap-3 mb-3">
            <p className="font-semibold text-black">
              ${book.newPrice?.toFixed(2)}
            </p>

            {book.oldPrice && (
              <p className="line-through text-gray-400 text-sm">
                ${book.oldPrice?.toFixed(2)}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleAddToCart}
            className="btn-primary w-full sm:w-auto px-5 py-2 flex items-center justify-center gap-2 rounded-md"
          >
            <FiShoppingCart className="text-lg" />
            <span>Add to Cart</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default BookCard;
