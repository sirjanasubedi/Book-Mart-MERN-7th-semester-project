



import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
          <p className="mb-6 text-gray-600">We couldn't find your order details.</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto mb-4 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-700">Order ID:</p>
          <p className="text-lg font-mono text-gray-900">{state.orderId}</p>
          <p className="mt-2 text-gray-600">
            Payment Method: {state.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "eSewa"}
          </p>
        </div>

        <p className="mb-6 text-gray-600">
          Thank you for your order. {state.paymentMethod === "CASH_ON_DELIVERY" && 
          "You will pay when your order is delivered."}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/user-dashboard/orders/${state.orderId}`)}  
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Order Details
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;