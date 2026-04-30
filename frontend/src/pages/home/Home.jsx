import React, { useEffect, useState } from "react";
import TopSellers from "./TopSeller";
import Recommended from "./Recommended";
import PersonalizedRecommendations from "./PersonalizedRecommendations";
import BANNER from "./Banner";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { getUserPreferences } from "../../utils/userTracking";
import { useAuth } from "../../context/AuthContext";

const SectionWrapper = ({ children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    )}
  </div>
);

const Home = () => {
  const [userPreferences, setUserPreferences] = useState(null);
  const { data, isLoading, isError } = useFetchAllBooksQuery();
  const { currentUser } = useAuth();

  useEffect(() => {
    setUserPreferences(getUserPreferences());
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading books...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Failed to load data
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO SECTION */}
      <BANNER />

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

        {/* TOP SELLERS */}
        <SectionWrapper>
          <SectionTitle
            title="🔥 Top Sellers"
            subtitle="Most popular books right now"
          />
          <TopSellers />
        </SectionWrapper>

        {/* RECOMMENDED */}
        <SectionWrapper>
          <SectionTitle
            title="⭐ Recommended"
            subtitle="Trending books you might like"
          />
          <Recommended />
        </SectionWrapper>

        {/* 🔥 ONLY FOR LOGGED IN USERS */}
        {currentUser && userPreferences?.likedBooks?.length > 0 && (
          <SectionWrapper>
            <SectionTitle
              title="🎯 Because You Liked"
              subtitle="Personalized for your reading taste"
            />
            <PersonalizedRecommendations
              likedBooks={userPreferences.likedBooks}
              allBooks={data.books}
            />
          </SectionWrapper>
        )}

        {/* 🔒 GUEST EXPERIENCE MESSAGE */}
        {!currentUser && (
          <div className="text-center bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800">
              Login to get personalized book recommendations
            </h3>
            <p className="text-gray-500 mt-1">
              Discover books based on your interests
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
