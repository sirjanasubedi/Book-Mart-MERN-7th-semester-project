import React, { useState } from "react";
import BookCard from "../books/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const categories = [
  "All",
  "Business",
  "Fiction",
  "Horror",
  "Adventure",
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Novel",
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, isLoading, isError } = useFetchAllBooksQuery();

  const books = Array.isArray(data?.books) ? data.books : [];

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter(
          (book) =>
            book.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">
        Loading books...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-red-500">
        Failed to load books
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

        <h2 className="text-2xl font-bold text-gray-900">
          Top Sellers
        </h2>

        {/* CATEGORY FILTER */}
        <div className="mt-3 md:mt-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 bg-white text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No books found in this category
        </div>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          navigation
          modules={[Pagination, Navigation]}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 25 },
            1024: { slidesPerView: 2, spaceBetween: 30 },
            1180: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {filteredBooks.map((book) => (
            <SwiperSlide key={book._id}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default TopSellers;
