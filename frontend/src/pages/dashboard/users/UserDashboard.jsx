import React from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { data: orders = [], isLoading } = useGetOrderByEmailQuery(currentUser?.email);
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  // Function to determine if a nav item is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{currentUser.fullName} Dashboard</h2>
          <p className="text-sm text-gray-500">{currentUser?.email}</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/user-dashboard" 
                className={`block px-4 py-2 rounded-md ${
                  isActive('/user-dashboard') 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/user-dashboard/orders" 
                className={`block px-4 py-2 rounded-md ${
                  isActive('/user-dashboard/orders') 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                My Orders
              </Link>
            </li>
            <li>
              <Link 
                to="/user-dashboard/payment-history" 
                className={`block px-4 py-2 rounded-md ${
                  isActive('/user-dashboard/payment-history') 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Payment History
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default UserDashboard;