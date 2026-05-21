import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";

import Img from "../assets/navLogo.png";

const userNavigation = [
  { name: "My Profile", href: "/profile" },
  { name: "Dashboard", href: "/user-dashboard" },
];

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Manage Books", href: "/dashboard/manage-books" },
  { name: "Add Book", href: "/dashboard/add-book" },
  { name: "Orders", href: "/dashboard/orders" },
  { name: "Payment Reports", href: "/dashboard/payment-reports" },
  { name: "Users", href: "/dashboard/users" },
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
    <header
      className="sticky top-0 z-50 max-w-screen-2xl mx-auto px-10 py-6 h-24 text-white shadow-lg"
      style={{
        background:
          "linear-gradient(90deg, rgba(0,0,0,0.88), rgba(30,58,138,0.75), rgba(0,0,0,0.88))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <nav className="flex justify-between items-center h-full">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-6 md:gap-16">
          <div className="h-14 w-14 flex items-center justify-center">
            <img
              src={Img}
              alt="logo"
              className="rounded-full object-cover"
            />
          </div>

          <div className="hidden md:flex gap-10 font-semibold">
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
          <div className="relative sm:w-72 w-40 ml-2">
            <IoSearchOutline
              onClick={handleSearch}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer"
            />
            <input
              type="text"
              placeholder="Search books..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-white text-black w-full py-1 px-8 rounded-md outline-none"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="relative flex items-center gap-5">

          {/* PROFILE */}
          <div className="relative">
            {profile ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex flex-col items-center"
                >
                  <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                    {profile.initials}
                  </div>
                  <span className="text-xs mt-1 truncate max-w-[120px]">
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
              <>
                <Link to="/login" className="font-semibold">
                  Login
                </Link>
                <Link to="/register" className="ml-4 font-semibold">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ICONS */}
          <HiOutlineHeart className="w-6 h-6 cursor-pointer" />

          <Link to="/cart" className="relative">
            <HiOutlineShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;