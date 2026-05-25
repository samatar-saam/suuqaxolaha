import { useState } from "react";
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
  Store,
  Shield,
  CreditCard,
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "Stores", href: "/stores", icon: Store },
    { name: "Deals", href: "/deals", icon: Tag },
    { name: "New Arrivals", href: "/new-arrivals", icon: Star },
    { name: "Top Selling", href: "/top-selling", icon: TrendingUp },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* LOGO */}
          <a href="/" className="group flex shrink-0 items-center gap-3">
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
          </a>

          {/* SEARCH */}
          <div className="hidden flex-1 items-center rounded-xl border border-gray-300 bg-white lg:flex">
            <a
              href="/categories"
              className="flex h-11 items-center border-r border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:text-purple-600"
            >
              Categories
            </a>
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="h-11 w-full bg-transparent px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
            <button className="mr-1 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white transition hover:bg-purple-700">
              <Search size={17} />
            </button>
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden items-center gap-5 xl:flex">
            <a
              href="/track-order"
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-purple-600"
            >
              <MapPin size={18} />
              Track Order
            </a>
            <a
              href="/wishlist"
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-purple-600"
            >
              <Heart size={18} />
              Wishlist
            </a>
            <a
              href="/cart"
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-purple-600"
            >
              <ShoppingCart size={18} />
              Cart
            </a>
            {/* CHECKOUT LINK ADDED */}
            <a
              href="/checkout"
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-purple-700"
            >
              <CreditCard size={18} />
              Checkout
            </a>
            <a
              href="/login"
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md"
            >
              <User size={17} />
              Login
            </a>
            <a
              href="/admin/login"
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-purple-700"
            >
              <Shield size={17} />
              Admin
            </a>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 text-gray-700 transition-all hover:bg-slate-50 hover:shadow-md lg:hidden"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* BOTTOM DESKTOP NAV (no change) */}
        <div className="hidden h-14 items-center gap-8 border-t border-gray-100 lg:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-semibold transition hover:text-purple-600 ${
                  item.name === "Home"
                    ? "relative text-purple-600"
                    : "text-gray-600"
                }`}
              >
                {Icon && <Icon size={15} />}
                {item.name}
                {item.name === "Home" && (
                  <span className="absolute -bottom-[18px] left-0 h-[2px] w-full rounded-full bg-purple-600" />
                )}
              </a>
            );
          })}
        </div>

        {/* MOBILE MENU - added Checkout link */}
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
              />
              <button className="rounded-r-xl bg-purple-600 px-4 py-3 text-white">
                <Search size={18} />
              </button>
            </div>

            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={handleMobileLinkClick}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
                >
                  {Icon && <Icon size={15} />}
                  {item.name}
                </a>
              );
            })}

            <div className="mt-3 grid gap-3 border-t border-slate-200 pt-3">
              <a
                href="/track-order"
                onClick={handleMobileLinkClick}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
              >
                <MapPin size={16} />
                Track Order
              </a>
              <a
                href="/wishlist"
                onClick={handleMobileLinkClick}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
              >
                <Heart size={16} />
                Wishlist
              </a>
              <a
                href="/cart"
                onClick={handleMobileLinkClick}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
              >
                <ShoppingCart size={16} />
                Cart
              </a>
              {/* CHECKOUT LINK ADDED IN MOBILE MENU */}
              <a
                href="/checkout"
                onClick={handleMobileLinkClick}
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700"
              >
                <CreditCard size={16} />
                Checkout
              </a>
              <a
                href="/login"
                onClick={handleMobileLinkClick}
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700"
              >
                <User size={16} />
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}