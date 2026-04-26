import React from 'react';

const ReviewsList = ({ reviews }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="font-semibold">{review.userName}</div>
                <div className="ml-2 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <div className="text-sm text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;