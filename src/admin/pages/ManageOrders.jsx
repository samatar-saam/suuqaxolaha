// src/admin/pages/ManageOrders.jsx
import { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Download,
  Printer,
} from "lucide-react";

const ORDERS_API = "http://localhost:5000/orders";
const USERS_API = "http://localhost:5000/users";
const PRODUCTS_API = "http://localhost:5000/products";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        fetch(ORDERS_API),
        fetch(USERS_API),
        fetch(PRODUCTS_API),
      ]);
      setOrders(await ordersRes.json());
      setUsers(await usersRes.json());
      setProducts(await productsRes.json());
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await fetch(`${ORDERS_API}/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchData();
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId || u.id?.toString() === userId?.toString());
    if (user) return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
    return "Guest User";
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId || p.id?.toString() === productId?.toString());
    return product?.name || "Product";
  };

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.setDate(now.getDate() - 7));
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt || order.orderDate);
        if (dateFilter === "today") return orderDate >= today;
        if (dateFilter === "week") return orderDate >= thisWeek;
        if (dateFilter === "month") return orderDate >= thisMonth;
        return true;
      });
    }

    return filtered.sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate));
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status?.toLowerCase() === "pending").length,
    processing: orders.filter(o => o.status?.toLowerCase() === "processing").length,
    shipped: orders.filter(o => o.status?.toLowerCase() === "shipped").length,
    delivered: orders.filter(o => o.status?.toLowerCase() === "delivered").length,
    cancelled: orders.filter(o => o.status?.toLowerCase() === "cancelled").length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case "delivered": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "shipped": return <Truck className="h-4 w-4 text-purple-500" />;
      case "processing": return <Clock className="h-4 w-4 text-blue-500" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      delivered: "bg-green-100 text-green-700",
      shipped: "bg-purple-100 text-purple-700",
      processing: "bg-blue-100 text-blue-700",
      pending: "bg-yellow-100 text-yellow-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    const currentIndex = allStatuses.indexOf(currentStatus?.toLowerCase());
    return allStatuses.slice(currentIndex);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return `KSh ${(amount || 0).toLocaleString()}`;
  };

  const handleExport = () => {
    const csvData = filteredOrders.map(order => ({
      "Order ID": order.id,
      "Customer": order.customerName || "Guest",
      "Email": order.customerEmail || "N/A",
      "Amount": order.total || 0,
      "Status": order.status || "Pending",
      "Date": formatDate(order.createdAt || order.orderDate),
    }));
    
    const headers = Object.keys(csvData[0] || {});
    const csv = [
      headers.join(","),
      ...csvData.map(row => headers.map(h => JSON.stringify(row[h] || "")).join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ShoppingCart size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">Order Management</span>
              </div>
              <h1 className="text-3xl font-black">Manage Orders</h1>
              <p className="mt-1 text-purple-100">View, track, and manage all customer orders</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <StatCard label="Total Orders" value={stats.total} icon={ShoppingCart} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="Processing" value={stats.processing} icon={Package} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Shipped" value={stats.shipped} icon={Truck} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
          <StatCard label="Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        </div>

        {/* Filters Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, email, or tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-purple-50"
            >
              <Filter size={14} />
              Filters
              {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showFilters && (
              <>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <ShoppingCart size={48} className="mx-auto text-slate-300" />
                      <p className="mt-3 text-slate-500">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-mono text-sm font-semibold text-purple-600">#{order.id}</p>
                        {order.trackingNumber && (
                          <p className="text-xs text-slate-400">Tracking: {order.trackingNumber}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-900">{order.customerName || "Guest"}</p>
                        <p className="text-xs text-slate-500">{order.customerEmail || "No email"}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDate(order.createdAt || order.orderDate)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-purple-600">{formatCurrency(order.total)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative group">
                          <select
                            value={order.status || "pending"}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={updatingStatus}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold cursor-pointer ${getStatusBadge(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                            title="Print Invoice"
                          >
                            <Printer size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          getUserName={getUserName}
          getProductName={getProductName}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg ${bg} p-2`}>
          <Icon size={18} className={color} />
        </div>
        <span className="text-xl font-black text-slate-900">{typeof value === 'number' ? value : value}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function OrderDetailsModal({ order, onClose, onUpdateStatus, getUserName, getProductName, formatDate, formatCurrency, getStatusBadge }) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await onUpdateStatus(order.id, newStatus);
    setUpdating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg">
          <X size={20} />
        </button>

        <div className="relative h-28 bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
              <ShoppingCart size={28} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="px-6 pt-12 pb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Order #{order.id}</h2>
            <div className="mt-2 flex justify-center gap-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                {order.status || "Pending"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Info */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <h3 className="text-sm font-semibold text-purple-600 mb-3">Order Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-purple-500" />
                  <span className="text-slate-600">Order Date:</span>
                  <span className="text-slate-900 font-medium">{formatDate(order.createdAt || order.orderDate)}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck size={14} className="text-purple-500" />
                    <span className="text-slate-600">Tracking Number:</span>
                    <span className="text-slate-900 font-mono text-sm">{order.trackingNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={14} className="text-purple-500" />
                  <span className="text-slate-600">Payment Method:</span>
                  <span className="text-slate-900">{order.paymentMethod || "M-PESA"}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <h3 className="text-sm font-semibold text-purple-600 mb-3">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User size={14} className="text-purple-500" />
                  <span className="text-slate-600">Name:</span>
                  <span className="text-slate-900">{order.customerName || "Guest"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-purple-500" />
                  <span className="text-slate-600">Email:</span>
                  <span className="text-slate-900">{order.customerEmail || "N/A"}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-purple-500" />
                    <span className="text-slate-600">Phone:</span>
                    <span className="text-slate-900">{order.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{item.name || getProductName(item.productId)}</p>
                        <p className="text-sm text-slate-500">Quantity: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="font-bold text-purple-600">{formatCurrency((item.price || 0) * (item.quantity || 1))}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-slate-900">{formatCurrency(order.subtotal || order.total || 0)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Delivery Fee</span>
              <span className="text-slate-900">{formatCurrency(order.deliveryFee || 250)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm mb-2 text-green-600">
                <span>Discount</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200 mt-2">
              <span className="text-slate-900">Total</span>
              <span className="text-purple-600">{formatCurrency(order.total || 0)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="mt-4 p-4 bg-purple-50 rounded-xl">
              <h4 className="text-sm font-semibold text-purple-700 mb-2">Shipping Address</h4>
              <p className="text-sm text-slate-600">{order.shippingAddress.street}</p>
              <p className="text-sm text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p className="text-sm text-slate-600">{order.shippingAddress.country}</p>
            </div>
          )}

          {/* Update Status */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Update Order Status</h4>
            <div className="flex gap-2 flex-wrap">
              {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    order.status?.toLowerCase() === status
                      ? getStatusBadge(status)
                      : "bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-purple-600 py-2.5 font-semibold text-white hover:bg-purple-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}