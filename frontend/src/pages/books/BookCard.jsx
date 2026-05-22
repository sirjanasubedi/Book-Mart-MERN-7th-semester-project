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

const BookCard = ({ book, showActions = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (!book) return null;

  const isAdmin = currentUser?.role === "admin";

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    dispatch(addToCart(book));
  };

  const isCompact = !showActions;

  return (
    <div
      onClick={isCompact ? () => navigate(`/books/${book._id}`) : undefined}
      className={`overflow-hidden transition-all duration-300 ${isCompact ? "bg-transparent border border-black shadow-none cursor-pointer hover:shadow-none" : "bg-white rounded-2xl border border-black shadow-sm hover:shadow-2xl hover:-translate-y-1"}`}
    >

      {isCompact ? (
        <div className="bg-white shadow-sm rounded-none overflow-hidden">
          <Link to={`/books/${book._id}`}>
            <div className="relative overflow-hidden bg-transparent aspect-[4/5]">
              <img
                src={getImgUrl(book.coverImage)}
                alt={book.title}
                className="block w-full h-full object-contain object-top"
              />
            </div>
          </Link>

          <div className="p-4">
            <div className="grid grid-cols-[1fr_auto] items-start gap-3">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-700 font-semibold">
                  {book.category}
                </p>
                <p className="text-sm font-bold text-slate-900">Rs. {book.newPrice}</p>
              </div>
              <Link to={`/books/${book._id}`} className="text-sm font-semibold text-slate-900 text-right line-clamp-2">
                {book.title}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* IMAGE */}
          <div className="relative overflow-hidden bg-indigo-50 aspect-[4/5]">
            <Link to={`/books/${book._id}`}>
              <img
                src={getImgUrl(book.coverImage)}
                alt={book.title}
                className="block w-full h-full object-contain object-top"
              />
            </Link>

            {/* Like Button */}
            {showActions && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md"
              >
                <LikeButton
                  bookId={book._id}
                  initialLikes={book.likes?.length || 0}
                  initialLiked={false}
                />
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-black font-semibold mb-1">
              {book.category}
            </p>
            <Link to={`/books/${book._id}`}>
              <h3 className="text-base font-semibold text-black transition line-clamp-2 min-h-[56px]">
                {book.title}
              </h3>
            </Link>
            <div className="mt-2">
              <p className="text-xl font-bold text-black">Rs. {book.newPrice}</p>
            </div>
          </div>
        </>
      )}

      {showActions && (
        <>
          <div className="flex items-center gap-1 text-yellow-500 mt-2">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className="fill-current" />
            ))}
            <span className="text-sm text-gray-500 ml-1">(4.8)</span>
          </div>

          <p className="text-sm text-gray-600 mt-3 line-clamp-3 min-h-[56px]">
            {book.description}
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <Link
              to={`/books/${book._id}`}
              className="bg-indigo-50 text-indigo-700 py-2.5 rounded-xl text-center font-semibold hover:bg-indigo-100 transition flex items-center justify-center gap-2 w-full"
            >
              <FiEye />
              Details
            </Link>

            {!isAdmin && (
              currentUser ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md w-full"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md w-full"
                >
                  Login to Buy
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookCard;