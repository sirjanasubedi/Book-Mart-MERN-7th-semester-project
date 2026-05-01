
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getBaseUrl from '../utils/baseURL';

const generateUniqueId = () => `BM-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [esewaForm, setEsewaForm] = useState(null);

  useEffect(() => {
    if (!esewaForm) return;

    document.getElementById('esewa-payment-form')?.submit();
  }, [esewaForm]);

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
      const transactionUuid = generateUniqueId();

      const response = await axios.post(`${getBaseUrl()}/initiate-payment`, {
        amount: Number(orderData.totalPrice),
        productId: transactionUuid,
        productIds: orderData.productIds,
        orderId: orderData._id || orderData.orderId,
      });

      const paymentUrl = response.data?.paymentUrl || response.data?.url;
      const formData = response.data?.formData;
      if (!paymentUrl) {
        console.error('Missing payment URL in response:', response.data);
        setPaymentError('Unable to start eSewa payment. Please try again later.');
        return;
      }

      localStorage.setItem(
        'pendingOrder',
        JSON.stringify({
          ...orderData,
          transactionUuid: formData?.transaction_uuid,
        })
      );

      if (response.data?.mock || !formData) {
        window.location.href = paymentUrl;
        return;
      }

      setEsewaForm({ paymentUrl, formData });
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

      {esewaForm && (
        <form
          id="esewa-payment-form"
          action={esewaForm.paymentUrl}
          method="POST"
          className="hidden"
        >
          {Object.entries(esewaForm.formData).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} readOnly />
          ))}
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
