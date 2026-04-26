import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import BookCard from '../books/BookCard';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const Recommended = () => {
  const { data, isLoading, isError } = useFetchAllBooksQuery();

  if (isLoading) return <p>Loading recommended books...</p>;
  if (isError) return <p>Failed to load recommended books.</p>;

  // Safely extract books array
  const books = data?.books || (Array.isArray(data) ? data : []);

  const recommendedBooks = books.slice(0, 10);

  return (
    <div className="py-16">
      <h2 className="text-3xl font-semibold mb-6">Recommended for you</h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation
        modules={[Navigation]}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 3, spaceBetween: 50 }
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