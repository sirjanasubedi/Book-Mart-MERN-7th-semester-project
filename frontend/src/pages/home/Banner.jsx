import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";

function BANNER() {
  return (
    <section className="relative overflow-hidden bg-[#f8f8fc]">

      {/* background blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-200/40 blur-3xl rounded-full"></div>

      <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT CONTENT */}
          <div>

            <span className="inline-block px-4 py-2 bg-white shadow-sm border border-gray-100 rounded-full text-sm font-medium text-indigo-600 mb-6">
              📚 Trusted Online Bookstore
            </span>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900">
              Discover Your
              <span className="block text-indigo-600">
                Next Favorite Book
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
              Explore bestselling novels, academic books, and inspiring reads
              from thousands of collections designed for modern readers.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-8">

              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-4 rounded-2xl font-semibold shadow-lg hover:bg-indigo-700 transition duration-300"
              >
                Explore Books
                <FiArrowRight className="group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/about"
                className="px-7 py-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition font-medium text-gray-700"
              >
                Learn More
              </Link>

            </div>

            {/* STATS */}
            <div className="flex gap-10 mt-12">

              <div>
                <h3 className="text-3xl font-bold text-gray-900">10K+</h3>
                <p className="text-gray-500 mt-1">Books Available</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">5K+</h3>
                <p className="text-gray-500 mt-1">Happy Readers</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">4.9★</h3>
                <p className="text-gray-500 mt-1">User Rating</p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex justify-center">

            {/* Main Book */}
            <div className="relative">

              {/* floating card */}
              <div className="absolute -top-6 -left-6 bg-white px-5 py-3 rounded-2xl shadow-xl border border-gray-100">
                <p className="text-sm text-gray-500">Popular This Week</p>
                <h4 className="font-bold text-gray-900">
                  Harry Potter Series
                </h4>
              </div>

              {/* main image */}
              <div className="bg-white p-4 rounded-[2rem] shadow-2xl rotate-[-4deg] hover:rotate-0 transition duration-500">

                <img
                  src={getImgUrl("book-5.png")}
                  alt="Book Cover"
                  className="w-[320px] lg:w-[380px] object-cover rounded-2xl"
                />

              </div>

              {/* small stacked books */}
              <img
                src={getImgUrl("book-1.png")}
                alt=""
                className="absolute -bottom-10 -left-16 w-32 rounded-xl shadow-xl rotate-[-12deg] hidden md:block"
              />

              <img
                src={getImgUrl("book-3.png")}
                alt=""
                className="absolute -top-10 -right-14 w-32 rounded-xl shadow-xl rotate-[10deg] hidden md:block"
              />

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default BANNER; 