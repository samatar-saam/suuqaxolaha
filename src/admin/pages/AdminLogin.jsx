// AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LayoutDashboard,
  Settings,
  Users,
  Activity,
  ShoppingBag,
  Store,
  Package,
} from "lucide-react";

const ADMINS_API = "http://localhost:5000/admins";

function AdminLogin() {
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

      const response = await fetch(ADMINS_API);
      if (!response.ok) {
        throw new Error("Failed to connect to admin database");
      }

      const admins = await response.json();

      const foundAdmin = admins.find(
        (admin) => admin.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (!foundAdmin) {
        setError("No admin account found with this email");
        toast.error("No admin account found. Please contact system administrator.");
        setIsSubmitting(false);
        return;
      }

      if (foundAdmin.password !== formData.password) {
        setError("Incorrect password");
        toast.error("Incorrect password. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Store admin data
      const { password, ...adminWithoutPassword } = foundAdmin;
      localStorage.setItem("admin", JSON.stringify(adminWithoutPassword));
      localStorage.setItem("isAdminAuthenticated", "true");
      localStorage.setItem("adminLoginTime", new Date().toISOString());

      toast.success(`Welcome back, ${foundAdmin.firstName || "Admin"}!`);

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error("Admin login error:", error);
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
        {/* Left Side - Purple Admin Section */}
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
                Admin Portal
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Admin Control Panel
              </h1>
              <p className="mt-5 text-purple-200 text-base leading-7 max-w-lg">
                Manage products, sellers, orders, and oversee all marketplace operations.
                Sign in with your administrator credentials.
              </p>
            </div>
          </div>

          {/* Admin Stats / Features */}
          <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <Package className="w-5 h-5 mb-2 text-purple-200" />
              <p className="text-2xl font-bold">Products</p>
              <p className="text-sm text-purple-200">Manage inventory</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <Store className="w-5 h-5 mb-2 text-purple-200" />
              <p className="text-2xl font-bold">Sellers</p>
              <p className="text-sm text-purple-200">Vendor management</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <Users className="w-5 h-5 mb-2 text-purple-200" />
              <p className="text-2xl font-bold">Customers</p>
              <p className="text-sm text-purple-200">User accounts</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <LayoutDashboard className="w-5 h-5 mb-2 text-purple-200" />
              <p className="text-2xl font-bold">Analytics</p>
              <p className="text-sm text-purple-200">Sales & reports</p>
            </div>
          </div>

          {/* Admin Security Note */}
          <div className="relative z-10 mt-12 bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
            <p className="text-purple-100 italic text-sm">
              "Administrative access is restricted. All actions are logged for
              security and audit purposes."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-purple-900 font-bold">
                SA
              </div>
              <div>
                <p className="font-semibold text-sm">System Admin</p>
                <p className="text-xs text-purple-200">SuuqHub Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-6 sm:p-10 lg:p-14 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white shadow-lg">
                <Shield className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                <span className="text-purple-600">Suuq</span>
                <span className="text-gray-900">Hub</span>
              </h1>
              <p className="text-xs text-purple-600 mt-1 tracking-wider">
                ADMIN PORTAL
              </p>
            </div>

            <p className="text-sm font-semibold tracking-[0.2em] text-purple-600 uppercase">
              Admin Access
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Administrator Login
            </h2>
            <p className="mt-3 text-slate-500 leading-6">
              Enter your admin credentials to access the control panel and manage
              the SuuqHub marketplace.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="samatar578@gmail.com"
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
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
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
                    Access Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600 text-center">
              Need help?{" "}
              <Link
                to="/contact"
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                Contact Support
              </Link>
            </p>

            {/* Updated Demo credentials hint */}
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">
                Demo: samatar578@gmail.com / 2839
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;