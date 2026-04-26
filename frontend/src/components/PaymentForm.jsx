
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getBaseUrl from '../utils/baseURL';

const generateUniqueId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (!orderData) {
      const savedOrder = localStorage.getItem('pendingOrder');
      if (savedOrder) {
        try {
          setOrderData(JSON.parse(savedOrder));
          return;
        } catch {
          localStorage.removeItem('pendingOrder');
        }
      }
      navigate('/checkout');
    }
  }, [orderData, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!orderData) return;
    setLoading(true);
    setPaymentError('');

    try {
      const response = await axios.post(`${getBaseUrl()}/initiate-payment`, {
        amount: orderData.totalPrice,
        productId: generateUniqueId(),
      });

      localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      const paymentUrl = response.data?.url || response.data?.paymentUrl || response.data?.redirectUrl;
      if (!paymentUrl) {
        console.error('Missing payment URL in response:', response.data);
        setPaymentError('Unable to start eSewa payment. Please try again later.');
        return;
      }

      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error initiating payment:', error);
      setPaymentError(error.response?.data?.message || 'Error initiating payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Confirm Payment</h1>
      <p><strong>Total Items:</strong> {orderData?.totalItems ?? '-'}</p>
      <p><strong>Total Amount:</strong> Rs. {orderData?.totalPrice ?? '-'}</p>

      {paymentError && (
        <div className="mb-4 text-red-600">{paymentError}</div>
      )}

      <form onSubmit={handlePayment}>
        <button
          type="submit"
          disabled={!orderData || loading}
          className={`mt-6 text-white px-4 py-2 rounded ${
            !orderData || loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? 'Processing...' : 'Pay with eSewa'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;

