// src/users/pages/MyOrders.jsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  RefreshCw,
  Star,
  MessageSquare,
  X,
  MapPin,
} from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [existingReviews, setExistingReviews] = useState([]);

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      fetchUserOrders(user);
      fetchUserReviews(user);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserOrders = async (user) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/orders");
      const allOrders = await response.json();
      
      const userOrders = allOrders.filter(order => 
        order.customerEmail?.toLowerCase() === user.email?.toLowerCase() ||
        order.userId === user.id
      );
      
      userOrders.sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate));
      setOrders(userOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async (user) => {
    try {
      const response = await fetch("http://localhost:5000/reviews");
      const allReviews = await response.json();
      const userReviews = allReviews.filter(review => 
        review.userEmail === user.email || review.userId === user.id
      );
      setExistingReviews(userReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case "delivered": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "shipped": return <Truck className="h-5 w-5 text-purple-500" />;
      case "processing": return <Clock className="h-5 w-5 text-blue-500" />;
      case "cancelled": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Package className="h-5 w-5 text-yellow-500" />;
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

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status?.toLowerCase() === statusFilter.toLowerCase());
    }
    return filtered;
  }, [orders, searchTerm, statusFilter]);

  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status?.toLowerCase() === "delivered").length,
    processing: orders.filter(o => o.status?.toLowerCase() === "processing").length,
    shipped: orders.filter(o => o.status?.toLowerCase() === "shipped").length,
    cancelled: orders.filter(o => o.status?.toLowerCase() === "cancelled").length,
  };

  const handleRefresh = () => {
    if (currentUser) {
      fetchUserOrders(currentUser);
      fetchUserReviews(currentUser);
    }
  };

  const hasUserReviewed = (productId) => {
    return existingReviews.some(review => review.productId === productId);
  };

  const getUnreviewedProducts = (order) => {
    if (!order.items) return [];
    return order.items.filter(item => !hasUserReviewed(item.id));
  };

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setReviewRating(5);
    setReviewComment("");
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!reviewComment.trim()) {
      alert("Please enter a review comment.");
      return;
    }

    const reviewData = {
      id: `rev_${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.email,
      rating: reviewRating,
      comment: reviewComment,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      
      if (response.ok) {
        alert("Review submitted! It will appear after admin approval.");
        setShowReviewModal(false);
        fetchUserReviews(currentUser);
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const getRatingStars = (rating, size = 16) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
            <p className="text-sm text-slate-500 mt-1">Track, manage, and review your orders</p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard label="Total Orders" value={stats.total} icon={ShoppingBag} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
        <StatCard label="Processing" value={stats.processing} icon={Clock} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Shipped" value={stats.shipped} icon={Truck} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Cancelled" value={stats.cancelled} icon={XCircle} color="text-red-600" bg="bg-red-50" />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order ID or tracking number..."
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
          )}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Package size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
          <p className="text-slate-500 mb-6">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "You haven't placed any orders yet"}
          </p>
          {(searchTerm || statusFilter !== "all") ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="text-purple-600 hover:text-purple-700"
            >
              Clear filters
            </button>
          ) : (
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const unreviewedProducts = getUnreviewedProducts(order);
            const hasUnreviewedProducts = unreviewedProducts.length > 0;
            
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="text-sm text-slate-500">Order #{order.id}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} />
                        {formatDate(order.createdAt || order.orderDate)}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-xs text-purple-600 font-mono mt-0.5">Tracking: {order.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                      {order.status || "Pending"}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard size={14} className="text-purple-500" />
                        <span className="text-slate-600">Total:</span>
                        <span className="font-bold text-purple-600">KSh {order.total?.toLocaleString() || 0}</span>
                      </div>
                      {order.items && order.items.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="text-slate-500">Items:</span>
                          {order.items.slice(0, 2).map((item, idx) => (
                            <span key={idx} className="text-slate-700">{item.quantity}×{item.name}</span>
                          ))}
                          {order.items.length > 2 && <span className="text-purple-600">+{order.items.length-2} more</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to="/dashboard/track-order"
                        state={{ orderId: order.id }}
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
                      >
                        Track Order
                      </Link>
                      
                      {/* Write Review Button - Visible on Delivered orders with unreviewed products */}
                      {order.status?.toLowerCase() === "delivered" && hasUnreviewedProducts && (
                        <button
                          onClick={() => openReviewModal(unreviewedProducts[0])}
                          className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-100 transition"
                        >
                          <Star size={14} />
                          Write a Review ({unreviewedProducts.length})
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Review Reminder Banner */}
                  {order.status?.toLowerCase() === "delivered" && hasUnreviewedProducts && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <p className="text-sm text-purple-700">
                        🎉 You have {unreviewedProducts.length} product{unreviewedProducts.length !== 1 ? 's' : ''} to review! 
                        Share your experience to help other shoppers.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="text-center text-sm text-slate-500 py-4">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedOrder(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition">
              <X size={20} />
            </button>

            <div className="relative h-28 bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                  <Package size={28} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="px-6 pt-12 pb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
                <p className="text-sm text-slate-500 mt-1">Order ID: {selectedOrder.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                <div>
                  <p className="text-xs text-slate-500">Order Date</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(selectedOrder.createdAt || selectedOrder.orderDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status || "Pending"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Amount</p>
                  <p className="text-xl font-bold text-purple-600">KSh {selectedOrder.total?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Payment Method</p>
                  <p className="text-sm text-slate-900 capitalize">{selectedOrder.paymentMethod || "M-PESA"}</p>
                </div>
                {selectedOrder.trackingNumber && (
                  <div>
                    <p className="text-xs text-slate-500">Tracking Number</p>
                    <p className="text-sm font-mono text-purple-600">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* Order Items with Review Buttons */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => {
                      const isReviewed = hasUserReviewed(item.id);
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <img src={item.image || "https://via.placeholder.com/48"} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <p className="font-medium text-slate-900">{item.name}</p>
                              <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-purple-600">KSh {(item.price * item.quantity).toLocaleString()}</p>
                            {selectedOrder.status?.toLowerCase() === "delivered" && !isReviewed && (
                              <button
                                onClick={() => openReviewModal(item)}
                                className="mt-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                              >
                                Write a Review →
                              </button>
                            )}
                            {isReviewed && (
                              <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle size={12} />
                                Reviewed
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="mb-4 p-4 bg-purple-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    <MapPin size={14} />
                    Shipping Address
                  </h4>
                  <p className="text-sm text-slate-600">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.shippingAddress.country}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 font-semibold text-white hover:bg-purple-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowReviewModal(false)}>
          <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowReviewModal(false)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition">
              <X size={20} />
            </button>

            <div className="p-6">
              <div className="text-center mb-4">
                <img
                  src={selectedProduct.image || "https://via.placeholder.com/64"}
                  alt={selectedProduct.name}
                  className="w-16 h-16 rounded-xl object-cover mx-auto mb-2"
                />
                <h3 className="text-lg font-bold text-slate-900">Write a Review</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedProduct.name}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={32}
                          className={star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Review</label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReview}
                    className="flex-1 rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <span className="text-2xl font-black text-slate-900">{value}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}