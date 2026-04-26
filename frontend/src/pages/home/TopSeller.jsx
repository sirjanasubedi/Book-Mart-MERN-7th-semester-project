import React, { useState } from "react";
import BookCard from "../books/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const categories = [
  "Choose a genre",
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
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

  const { data, isLoading, isError } = useFetchAllBooksQuery();

  // ✅ SAFE DATA HANDLING (VERY IMPORTANT FIX)
  const books =
    Array.isArray(data?.books)
      ? data.books
      : Array.isArray(data)
      ? data
      : [];

  // Debug (you can remove later)
  console.log("Books:", books);

  // ✅ FILTER SAFE
  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books.filter(
          (book) =>
            book.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  if (isLoading) {
    return (
      <div className="text-center py-8">Loading books...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load books
      </div>
    );
  }

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">
        Top Sellers
      </h2>

      {/* CATEGORY FILTER */}
      <div className="mb-8 flex items-center">
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* EMPTY STATE FIX */}
      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500">
          No books found
        </p>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          navigation
          modules={[Pagination, Navigation]}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 2, spaceBetween: 50 },
            1180: { slidesPerView: 3, spaceBetween: 50 },
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
