// src/users/layout/UserDashboard.jsx
import { NavLink, Outlet, useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  ShoppingCart,
  User,
  LifeBuoy,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Truck,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import DashboardOverview from "../pages/DashboardOverview";
import TrackOrder from "../pages/TrackOrder";
import MyOrders from "../pages/MyOrders";
import UserProfile from "../pages/UserProfile";
import UserWishlist from "../pages/UserWishlist";
import MyReviews from "../pages/MyReviews";
import OrderReport from "../pages/ReportIssue";
import UserSupport from "../pages/UserSupport";
import UserTickets from "../pages/UserTickets";

function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Keep false for expanded sidebar
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated || !currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, end: true },
    { name: "My Orders", path: "/dashboard/orders", icon: ShoppingCart },
    { name: "Wishlist", path: "/dashboard/wishlist", icon: Heart },
    { name: "Track Order", path: "/dashboard/track-order", icon: MapPin },
    { name: "My Reviews", path: "/dashboard/reviews", icon: Star },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Order Report", path: "/dashboard/report", icon: FileText },
    { name: "Support", path: "/dashboard/support", icon: LifeBuoy },
    { name: "My Tickets", path: "/dashboard/tickets", icon: Ticket },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTime");
    navigate("/");
  };

  const pageTitle = useMemo(() => {
    if (location.pathname === "/dashboard") return "Dashboard Overview";
    if (location.pathname.includes("/track-order")) return "Track Order";
    if (location.pathname.includes("/orders")) return "My Orders";
    if (location.pathname.includes("/wishlist")) return "My Wishlist";
    if (location.pathname.includes("/reviews")) return "My Reviews";
    if (location.pathname.includes("/profile")) return "Profile Settings";
    if (location.pathname.includes("/report")) return "Order Report";
    if (location.pathname.includes("/support")) return "Customer Support";
    if (location.pathname.includes("/tickets")) return "My Support Tickets";
    return "User Dashboard";
  }, [location.pathname]);

  const userName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "SuuqHub Shopper"
    : "SuuqHub Shopper";
  const userEmail = currentUser?.email || "shopper@suuqhub.com";

  // When collapsed on desktop, sidebar is 80px (w-20), when expanded it's 288px (w-72)
  const sidebarWidth = isCollapsed && !isMobile ? "w-20" : "w-72";
  const mainMargin = isCollapsed && !isMobile ? "md:ml-20" : "md:ml-72";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-slate-950 text-white transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${sidebarWidth} ${
          isCollapsed && !isMobile ? "lg:w-20" : "lg:w-72"
        }`}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 border-b border-white/10 px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {(!isCollapsed || isMobile) && (
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  <span className="text-purple-500">Suuq</span>
                  <span className="text-white">Hub</span>
                </h1>
                <p className="hidden sm:block mt-1 text-xs sm:text-sm text-slate-400">
                  User Dashboard
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex rounded-xl p-1.5 sm:p-2 text-slate-300 transition hover:bg-white/10"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden rounded-xl p-1.5 sm:p-2 text-slate-300 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-4 sm:py-6">
          <nav className="space-y-1 sm:space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => {
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  title={isCollapsed && !isMobile ? item.name : ""}
                  className={({ isActive }) =>
                    `flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    } ${isCollapsed && !isMobile ? "justify-center" : ""}`
                  }
                >
                  <Icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                  {(!isCollapsed || isMobile) && <span className="truncate">{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="flex-shrink-0 border-t border-white/10 p-3 sm:p-4">
          {(!isCollapsed || isMobile) && (
            <div className="mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-white/5 p-3 sm:p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Logged in as
              </p>
              <p className="mt-1 text-sm sm:text-base font-semibold text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-slate-400 truncate">{userEmail}</p>
              <p className="text-xs text-purple-400 mt-1">Customer</p>
            </div>
          )}
          {isCollapsed && !isMobile && (
            <div className="mb-3 flex justify-center">
              <User className="h-6 w-6 text-slate-300" />
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-red-500/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white ${
              isCollapsed && !isMobile ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {(!isCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${mainMargin}`}>
        <div className="flex min-h-screen flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 bg-white shadow-sm">
            <div className="px-3 sm:px-4 py-3 sm:py-4 lg:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
                  >
                    <Menu size={18} className="sm:w-5 sm:h-5" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 truncate">
                      {pageTitle}
                    </h2>
                    <p className="hidden sm:block text-xs sm:text-sm text-slate-500 truncate">
                      Welcome back, {userName.split(' ')[0]}!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative hidden md:block">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="h-9 w-48 sm:h-10 sm:w-64 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-purple-400 focus:bg-white"
                    />
                  </div>

                  <button className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-600 transition">
                    <Bell size={16} className="sm:w-4 sm:h-4" />
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 lg:px-6">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="wishlist" element={<UserWishlist />} />
              <Route path="track-order" element={<TrackOrder />} />
              <Route path="reviews" element={<MyReviews />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="report" element={<OrderReport />} />
              <Route path="support" element={<UserSupport />} />
              <Route path="tickets" element={<UserTickets />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Truck size={14} className="text-purple-600" />
                <p>© 2026 SuuqHub User Dashboard</p>
              </div>
              <p className="flex items-center justify-center gap-2">
                <ShieldCheck size={14} />
                Shop Local. Empower Business. • v1.0
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;