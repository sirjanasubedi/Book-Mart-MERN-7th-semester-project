import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin'); 
  };

  const profileLetter = currentUser?.email?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold mr-3">
            {profileLetter}
          </div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-300">{currentUser?.email}</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-2 flex-1">
          <Link to="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/dashboard/manage-books" className="block py-2 px-4 rounded hover:bg-gray-700">
            Manage Books
          </Link>
          <Link to="/dashboard/add-book" className="block py-2 px-4 rounded hover:bg-gray-700">
            Add New Book
          </Link>
          <Link to="/dashboard/orders" className="block py-2 px-4 rounded hover:bg-gray-700">
            Manage Orders
          </Link>
          <Link to="/dashboard/users" className="block py-2 px-4 rounded hover:bg-gray-700">
            Manage Users
          </Link>
          <Link to="/dashboard/payment-reports" className="block py-2 px-4 rounded hover:bg-gray-700">
            Payment Reports
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 rounded hover:bg-red-700 mt-4"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
