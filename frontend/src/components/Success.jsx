import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const encodedData = queryParams.get("data");
  const method = queryParams.get("method");
  const pidx = queryParams.get("pidx");
  const isSim = queryParams.get("sim") === "true";

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const savedOrder = localStorage.getItem("pendingOrder");
        const pendingOrder = savedOrder ? JSON.parse(savedOrder) : null;

        if (!pendingOrder) throw new Error("Pending order details were not found.");

        let finalOrderId = null;

        // ── Khalti ────────────────────────────────────────────────────────
        if (method === "khalti" && pidx) {
          setPaymentMethod("Khalti");

          const verifyRes = await axios.post(`${getBaseUrl()}/verify-khalti`, {
            pidx,
            transactionUuid: pendingOrder.transactionUuid,
          });

          if (verifyRes.data?.transaction?.status !== "COMPLETE") {
            throw new Error("Khalti payment was not completed.");
          }

          const orderRes = await axios.post(`${getBaseUrl()}/api/orders/esewa`, {
            ...pendingOrder,
            transactionUuid: pendingOrder.transactionUuid,
            paymentStatus: "COMPLETE",
            paymentMethod: "Khalti",
          });

          finalOrderId = orderRes.data._id;

        // ── eSewa ─────────────────────────────────────────────────────────
        } else if (encodedData) {
          setPaymentMethod("eSewa");

          // Send just the raw base64 string, not wrapped in object
          const paymentRes = await axios.post(`${getBaseUrl()}/payment-status`, {
            data: encodedData,
          });

          if (paymentRes.data?.transaction?.status !== "COMPLETE") {
            throw new Error("eSewa payment was not completed.");
          }

          const orderRes = await axios.post(`${getBaseUrl()}/api/orders/esewa`, {
            ...pendingOrder,
            transactionUuid: paymentRes.data.transaction.transaction_uuid,
            paymentStatus: "COMPLETE",
            paymentMethod: "eSewa",
          });

          finalOrderId = orderRes.data._id;

        } else {
          throw new Error("No payment data received.");
        }

        localStorage.removeItem("pendingOrder");
        setOrderId(finalOrderId);
      } catch (err) {
        console.error("Payment verify error:", err);
        setError(
          err.response?.data?.message || err.message || "Unable to verify payment."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [encodedData, method, pidx]);

  useEffect(() => {
    if (loading || error) return;
    const timer = setTimeout(() => navigate("/"), 4000);
    return () => clearTimeout(timer);
  }, [error, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 animate-pulse">Verifying payment...</p>
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
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Thank you! Your order has been placed via {paymentMethod}.
        </p>
        {orderId && (
          <p className="mt-3 text-sm text-gray-500">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <p className="text-xs text-gray-400 mt-4">Redirecting to homepage in 4 seconds...</p>
      </div>
    </div>
  );
};

export default Success;