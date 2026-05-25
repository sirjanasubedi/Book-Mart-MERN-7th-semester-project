import React, { useState } from "react";
import BookCard from "../books/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const categories = [
  "All", "Business", "Fiction", "Horror", "Adventure",
  "Romance", "Fantasy", "Science Fiction", "Novel",
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data, isLoading, isError } = useFetchAllBooksQuery();
  const books = Array.isArray(data?.books) ? data.books : [];

  // ✅ FIX: Top Sellers shows TRENDING books first
  const trendingBooks = books.filter((book) => book.trending);
  const sourceBooks = trendingBooks.length > 0 ? trendingBooks : books;

  const filteredBooks =
    selectedCategory === "All"
      ? sourceBooks
      : sourceBooks.filter(
          (book) => book.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  if (isLoading) return (
    <div style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
      Loading books...
    </div>
  );

  if (isError) return (
    <div style={{ textAlign: "center", padding: "24px", color: "#ef4444" }}>
      Failed to load books
    </div>
  );

  return (
    <div>
      {/* CATEGORY FILTER */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            border: "1px solid #e0e0e0",
            background: "#fff",
            color: "#374151",
            borderRadius: "10px",
            padding: "8px 16px",
            fontSize: "14px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredBooks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
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