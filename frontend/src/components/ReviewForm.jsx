import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import api from '../utils/api'; 
import { toast } from 'react-toastify';

const ReviewForm = ({ onReviewSubmit }) => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to submit a review');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/books/${id}/reviews`, {
        userId: currentUser.id || currentUser.uid,
        userName: currentUser.displayName || currentUser.email.split('@')[0] || 'Anonymous',
        rating,
        comment
      });

      toast.success('Review submitted successfully!');
      onReviewSubmit(response.data.book);
      setComment('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Rating</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                disabled={isSubmitting}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            required
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;