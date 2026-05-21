import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getBaseUrl from "../utils/baseURL";
import { jwtDecode } from "jwt-decode";

const AdminLogin = () => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ Auto redirect if already logged in as admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.role === "admin") {
          navigate("/dashboard");
        }
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setMessage("");
    setSuccess("");

    try {
      const res = await axios.post(
        `${getBaseUrl()}/api/auth/admin`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      const auth = res.data;

      if (!auth.token) {
        setMessage("Invalid credentials.");
        return;
      }

      const decoded = jwtDecode(auth.token);

      // ✅ Block normal users from admin login
      if (decoded?.role !== "admin") {
        setMessage("Access denied. This page is for admins only.");
        return;
      }

      localStorage.setItem("token", auth.token);
      setSuccess("Login successful! Redirecting...");
      setMessage("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.log(error);
      setMessage("Invalid email or password.");
      setSuccess("");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-md rounded px-8 py-6">

        <h2 className="text-xl font-bold mb-4 text-center">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">Email required</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">Password required</p>
            )}
          </div>

          {/* ERROR MESSAGE */}
          {message && (
            <p className="text-red-500 text-sm mb-2">{message}</p>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <p className="text-green-600 text-sm mb-2">{success}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;