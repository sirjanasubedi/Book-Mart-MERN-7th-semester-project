
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import  {useAuth}  from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import Img from "../assets/navLogo.png";
import backgroundImage from "../assets/backgroundImg.jpg";




const userNavigation = [
  { name: "My Profile", href: "/profile" },
  { name: "Dashboard", href: "/user-dashboard" },

];

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "View Orders", href: "/orders" },
  { name: "Manage Books", href: "/dashboard/manage-books" },
  { name: "Add Book", href: "/dashboard/add-new-book" },
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
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
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
    alert(`Searching for "${query}" - add your logic!`);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const renderProfile = () => {
    if (currentUser) {
      const name = currentUser.fullName || currentUser.displayName || currentUser.email;
      return {
        initials: getUserInitials(name),
        email: currentUser.email,
        isAdmin: false,
      };
    } else if (adminData) {
      return {
        initials: getUserInitials(adminData.email),
        email: adminData.email,
        isAdmin: true,
      };
    }
    return null;
  };

  const profile = renderProfile();
  const isAdmin = profile?.isAdmin;

  return (
    <header
      className="max-w-screen-2xl mx-auto px-10 py-6 h-24 text-white"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}
    >
      <nav className="flex justify-between items-center h-full">
        <div className="flex items-center gap-6 md:gap-16">
          <div className="h-14 w-14 flex items-center justify-center">
            <img src={Img} alt="logo" className="rounded-full object-cover" />
          </div>

          <div className="hidden md:flex gap-10 font-semibold text-white">
            <Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link>
            <Link to="/categories" className="hover:text-primary transition-colors duration-200">Categories</Link>
            <Link to="/about" className="hover:text-primary transition-colors duration-200">About Us</Link>
            <Link to="/contact" className="hover:text-primary transition-colors duration-200">Contact Us</Link>
          </div>

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
              className="bg-white text-black w-full py-1 md:px-8 px-7 rounded-md outline-none pl-8 pr-2"
            />
          </div>
        </div>

        <div className="relative flex items-center gap-5 text-white">
          <div className="relative">
            {profile ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex flex-col items-center focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold select-none">
                    {profile.initials}
                  </div>
                  <span className="text-xs mt-1 lowercase select-text max-w-[120px] truncate text-center">
                    {profile.email}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg text-black z-50">
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
                <Link to="/login" className="text-white font-semibold hover:text-primary transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register" className="ml-4 text-white font-semibold hover:text-primary transition-colors duration-200">
                  Register
                </Link>
              </>
            )}
          </div>

          <button title="Wishlist" className="hidden sm:block hover:text-primary transition-colors duration-200" aria-label="Wishlist">
            <HiOutlineHeart className="w-6 h-6" />
          </button>

          <Link
            to="/cart"
            className="bg-primary p-2 flex items-center rounded-md hover:bg-blue-700 transition-colors duration-200 relative"
            aria-label="Cart"
          >
            <HiOutlineShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5">
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

