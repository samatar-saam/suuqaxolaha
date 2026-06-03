// src/components/Footer.jsx
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: "Electronics", link: "/categories?category=electronics" },
    { name: "Fashion", link: "/categories?category=fashion" },
    { name: "Home & Living", link: "/categories?category=home-living" },
    { name: "Beauty", link: "/categories?category=beauty" },
    { name: "Sports", link: "/categories?category=sports" },
    { name: "Books", link: "/categories?category=books" },
    { name: "Automotive", link: "/categories?category=automotive" },
    { name: "Groceries", link: "/categories?category=groceries" },
  ];

  const quickLinks = [
    { name: "Home", link: "/" },
    { name: "Categories", link: "/categories" },
    { name: "Checkout", link: "/checkout" },
    { name: "Track Order", link: "/dashboard/track-order" },
    { name: "Return Policy", link: "/return-policy" },
    { name: "Shipping Info", link: "/shipping-info" },
  ];

  const handleCategoryClick = (e, link) => {
    e.preventDefault();
    window.location.href = link;
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    <span className="text-purple-500">Suuq</span>
                    <span className="text-white">Hub</span>
                  </h2>
                </div>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Shop Local. Empower Business. — SuuqHub connects you with trusted local vendors across Kenya.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone size={16} className="text-purple-500 flex-shrink-0" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={16} className="text-purple-500 flex-shrink-0" />
                <span>support@suuqhub.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={16} className="text-purple-500 flex-shrink-0" />
                <span>Garissa, Kenya</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock size={16} className="text-purple-500 flex-shrink-0" />
                <span>9:00 AM - 9:00 PM (Daily)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 h-0.5 w-8 bg-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    className="text-slate-400 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              Shop by Category
              <span className="absolute -bottom-1 left-0 h-0.5 w-8 bg-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.link}
                    className="text-slate-400 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              Customer Service
              <span className="absolute -bottom-1 left-0 h-0.5 w-8 bg-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard/support"
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300"></span>
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-info"
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300"></span>
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/orders"
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300"></span>
                  My Orders
                </Link>
              </li>
            </ul>

            {/* Trust Badges */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Truck size={14} className="text-purple-500" />
                  <span>Free Delivery Over KSh 2,500</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck size={14} className="text-purple-500" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <RotateCcw size={14} className="text-purple-500" />
                  <span>7-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-xs text-slate-500">
              © {currentYear} SuuqHub. All rights reserved. Shop Local. Empower Business.
            </p>
            <div className="flex gap-4 text-xs text-slate-500">
              <Link to="/" className="hover:text-purple-400 transition">Home</Link>
              <Link to="/categories" className="hover:text-purple-400 transition">Categories</Link>
              <Link to="/checkout" className="hover:text-purple-400 transition">Checkout</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-purple-600 p-3 text-white shadow-lg transition-all duration-300 hover:bg-purple-700 hover:scale-110 hover:shadow-xl opacity-70 hover:opacity-100"
        aria-label="Back to top"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}