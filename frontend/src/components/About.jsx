import React from "react";

const About = () => {
  return (
    <section className="bg-slate-950 text-white py-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300 mb-3">
            Discover Your Next Favorite Read
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Book Mart brings stories, study guides, and fresh inspiration together.
          </h2>
          <p className="mt-5 text-slate-300 max-w-3xl mx-auto text-lg sm:text-xl">
            From academic textbooks to bestselling novels, we make reading
            accessible, stylish, and memorable for every kind of reader.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-14">
          <div className="rounded-[2rem] bg-slate-900/90 p-8 shadow-2xl ring-1 ring-white/10">
            <h3 className="text-xl font-semibold mb-4 text-cyan-200">
              Our Mission
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Build a community of readers and learners by offering a curated
              selection, friendly service, and expert recommendations.
            </p>
          </div>

          <div className="rounded-[2rem] bg-cyan-600/10 p-8 shadow-2xl ring-1 ring-cyan-400/20">
            <h3 className="text-xl font-semibold mb-4 text-cyan-100">
              What We Offer
            </h3>
            <ul className="space-y-3 text-slate-200 leading-relaxed">
              <li>• Vast collection of textbooks, fiction, and stationery</li>
              <li>• Fast delivery and secure checkout</li>
              <li>• Curated picks for students and leisure readers</li>
            </ul>
          </div>

          <div className="rounded-[2rem] bg-slate-900/90 p-8 shadow-2xl ring-1 ring-white/10">
            <h3 className="text-xl font-semibold mb-4 text-cyan-200">
              Why Choose Us
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Quality service, trusted stock, and a shopping experience built for
              readers who love both learning and leisure.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-start">
          <div className="rounded-[2rem] bg-white/5 border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-2xl font-semibold mb-5 text-white">
              A better book journey
            </h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              At Book Mart, we believe the right book changes everything. Whether
              you're shopping for study guides, career reads, or novels, our team
              helps you discover the perfect match.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900/90 p-5">
                <p className="text-3xl">📚</p>
                <p className="mt-3 text-slate-200 font-medium">Curated Collection</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-5">
                <p className="text-3xl">🚚</p>
                <p className="mt-3 text-slate-200 font-medium">Fast Delivery</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-5">
                <p className="text-3xl">💬</p>
                <p className="mt-3 text-slate-200 font-medium">Friendly Support</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-cyan-500/10 border border-cyan-300/20 p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-5 text-white">
              Your reading experience starts here
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Browse bestsellers, student favorites, and daily recommendations.
              Every order supports our mission to bring books closer to readers.
            </p>
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="font-semibold text-cyan-200">Shop with confidence</p>
                <p className="text-slate-300 text-sm">Secure checkout and easy returns for every order.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="font-semibold text-cyan-200">Fresh recommendations</p>
                <p className="text-slate-300 text-sm">Discover new arrivals, staff picks, and hidden gems.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default About;