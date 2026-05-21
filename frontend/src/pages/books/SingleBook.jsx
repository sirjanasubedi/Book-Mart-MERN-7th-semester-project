import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { useAuth } from "../../context/AuthContext";
import { FiShoppingCart, FiHeart, FiTag, FiArrowLeft } from "react-icons/fi";

const SingleBook = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { data, isLoading, isError } = useFetchAllBooksQuery();
  const book = data?.books?.find((b) => b._id === id);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const isAdmin = currentUser?.role === "admin";

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddToCart = () => {
    dispatch(addToCart(book));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount =
    book?.oldPrice > book?.newPrice
      ? Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold">Failed to load book.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-indigo-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h2>
          <p className="text-gray-500 mb-4">This book may have been removed or is unavailable.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition"
        >
          <FiArrowLeft />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">

            {/* LEFT - Book Cover */}
            <div className="relative bg-indigo-50 flex items-center justify-center p-8">
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}
              <img
                src={getImgUrl(book.coverImage)}
                alt={book.title}
                className="w-full max-w-sm rounded-xl shadow-xl object-cover"
              />
            </div>

            {/* RIGHT - Book Details */}
            <div className="p-8 flex flex-col justify-between">
              <div>

                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <FiTag className="text-indigo-500 text-sm" />
                  <span className="text-xs uppercase tracking-widest text-indigo-500 font-semibold">
                    {book.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {book.title}
                </h1>

                {/* Divider */}
                <hr className="border-gray-100 mb-4" />

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {book.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-indigo-700">
                    Rs. {book.newPrice?.toFixed(2)}
                  </span>
                  {book.oldPrice && (
                    <span className="text-base text-gray-400 line-through">
                      Rs. {book.oldPrice?.toFixed(2)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                      Save {discount}%
                    </span>
                  )}
                </div>

              </div>

              {/* BOTTOM ACTIONS */}
              <div>

                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition mb-4 ${
                    liked
                      ? "bg-red-50 border-red-300 text-red-500"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-500"
                  }`}
                >
                  <FiHeart className={liked ? "fill-current" : ""} />
                  {likesCount} {likesCount === 1 ? "Like" : "Likes"}
                </button>

                {/* Admin Notice */}
                {isAdmin && (
                  <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium">
                    <span className="text-lg">👑</span>
                    <div>
                      <p className="font-semibold">Admin View</p>
                      <p className="text-xs text-amber-600 font-normal">
                        Cart features are disabled in admin mode.
                      </p>
                    </div>
                  </div>
                )}

                {/* Normal User - Add to Cart */}
                {!isAdmin && currentUser && (
                  <button
                    onClick={handleAddToCart}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition ${
                      addedToCart
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    <FiShoppingCart />
                    {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
                  </button>
                )}

                {/* Guest - Login to Buy */}
                {!isAdmin && !currentUser && (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    <FiShoppingCart />
                    Login to Buy
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;