import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  Star,
  Bell,
   Mail,
  LifeBuoy,
  Settings,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Store,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const adminData = localStorage.getItem("admin");

    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        setAdminName(
          admin.firstName ||
            admin.name ||
            admin.email?.split("@")[0] ||
            "Admin"
        );
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }
    }
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
    { name: "Categories", path: "/admin/categories", icon: Tag },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Stores", path: "/admin/stores", icon: Store },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Reports", path: "/admin/reports", icon: BarChart3 },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
    { name: "Support", path: "/admin/support", icon: LifeBuoy },
    { name: "Messages", path: "/admin/messages", icon: Mail },

    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminLoginTime");
    navigate("/", { replace: true });
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-72";
  const mainMargin = isCollapsed ? "lg:ml-20" : "lg:ml-72";

  return (
    <div className="min-h-screen bg-slate-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SCROLLABLE SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-slate-950 text-white transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${sidebarWidth}`}
      >
        {/* LOGO */}
        <div className="shrink-0 border-b border-white/10 bg-slate-950 px-5 py-6">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  <span className="text-purple-500">Suuq</span>Hub
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Admin Dashboard
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden rounded-xl p-2 text-slate-300 transition hover:bg-white/10 lg:flex"
              >
                {isCollapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </button>

              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 lg:hidden"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* NAVIGATION SCROLL AREA */}
        <div className="sidebar-scroll flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  title={isCollapsed ? item.name : ""}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-xl shadow-purple-900/30"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    } ${isCollapsed ? "justify-center" : ""}`
                  }
                >
                  <Icon size={20} />

                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR BOTTOM */}
        <div className="shrink-0 border-t border-white/10 bg-slate-950 p-4">
          {!isCollapsed && (
            <div className="mb-4 rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Logged in as
              </p>

              <p className="mt-1 font-semibold text-white">{adminName}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`transition-all duration-300 ${mainMargin}`}>
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <h2 className="text-3xl font-black text-slate-950">
                  Dashboard Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Welcome back, {adminName}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search admin panel..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-purple-500 focus:bg-white sm:w-80"
                />
              </div>

              {/* Logout Button - Changed from Add Product */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-red-700 hover:scale-[1.02]"
              >
                <LogOut size={16} />
                Logout
              </button>

              <button className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                <Bell size={18} />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-90px)] p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}