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
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (!esewaForm) return;
    document.getElementById('esewa-payment-form')?.submit();
  }, [esewaForm]);

  useEffect(() => {
    if (!orderData) {
      const savedOrder = localStorage.getItem('pendingOrder');
      if (savedOrder) {
        try { setOrderData(JSON.parse(savedOrder)); return; }
        catch { localStorage.removeItem('pendingOrder'); }
      }
      navigate('/checkout');
    }
  }, [orderData, navigate]);

  const handleEsewaPayment = async () => {
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

      const paymentUrl = response.data?.paymentUrl;
      const formData = response.data?.formData;

      if (!paymentUrl || !formData?.transaction_uuid) {
        setPaymentError('Unable to start eSewa payment. Please try again.');
        return;
      }

      localStorage.setItem('pendingOrder', JSON.stringify({
        ...orderData,
        transactionUuid,
        paymentMethod: 'esewa',
      }));

      setEsewaForm({ paymentUrl, formData });
    } catch (error) {
      setPaymentError(error.response?.data?.message || 'eSewa payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5">
            <h1 className="text-xl font-bold text-white">Complete Your Order</h1>
            <p className="text-green-100 text-sm mt-1">Review and confirm payment</p>
          </div>

          {/* Order Summary */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Order Summary
            </h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Items</span>
              <span className="font-medium text-gray-800">{orderData?.totalItems ?? 0}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="font-semibold text-gray-700">Total Amount</span>
              <span className="text-xl font-bold text-green-600">
                Rs. {orderData?.totalPrice ?? '0.00'}
              </span>
            </div>
          </div>

          {/* Payment Section */}
          <div className="px-6 py-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Payment Method
            </h2>

            {/* Error */}
            {paymentError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠</span>
                <p className="text-red-600 text-sm">{paymentError}</p>
              </div>
            )}

            {/* eSewa Button */}
            <button
              onClick={handleEsewaPayment}
              disabled={!orderData || loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-200 ${
                !orderData || loading
                  ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                  : 'bg-green-500 hover:bg-green-600 active:scale-95 shadow-md hover:shadow-green-200'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <img
                    src="https://esewa.com.np/common/images/esewa_logo.png"
                    alt="eSewa"
                    className="h-5 w-auto"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  Pay with eSewa
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-400 text-center mt-4">
              By paying, you agree to our{' '}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-green-600 underline hover:text-green-700"
              >
                Terms & Conditions
              </button>
            </p>
          </div>

          {/* Security note */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
            <span className="text-gray-400 text-xs">🔒</span>
            <p className="text-xs text-gray-400">Secured & encrypted payment</p>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
        >
          ← Go Back
        </button>
      </div>

      {/* Hidden eSewa form */}
      {esewaForm && (
        <form id="esewa-payment-form" action={esewaForm.paymentUrl} method="POST" className="hidden">
          {Object.entries(esewaForm.formData).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} readOnly />
          ))}
        </form>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Terms & Conditions</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>1. You agree to pay the full order amount using the selected payment method.</p>
              <p>2. Once payment is completed, the order cannot be canceled without our cancellation policy.</p>
              <p>3. Confirm your billing and shipping information before submitting payment.</p>
              <p>4. Disputes or refund requests must go through our customer support channels.</p>
              <p>5. By continuing, you accept these terms.</p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className="mt-5 w-full py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-medium"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;