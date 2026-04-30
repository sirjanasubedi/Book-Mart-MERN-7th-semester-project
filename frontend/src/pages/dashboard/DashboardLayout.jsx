import React from "react";
import { Outlet } from "react-router-dom";


const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back 👋 Here is your system performance
          </p>
        </div>

        {/* CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-md">
            <Outlet />
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-4 space-y-6">

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h2 className="text-sm font-semibold mb-3">
                Quick Overview
              </h2>
              <p className="text-xs text-gray-500">
                Use left menu to manage system data efficiently.
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h2 className="text-sm font-semibold text-blue-700">
                Admin Tip
              </h2>
              <p className="text-xs text-blue-600 mt-2">
                Keep books updated regularly for better sales analytics.
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
