// src/admin/pages/DashboardOverview.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Star,
  Store,
  TrendingUp,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Eye,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

function DashboardOverview() {
  const [data, setData] = useState({
    users: [],
    products: [],
    orders: [],
    sellers: [],
    reviews: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, products, orders, sellers, reviews, categories] = await Promise.all([
          fetch("http://localhost:5000/users").then(res => res.json()),
          fetch("http://localhost:5000/products").then(res => res.json()),
          fetch("http://localhost:5000/orders").then(res => res.json()),
          fetch("http://localhost:5000/sellers").then(res => res.json()),
          fetch("http://localhost:5000/reviews").then(res => res.json()),
          fetch("http://localhost:5000/categories").then(res => res.json()),
        ]);
        setData({ users, products, orders, sellers, reviews, categories });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalUsers = data.users.filter(u => u.role === "user").length;
    const totalProducts = data.products.length;
    const totalOrders = data.orders.length;
    const totalSellers = data.sellers.length;
    const totalRevenue = data.orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalReviews = data.reviews.length;
    const avgRating = data.reviews.length > 0 
      ? (data.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / data.reviews.length).toFixed(1)
      : 0;

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalSellers,
      totalRevenue,
      totalReviews,
      avgRating,
    };
  }, [data]);

  const salesData = useMemo(() => {
    const days = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySales = new Array(12).fill(0);
    
    data.orders.forEach((order) => {
      const date = new Date(order.createdAt || order.orderDate);
      const month = date.getMonth();
      monthlySales[month] += order.total || 0;
    });
    
    return days.map((month, i) => ({ month, sales: monthlySales[i] }));
  }, [data.orders]);

  const orderStatus = useMemo(() => {
    const statusCount = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    data.orders.forEach((order) => {
      const status = order.status?.toLowerCase();
      if (status === "pending") statusCount.pending++;
      else if (status === "processing") statusCount.processing++;
      else if (status === "shipped") statusCount.shipped++;
      else if (status === "delivered") statusCount.delivered++;
      else if (status === "cancelled") statusCount.cancelled++;
      else statusCount.pending++;
    });
    return [
      { name: "Pending", value: statusCount.pending, color: "#f59e0b" },
      { name: "Processing", value: statusCount.processing, color: "#3b82f6" },
      { name: "Shipped", value: statusCount.shipped, color: "#8b5cf6" },
      { name: "Delivered", value: statusCount.delivered, color: "#10b981" },
      { name: "Cancelled", value: statusCount.cancelled, color: "#ef4444" },
    ];
  }, [data.orders]);

  const recentOrders = useMemo(() => {
    return [...data.orders]
      .sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate))
      .slice(0, 5);
  }, [data.orders]);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Sales" value={`KSh ${stats.totalRevenue.toLocaleString()}`} growth="+18.6%" icon={<DollarSign className="h-6 w-6 text-emerald-600" />} bgColor="bg-emerald-50" />
        <StatCard title="Total Orders" value={stats.totalOrders} growth="+12.4%" icon={<ShoppingCart className="h-6 w-6 text-blue-600" />} bgColor="bg-blue-50" />
        <StatCard title="Total Customers" value={stats.totalUsers} growth="+15.3%" icon={<Users className="h-6 w-6 text-purple-600" />} bgColor="bg-purple-50" />
        <StatCard title="Total Vendors" value={stats.totalSellers} growth="+9.8%" icon={<Store className="h-6 w-6 text-orange-600" />} bgColor="bg-orange-50" />
      </div>

      {/* Sales Overview Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-900">Sales Overview</h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(value) => `KSh ${value/1000}K`} />
            <Tooltip formatter={(value) => [`KSh ${value.toLocaleString()}`, "Sales"]} />
            <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fill="url(#salesGradient)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Order Status Pie Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-900">Order Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie data={orderStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {orderStatus.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
          </div>
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-900">#{order.id}</p>
                  <p className="text-xs text-slate-500">{order.customerName || "Customer"}</p>
                </div>
                <p className="font-bold text-purple-600">KSh {order.total?.toLocaleString() || 0}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status?.toLowerCase()] || "bg-gray-100"}`}>
                  {order.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, growth, icon, bgColor }) {
  const isPositive = growth?.startsWith("+");
  
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className={`mb-3 inline-flex rounded-2xl ${bgColor} p-3`}>
          {icon}
        </div>
        {growth && (
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {growth}
          </div>
        )}
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}

export default DashboardOverview;