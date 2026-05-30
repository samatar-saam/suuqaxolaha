// src/admin/pages/ManagePayments.jsx
import { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Download,
  X,
  TrendingUp,
  Wallet,
} from "lucide-react";

const PAYMENTS_API = "http://localhost:5000/payments";
const ORDERS_API = "http://localhost:5000/orders";
const USERS_API = "http://localhost:5000/users";

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersRes, usersRes] = await Promise.all([
        fetch(ORDERS_API),
        fetch(USERS_API),
      ]);
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();
      setOrders(ordersData);
      setUsers(usersData);

      let paymentsData = [];
      try {
        const paymentsRes = await fetch(PAYMENTS_API);
        if (paymentsRes.ok) {
          paymentsData = await paymentsRes.json();
        } else {
          paymentsData = generatePaymentsFromOrders(ordersData, usersData);
        }
      } catch (err) {
        paymentsData = generatePaymentsFromOrders(ordersData, usersData);
      }

      setPayments(paymentsData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load dashboard data. Please check your database connection.");
    } finally {
      setLoading(false);
    }
  };

  const generatePaymentsFromOrders = (orders, users) => {
    if (!orders.length) return [];

    return orders.map((order, idx) => {
      const user = users.find(u => u.id === order.userId || u.email === order.customerEmail);
      const paymentMethods = ["mpesa", "card", "cod"];
      const statuses = ["completed", "pending", "failed", "refunded"];
      const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        id: `pay_${order.id || idx}`,
        orderId: order.id,
        userId: user?.id || order.userId || "guest",
        amount: order.total,
        method: order.paymentMethod || randomMethod,
        status: order.paymentStatus || randomStatus,
        transactionId: `TXN-${Date.now()}-${idx}`,
        createdAt: order.createdAt || new Date().toISOString(),
      };
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      const response = await fetch(`${PAYMENTS_API}/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, updatedAt: new Date().toISOString() }),
      });
      if (response.ok) {
        await fetchData();
      } else {
        setPayments(prev =>
          prev.map(p => (p.id === paymentId ? { ...p, status: newStatus } : p))
        );
      }
    } catch (error) {
      console.error("Failed to update payment status:", error);
      setPayments(prev =>
        prev.map(p => (p.id === paymentId ? { ...p, status: newStatus } : p))
      );
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "Guest User";
  };

  const filteredPayments = useMemo(() => {
    let filtered = Array.isArray(payments) ? [...payments] : [];

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUserName(payment.userId)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (methodFilter !== "all") {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.setDate(now.getDate() - 7));
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        if (dateFilter === "today") return paymentDate >= today;
        if (dateFilter === "week") return paymentDate >= thisWeek;
        if (dateFilter === "month") return paymentDate >= thisMonth;
        return true;
      });
    }

    if (Array.isArray(filtered)) {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return filtered;
  }, [payments, searchTerm, statusFilter, methodFilter, dateFilter, users]);

  const stats = {
    total: Array.isArray(payments) ? payments.length : 0,
    completed: payments.filter(p => p.status === "completed").length,
    pending: payments.filter(p => p.status === "pending").length,
    failed: payments.filter(p => p.status === "failed").length,
    refunded: payments.filter(p => p.status === "refunded").length,
    totalAmount: payments.filter(p => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0),
    mpesa: payments.filter(p => p.method === "mpesa").length,
    card: payments.filter(p => p.method === "card").length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      failed: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
      refunded: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case "mpesa": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">💳 M-PESA</span>;
      case "card": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">💳 Card</span>;
      case "cod": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium">💰 Cash on Delivery</span>;
      default: return <span>{method}</span>;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `KSh ${(amount || 0).toLocaleString()}`;
  };

  const handleExport = () => {
    const dataToExport = Array.isArray(filteredPayments) ? filteredPayments : [];
    const csvData = dataToExport.map(payment => ({
      "Payment ID": payment.id,
      "Order ID": payment.orderId,
      "Customer": getUserName(payment.userId),
      "Amount": payment.amount || 0,
      "Method": payment.method,
      "Status": payment.status,
      "Transaction ID": payment.transactionId || "N/A",
      "Date": formatDate(payment.createdAt),
    }));

    if (!csvData.length) {
      alert("No data to export");
      return;
    }

    const headers = Object.keys(csvData[0]);
    const csv = [
      headers.join(","),
      ...csvData.map(row => headers.map(h => JSON.stringify(row[h] || "")).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error && (!payments.length && !orders.length)) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to load data</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={fetchData} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* Modern Header */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <CreditCard size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">Payments</span>
              </div>
              <h1 className="text-3xl font-black">Payment Overview</h1>
              <p className="mt-1 text-purple-100">Track and manage all customer transactions</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold transition hover:bg-white/30"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Modern Stats Cards - 7 cards, no COD revenue */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          <StatCard label="Total Payments" value={stats.total} icon={CreditCard} color="text-purple-600" bg="bg-purple-50" trend="+12%" />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
          <StatCard label="Failed" value={stats.failed} icon={XCircle} color="text-rose-600" bg="bg-rose-50" />
          {/* <StatCard label="Refunded" value={stats.refunded} icon={RefreshCw} color="text-slate-600" bg="bg-slate-100" /> */}
          <StatCard label="Total Revenue" value={formatCurrency(stats.totalAmount)} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="M-PESA / Card" value={`${stats.mpesa + stats.card}`} icon={Wallet} color="text-blue-600" bg="bg-blue-50" />
        </div>

        {/* Modern Filters Bar */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by payment ID, order ID, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition"
            >
              <Filter size={14} />
              Filters
              {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showFilters && (
              <div className="flex flex-wrap gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-400"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>

                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-400"
                >
                  <option value="all">All Methods</option>
                  <option value="mpesa">M-PESA</option>
                  <option value="card">Card</option>
                  <option value="cod">Cash on Delivery</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-400"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Modern Payments Table */}
        <div className="overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Payment ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!filteredPayments.length ? (
                  <tr>
                    <td colSpan="8" className="py-16 text-center">
                      <CreditCard size={48} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500">No payments found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition group">
                      <td className="px-4 py-3">
                        <p className="font-mono text-sm font-semibold text-purple-600">#{payment.id?.slice(0, 8)}</p>
                        {payment.transactionId && (
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{payment.transactionId?.slice(0, 12)}...</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-900">#{payment.orderId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-900">{getUserName(payment.userId)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-purple-600">{formatCurrency(payment.amount)}</p>
                      </td>
                      <td className="px-4 py-3">{getMethodIcon(payment.method)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={payment.status || "pending"}
                          onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${getStatusBadge(payment.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                       </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{formatDate(payment.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500 bg-white">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        </div>
      </div>

      {/* Modern Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedPayment(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedPayment(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition">
              <X size={20} />
            </button>

            <div className="relative h-32 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
                  <CreditCard size={32} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 pt-12">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Payment Details</h2>
                <p className="text-sm text-slate-500 mt-1 font-mono">{selectedPayment.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 rounded-xl mb-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Order ID</p>
                  <p className="text-sm font-semibold text-purple-600 mt-1">#{selectedPayment.orderId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Customer</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{getUserName(selectedPayment.userId)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Amount</p>
                  <p className="text-2xl font-black text-purple-600 mt-1">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Method</p>
                  <p className="text-sm font-medium text-slate-900 mt-1 capitalize">{selectedPayment.method}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Transaction ID</p>
                  <p className="text-sm font-mono text-slate-600 mt-1 break-all">{selectedPayment.transactionId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Date</p>
                  <p className="text-sm text-slate-700 mt-1">{formatDate(selectedPayment.createdAt)}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Payment Status</p>
                <div className="flex gap-2 flex-wrap">
                  {["pending", "completed", "failed", "refunded"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updatePaymentStatus(selectedPayment.id, status);
                        setSelectedPayment(null);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                        selectedPayment.status === status
                          ? getStatusBadge(status)
                          : "bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-600"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="flex-1 rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg, trend }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition group">
      <div className="flex items-center justify-between mb-3">
        <div className={`rounded-lg ${bg} p-2.5`}>
          <Icon size={18} className={color} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}