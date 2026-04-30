import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [message, setMessage] = useState("");
  const { registerUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ---------------- SUBMIT ----------------
  const onSubmit = async (data) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`;

      await registerUser(
        data.email,
        data.password,
        fullName,
        data.phone,
        data.address
      );

      navigate("/");
    } catch (error) {
      setMessage(error?.message || "Registration failed");
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch {
      setMessage("Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

          {/* FAKE FIELDS (STOP AUTOFILL) */}
          <input type="text" autoComplete="username" className="hidden" />
          <input type="password" autoComplete="new-password" className="hidden" />

          {/* FIRST NAME */}
          <input
            {...register("firstName", {
              required: "First name is required",
            })}
            type="text"
            placeholder="First Name"
            className="w-full mb-2 px-4 py-2 border rounded-lg"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mb-2">
              {errors.firstName.message}
            </p>
          )}

          {/* LAST NAME */}
          <input
            {...register("lastName", {
              required: "Last name is required",
            })}
            type="text"
            placeholder="Last Name"
            className="w-full mb-2 px-4 py-2 border rounded-lg"
          />

          {/* EMAIL (GMAIL STYLE VALIDATION) */}
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Email must be a valid @gmail.com address",
              },
            })}
            type="email"
            placeholder="example@gmail.com"
            className="w-full mb-2 px-4 py-2 border rounded-lg"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mb-2">
              {errors.email.message}
            </p>
          )}

          {/* PASSWORD (5+ CHAR + NUMBER) */}
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password must be at least 5 characters",
              },
              validate: (value) =>
                /[0-9]/.test(value) ||
                "Password must contain at least one number",
            })}
            type="password"
            placeholder="Password"
            className="w-full mb-2 px-4 py-2 border rounded-lg"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mb-2">
              {errors.password.message}
            </p>
          )}

          {/* PHONE (10 DIGITS ONLY) */}
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone number must be exactly 10 digits",
              },
            })}
            type="tel"
            placeholder="98XXXXXXXX"
            className="w-full mb-2 px-4 py-2 border rounded-lg"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mb-2">
              {errors.phone.message}
            </p>
          )}

          {/* ADDRESS */}
          <textarea
            {...register("address", {
              required: "Address is required",
            })}
            placeholder="Address"
            rows={3}
            className="w-full mb-3 px-4 py-2 border rounded-lg"
          />

          {/* ERROR MESSAGE */}
          {message && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {message}
            </p>
          )}

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Create Account
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-2 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* GOOGLE */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </button>

        {/* LOGIN */}
        <p className="text-center text-sm mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
