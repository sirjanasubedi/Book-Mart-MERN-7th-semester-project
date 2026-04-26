import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // you can connect backend later
    alert("Message sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-500 mb-3">
            Connect with Book Mart
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
            We’re here to help you find the perfect read.
          </h2>
          <p className="mt-5 text-slate-600 max-w-3xl mx-auto text-lg sm:text-xl">
            Send us a message for order help, book recommendations, or general
            support. We’ll respond within 24 hours.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-start">
          <div className="rounded-[2rem] bg-white p-8 shadow-2xl border border-slate-200">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                Send us a message
              </h3>
              <p className="text-slate-500">
                Fill out the form and our customer support team will reach out
                shortly.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full min-h-[170px] rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-cyan-700"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-cyan-600 to-slate-900 p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-semibold mb-4">Contact details</h3>
              <p className="text-slate-100 mb-5">
                Reach out for order updates, gift support, or book recommendations.
              </p>
              <div className="space-y-4 text-sm sm:text-base">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="font-semibold">Address</p>
                  <p className="mt-2 text-slate-200">Devkota-Chowk, Bhairahawa, Nepal</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="font-semibold">Phone</p>
                  <p className="mt-2 text-slate-200">+977-9867154544</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="font-semibold">Email</p>
                  <p className="mt-2 text-slate-200">project@bookmart.com</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="font-semibold">Hours</p>
                  <p className="mt-2 text-slate-200">Mon–Fri, 9 AM – 7 PM</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-2xl border border-slate-200">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Why Book Mart?
              </h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-cyan-600 text-xl">✔</span>
                  Fast support and friendly guidance for every order.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-cyan-600 text-xl">✔</span>
                  Easy checkout, secure payments, and trusted book picks.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-cyan-600 text-xl">✔</span>
                  Dedicated to helping readers discover more value.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;