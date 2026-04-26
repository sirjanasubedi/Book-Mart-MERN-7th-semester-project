import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import getBaseUrl from "../../utils/baseURL";

function CheckoutPage() {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

 
  const totalPrice = cartItems
    .reduce((acc, item) => acc + (item.newPrice * item.quantity), 0)
    .toFixed(2);

  
  const totalItems = cartItems
    .reduce((acc, item) => acc + item.quantity, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCashOnDelivery = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newOrder = {
        name: formData.name,
        email: currentUser?.email,
        address: {
          city: formData.city,
          country: formData.country,
          state: formData.state,
          zipcode: formData.zipcode,
        },
        phone: formData.phone,
        productIds: cartItems.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
          price: item.newPrice
        })),
        totalPrice: totalPrice,
        totalItems: totalItems,
        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "PENDING"
      };

      const response = await axios.post(`${getBaseUrl()}/api/orders`, newOrder);
      
      navigate("/order-confirmation", { 
        state: { 
          orderId: response.data._id,
          paymentMethod: "CASH_ON_DELIVERY"
        } 
      });
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEsewaPayment = (formData) => {
    const newOrder = {
      name: formData.name,
      email: currentUser?.email,
      address: {
        city: formData.city,
        country: formData.country,
        state: formData.state,
        zipcode: formData.zipcode,
      },
      phone: formData.phone,
      productIds: cartItems.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        price: item.newPrice
      })),
      totalPrice: totalPrice,
      totalItems: totalItems,
      paymentMethod: "ESEWA",
      paymentStatus: "PENDING"
    };

    localStorage.setItem("pendingOrder", JSON.stringify(newOrder));
    navigate("/payment", { state: newOrder });
  };

  const onSubmit = (data) => {
    if (paymentMethod === "esewa") {
      handleEsewaPayment(data);
    } else {
      handleCashOnDelivery(data);
    }
  };

  return (
    <section>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-xl text-gray-600 mb-2">Checkout</h2>
            <p className="text-gray-500 mb-2">Rs.{totalPrice}</p>
            <p className="text-gray-500 mb-6">
              Items: {totalItems > 0 ? totalItems : 0}
            </p>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4 text-sm grid-cols-1 lg:grid-cols-3 my-8"
              >
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Personal Details</p>
                  <p>Please fill out all the fields.</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="name">Full Name</label>
                      <input
                        {...register("name", { required: true })}
                        type="text"
                        id="name"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">Name is required.</p>
                      )}
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="text"
                        id="email"
                        disabled
                        defaultValue={currentUser?.email}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        {...register("phone", { required: true })}
                        type="number"
                        id="phone"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">Phone is required.</p>
                      )}
                    </div>

                    <div className="md:col-span-3">
                      <label htmlFor="address">Address / Street</label>
                      <input
                        {...register("address", { required: true })}
                        type="text"
                        id="address"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">Address is required.</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="city">City</label>
                      <input
                        {...register("city", { required: true })}
                        type="text"
                        id="city"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">City is required.</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="country">Country</label>
                      <input
                        {...register("country", { required: true })}
                        type="text"
                        id="country"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">Country is required.</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="state">State</label>
                      <input
                        {...register("state", { required: true })}
                        type="text"
                        id="state"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">State is required.</p>
                      )}
                    </div>

                    <div className="md:col-span-1">
                      <label htmlFor="zipcode">Zipcode</label>
                      <input
                        {...register("zipcode", { required: true })}
                        type="text"
                        id="zipcode"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.zipcode && (
                        <p className="text-red-500 text-xs mt-1">Zipcode is required.</p>
                      )}
                    </div>

                    <div className="md:col-span-5">
                      <label className="font-medium text-gray-700 mb-2 block">
                        Payment Method
                      </label>
                      <div className="flex flex-col space-y-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio"
                            name="paymentMethod"
                            value="esewa"
                            checked={paymentMethod === "esewa"}
                            onChange={() => setPaymentMethod("esewa")}
                          />
                          <span className="ml-2">Pay with eSewa</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                          />
                          <span className="ml-2">Cash on Delivery</span>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-5 mt-3">
                      <div className="inline-flex items-center">
                        <input
                          type="checkbox"
                          onChange={(e) => setIsChecked(e.target.checked)}
                          className="form-checkbox"
                        />
                        <label htmlFor="billing_same" className="ml-2">
                          I agree to the{" "}
                          <Link className="underline text-blue-600">Terms & Conditions</Link> and{" "}
                          <Link className="underline text-blue-600">Shopping Policy</Link>.
                        </label>
                      </div>
                    </div>

                    {error && (
                      <div className="md:col-span-5 text-red-500">
                        {error}
                      </div>
                    )}

                    <div className="md:col-span-5 text-right">
                      <button
                        type="submit"
                        disabled={!isChecked || isSubmitting}
                        className={`${
                          isChecked
                            ? paymentMethod === "esewa"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-300 cursor-not-allowed"
                        } text-white font-bold py-2 px-4 rounded`}
                      >
                        {isSubmitting ? (
                          "Processing..."
                        ) : paymentMethod === "esewa" ? (
                          "Pay with eSewa"
                        ) : (
                          "Place Order (Cash on Delivery)"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;



