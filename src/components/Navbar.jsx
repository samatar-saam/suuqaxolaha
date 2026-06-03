// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  Tag,
  Star,
  TrendingUp,
  Shield,
  CreditCard,
  Wrench,
  Mail,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Load current user and cart count
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
    updateCartCount();
  }, []);

  // Update cart count whenever localStorage changes
  const updateCartCount = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } else {
      setCartCount(0);
    }
  };

  // Listen for cart changes
  useEffect(() => {
    const handleStorageChange = () => {
      updateCartCount();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for cart updates
    window.addEventListener("cartUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLoginDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services", icon: Wrench },
    { name: "New Arrivals", href: "/new-arrivals", icon: Star },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleLoginDropdown = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTime");
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    navigate("/");
    window.dispatchEvent(new Event("storage"));
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value;
      if (searchTerm.trim()) {
        navigate(`/categories?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleSearchClick = () => {
    const searchInput = document.getElementById("search-input");
    if (searchInput && searchInput.value.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchInput.value)}`);
    }
  };

  return (
    <>
      {/* Fixed Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-slate-200 bg-white/95 shadow-lg backdrop-blur-xl"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex h-20 items-center justify-between gap-6">
            {/* LOGO */}
            <Link to="/" className="group flex shrink-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md transition group-hover:scale-110">
                <ShoppingCart size={23} />
              </div>
              <div className="leading-tight">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  <span className="text-purple-600">Suuq</span>
                  <span className="text-gray-950">Hub</span>
                </h1>
                <p className="text-xs font-medium text-gray-500">
                  Shop Local. Empower Business.
                </p>
              </div>
            </Link>

            {/* SEARCH - Extended width */}
            <div className="hidden flex-1 items-center rounded-xl border border-gray-300 bg-white lg:flex">
              <Link
                to="/categories"
                className="flex h-11 items-center border-r border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:text-purple-600"
              >
                Categories
              </Link>
              <input
                id="search-input"
                type="text"
                placeholder="Search for products, brands and more..."
                className="h-11 w-full bg-transparent px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                onKeyPress={handleSearch}
              />
              <button 
                onClick={handleSearchClick}
                className="mr-1 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white transition hover:bg-purple-700"
              >
                <Search size={17} />
              </button>
            </div>

            {/* DESKTOP RIGHT */}
            <div className="hidden items-center gap-5 xl:flex">
              <Link
                to="/wishlist"
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-purple-600"
              >
                <Heart size={18} />
                Wishlist
              </Link>
              <Link
                to="/cart"
                className="relative flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-purple-600"
              >
                <ShoppingCart size={18} />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
              <Link
                to="/checkout"
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-purple-700"
              >
                <CreditCard size={18} />
                Checkout
              </Link>
              
              {/* User Section - Shows different based on login status */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md"
                  >
                    <User size={17} />
                    <span className="max-w-[100px] truncate">
                      {currentUser.firstName || currentUser.email?.split('@')[0] || "Account"}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {/* User Menu Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg py-2 z-50 animate-fadeIn">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                      >
                        <Package size={16} />
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                      >
                        <Heart size={16} />
                        Wishlist
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Login Dropdown for guests */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleLoginDropdown}
                    className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md"
                  >
                    <User size={17} />
                    Login
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isLoginDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-2 z-50 animate-fadeIn">
                      <Link
                        to="/login"
                        onClick={() => setIsLoginDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                      >
                        <User size={16} />
                        User Login
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <Link
                        to="/admin/login"
                        onClick={() => setIsLoginDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                      >
                        <Shield size={16} />
                        Admin Login
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 text-gray-700 transition-all hover:bg-slate-50 hover:shadow-md lg:hidden"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* BOTTOM DESKTOP NAV - No purple line removed */}
          <div className="hidden h-14 items-center gap-8 border-t border-gray-100 lg:flex">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 text-sm font-semibold transition hover:text-purple-600 ${
                    isActive ? "text-purple-600" : "text-gray-600"
                  }`}
                >
                  {Icon && <Icon size={15} />}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* MOBILE MENU */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out lg:hidden ${
              isMobileMenuOpen
                ? "max-h-[850px] pb-5 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="mb-4 flex items-center rounded-xl border border-gray-300 bg-white">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                  onKeyPress={handleSearch}
                />
                <button 
                  onClick={handleSearchClick}
                  className="rounded-r-xl bg-purple-600 px-4 py-3 text-white"
                >
                  <Search size={18} />
                </button>
              </div>

              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleMobileLinkClick}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
                  >
                    {Icon && <Icon size={15} />}
                    {item.name}
                  </Link>
                );
              })}

              <div className="mt-3 grid gap-3 border-t border-slate-200 pt-3">
                <Link
                  to="/wishlist"
                  onClick={handleMobileLinkClick}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                >
                  <Heart size={16} />
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  onClick={handleMobileLinkClick}
                  className="relative flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                >
                  <ShoppingCart size={16} />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/checkout"
                  onClick={handleMobileLinkClick}
                  className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700"
                >
                  <CreditCard size={16} />
                  Checkout
                </Link>
                
                {/* Mobile Login/User Options */}
                {currentUser ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={handleMobileLinkClick}
                      className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        handleMobileLinkClick();
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={handleMobileLinkClick}
                      className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700"
                    >
                      <User size={16} />
                      User Login
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={handleMobileLinkClick}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                    >
                      <Shield size={16} />
                      Admin Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}