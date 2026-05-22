import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopSellers from "./TopSeller";
import Recommended from "./Recommended";
import PersonalizedRecommendations from "./PersonalizedRecommendations";
import UserRecommendations from "../../components/UserRecommendations";
import BANNER from "./Banner";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { getUserPreferences } from "../../utils/userTracking";
import { useAuth } from "../../context/AuthContext";

const SectionWrapper = ({ children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, buttonLink, buttonText }) => (
  <div className="w-full flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-sm mt-1 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
    <Link
      to={buttonLink}
      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
    >
      {buttonText}
    </Link>
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
        <div className="space-y-6">
          <SectionHeader
            title="Top Sellers"
            subtitle="Most popular books right now"
            buttonLink="/categories"
            buttonText="Show All"
          />
          <TopSellers hideHeader />
        </div>

        {/* RECOMMENDED */}
        <div className="space-y-6">
          <SectionHeader
            title="Recommended"
            subtitle="Trending books you might like"
            buttonLink="/categories"
            buttonText="Show All"
          />
          <Recommended hideHeader />
        </div>

        {/* ONLY FOR LOGGED IN USERS */}
        {currentUser && userPreferences?.likedBooks?.length > 0 && (
          <SectionWrapper>
            <SectionTitle
              title="Because You Liked"
              subtitle="Personalized for your reading taste"
            />
            <PersonalizedRecommendations
              likedBooks={userPreferences.likedBooks}
              allBooks={data.books}
            />
            <div className="mt-6">
              <UserRecommendations />
            </div>
          </SectionWrapper>
        )}

      </div>
    </div>
  );
};

export default Home;
