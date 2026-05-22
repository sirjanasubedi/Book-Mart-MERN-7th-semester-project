import React from 'react'
import footerLogo from "../assets/footer-logo.png"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-slate-100 text-slate-700 py-10 px-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="space-y-4">
          <img src={footerLogo} alt="BookMart logo" className="w-32" />
          <p className="max-w-md text-sm text-slate-500">
            Discover your next favorite book with a clean, modern bookstore experience.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-4">Quick links</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li><a href="/" className="hover:text-slate-900 transition">Home</a></li>
            <li><a href="/categories" className="hover:text-slate-900 transition">Categories</a></li>
            <li><a href="/about" className="hover:text-slate-900 transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-slate-900 transition">Contact</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Follow</h3>
          <div className="flex items-center gap-4 text-slate-600">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">
              <FaFacebook size={22} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">
              <FaTwitter size={22} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">
              <FaInstagram size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500 text-center">
        © {new Date().getFullYear()} BookMart. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer