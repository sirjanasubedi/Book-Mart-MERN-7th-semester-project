import React from "react";
import {
  FiBookOpen,
  FiUsers,
  FiAward,
  FiShield,
  FiTruck,
  FiArrowRight,
  FiHeart,
  FiTarget,
} from "react-icons/fi";

const About = () => {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-white text-gray-900 overflow-hidden">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>
            <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
              <FiBookOpen />
              About Book Mart
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Building Better
              <span className="block text-indigo-600">
                Reading Journey
              </span>
            </h1>

            <p className="mt-6 text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Book Mart helps students, professionals, and readers
              discover quality books with trusted service and smooth shopping.
            </p>

            {/* BUTTON FIXED */}
            <a
              href="#story"
              className="mt-8 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 sm:px-8 py-3 rounded-xl font-semibold transition"
            >
              Discover Our Story <FiArrowRight />
            </a>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-10 max-w-md">
              <div>
                <h3 className="text-2xl font-bold">10K+</h3>
                <p className="text-sm text-gray-500">Books Sold</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">5K+</h3>
                <p className="text-sm text-gray-500">Readers</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">4.9★</h3>
                <p className="text-sm text-gray-500">Ratings</p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="relative">
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-8">
              <div className="space-y-5">

                <div className="flex gap-4 p-5 rounded-2xl bg-indigo-50">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <FiBookOpen />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      Curated Books
                    </h3>
                    <p className="text-sm text-gray-500">
                      Handpicked books for every reader.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl bg-slate-50">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <FiShield />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      Trusted Service
                    </h3>
                    <p className="text-sm text-gray-500">
                      Safe payments and secure checkout.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl bg-indigo-50">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <FiTruck />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      Fast Delivery
                    </h3>
                    <p className="text-sm text-gray-500">
                      Reliable delivery to your doorstep.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STORY SECTION */}
      <div
        id="story"
        className="bg-white py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Our Story
            </h2>

            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Book Mart began with a simple goal — make books easy to
              access for everyone. We continue to inspire learning,
              growth, and success through reading.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-slate-50 rounded-3xl p-8 hover:shadow-lg transition">
              <FiTarget className="text-indigo-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Our Mission
              </h3>
              <p className="text-gray-500 text-sm">
                Deliver knowledge through quality books.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 hover:shadow-lg transition">
              <FiHeart className="text-indigo-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Our Passion
              </h3>
              <p className="text-gray-500 text-sm">
                Inspire reading habits every day.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 hover:shadow-lg transition">
              <FiAward className="text-indigo-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Our Promise
              </h3>
              <p className="text-gray-500 text-sm">
                Better service and better books.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
