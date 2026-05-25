// Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const USERS_API = "http://localhost:5000/users";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter both email and password");
      toast.error("Please enter both email and password");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(USERS_API);
      if (!response.ok) {
        throw new Error("Failed to connect to database");
      }

      const users = await response.json();
      
      const foundUser = users.find(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (!foundUser) {
        setError("No account found with this email");
        toast.error("No account found with this email. Please sign up first.");
        setIsSubmitting(false);
        return;
      }

      if (foundUser.password !== formData.password) {
        setError("Incorrect password");
        toast.error("Incorrect password. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (foundUser.status !== "active") {
        setError("Your account is not active. Please contact support.");
        toast.error("Your account is not active. Please contact support.");
        setIsSubmitting(false);
        return;
      }

      const { password, ...userWithoutPassword } = foundUser;
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loginTime", new Date().toISOString());

      toast.success(`Welcome back, ${foundUser.firstName || "Shopper"}!`);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      toast.error("Login failed. Please check your connection.");
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
                Welcome Back
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Shop Local.
                <br />
                Empower Business.
              </h1>
              <p className="mt-5 text-purple-200 text-base leading-7 max-w-lg">
                Access your account to track orders, manage wishlists, 
                and discover amazing products from local businesses in Garissa.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm text-purple-200">Happy Customers</p>
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

        {/* Right Side - Login Form */}
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
              Login
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Welcome back!
            </h2>
            <p className="mt-3 text-slate-500 leading-6">
              Please enter your details to access your account and start shopping.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition">
                  <Lock className="w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3.5 font-semibold text-white shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying credentials...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.25h3.32l-.53 3.49h-2.79V24C19.62 23.1 24 18.1 24 12.07Z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            <p className="mt-8 text-sm text-slate-600 text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                Create one
              </Link>
            </p>

            <p className="mt-4 text-xs text-slate-400 text-center">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;