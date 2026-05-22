import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";

const userNavigation = [
  { name: "My Profile", href: "/profile" },
  { name: "Dashboard", href: "/user-dashboard" },
];

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard" },
];

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const { currentUser, logout } = useAuth();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const getUserInitials = (full = "") => {
    if (!full) return "";
    const parts = full.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.role === "admin") {
          setAdminData(decoded);
        }
      } catch (err) {
        console.error("Invalid admin token");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = async () => {
    if (adminData) {
      localStorage.removeItem("token");
      setAdminData(null);
      setIsDropdownOpen(false);
      navigate("/");
    } else {
      await logout();
      setIsDropdownOpen(false);
      navigate("/login");
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ✅ Admin is checked FIRST before currentUser
  const renderProfile = () => {
    if (adminData) {
      return {
        initials: getUserInitials(adminData.email),
        email: adminData.email,
        isAdmin: true,
      };
    }

    if (currentUser) {
      const name =
        currentUser.fullName ||
        currentUser.displayName ||
        currentUser.email;
      return {
        initials: getUserInitials(name),
        email: currentUser.email,
        isAdmin: false,
      };
    }

    return null;
  };

  const profile = renderProfile();
  const isAdmin = profile?.isAdmin;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-50 text-slate-900 shadow-md border-b border-slate-200">
      <nav className="mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8 lg:px-10">

        {/* LEFT SECTION */}
        <div className="flex flex-wrap items-center gap-4 md:gap-10 w-full md:w-auto">
          <Link to="/" className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 hover:text-indigo-700 transition">
            BookMart
          </Link>

          <div className="hidden md:flex flex-wrap items-center gap-6 font-semibold">
            <Link to="/" className="hover:text-blue-300 transition">
              Home
            </Link>
            <Link to="/categories" className="hover:text-blue-300 transition">
              Categories
            </Link>
            <Link to="/about" className="hover:text-blue-300 transition">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-blue-300 transition">
              Contact Us
            </Link>
          </div>

          {/* SEARCH */}
          <div className="relative flex-1 min-w-[180px] sm:min-w-[240px] md:w-72">
            <IoSearchOutline
              onClick={handleSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            />
            <input
              type="text"
              placeholder="Search books..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-white text-black w-full py-2 pl-10 pr-4 rounded-md outline-none border border-black"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="relative flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5 justify-end w-full md:w-auto">

          {/* PROFILE */}
          <div className="relative flex items-center gap-3">
            {profile ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3"
                >
                  <div className="bg-slate-900 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                    {profile.initials}
                  </div>
                  <span className="hidden sm:inline-block text-xs truncate max-w-[140px] text-slate-900">
                    {profile.email}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-md shadow-lg z-50">
                    <ul>
                      {(isAdmin ? adminNavigation : userNavigation).map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 hover:bg-gray-200"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-200"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="font-semibold">
                  Login
                </Link>
                <Link to="/register" className="font-semibold">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ICONS */}
          {!isAdmin && (
            <>
              <HiOutlineHeart className="w-6 h-6 cursor-pointer" />

              <Link to="/cart" className="relative">
                <HiOutlineShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;