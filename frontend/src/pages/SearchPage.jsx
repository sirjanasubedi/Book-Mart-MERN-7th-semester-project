 
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
 
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  useEffect(() => {
    if (!query.trim()) return;
 
    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/books?search=${encodeURIComponent(query)}`
        );
        setResults(res.data.books || []);
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchResults();
  }, [query]);
 
  // ✅ FIXED: handles both full URLs and local /uploads/ paths
  const getImageUrl = (coverImage) => {
    if (!coverImage) return null;
    if (coverImage.startsWith("http")) return coverImage; // already a full URL
    return `http://localhost:5000${coverImage}`;          // local upload path
  };
 
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 text-black">
      <h2 className="text-2xl font-bold mb-6">
        Search results for:{" "}
        <span className="text-blue-600">"{query}"</span>
      </h2>
 
      {loading && <p className="text-gray-500">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}
 
      {!loading && results.length === 0 && !error && (
        <p className="text-gray-500">No books found for "{query}".</p>
      )}
 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((book) => (
          <Link
            to={`/books/${book._id}`}
            key={book._id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
          >
            {/* ✅ FIXED: image URL now works for both hosted and local images */}
            <img
              src={getImageUrl(book.coverImage)}
              alt={book.title}
              className="w-full h-52 object-cover rounded mb-3"
              onError={(e) => {
                e.target.style.display = "none"; // hide if image still fails
              }}
            />
 
            {/* ✅ FIXED: title and author now visible (dark text on white bg) */}
            <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{book.author}</p>
            <p className="text-blue-600 font-bold">Rs. {book.newPrice}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
 
export default SearchPage;
 