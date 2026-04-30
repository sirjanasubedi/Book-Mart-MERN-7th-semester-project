import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded?.role !== "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Outlet />; // ✅ CLEAN FIX
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/admin" replace />;
  }
};

export default AdminRoute;
