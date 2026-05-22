import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../pages/books/BookCard';

const UserRecommendations = () => {
  const { currentUser } = useAuth();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchRecs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/users/${currentUser.id}/recommendations`);
        setRecs(res.data.recommendations || []);
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [currentUser]);

  if (!currentUser) return null;
  if (loading) return <div className="text-center py-6">Loading recommendations...</div>;
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>;
  if (!recs.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recs.map((book) => (
          <BookCard key={book._id} book={book} showActions={false} />
        ))}
      </div>
    </div>
  );
};

export default UserRecommendations;
