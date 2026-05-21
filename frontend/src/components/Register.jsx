import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(
        data.email, data.password,
        `${data.firstName} ${data.lastName}`,
        data.phone, data.address
      );
      navigate("/");
    } catch (error) {
      setMessage(error?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-3xl flex rounded-2xl overflow-hidden shadow-2xl">

        {/* LEFT PANEL */}
        <div className="hidden md:flex w-2/5 bg-[#1a1a2e] flex-col justify-between p-10">
          <div>
            <div className="w-11 h-11 bg-[#534AB7] rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold font-serif mb-2">Book-Mart</h1>
            <p className="text-white/50 text-sm leading-relaxed">Your favourite books, delivered to your door.</p>
          </div>
          <div className="space-y-3">
            {["10,000+ books available", "Fast delivery across Nepal", "Secure eSewa payments", "Track orders in real time"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-white/60 text-sm">{f}</span>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs">© 2026 Book-Mart. All rights reserved.</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create account</h2>
          <p className="text-sm text-gray-500 mb-7">Join thousands of readers today</p>

          {/* KEY FIX: autocomplete="off" on form + new-password on fields */}
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>

            {/* HONEYPOT FIELDS - tricks browser into filling these instead */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
              <input type="text" name="username" tabIndex={-1} />
              <input type="password" name="password" tabIndex={-1} />
              <input type="email" name="email" tabIndex={-1} />
            </div>

            <div className="grid grid-cols-2 gap-4">

              {/* FIRST NAME */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
                <input
                  {...register("firstName", { required: "Required" })}
                  type="text"
                  placeholder="First Name"
                  autoComplete="off"
                  data-form-type="other"
                  data-lpignore="true"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>

              {/* LAST NAME */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
                <input
                  {...register("lastName", { required: "Required" })}
                  type="text"
                  placeholder="Last Name"
                  autoComplete="off"
                  data-form-type="other"
                  data-lpignore="true"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50"
                />
              </div>

              {/* EMAIL */}
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, message: "Must be a @gmail.com address" }
                  })}
                  type="email"
                  placeholder="example@gmail.com"
                  autoComplete="off"
                  data-form-type="other"
                  data-lpignore="true"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* PASSWORD */}
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                <div className="relative mt-1">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 5, message: "Min. 5 characters" },
                      validate: (v) => /[0-9]/.test(v) || "Must contain a number"
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 5 characters + 1 number"
                    autoComplete="new-password"
                    data-lpignore="true"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-xs text-gray-400 hover:text-indigo-600 font-medium transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* PHONE */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                <input
                  {...register("phone", {
                    required: "Required",
                    pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" }
                  })}
                  type="tel"
                  placeholder="98XXXXXXXX"
                  autoComplete="off"
                  data-form-type="other"
                  data-lpignore="true"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* CITY */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">City</label>
                <input
                  {...register("city", { required: "Required" })}
                  type="text"
                  placeholder="cityname"
                  autoComplete="off"
                  data-form-type="other"
                  data-lpignore="true"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50"
                />
              </div>

              {/* ADDRESS */}
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Address</label>
                <textarea
                  {...register("address", { required: "Address is required" })}
                  rows={2}
                  placeholder="Full address"
                  autoComplete="off"
                  data-form-type="other"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 resize-none"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

            </div>

            {message && (
              <p className="text-red-500 text-sm mt-3 text-center">{message}</p>
            )}

            <button
              type="submit"
              className="mt-6 w-full bg-[#534AB7] hover:bg-[#3C3489] text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-[#534AB7] font-semibold hover:underline">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;