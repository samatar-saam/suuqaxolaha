// src/users/pages/DashboardOverview.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Package,
  TrendingUp,
  Clock,
  Truck,
  Star,
  ChevronRight,
} from "lucide-react";

export default function DashboardOverview() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    reviewsCount: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(currentUser);
    
    if (currentUser) {
      fetchUserData(currentUser);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (currentUser) => {
    setLoading(true);
    try {
      // Fetch all orders from database
      const ordersRes = await fetch("http://localhost:5000/orders");
      const allOrders = await ordersRes.json();
      
      // Filter orders for current user ONLY
      const userOrders = allOrders.filter(order => 
        order.customerEmail === currentUser.email || 
        order.userId === currentUser.id ||
        order.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase()
      );
      
      // Calculate user stats (NOT admin stats)
      const totalOrders = userOrders.length;
      const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingOrders = userOrders.filter(order => order.status === "pending").length;
      const deliveredOrders = userOrders.filter(order => order.status === "delivered").length;
      
      // Get recent orders (last 5)
      const recent = userOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      // Get wishlist count from localStorage
      const wishlist = JSON.parse(localStorage.getItem("public_wishlist") || "[]");
      const wishlistCount = wishlist.length;
      
      // Fetch and filter user reviews
      const reviewsRes = await fetch("http://localhost:5000/reviews");
      const allReviews = await reviewsRes.json();
      const userReviews = allReviews.filter(review => 
        review.userEmail === currentUser.email || 
        review.userId === currentUser.id
      );
      
      setStats({
        totalOrders,
        totalSpent,
        wishlistCount,
        reviewsCount: userReviews.length,
        pendingOrders,
        deliveredOrders,
      });
      
      setRecentOrders(recent);
      
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `KSh ${price?.toLocaleString() || "0"}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Please login to view your dashboard</p>
        <Link to="/login" className="mt-4 inline-block text-purple-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const firstName = user.firstName || user.email?.split('@')[0] || "Customer";

  return (
    <div className="space-y-6">
      {/* Welcome Banner - NO ADMIN TEXT */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-purple-100">
          Here's what's happening with your orders today.
        </p>
      </div>

      {/* Stats Cards - USER STATS ONLY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Package size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs">
            {stats.pendingOrders > 0 && (
              <span className="text-yellow-600">⏳ {stats.pendingOrders} pending</span>
            )}
            {stats.deliveredOrders > 0 && (
              <span className="text-green-600">✓ {stats.deliveredOrders} delivered</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Spent</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{formatPrice(stats.totalSpent)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Wishlist Items</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.wishlistCount}</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-xl">
              <Heart size={24} className="text-pink-600" />
            </div>
          </div>
          <Link to="/dashboard/wishlist" className="mt-2 text-xs text-purple-600 hover:underline inline-block">
            View Wishlist →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">My Reviews</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.reviewsCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star size={24} className="text-yellow-600" />
            </div>
          </div>
          <Link to="/dashboard/reviews" className="mt-2 text-xs text-purple-600 hover:underline inline-block">
            Write a Review →
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">Recent Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Your latest purchase history</p>
          </div>
          {recentOrders.length > 0 && (
            <Link to="/dashboard/orders" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
              View All
              <ChevronRight size={14} />
            </Link>
          )}
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No orders yet</p>
            <Link to="/categories" className="mt-3 inline-block text-purple-600 hover:underline text-sm">
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-5 hover:bg-slate-50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-mono text-sm font-semibold text-purple-600">
                        #{order.id?.slice(-8)}
                      </p>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-purple-600">
                      {formatPrice(order.total)}
                    </p>
                    <Link
                      to={`/dashboard/orders`}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/categories"
          className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-md transition group"
        >
          <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition">
            <ShoppingBag size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Continue Shopping</p>
            <p className="text-xs text-slate-500">Discover new products</p>
          </div>
        </Link>

        <Link
          to="/dashboard/track-order"
          className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-md transition group"
        >
          <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition">
            <Truck size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Track Order</p>
            <p className="text-xs text-slate-500">Check delivery status</p>
          </div>
        </Link>

        <Link
          to="/dashboard/support"
          className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-md transition group"
        >
          <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition">
            <Clock size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Need Help?</p>
            <p className="text-xs text-slate-500">Contact support</p>
          </div>
        </Link>
      </div>
    </div>
  );
}