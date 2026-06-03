// Signup.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  ShoppingBag, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Sparkles,
  Truck,
  ShieldCheck,
  Headphones,
  Star
} from "lucide-react";

const USERS_API = "http://localhost:5000/users";

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);

      const checkResponse = await fetch(USERS_API);
      const existingUsers = await checkResponse.json();
      
      const userExists = existingUsers.some(
        user => user.email?.toLowerCase() === formData.email.toLowerCase()
      );

      if (userExists) {
        toast.error("Email already exists. Please login instead.");
        setIsSubmitting(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        firstName: formData.firstName.trim() || "Shopper",
        lastName: formData.lastName.trim() || "",
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || "",
        password: formData.password.trim(),
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(USERS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      toast.success("Account created successfully! Please login.");

      navigate("/login", {
        state: {
          message: "Account created successfully! Please login.",
          email: formData.email,
        },
      });

    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
        {/* Left Side - Purple Gradient Brand Section */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 p-10 text-white flex-col justify-between">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/20">
              <ShoppingBag className="w-6 h-6" />
              <span className="font-semibold text-lg">SuuqHub</span>
            </div>

            <div className="mt-16">
              <p className="text-sm uppercase tracking-[0.25em] text-purple-200">
                Join the Community
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Start shopping local today.
              </h1>
              <p className="mt-5 text-purple-200 text-base leading-7 max-w-lg">
                Create an account to access exclusive deals, track orders, 
                and support local businesses in Garissa.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm text-purple-200">Happy Shoppers</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-purple-200">Local Sellers</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-bold">100%</p>
              <p className="text-sm text-purple-200">Secure Payments</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm text-purple-200">Support</p>
            </div>
          </div>

          {/* Features */}
          <div className="relative z-10 mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-purple-200">
              <Truck className="w-4 h-4" />
              <span>Free delivery on orders over KSh 2,500</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-purple-200">
              <ShieldCheck className="w-4 h-4" />
              <span>100% secure payment protection</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-purple-200">
              <Headphones className="w-4 h-4" />
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="p-6 sm:p-10 lg:p-14 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white shadow-lg">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                <span className="text-purple-600">Suuq</span>
                <span className="text-gray-900">Hub</span>
              </h1>
              <p className="text-xs text-purple-600 mt-1 tracking-wider">SHOP LOCAL. EMPOWER BUSINESS.</p>
            </div>

            <p className="text-sm font-semibold tracking-[0.2em] text-purple-600 uppercase">
              Sign Up
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Create your account
            </h2>
            <p className="mt-3 text-slate-500 leading-6">
              Join SuuqHub to discover amazing products from local businesses.
            </p>

            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name <span className="text-slate-400 text-xs">(optional)</span>
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition">
                    <User className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                      className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name <span className="text-slate-400 text-xs">(optional)</span>
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition">
                    <User className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                      className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field - Required */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address <span className="text-purple-600">*</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Phone Field - Optional */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+254 700 000 000"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field - Required */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password <span className="text-purple-600">*</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition">
                  <Lock className="w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Confirm Password Field - Required */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password <span className="text-purple-600">*</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition">
                  <Lock className="w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3.5 font-semibold text-white shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-sm text-slate-600 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                Login
              </Link>
            </p>

            {/* Terms */}
            {/* <p className="mt-6 text-xs text-slate-400 text-center">
              By signing up, you agree to our{" "}
              <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;