import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import BookCard from "../books/BookCard";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

const Recommended = () => {
  const { data, isLoading, isError } = useFetchAllBooksQuery();

  const books = Array.isArray(data?.books)
    ? data.books
    : [];

  const recommendedBooks = books.slice(0, 10);

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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Recommended for You
      </h2>

      {/* SWIPER */}
      <Swiper
        slidesPerView={1}
        spaceBetween={25}
        navigation
        modules={[Navigation]}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
      >
        {recommendedBooks.map((book) => (
          <SwiperSlide key={book._id}>
            <BookCard book={book} />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default Recommended;
