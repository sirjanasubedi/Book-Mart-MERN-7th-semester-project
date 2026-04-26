import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getBaseUrl from "../utils/baseURL";
import { jwtDecode } from "jwt-decode";

const AdminLogin = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ if already logged in → go dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded?.role === "admin") {
          navigate("/dashboard"); // ✅ FIXED
        }
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${getBaseUrl()}/api/auth/admin`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const auth = res.data;

      // ❌ not admin check
      if (auth.user?.role !== "admin") {
        setMessage("You are not authorized as admin.");
        return;
      }

      // ✅ save token
      if (auth.token) {
        localStorage.setItem("token", auth.token);

        const decoded = jwtDecode(auth.token);

        if (decoded?.role !== "admin") {
          setMessage("Invalid admin token.");
          return;
        }

        alert("Admin login successful!");

        // ✅ IMPORTANT FIX HERE
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
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

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
