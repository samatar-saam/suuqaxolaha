import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CategoriesPage from "./components/CategoriesPage";
import Cart from "./components/Cart";
import Services from "./components/Services";
import PublicWishlist from "./components/PublicWishlist";
import Contact from "./components/Contact";
import About from "./components/About";
import NewArrivals from "./components/NewArrivals";
import Checkout from "./components/Checkout";

// Admin Imports
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/layouts/AdminDashboard";
import DashboardOverview from "./admin/pages/DashboardOverview";
import ManageCategories from "./admin/pages/ManageCategories";
import ManageProducts from "./admin/pages/ManageProducts";
import ManageStores from "./admin/pages/ManageStores";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageOrders from "./admin/pages/ManageOrders";
import ManageReports from "./admin/pages/ManageReports";
import ManagePayments from "./admin/pages/ManagePayments";
import ManageReviews from "./admin/pages/ManageReviews";
import AdminSettings from "./admin/pages/AdminSettings";
import ManageSupport from "./admin/pages/ManageSupport";
import ManageMessages from "./admin/pages/ManageMessages";

// User Dashboard Import
import UserDashboard from "./users/layout/UserDashboard";

// Public Layout Component - All pages with Navbar and Footer
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Simple Layout without Footer (for checkout and cart)
function SimpleLayout() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/wishlist" element={<PublicWishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
        </Route>

        {/* Public Routes with Navbar only (no footer) */}
        <Route element={<SimpleLayout />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Auth Routes - No Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="stores" element={<ManageStores />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="reports" element={<ManageReports />} />
          <Route path="payments" element={<ManagePayments />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="support" element={<ManageSupport />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* User Dashboard Route - Protected */}
        <Route path="/dashboard/*" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;