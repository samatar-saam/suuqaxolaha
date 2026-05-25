import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CategoriesPage from "./components/CategoriesPage";
import Cart from "./components/Cart";
import StoresPage from "./components/Stores";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/layouts/AdminDashboard";
import DashboardOverview from "./admin/pages/DashboardOverview";
import ManageCategories from "./admin/pages/ManageCategories";
import ManageProducts from "./admin/pages/ManageProducts";
import ManageStores from "./admin/pages/ManageStores";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageOrders from "./admin/pages/ManageOrders";
import ManageReports from "./admin/pages/ManageReports";
import Checkout from "./components/Checkout";

import UserDashboard from "./users/layout/UserDashboard";
import Footer from "./components/Footer";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />

        </Route>

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
        </Route>

        {/* User Dashboard Route */}
        <Route path="/dashboard/*" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;