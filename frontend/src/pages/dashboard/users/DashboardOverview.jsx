import React from "react";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading } =
    useGetOrderByEmailQuery(currentUser?.email);

  // loading UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // -------------------------
  // DATA CALCULATIONS
  // -------------------------
  const totalOrders = orders.length;

  const totalSpent = orders
    .filter((order) => order.paymentStatus === "COMPLETE")
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const pendingOrders = orders.filter(
    (order) => order.paymentStatus === "PENDING"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.paymentStatus === "COMPLETE"
  ).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // -------------------------
  // FORMAT CURRENCY (IMPORTANT FIX)
  // -------------------------
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
    }).format(amount || 0);
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser?.fullName || currentUser?.email}
        </h1>
        <p className="text-gray-600 mt-1">
          Here is your store performance overview
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* TOTAL ORDERS */}
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold">{totalOrders}</h2>
        </div>

        {/* EARNINGS (FIXED) */}
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Earnings</p>
          <h2 className="text-2xl font-bold break-words">
            {formatMoney(totalSpent)}
          </h2>
        </div>

        {/* PENDING */}
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pending Orders</p>
          <h2 className="text-2xl font-bold">{pendingOrders}</h2>
        </div>

        {/* COMPLETED */}
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Completed Orders</p>
          <h2 className="text-2xl font-bold">{completedOrders}</h2>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* RECENT ORDERS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link
              to="/user-dashboard/orders"
              className="text-blue-600 text-sm"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between border p-4 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {formatMoney(order.totalPrice)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.paymentStatus === "COMPLETE"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No orders yet</p>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="space-y-3">
            <Link
              to="/"
              className="block bg-blue-600 text-white text-center py-3 rounded-lg"
            >
              Continue Shopping
            </Link>

            <Link
              to="/user-dashboard/orders"
              className="block bg-gray-100 text-center py-3 rounded-lg"
            >
              Order History
            </Link>

            <Link
              to="/profile"
              className="block bg-gray-100 text-center py-3 rounded-lg"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
