import React from 'react'
import { useNavigate } from "react-router-dom";


const Failure = () => {
  const navigate = useNavigate();
  const retryPayment = () => {
    const pendingOrder = localStorage.getItem("pendingOrder");
    navigate(pendingOrder ? "/payment" : "/checkout");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p className="text-gray-600 mt-2">
          The eSewa payment was cancelled, failed, or is still pending.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={retryPayment}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Failure
