import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const encodedData = queryParams.get("data");
  const isMock = queryParams.get("mock") === "true";

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const savedOrder = localStorage.getItem("pendingOrder");
        const pendingOrder = savedOrder ? JSON.parse(savedOrder) : null;

        if (!pendingOrder && !isMock) {
          throw new Error("Pending order details were not found.");
        }

        let finalOrderId = null;

        if (isMock) {
          const res = await axios.post(`${getBaseUrl()}/api/orders/esewa`, {
            ...(pendingOrder || {}),
            paymentStatus: "COMPLETE",
            paymentMethod: "eSewa",
            mock: true,
          });
          finalOrderId = res.data._id;

        } else if (encodedData) {
          // Step 1: Verify payment with eSewa
          const paymentResponse = await axios.post(`${getBaseUrl()}/payment-status`, {
            data: encodedData,
          });

          if (paymentResponse.data?.transaction?.status !== "COMPLETE") {
            throw new Error("Payment was not completed.");
          }

          // Step 2: Save order to database
          const res = await axios.post(`${getBaseUrl()}/api/orders/esewa`, {
            ...pendingOrder,
            transactionUuid: paymentResponse.data.transaction.transaction_uuid,
            productId: paymentResponse.data.transaction.transaction_uuid,
            paymentStatus: "COMPLETE",
            paymentMethod: "eSewa",
          });

          finalOrderId = res.data._id;
        } else {
          throw new Error("eSewa did not return payment data.");
        }

        localStorage.removeItem("pendingOrder");
        setOrderId(finalOrderId);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Unable to verify payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [encodedData, isMock]);

  useEffect(() => {
    if (loading || error) return;
    const timer = setTimeout(() => navigate("/"), 3000);
    return () => clearTimeout(timer);
  }, [error, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Processing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600">Payment Verification Failed</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">Thank you! Your order has been placed.</p>
        {orderId && (
          <p className="mt-3 text-sm text-gray-500">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <p className="text-xs text-gray-400 mt-4">Redirecting to homepage...</p>
      </div>
    </div>
  );
};

export default Success;