import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const adminLinks = [
  { name: "Overview", to: "/dashboard" },
  { name: "Add Book", to: "/dashboard/add-book" },
  { name: "Manage Books", to: "/dashboard/manage-books" },
  { name: "Manage Categories", to: "/dashboard/manage-categories" }, // ✅ NEW
  { name: "Orders", to: "/dashboard/orders" },
  { name: "Payment Reports", to: "/dashboard/payment-reports" },
  { name: "Users", to: "/dashboard/users" },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setAdminData(decoded);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            {adminLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block px-4 py-2 rounded-md text-sm transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {adminData?.email || "Admin"}
          </h1>
          <p className="text-sm text-gray-500">
            Manage your store, books, and orders
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;