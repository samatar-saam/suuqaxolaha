// src/admin/pages/ManageReviews.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Star,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Trash2,
  User,
  Package,
  Calendar,
  MessageSquare,
  X,
} from "lucide-react";

const REVIEWS_API = "http://localhost:5000/reviews";
const PRODUCTS_API = "http://localhost:5000/products";
const USERS_API = "http://localhost:5000/users";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, productsRes, usersRes] = await Promise.all([
        fetch(REVIEWS_API),
        fetch(PRODUCTS_API),
        fetch(USERS_API),
      ]);
      setReviews(await reviewsRes.json());
      setProducts(await productsRes.json());
      setUsers(await usersRes.json());
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateReviewStatus = async (reviewId, newStatus) => {
    try {
      await fetch(`${REVIEWS_API}/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, updatedAt: new Date().toISOString() }),
      });
      await fetchData();
    } catch (error) {
      console.error("Failed to update review status:", error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Delete this review? This action cannot be undone.")) return;
    try {
      await fetch(`${REVIEWS_API}/${reviewId}`, { method: "DELETE" });
      await fetchData();
      if (selectedReview?.id === reviewId) {
        setShowModal(false);
        setSelectedReview(null);
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product?.name || "Unknown Product";
  };

  const getProductImage = (productId) => {
    const product = products.find(p => p.id === productId);
    return product?.image || "https://via.placeholder.com/80";
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "Guest User";
  };

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProductName(review.productId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUserName(review.userId)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.setDate(now.getDate() - 7));
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter(review => {
        const reviewDate = new Date(review.createdAt);
        if (dateFilter === "today") return reviewDate >= today;
        if (dateFilter === "week") return reviewDate >= thisWeek;
        if (dateFilter === "month") return reviewDate >= thisMonth;
        return true;
      });
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reviews, searchTerm, statusFilter, ratingFilter, dateFilter, products, users]);

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === "approved").length,
    pending: reviews.filter(r => r.status === "pending").length,
    rejected: reviews.filter(r => r.status === "rejected").length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0,
    fiveStar: reviews.filter(r => r.rating === 5).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
    threeStar: reviews.filter(r => r.rating === 3).length,
    twoStar: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
      pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
      rejected: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getRatingStars = (rating, size = 14) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Star size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">Reviews Management</span>
              </div>
              <h1 className="text-3xl font-black">Manage Reviews</h1>
              <p className="mt-1 text-purple-100">Moderate and manage customer reviews</p>
            </div>
            <div className="flex gap-3">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-8">
          <StatCard label="Total Reviews" value={stats.total} icon={MessageSquare} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
          <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="text-rose-600" bg="bg-rose-50" />
          <StatCard label="Avg Rating" value={stats.avgRating} icon={Star} color="text-yellow-600" bg="bg-yellow-50" suffix="/5" />
          <StatCard label="5★" value={stats.fiveStar} icon={Star} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="4★" value={stats.fourStar} icon={Star} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="3★" value={stats.threeStar} icon={Star} color="text-yellow-600" bg="bg-yellow-50" />
        </div>

        {/* Filters Bar */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product, customer, or comment..."
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
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-400"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
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

        {/* Reviews Table */}
        <div className="overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Review</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <Star size={48} className="mx-auto text-slate-300" />
                      <p className="mt-3 text-slate-500">No reviews found</p>
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-slate-50 transition group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">{getProductName(review.productId)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-700">{getUserName(review.userId)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getRatingStars(review.rating)}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-600 max-w-xs truncate">{review.comment || "No comment"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={review.status || "pending"}
                          onChange={(e) => updateReviewStatus(review.id, e.target.value)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${getStatusBadge(review.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{formatDate(review.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openReviewModal(review)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500 bg-white">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>
      </div>

      {/* Review Details Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeModal}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeModal} 
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>

            <div className="relative h-24 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                  <MessageSquare size={28} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-10">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  {getRatingStars(selectedReview.rating, 20)}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Review Details</h2>
                <p className="text-sm text-slate-500 mt-1 font-mono">ID: {selectedReview.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={getProductImage(selectedReview.productId)} 
                    alt={getProductName(selectedReview.productId)}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Product</p>
                    <p className="text-sm font-semibold text-slate-900">{getProductName(selectedReview.productId)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{getUserName(selectedReview.userId)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rating</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedReview.rating} / 5</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date Submitted</p>
                  <p className="text-sm text-slate-700 mt-1">{formatDate(selectedReview.createdAt)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-purple-600" />
                  Review Comment
                </p>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-slate-700 leading-relaxed">
                    {selectedReview.comment || "No comment provided."}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-900 mb-3">Update Status</p>
                <div className="flex gap-3 flex-wrap">
                  {["pending", "approved", "rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateReviewStatus(selectedReview.id, status);
                        closeModal();
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                        selectedReview.status === status
                          ? getStatusBadge(status)
                          : "bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-600"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">
                  <span className="font-semibold">Current Status:</span>{" "}
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(selectedReview.status)}`}>
                    {selectedReview.status || "Pending"}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 font-semibold text-white hover:bg-purple-700 transition"
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

function StatCard({ label, value, icon: Icon, color, bg, suffix = "" }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition group">
      <div className="flex items-center justify-between mb-2">
        <div className={`rounded-lg ${bg} p-2`}>
          <Icon size={16} className={color} />
        </div>
      </div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-black text-slate-900 mt-1">
        {value}{suffix}
      </p>
    </div>
  );
}