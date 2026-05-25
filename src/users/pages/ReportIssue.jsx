// src/users/pages/ReportIssue.jsx
import { useState, useEffect } from "react";
import {
  Flag,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  ShoppingBag,
  Store,
  User,
  MessageSquare,
  Paperclip,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const REPORTS_API = "http://localhost:5000/reports";

export default function ReportIssue() {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    type: "order",
    subject: "",
    description: "",
    orderId: "",
    storeId: "",
    priority: "medium",
    attachments: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [userStores, setUserStores] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      fetchUserData(user);
    }
  }, []);

  const fetchUserData = async (user) => {
    try {
      const [ordersRes, storesRes] = await Promise.all([
        fetch("http://localhost:5000/orders"),
        fetch("http://localhost:5000/sellers"),
      ]);
      const allOrders = await ordersRes.json();
      const allStores = await storesRes.json();
      
      const userOrdersList = allOrders.filter(
        order => order.userId === user.id || order.customerEmail === user.email
      );
      setUserOrders(userOrdersList);
      setUserStores(allStores);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      setError("Please enter a subject");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }

    setSubmitting(true);
    
    const reportData = {
      ...formData,
      userId: currentUser?.id,
      userName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
      userEmail: currentUser?.email,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch(REPORTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });
      setSubmitted(true);
      setFormData({
        type: "order",
        subject: "",
        description: "",
        orderId: "",
        storeId: "",
        priority: "medium",
        attachments: [],
      });
    } catch (error) {
      console.error("Failed to submit report:", error);
      setError("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Submitted!</h2>
          <p className="text-slate-500 mb-6">
            Thank you for your report. Our support team will review it and get back to you within 24-48 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-white font-semibold hover:bg-purple-700"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-2.5 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-xl">
            <Flag size={24} className="text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Report an Issue</h1>
            <p className="text-sm text-slate-500 mt-1">
              Let us know about any problems you're experiencing. We're here to help!
            </p>
          </div>
        </div>
      </div>

      {/* Report Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Report Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "order", label: "Order Issue", icon: ShoppingBag },
                { value: "store", label: "Store Issue", icon: Store },
                { value: "product", label: "Product Issue", icon: FileText },
                { value: "other", label: "Other", icon: MessageSquare },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${
                      formData.type === type.value
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 hover:border-purple-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <Icon size={20} className={formData.type === type.value ? "text-purple-600" : "text-slate-400"} />
                    <span className={`text-xs font-medium ${formData.type === type.value ? "text-purple-600" : "text-slate-600"}`}>
                      {type.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Order Selection (if type is order) */}
          {formData.type === "order" && userOrders.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Related Order (Optional)
              </label>
              <select
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              >
                <option value="">Select an order</option>
                {userOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    #{order.id} - {new Date(order.createdAt).toLocaleDateString()} - KSh {order.total}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Store Selection (if type is store) */}
          {formData.type === "store" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Related Store (Optional)
              </label>
              <select
                name="storeId"
                value={formData.storeId}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              >
                <option value="">Select a store</option>
                {userStores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.business_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Priority Level *
            </label>
            <div className="flex gap-3">
              {[
                { value: "low", label: "Low", color: "text-green-600", bg: "bg-green-50" },
                { value: "medium", label: "Medium", color: "text-yellow-600", bg: "bg-yellow-50" },
                { value: "high", label: "High", color: "text-orange-600", bg: "bg-orange-50" },
                { value: "urgent", label: "Urgent", color: "text-red-600", bg: "bg-red-50" },
              ].map((priority) => (
                <label
                  key={priority.value}
                  className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition ${
                    formData.priority === priority.value
                      ? `${priority.bg} border-purple-500`
                      : "border-slate-200 hover:border-purple-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <AlertCircle size={14} className={priority.color} />
                  <span className={`text-sm font-medium ${priority.color}`}>{priority.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief summary of the issue"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Please provide detailed information about the issue..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 resize-none"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}