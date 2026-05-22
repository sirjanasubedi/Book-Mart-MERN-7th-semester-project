import React from "react";
import { Link } from "react-router-dom";
import BookCard from "../books/BookCard";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

const Recommended = ({ hideHeader = false }) => {
  const { data, isLoading, isError } = useFetchAllBooksQuery();

  const books = Array.isArray(data?.books) ? data.books : [];
  const recommendedBooks = books.length > 10 ? books.slice(10, 20) : books.slice(0, 10);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-600">
        Loading recommended books...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-red-500">
        Failed to load recommended books
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!hideHeader && (
        <div className="flex items-center justify-end -mt-2 mb-5 gap-3">
          <Link
            to="/categories"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition"
          >
            Show All
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {recommendedBooks.slice(0, 4).map((book) => (
          <div key={book._id} className="">
            <BookCard book={book} showActions={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommended;
 
