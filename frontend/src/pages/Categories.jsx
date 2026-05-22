import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from './books/BookCard';
import { useFetchAllBooksQuery } from '../redux/features/books/booksApi';
import axios from 'axios';
import getBaseUrl from '../utils/baseURL';

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { data, isLoading, isError } = useFetchAllBooksQuery();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${getBaseUrl()}/api/categories`);
        setCategories(["All", ...res.data.map((cat) => cat.name)]);
      } catch (err) {
        console.error("Failed to load categories", err);
        setCategories(["All"]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category') || 'All';
    setSelectedCategory(category);
    setShowAll(false);
  }, [searchParams]);

  const filteredBooks =
    selectedCategory === 'All'
      ? data?.books || []
      : (data?.books || []).filter(
          (book) => book.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const booksToShow = showAll ? filteredBooks : filteredBooks.slice(0, 4);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center py-8">Error loading books</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="overflow-x-auto pb-3">
          <div className="inline-flex min-w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="inline-flex gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    const newParams = new URLSearchParams();
                    if (category !== 'All') newParams.set('category', category);
                    setSearchParams(newParams);
                  }}
                  className={`whitespace-nowrap rounded-full px-4 py-3 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedCategory} Books</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {filteredBooks.length} book{filteredBooks.length === 1 ? '' : 's'} found
                </p>
              </div>
              {filteredBooks.length > 3 && (
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-sm font-semibold text-slate-900 bg-white px-4 py-2 rounded-full shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
                >
                  {showAll ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {booksToShow.map((book) => (
              <div key={book._id} className="group">
                <BookCard book={book} showActions={false} />
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No books found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;