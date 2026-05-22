import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";

// ─── Sub-components ──────────────────────────────────────────────────────────

const BackgroundBlurs = () => (
  <>
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 blur-3xl rounded-full pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-200/40 blur-3xl rounded-full pointer-events-none" />
  </>
);

const StatItem = ({ value, label }) => (
  <div>
    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    <p className="mt-1 text-sm text-gray-500">{label}</p>
  </div>
);

const BannerStats = () => {
  const stats = [
    { value: "10K+", label: "Books Available" },
    { value: "5K+",  label: "Happy Readers"   },
    { value: "4.9★", label: "User Rating"      },
  ];

  return (
    <div className="flex gap-10 mt-12">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
};

const BannerActions = () => (
  <div className="flex flex-wrap gap-4 mt-8">
    <Link
      to="/shop"
      className="group inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-4 rounded-2xl font-semibold shadow-lg hover:bg-indigo-700 transition duration-300"
    >
      Explore Books
      <FiArrowRight className="transition group-hover:translate-x-1" />
    </Link>

    <Link
      to="/about"
      className="px-7 py-4 rounded-2xl border border-gray-200 bg-white font-medium text-gray-700 hover:bg-gray-50 transition duration-300"
    >
      Learn More
    </Link>
  </div>
);

const BannerContent = () => (
  <div>
    <h1 className="text-5xl font-black leading-tight text-gray-900 lg:text-6xl">
      Discover Your
      <span className="block text-indigo-600">Next Favorite Book</span>
    </h1>

    <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600">
      Explore bestselling novels, academic books, and inspiring reads from
      thousands of collections designed for modern readers.
    </p>

    <BannerActions />
    <BannerStats />
  </div>
);

// ─── Book Card ────────────────────────────────────────────────────────────────
// Each book slot is the same size. Pass `src` once you have your images.
// The `featured` prop gives the center card a subtle lift and shadow.

const BookCard = ({ src, alt = "", rotate = "0", featured = false }) => (
  <div
    className={`
      rounded-2xl bg-white p-3 shadow-xl transition duration-500 hover:scale-105
      border border-black
      ${featured ? "scale-105 shadow-2xl z-10" : "opacity-90 hover:opacity-100"}
    `}
    style={{ transform: `rotate(${rotate})` }}
  >
    <img
      src={getImgUrl(src)}
      alt={alt}
      className="w-[160px] h-[230px] rounded-xl object-cover lg:w-[190px] lg:h-[270px] border border-black"
    />
  </div>
);

// ─── Three-Book Stack ─────────────────────────────────────────────────────────

const BannerImage = () => (
  <div className="flex items-end justify-center gap-4 lg:gap-6">
    {/*
      To add your images, set the `src` prop on each BookCard.
      Example: src="book-1.png"
      Leave src undefined (or omit it) to keep the blank placeholder.
    */}
    <BookCard rotate="-6deg" src="book-1.png" alt="Book one cover" />
    <BookCard rotate="0deg"  src="book-5.png" alt="Featured book cover" featured />
    <BookCard rotate="6deg"  src="book-3.png" alt="Book three cover" />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

function Banner() {
  return (
    <section className="relative overflow-hidden bg-[#f8f8fc]">
      <BackgroundBlurs />

      <div className="container relative z-10 mx-auto px-6 py-16 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <BannerContent />
          <BannerImage />
        </div>
      </div>
    </section>
  );
}

export default Banner;