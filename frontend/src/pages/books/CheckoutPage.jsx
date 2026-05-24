import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import getBaseUrl from "../../utils/baseURL";
import {
  User, Mail, Phone, MapPin, CreditCard,
  ShoppingBag, Truck, Shield, ChevronRight, Package
} from "lucide-react";

// ── Cart item with stable image (no blinking) ─────────────────────────────
const CartItem = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const baseUrl = getBaseUrl().replace("/api", "");
  const imageUrl = item.coverImage
    ? item.coverImage.startsWith("http")
      ? item.coverImage
      : `${baseUrl}/${item.coverImage}`
    : null;

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="h-12 w-9 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-100 relative">
        {!imgError && imageUrl ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
            )}
            <img
              src={imageUrl}
              alt={item.title}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <span className="text-lg">📖</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">{item.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
      </div>
      <p className="text-sm font-semibold text-gray-800 shrink-0">
        Rs. {(item.newPrice * item.quantity).toFixed(2)}
      </p>
    </div>
  );
};

// ── Reusable input field ──────────────────────────────────────────────────
const InputField = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1.5">
      {label} <span className="text-red-400">*</span>
    </label>
    <div className={`flex items-center gap-2.5 px-3.5 py-3 border rounded-xl bg-gray-50
      focus-within:bg-white focus-within:border-blue-400 focus-within:ring-2
      focus-within:ring-blue-50 transition-all duration-200
      ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
      <Icon size={15} className={error ? "text-red-400" : "text-gray-400"} />
      {children}
    </div>
    {error && (
      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

// ── Main checkout page ────────────────────────────────────────────────────
function CheckoutPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const {
    register, handleSubmit, reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  // Auto-fill from logged-in user
  useEffect(() => {
    if (currentUser) {
      reset({
        name:
          currentUser?.displayName ||
          `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
          currentUser?.fullName ||
          currentUser?.name || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || currentUser?.phoneNumber || "",
        address: currentUser?.address || "",
        city: currentUser?.city || "",
        state: currentUser?.state || "",
        country: currentUser?.country || "Nepal",
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const newOrder = {
      ...data,
      totalPrice,
      totalItems,
      paymentMethod: paymentMethod === "esewa" ? "ESEWA" : "CASH_ON_DELIVERY",
      productIds: cartItems.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        price: item.newPrice,
      })),
    };

    try {
      if (paymentMethod === "esewa") {
        const res = await axios.post(`${getBaseUrl()}/api/orders`, {
          ...newOrder,
          paymentStatus: "PENDING",
        });
        const pendingEsewaOrder = {
          ...newOrder,
          _id: res.data._id,
          orderId: res.data._id,
          paymentStatus: "PENDING",
        };
        localStorage.setItem("pendingOrder", JSON.stringify(pendingEsewaOrder));
        navigate("/payment", { state: pendingEsewaOrder });
      } else {
        const res = await axios.post(`${getBaseUrl()}/api/orders`, newOrder);
        navigate("/order-confirmation", { state: { orderId: res.data._id } });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate("/cart")}>Cart</span>
          <ChevronRight size={14} />
          <span className="text-gray-700 font-medium">Checkout</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* ── LEFT FORM ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-white" />
                  <h2 className="text-base font-semibold text-white">Delivery Information</h2>
                </div>
              </div>

              <div className="p-6">
                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid md:grid-cols-2 gap-4">

                    <InputField label="Full Name" icon={User} error={errors.name?.message}>
                      <input
                        {...register("name", { required: "Full Name is required" })}
                        placeholder="Your full name"
                        className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                      />
                    </InputField>

                    <InputField label="Email" icon={Mail} error={errors.email?.message}>
                      <input
                        {...register("email", { required: "Email is required" })}
                        placeholder="your@email.com"
                        className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                      />
                    </InputField>

                    <div className="md:col-span-2">
                      <InputField label="Phone" icon={Phone} error={errors.phone?.message}>
                        <input
                          {...register("phone", { required: "Phone is required" })}
                          placeholder="98XXXXXXXX"
                          className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                        />
                      </InputField>
                    </div>

                    <div className="md:col-span-2">
                      <InputField label="Street Address" icon={MapPin} error={errors.address?.message}>
                        <input
                          {...register("address", { required: "Address is required" })}
                          placeholder="Street, area, locality"
                          className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                        />
                      </InputField>
                    </div>

                    <InputField label="City" icon={MapPin} error={errors.city?.message}>
                      <input
                        {...register("city", { required: "City is required" })}
                        placeholder="Kathmandu"
                        className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                      />
                    </InputField>

                    <InputField label="State" icon={MapPin} error={errors.state?.message}>
                      <input
                        {...register("state", { required: "State is required" })}
                        placeholder="Bagmati"
                        className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                      />
                    </InputField>

                    <div className="md:col-span-2">
                      <InputField label="Country" icon={MapPin} error={errors.country?.message}>
                        <input
                          {...register("country", { required: "Country is required" })}
                          placeholder="Nepal"
                          className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                        />
                      </InputField>
                    </div>

                  </div>
                </form>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-white" />
                  <h2 className="text-base font-semibold text-white">Payment Method</h2>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {/* eSewa */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === "esewa"
                    ? "border-green-400 bg-green-50 shadow-sm"
                    : "border-gray-200 hover:border-green-200 hover:bg-green-50/30"
                }`}>
                  <input
                    type="radio"
                    checked={paymentMethod === "esewa"}
                    onChange={() => setPaymentMethod("esewa")}
                    className="accent-green-500 w-4 h-4"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src="https://esewa.com.np/common/images/esewa_logo.png"
                        alt="eSewa"
                        className="h-5 w-auto"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = '<span class="text-green-600 font-bold text-xs">eSewa</span>';
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Pay with eSewa</p>
                      <p className="text-xs text-gray-400">Fast & secure digital wallet</p>
                    </div>
                  </div>
                  {paymentMethod === "esewa" && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </label>

                {/* COD */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === "cod"
                    ? "border-blue-400 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                }`}>
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-blue-500 w-4 h-4"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Truck size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-400">Pay when your order arrives</p>
                    </div>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Terms + Submit */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="flex items-start gap-3 cursor-pointer mb-5">
                <div
                  onClick={() => setIsChecked(!isChecked)}
                  className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    isChecked ? "bg-blue-600 border-blue-600" : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {isChecked && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I agree with the{" "}
                  <button type="button" onClick={() => setShowTerms(true)}
                    className="text-blue-600 font-medium hover:underline">
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button type="button" onClick={() => setShowPrivacy(true)}
                    className="text-blue-600 font-medium hover:underline">
                    Privacy Policy
                  </button>
                </p>
              </label>

              <button
                type="submit"
                form="checkout-form"
                disabled={!isValid || !isChecked || isSubmitting}
                className={`w-full py-4 rounded-xl font-semibold text-white text-sm tracking-wide
                  shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  !isValid || !isChecked || isSubmitting
                    ? "bg-gray-300 cursor-not-allowed shadow-none"
                    : paymentMethod === "esewa"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:scale-[0.99]"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Processing...
                  </>
                ) : paymentMethod === "esewa" ? (
                  <>Pay with eSewa <ChevronRight size={16} /></>
                ) : (
                  <>Place Order <ChevronRight size={16} /></>
                )}
              </button>
            </div>

          </div>

          {/* ── RIGHT SUMMARY ──────────────────────────────────────────── */}
          <div className="space-y-4 sticky top-6">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-purple-600 to-pink-500">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-white" />
                  <h2 className="text-base font-semibold text-white">Order Summary</h2>
                  <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {/* Cart items — stable, no blinking */}
                <div className="space-y-2 mb-4 max-h-52 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>Rs. {totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free 🎉</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2.5 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-blue-600">Rs. {totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
              {[
                { icon: Shield, color: "green", label: "Secure Checkout", sub: "SSL encrypted payment" },
                { icon: Truck, color: "blue", label: "Free Delivery", sub: "On all orders" },
                { icon: Package, color: "purple", label: "Easy Returns", sub: "7-day return policy" },
              ].map(({ icon: Icon, color, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`p-2 bg-${color}-50 rounded-lg shrink-0`}>
                    <Icon size={15} className={`text-${color}-600`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-base font-bold text-white">Terms & Conditions</h2>
              <button onClick={() => setShowTerms(false)}
                className="text-white/70 hover:text-white text-xl font-bold">✕</button>
            </div>
            <div className="p-6 space-y-3 text-gray-600 text-sm leading-relaxed max-h-72 overflow-y-auto">
              <p>1. You confirm that all order details, including address and phone number, are accurate.</p>
              <p>2. Payment must be completed to confirm your order. If you choose eSewa, you will be redirected to the payment gateway.</p>
              <p>3. Orders can be modified or canceled only according to our refund and cancellation policy.</p>
              <p>4. By proceeding with checkout, you agree to our terms and allow Book Mart to process your payment.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowTerms(false)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm">
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-base font-bold text-white">Privacy Policy</h2>
              <button onClick={() => setShowPrivacy(false)}
                className="text-white/70 hover:text-white text-xl font-bold">✕</button>
            </div>
            <div className="p-6 space-y-3 text-gray-600 text-sm leading-relaxed max-h-72 overflow-y-auto">
              <p>1. We collect only the information required to process your order and payment.</p>
              <p>2. Your payment details are handled securely through our payment gateway and are not stored on this site.</p>
              <p>3. We may use your email and phone number to confirm your order and provide delivery updates.</p>
              <p>4. We will not share your personal data with third parties except to fulfill your order.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowPrivacy(false)}
                className="w-full py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium text-sm">
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default CheckoutPage;