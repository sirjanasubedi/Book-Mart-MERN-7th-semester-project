import React, { useEffect, useState } from 'react';

import TopSellers from './TopSeller';
import Recommended from './Recommended';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import BANNER from './Banner';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

import { getUserPreferences } from '../../utils/userTracking';

const Home = () => {
  const [userPreferences, setUserPreferences] = useState(null);
  const { data, isLoading, isError, refetch } = useFetchAllBooksQuery();

  useEffect(() => {
    const prefs = getUserPreferences();
    setUserPreferences(prefs);
    
    // Force refetch to ensure we have latest data
    refetch();
  }, [refetch]);

  return (
    <div className="container mx-auto px-4">
      <BANNER />

      <TopSellers />
      <Recommended />

      {userPreferences?.likedBooks?.length > 0 && data?.books && (
        <PersonalizedRecommendations
          likedBooks={userPreferences.likedBooks}
          allBooks={data.books}
        />
      )}
    </div>
  );
};

export default Home;