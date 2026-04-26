

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base64Decode } from "esewajs";
import axios from "axios";

const Success = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");
  const isMock = queryParams.get("mock") === "true";
  
  const verifyPaymentAndUpdateStatus = async () => {
    try {
      const orderData = JSON.parse(localStorage.getItem("pendingOrder"));
      if (!orderData) {
        throw new Error("Order data not found in localStorage");
      }

      if (isMock) {
        const orderResponse = await axios.post("http://localhost:5000/api/orders/esewa", {
          ...orderData,
          productId: orderData.productIds?.[0]?._id || `mock-${Date.now()}`,
          paymentStatus: "COMPLETE",
          paymentMethod: "eSewa",
          mock: true,
        });

        localStorage.removeItem("pendingOrder");
        setOrderId(orderResponse.data._id);
        setIsSuccess(true);

        setTimeout(() => {
          navigate(`/user-dashboard/orders/${orderResponse.data._id}`);
        }, 5000);
        return;
      }

      if (!token) {
        throw new Error("Payment verification token missing.");
      }

      const decoded = base64Decode(token);
      console.log("Decoded token:", decoded);

      const paymentResponse = await axios.post("http://localhost:5000/payment-status", {
        product_id: decoded.transaction_uuid,
      });

      if (paymentResponse.status === 200) {
        const orderResponse = await axios.post("http://localhost:5000/api/orders/esewa", {
          ...orderData,
          productId: decoded.transaction_uuid,
          paymentStatus: "COMPLETE"
        });

        localStorage.removeItem("pendingOrder");
        setOrderId(orderResponse.data._id);
        setIsSuccess(true);

        // Automatically redirect to order details after 5 seconds
        setTimeout(() => {
          navigate(`/user-dashboard/orders/${orderResponse.data._id}`);
        }, 5000);
      }
    } catch (error) {
      console.error("Error in payment verification:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyPaymentAndUpdateStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Your Payment</h2>
          <p className="text-gray-600">Please wait while we process your order</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Processing Error</h1>
          <p className="mb-6 text-gray-700">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/user-dashboard/orders/${orderId}`)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Check Your Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto mb-4 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Payment Status Unknown</h1>
          <p className="mb-4 text-gray-600">We couldn't verify your payment status.</p>
          <p className="mb-6 text-gray-600">Please check your orders or contact support.</p>
          <button
            onClick={() => navigate(`/user-dashboard/orders/${orderId}`)}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Check Your Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto mb-4 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-700">Order ID:</p>
          <p className="text-lg font-mono text-gray-900">{orderId}</p>
        </div>
        <p className="mb-6 text-gray-600">You'll be redirected to your order details shortly...</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-green-500 h-2.5 rounded-full animate-pulse" style={{width: '100%'}}></div>
        </div>
        <button
          onClick={() => navigate(`/user-dashboard/orders/${orderId}`)}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          View Order Details Now
        </button>
      </div>
    </div>
  );
};

export default Success;