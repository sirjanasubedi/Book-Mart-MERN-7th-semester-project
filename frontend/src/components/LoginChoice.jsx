import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-2xl font-semibold">Login as</h1>
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/login/user")}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          User
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Admin
        </button>
      </div>
    </div>
  );
};

export default LoginChoice;
