import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import BookCard from '../books/BookCard';

const PersonalizedRecommendations = ({ likedBooks, allBooks }) => {
  // Get categories of liked books
  const likedCategories = likedBooks
    .map(bookId => {
      const book = allBooks.find(b => b._id === bookId);
      return book?.category;
    })
    .filter(Boolean);
  
  // Count category occurrences
  const categoryCounts = likedCategories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Sort by most liked categories
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  //  this is for Get recommended books (excluding already liked ones)
  const recommendedBooks = sortedCategories
    .flatMap(category => 
      allBooks
        .filter(book => 
          book.category === category && 
          !likedBooks.includes(book._id)
        ).slice(0, 5) 
    )
    .slice(0, 10); 

  if (recommendedBooks.length === 0) return null;

  return (
    <div className="py-16">
      <h2 className="text-3xl font-semibold mb-6">Recommended For You</h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        navigation
        modules={[Navigation]}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
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

export default PersonalizedRecommendations;