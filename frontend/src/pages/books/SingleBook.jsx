import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

const SingleBook = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useFetchAllBooksQuery();

  const book = data?.books?.find((b) => b._id === id);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddToCart = () => {
    dispatch(addToCart(book));
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center">Error loading book</p>;

  if (!book) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold">Book Not Found</h2>
        <p className="text-gray-500">This book may be deleted or unavailable</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">

        <img
          src={getImgUrl(book.coverImage)}
          alt={book.title}
          className="w-full rounded-lg shadow-md"
        />

        <div>
          <h1 className="text-3xl font-bold mb-3">{book.title}</h1>

          <p className="text-gray-500 mb-2">
            Category: {book.category}
          </p>

          <p className="text-gray-600 mb-4">{book.description}</p>

          <p className="text-2xl font-bold mb-4">
            ${book.newPrice?.toFixed(2)}
          </p>

          <button
            onClick={handleLike}
            className="mb-3 px-4 py-2 bg-gray-200 rounded"
          >
            ❤️ {likesCount}
          </button>

          <br />

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
};

export default SingleBook;
