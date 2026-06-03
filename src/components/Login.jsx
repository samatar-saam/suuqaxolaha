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

  // Fixed delivery fee
  const DELIVERY_FEE = 150;

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

      // Check if there's a redirect URL stored (from trying to access protected page)
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      
      setTimeout(() => {
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectUrl);
        } else {
          // Check if there's a pending cart to migrate
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (parsedCart.length > 0) {
              // Migrate guest cart to database
              migrateGuestCartToDatabase(parsedCart, foundUser.id);
            }
          }
          navigate("/");
        }
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      toast.error("Login failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to migrate guest cart to database after login
  const migrateGuestCartToDatabase = async (guestCart, userId) => {
    console.log("Migrating guest cart to database...", guestCart);
    
    for (const item of guestCart) {
      try {
        // Check if item already exists in cart
        const checkRes = await fetch(`http://localhost:5000/cart_items?userId=${userId}&productId=${item.id}`);
        const existingItems = await checkRes.json();
        
        if (existingItems.length > 0) {
          // Update existing item
          await fetch(`http://localhost:5000/cart_items/${existingItems[0].id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quantity: existingItems[0].quantity + item.quantity,
              updatedAt: new Date().toISOString(),
            }),
          });
        } else {
          // Create new cart item
          await fetch("http://localhost:5000/cart_items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: Date.now() + Math.random(),
              userId: userId,
              productId: item.id,
              quantity: item.quantity,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }),
          });
        }
        console.log(`Migrated ${item.name} to database`);
      } catch (error) {
        console.error("Failed to migrate item:", error);
      }
    }
    
    // Clear guest cart after migration
    localStorage.removeItem("cart");
    toast.success("Your cart has been synced with your account!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center px-4 pt-24 pb-10">
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

          {/* Features - Updated with flat delivery fee */}
          <div className="relative z-10 mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-purple-200">
              <Truck className="w-4 h-4" />
              <span>Flat delivery fee of KSh {DELIVERY_FEE} on all orders</span>
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
            
            <p className="mt-8 text-sm text-slate-600 text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;