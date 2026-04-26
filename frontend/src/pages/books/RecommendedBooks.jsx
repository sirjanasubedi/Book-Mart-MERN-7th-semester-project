   



// import React, { useEffect, useState } from 'react';
// import BookCard from '../books/BookCard';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import api from '../../utils/api';

// const RecommendedBooks = ({ currentBookId, category }) => {
//   const [recommendedBooks, setRecommendedBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRecommendedBooks = async () => {
//       try {
//         const response = await api.get(`/books/${currentBookId}/recommendations`, {
//           params: { category }
//         });
        
//         // Handle case where response structure might differ
//         const books = response.recommendedBooks || response.data?.recommendedBooks || [];
//         setRecommendedBooks(books);
//       } catch (err) {
//         console.error('Recommendation error:', {
//           message: err.message,
//           response: err.response?.data
//         });
//         setError(err.response?.data?.message || 'Failed to load recommendations');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (category && currentBookId) {
//       fetchRecommendedBooks();
//     } else {
//       setLoading(false);
//       setError('Missing book ID or category');
//     }
//   }, [category, currentBookId]);

//   // Loading and error states
//   if (loading) return <div className="py-4">Loading recommendations...</div>;
//   if (error) return <div className="py-4 text-red-500">{error}</div>;

//   return (
//     <div className="py-8">
//       <h2 className="text-2xl font-bold mb-4">More from {category}</h2>
//       {recommendedBooks.length > 0 ? (
//         <Swiper
//           slidesPerView={1}
//           spaceBetween={20}
//           navigation
//           modules={[Navigation]}
//           breakpoints={{
//             640: { slidesPerView: 2 },
//             768: { slidesPerView: 3 },
//             1024: { slidesPerView: 4 }
//           }}
//         >
//           {recommendedBooks.map((book) => (
//             <SwiperSlide key={book._id}>
//               <BookCard book={book} />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       ) : (
//         <p>No recommendations found for this category.</p>
//       )}
//     </div>
//   );
// };

// export default RecommendedBooks;    



import React, { useEffect, useState } from 'react';
import BookCard from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import api from '../../utils/api';

const RecommendedBooks = ({ currentBookId, category }) => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (!category || !currentBookId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/books/${currentBookId}/recommendations`, {
          params: { category }
        });
        
        // Handle different response structures
        const books = response.data?.recommendedBooks || 
                      response.recommendedBooks || 
                      [];
        
        setRecommendedBooks(books.slice(0, 6)); // Limit to 6 recommendations
      } catch (err) {
        console.error('Recommendation error:', err);
        setError(err.response?.data?.message || 
                'Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBooks();
  }, [category, currentBookId]);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
        <p>Loading recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (recommendedBooks.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
        <p>No recommendations available right now.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">More from {category}</h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        navigation
        modules={[Navigation]}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerView: 4, spaceBetween: 40 }
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

export default RecommendedBooks;