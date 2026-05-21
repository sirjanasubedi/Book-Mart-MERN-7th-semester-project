import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../utils/getImgUrl';
import { useFetchAllBooksQuery } from '../redux/features/books/booksApi';
import axios from 'axios';
import getBaseUrl from '../utils/baseURL';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
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

  const filteredBooks =
    selectedCategory === "All"
      ? data?.books || []
      : (data?.books || []).filter(
          (book) => book.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center py-8">Error loading books</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Book Categories</h1>

      {/* ── Dynamic Category Buttons ── */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* ── Books Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-3 aspect-h-4">
              <img
                src={getImgUrl(book.coverImage)}
                alt={book.title}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{book.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-600">Rs. {book.newPrice}</span>
                  {book.oldPrice > book.newPrice && (
                    <span className="text-sm text-gray-500 line-through">Rs. {book.oldPrice}</span>
                  )}
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {book.category}
                </span>
              </div>
              <Link
                to={`/books/${book._id}`}
                className="mt-3 block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Categories;