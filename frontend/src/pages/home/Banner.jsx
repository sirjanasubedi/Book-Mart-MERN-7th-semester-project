import React from "react";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";

function BANNER() {
  const featuredBooks = [
    { _id: 1, title: "The Great Gatsby", coverImage: "book-1.png", price: 1999 },
    { _id: 2, title: "1984", coverImage: "book-3.png", price: 1499 },
    { _id: 3, title: "Harry Potter", coverImage: "book-5.png", price: 1799 },
  ];

  return (
    <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">

      {/* soft background glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-300 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300 opacity-20 blur-3xl rounded-full"></div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="space-y-6">

            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              <FiBookOpen />
              Trusted Book Store
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Discover Books That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Inspire You
              </span>
            </h1>

            <p className="text-gray-600 text-base max-w-lg leading-relaxed">
              Explore bestselling novels, trending books, and academic resources in a modern reading experience designed for you.
            </p>

            <div className="flex gap-4">
              <Link
                to="/shop"
                className="group bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Browse Books
                <FiArrowRight className="group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/about"
                className="border border-indigo-200 text-indigo-700 px-6 py-3 rounded-xl hover:bg-white/70 backdrop-blur transition"
              >
                Learn More
              </Link>
            </div>

            {/* STATS */}
            <div className="flex gap-8 pt-4">
              {[
                { label: "Books", value: "10K+" },
                { label: "Users", value: "5K+" },
                { label: "Rating", value: "4.9★" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="font-bold text-xl text-gray-900">{item.value}</p>
                  <p className="text-gray-500 text-sm">{item.label}</p>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-5">

            {/* MAIN CARD */}
            <Link
              to={`/books/${featuredBooks[0]._id}`}
              className="col-span-2 group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={getImgUrl(featuredBooks[0].coverImage)}
                  className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                  {featuredBooks[0].title}
                </h3>
                <p className="text-indigo-600 font-bold mt-1">
                  Rs. {featuredBooks[0].price}
                </p>
              </div>
            </Link>

            {/* SMALL CARDS */}
            {featuredBooks.slice(1).map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="overflow-hidden">
                  <img
                    src={getImgUrl(book.coverImage)}
                    className="h-36 w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-indigo-600">
                    {book.title}
                  </h3>
                  <p className="text-indigo-600 font-semibold text-sm mt-1">
                    Rs. {book.price}
                  </p>
                </div>
              </Link>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}

export default BANNER;
