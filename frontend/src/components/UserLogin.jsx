import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../pages/PasswordInput";

const getAuthErrorMessage = (error) => {
  if (!error) return "Please provide a valid email and password.";

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  const code = error?.code || "";

  switch (code) {
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      return error?.message || "Login failed. Please try again.";
  }
};

const UserLogin = () => {
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setSuccessMessage("");

    try {
      await loginUser(data.email, data.password);

      // ✅ Show success message (NO ALERT)
      setSuccessMessage("Login successful!");

      // ✅ Redirect after short delay (smooth UX)
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 800);

    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          User Login
        </h2>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-3 text-green-700 bg-green-100 border border-green-300 p-2 rounded text-sm text-center">
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {message && (
          <div className="mb-3 text-red-600 bg-red-50 border border-red-200 p-2 rounded text-sm text-center">
            {message}
          </div>
        )}

        {/* EMAIL */}
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="mb-4 w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* PASSWORD */}
        <PasswordInput
          register={register}
          name="password"
          placeholder="Password"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
};

export default UserLogin;
