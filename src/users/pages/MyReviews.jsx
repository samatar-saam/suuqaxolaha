// src/users/pages/MyReviews.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Star,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  MessageSquare,
  Package,
  Calendar,
  X,
  Save,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const REVIEWS_API = "http://localhost:5000/reviews";
const PRODUCTS_API = "http://localhost:5000/products";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        fetchUserData(user);
      } catch (e) {
        console.error("Error parsing user data:", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (user) => {
    try {
      setLoading(true);
      setError("");
      
      const [reviewsRes, productsRes] = await Promise.all([
        fetch(REVIEWS_API),
        fetch(PRODUCTS_API),
      ]);
      
      if (!reviewsRes.ok) {
        throw new Error("Failed to fetch reviews");
      }
      
      const allReviews = await reviewsRes.json();
      const allProducts = await productsRes.json();
      
      setProducts(allProducts);
      
      // Filter reviews for current user
      const userReviews = allReviews.filter(review => 
        review.userId === user.id || review.userEmail === user.email
      );
      
      setReviews(userReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setError("Unable to load your reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product?.name || "Unknown Product";
  };

  const getProductImage = (productId) => {
    const product = products.find(p => p.id === productId);
    return product?.image || "https://via.placeholder.com/60";
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
          />
        ))}
      </div>
    );
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment || "" });
  };

  const handleUpdateReview = async () => {
    if (!editForm.comment.trim()) {
      alert("Please enter a review comment");
      return;
    }

    try {
      const response = await fetch(`${REVIEWS_API}/${editingReview.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: editForm.rating,
          comment: editForm.comment,
          updatedAt: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) throw new Error("Failed to update");
      
      await fetchUserData(currentUser);
      setEditingReview(null);
      alert("Review updated successfully!");
    } catch (error) {
      console.error("Failed to update review:", error);
      alert("Failed to update review. Please try again.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Delete this review? This action cannot be undone.")) return;
    
    try {
      const response = await fetch(`${REVIEWS_API}/${reviewId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      
      await fetchUserData(currentUser);
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(review =>
        getProductName(review.productId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reviews, searchTerm, ratingFilter]);

  const stats = {
    total: reviews.length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0,
    fiveStar: reviews.filter(r => r.rating === 5).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
    threeStar: reviews.filter(r => r.rating === 3).length,
    twoStar: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to load reviews</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <button
          onClick={() => currentUser && fetchUserData(currentUser)}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Reviews</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage and track all your product reviews
            </p>
          </div>
          <button
            onClick={() => currentUser && fetchUserData(currentUser)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards - Only show if there are reviews */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total Reviews" value={stats.total} icon={MessageSquare} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Avg Rating" value={stats.avgRating} icon={Star} color="text-yellow-600" bg="bg-yellow-50" suffix="/5" />
          <StatCard label="5★" value={stats.fiveStar} icon={Star} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="4★" value={stats.fourStar} icon={Star} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="3★" value={stats.threeStar} icon={Star} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="2-1★" value={stats.twoStar + stats.oneStar} icon={Star} color="text-slate-500" bg="bg-slate-100" />
        </div>
      )}

      {/* Search & Filters - Only show if there are reviews */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product name or review comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
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
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Star size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No reviews yet</h3>
          <p className="text-slate-500 mb-6">
            {searchTerm || ratingFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "You haven't written any reviews yet"}
          </p>
          {(searchTerm || ratingFilter !== "all") ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setRatingFilter("all");
              }}
              className="text-purple-600 hover:text-purple-700"
            >
              Clear filters
            </button>
          ) : (
            <Link
              to="/dashboard/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition"
            >
              Browse Orders to Review
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="p-5">
                <div className="flex flex-wrap gap-4">
                  <img
                    src={getProductImage(review.productId)}
                    alt={getProductName(review.productId)}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100"
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900">{getProductName(review.productId)}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getRatingStars(review.rating)}
                          <span className="text-xs text-slate-500">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition"
                          title="Edit Review"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete Review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-slate-600">{review.comment || "No comment provided."}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center text-sm text-slate-500 py-4">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEditingReview(null)}>
          <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setEditingReview(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition">
              <X size={20} />
            </button>

            <div className="p-6">
              <div className="text-center mb-4">
                <img
                  src={getProductImage(editingReview.productId)}
                  alt={getProductName(editingReview.productId)}
                  className="w-16 h-16 rounded-xl object-cover mx-auto mb-2"
                />
                <h3 className="text-lg font-bold text-slate-900">Edit Your Review</h3>
                <p className="text-sm text-slate-500 mt-1">{getProductName(editingReview.productId)}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setEditForm({ ...editForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          size={28}
                          className={star <= editForm.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Review</label>
                  <textarea
                    rows={4}
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                    placeholder="Share your experience with this product..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setEditingReview(null)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateReview}
                    className="flex-1 rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    <Save size={16} className="inline mr-2" />
                    Update Review
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