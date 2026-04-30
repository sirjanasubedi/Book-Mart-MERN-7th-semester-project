import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import getBaseUrl from "../../utils/baseURL";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";

function CheckoutPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const [paymentMethod, setPaymentMethod] =
    useState("esewa");
  const [isChecked, setIsChecked] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const totalPrice = cartItems
    .reduce(
      (acc, item) =>
        acc + item.newPrice * item.quantity,
      0
    )
    .toFixed(2);

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  /* AUTO FILL USER DATA */
  useEffect(() => {
    if (currentUser) {
      reset({
        name:
          currentUser?.displayName ||
          currentUser?.fullName ||
          currentUser?.name ||
          currentUser?.username ||
          "",

        email: currentUser?.email || "",

        phone:
          currentUser?.phone ||
          currentUser?.phoneNumber ||
          "",

        address:
          currentUser?.address || "",

        city: currentUser?.city || "",
        state: currentUser?.state || "",
        country:
          currentUser?.country || "Nepal",

        zipcode:
          currentUser?.zipcode || "",
      });
    }
  }, [currentUser, reset]);

  /* SUBMIT */
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const newOrder = {
      ...data,
      totalPrice,
      totalItems,
      paymentMethod:
        paymentMethod === "esewa"
          ? "ESEWA"
          : "CASH_ON_DELIVERY",

      productIds: cartItems.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        price: item.newPrice,
      })),
    };

    try {
      if (paymentMethod === "esewa") {
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify(newOrder)
        );

        navigate("/payment", {
          state: newOrder,
        });
      } else {
        const res = await axios.post(
          `${getBaseUrl()}/api/orders`,
          newOrder
        );

        navigate("/order-confirmation", {
          state: {
            orderId: res.data._id,
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Checkout Details
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Fill all required details to continue.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* PERSONAL INFO */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-5">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                {/* NAME */}
                <div>
                  <label className="label">
                    Full Name *
                  </label>
                  <div className="inputBox">
                    <User size={18} />
                    <input
                      {...register("name", {
                        required:
                          "Full Name is required",
                      })}
                      className="input"
                    />
                  </div>
                  <p className="error">
                    {errors.name?.message}
                  </p>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="label">
                    Email *
                  </label>
                  <div className="inputBox">
                    <Mail size={18} />
                    <input
                      {...register("email", {
                        required:
                          "Email is required",
                      })}
                      className="input"
                    />
                  </div>
                  <p className="error">
                    {errors.email?.message}
                  </p>
                </div>

                {/* PHONE */}
                <div>
                  <label className="label">
                    Phone *
                  </label>
                  <div className="inputBox">
                    <Phone size={18} />
                    <input
                      {...register("phone", {
                        required:
                          "Phone is required",
                      })}
                      className="input"
                      type="text"
                    />
                  </div>
                  <p className="error">
                    {errors.phone?.message}
                  </p>
                </div>

                {/* ZIP */}
                <div>
                  <label className="label">
                    Zip Code *
                  </label>
                  <div className="inputBox">
                    <MapPin size={18} />
                    <input
                      {...register("zipcode", {
                        required:
                          "Zip code is required",
                      })}
                      className="input"
                    />
                  </div>
                  <p className="error">
                    {errors.zipcode?.message}
                  </p>
                </div>

                {/* ADDRESS */}
                <div className="md:col-span-2">
                  <label className="label">
                    Street Address *
                  </label>
                  <div className="inputBox">
                    <MapPin size={18} />
                    <input
                      {...register("address", {
                        required:
                          "Address is required",
                      })}
                      className="input"
                    />
                  </div>
                  <p className="error">
                    {errors.address?.message}
                  </p>
                </div>

                {/* CITY */}
                <div>
                  <label className="label">
                    City *
                  </label>
                  <div className="inputBox">
                    <MapPin size={18} />
                    <input
                      {...register("city", {
                        required:
                          "City is required",
                      })}
                      className="input"
                    />
                  </div>
                  <p className="error">
                    {errors.city?.message}
                  </p>
                </div>

                {/* STATE */}
                <div>
                  <label className="label">
                    State *
                  </label>
                  <div className="inputBox">
                    <MapPin size={18} />
                    <input
                      {...register("state", {
                        required:
                          "State is required",
                      })}
                      className="input"
                    />
                  </div>
                  <p className="error">
                    {errors.state?.message}
                  </p>
                </div>

                {/* COUNTRY */}
                <div className="md:col-span-2">
                  <label className="label">
                    Country *
                  </label>
                  <div className="inputBox">
                    <MapPin size={18} />
                    <input
                      {...register("country", {
                        required:
                          "Country is required",
                      })}
                      className="input"
                    />
                  </div>
                  <p className="error">
                    {errors.country?.message}
                  </p>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-5">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="paymentCard">
                  <input
                    type="radio"
                    checked={
                      paymentMethod === "esewa"
                    }
                    onChange={() =>
                      setPaymentMethod("esewa")
                    }
                  />
                  <span>Pay with eSewa</span>
                </label>

                <label className="paymentCard">
                  <input
                    type="radio"
                    checked={
                      paymentMethod === "cod"
                    }
                    onChange={() =>
                      setPaymentMethod("cod")
                    }
                  />
                  <span>
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </div>

            {/* TERMS */}
            <div className="flex gap-3 items-start">
              <input
                type="checkbox"
                onChange={(e) =>
                  setIsChecked(
                    e.target.checked
                  )
                }
              />

              <p className="text-sm text-gray-600">
                I agree with{" "}
                <Link className="text-blue-600 underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link className="text-blue-600 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={
                !isValid ||
                !isChecked ||
                isSubmitting
              }
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Processing..."
                : paymentMethod ===
                  "esewa"
                ? "Pay with eSewa"
                : "Place Order"}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-3xl shadow-xl p-8 h-fit sticky top-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                Rs. {totalPrice}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">
                Free
              </span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-blue-600">
                Rs. {totalPrice}
              </span>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm text-gray-600">
            <CreditCard
              size={18}
              className="mb-2"
            />
            Secure payment with SSL
            encryption.
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>
        {`
        .label{
          display:block;
          font-size:14px;
          font-weight:600;
          margin-bottom:8px;
          color:#374151;
        }

        .inputBox{
          display:flex;
          align-items:center;
          gap:10px;
          padding:12px 14px;
          border:1px solid #e5e7eb;
          border-radius:16px;
          background:#f9fafb;
        }

        .inputBox:focus-within{
          border-color:#2563eb;
          background:white;
        }

        .input{
          width:100%;
          background:transparent;
          outline:none;
        }

        .paymentCard{
          display:flex;
          align-items:center;
          gap:12px;
          padding:16px;
          border:1px solid #e5e7eb;
          border-radius:16px;
          cursor:pointer;
          transition:0.3s;
        }

        .paymentCard:hover{
          border-color:#2563eb;
          background:#eff6ff;
        }

        .error{
          color:red;
          font-size:12px;
          margin-top:5px;
          min-height:16px;
        }
        `}
      </style>
    </section>
  );
}

export default CheckoutPage;
