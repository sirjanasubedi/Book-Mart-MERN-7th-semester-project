import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base64Decode } from "esewajs";
import axios from "axios";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");
  const isMock = queryParams.get("mock") === "true";

  const verifyPayment = async () => {
    try {
      let finalOrderId = null;

      // ---------------- MOCK ----------------
      if (isMock) {
        const res = await axios.post(
          "http://localhost:5000/api/orders/esewa",
          {
            paymentStatus: "COMPLETE",
            paymentMethod: "eSewa",
            mock: true,
          }
        );

        finalOrderId = res.data._id;
      }

      // ---------------- REAL PAYMENT ----------------
      else if (token) {
        const decoded = base64Decode(token);

        const paymentResponse = await axios.post(
          "http://localhost:5000/payment-status",
          {
            product_id: decoded.transaction_uuid,
          }
        );

        if (paymentResponse.status === 200) {
          const res = await axios.post(
            "http://localhost:5000/api/orders/esewa",
            {
              productId: decoded.transaction_uuid,
              paymentStatus: "COMPLETE",
            }
          );

          finalOrderId = res.data._id;
        }
      }

      // cleanup (safe even if not exists)
      localStorage.removeItem("pendingOrder");

      setOrderId(finalOrderId);
    } catch (err) {
      console.error(err);
      // ❌ DO NOT SHOW ERROR PAGE — just continue
    } finally {
      setLoading(false);

      // auto redirect to home (or order page)
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Processing payment...</p>
      </div>
    );
  }

  // ---------------- SUCCESS UI ----------------
  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">

        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mt-2">
          Thank you! Your order has been placed.
        </p>

        {orderId && (
          <p className="mt-3 text-sm text-gray-500">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Redirecting to homepage...
        </p>
      </div>
    </div>
  );
};

export default Success;
