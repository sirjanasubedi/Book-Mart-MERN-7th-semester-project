import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import LikeButton from "../../components/LikeButton";

function BANNER() {
  const dispatch = useDispatch();
  // Temporarily use static data to show the UI
  const allBooks = [
    {
      _id: 1,
      title: "The Great Gatsby",
      description: "A classic American novel set in the Jazz Age.",
      coverImage: "book-1.png",
      newPrice: 19.99,
      oldPrice: 29.99,
      likes: []
    },
    {
      _id: 2,
      title: "To Kill a Mockingbird",
      description: "Harper Lee's Pulitzer Prize-winning novel.",
      coverImage: "book-2.png",
      newPrice: 14.99,
      oldPrice: 24.99,
      likes: []
    },
    {
      _id: 3,
      title: "1984",
      description: "George Orwell's dystopian masterpiece.",
      coverImage: "book-3.png",
      newPrice: 12.99,
      oldPrice: 19.99,
      likes: []
    },
    {
      _id: 4,
      title: "Pride and Prejudice",
      description: "Jane Austen's beloved romance novel.",
      coverImage: "book-4.png",
      newPrice: 16.99,
      oldPrice: 22.99,
      likes: []
    },
    {
      _id: 5,
      title: "The Catcher in the Rye",
      description: "J.D. Salinger's coming-of-age story.",
      coverImage: "book-5.png",
      newPrice: 11.99,
      oldPrice: 18.99,
      likes: []
    },
    {
      _id: 6,
      title: "Harry Potter",
      description: "J.K. Rowling's magical adventure.",
      coverImage: "book-6.png",
      newPrice: 17.99,
      oldPrice: 25.99,
      likes: []
    }
  ];

  const [featuredBooks, setFeaturedBooks] = useState(allBooks.slice(0, 6));

  console.log("Banner component rendered with static data");
  console.log("Featured books:", featuredBooks);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // Remove loading check since we're using static data
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">Book-Mart</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover millions of books at unbeatable prices. Free shipping on orders over $50!
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Shop Now
            </button>
            <Link to="/categories" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors inline-block text-center">
              View Categories
            </Link>
          </div>
        </div>

        {/* Featured Books Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <div key={book._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {/* Book Image */}
                <div className="relative">
                  <Link to={`/books/${book._id}`}>
                    <img
                      src={`${getImgUrl(book?.coverImage)}`}
                      alt={book.title}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {/* Like Button */}
                  <div className="absolute top-3 right-3">
                    <LikeButton
                      bookId={book._id}
                      initialLikes={book.likes?.length || 0}
                      initialLiked={book.likes?.some(like => like.userId === localStorage.getItem('uid'))}
                    />
                  </div>
                  {/* Discount Badge */}
                  {book?.oldPrice && book?.newPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                      {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="p-4">
                  <Link to={`/books/${book._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2 line-clamp-2">
                      {book?.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {book?.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(4.5)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${book?.newPrice?.toFixed(2)}
                      </span>
                      {book?.oldPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${book?.oldPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(book);
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Book Community</h3>
          <p className="text-gray-600 mb-6">
            Get exclusive access to new releases, author events, and special discounts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BANNER;
