import React from "react";
import { useNavigate } from "react-router-dom";

const LoginChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-100 text-center">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          Login as
        </h1>
        <p className="text-gray-500 mt-2">
          Choose your role to continue
        </p>

        {/* Buttons */}
        <div className="mt-8 space-y-4">

          {/* USER */}
          <button
            onClick={() => navigate("/login/user")}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium shadow-md hover:bg-indigo-700 hover:scale-[1.02] transition"
          >
            👤 Continue as User
          </button>

          {/* ADMIN */}
          <button
            onClick={() => navigate("/admin")}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium shadow-md hover:bg-green-700 hover:scale-[1.02] transition"
          >
            🛠️ Continue as Admin
          </button>

        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          Secure login powered by BookStore System
        </p>

      </div>
    </div>
  );
};

export default LoginChoice;
