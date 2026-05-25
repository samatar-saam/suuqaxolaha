// src/admin/pages/ManageReports.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Flag,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  User,
  Mail,
  Calendar,
  Trash2,
  Send,
  ShoppingCart,
  Store,
  Package,
  X,
} from "lucide-react";

const REPORTS_API = "http://localhost:5000/reports";

export default function ManageReports() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyModal, setReplyModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(REPORTS_API);
      const data = await response.json();
      setReports(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      setUpdating(true);
      await fetch(`${REPORTS_API}/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus, 
          updatedAt: new Date().toISOString() 
        }),
      });
      await fetchReports();
    } catch (error) {
      console.error("Failed to update report status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm("Delete this report? This action cannot be undone.")) return;
    try {
      await fetch(`${REPORTS_API}/${reportId}`, { method: "DELETE" });
      await fetchReports();
      if (selectedReport?.id === reportId) setSelectedReport(null);
    } catch (error) {
      console.error("Failed to delete report:", error);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;
    try {
      // In production, you would send an email or notification here
      console.log(`Sending reply to ${replyTo.userEmail}: ${replyText}`);
      
      // Add reply to report
      await fetch(`${REPORTS_API}/${replyTo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: replyText,
          repliedAt: new Date().toISOString(),
          status: "resolved",
          updatedAt: new Date().toISOString(),
        }),
      });
      
      setReplyModal(false);
      setReplyText("");
      await fetchReports();
      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply. Please try again.");
    }
  };

  const filteredReports = useMemo(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(report => report.type === typeFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    return filtered;
  }, [reports, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    resolved: reports.filter(r => r.status === "resolved").length,
    inProgress: reports.filter(r => r.status === "in-progress").length,
    urgent: reports.filter(r => r.priority === "urgent").length,
    highPriority: reports.filter(r => r.priority === "high" || r.priority === "urgent").length,
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };
    return styles[priority] || "bg-gray-100 text-gray-700";
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case "urgent": return <AlertCircle className="h-3 w-3" />;
      case "high": return <AlertCircle className="h-3 w-3" />;
      case "medium": return <Clock className="h-3 w-3" />;
      default: return <CheckCircle className="h-3 w-3" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      "in-progress": "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending": return <Clock className="h-3 w-3" />;
      case "in-progress": return <AlertCircle className="h-3 w-3" />;
      case "resolved": return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "order": return <ShoppingCart className="h-3 w-3" />;
      case "store": return <Store className="h-3 w-3" />;
      case "product": return <Package className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
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

  const handleBulkUpdate = async (status) => {
    const selectedReports = filteredReports.filter(r => r.status !== status);
    if (selectedReports.length === 0) return;
    
    if (confirm(`Update ${selectedReports.length} reports to ${status}?`)) {
      for (const report of selectedReports) {
        await updateReportStatus(report.id, status);
      }
      alert(`${selectedReports.length} reports updated to ${status}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Flag size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">Reports Management</span>
              </div>
              <h1 className="text-3xl font-black">Manage Reports</h1>
              <p className="mt-1 text-purple-100">View, track, and respond to user reports</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchReports}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={() => handleBulkUpdate("resolved")}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <CheckCircle size={16} />
                Mark All Resolved
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <StatCard label="Total Reports" value={stats.total} icon={Flag} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="In Progress" value={stats.inProgress} icon={AlertCircle} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
          <StatCard label="Urgent" value={stats.urgent} icon={AlertCircle} color="text-red-600" bg="bg-red-50" />
          <StatCard label="High Priority" value={stats.highPriority} icon={AlertCircle} color="text-orange-600" bg="bg-orange-50" />
        </div>

        {/* Filters Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, subject, user, or email..."
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
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="order">Order Issue</option>
                  <option value="store">Store Issue</option>
                  <option value="product">Product Issue</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-20 text-center">
                      <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-20 text-center">
                      <Flag size={48} className="mx-auto text-slate-300" />
                      <p className="mt-3 text-slate-500">No reports found</p>
                      <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <p className="text-sm font-mono font-semibold text-purple-600">
                          #{report.id?.slice(0, 8)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-900">{report.userName || "Anonymous"}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{report.userEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-700 max-w-[200px] truncate">{report.subject}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize">
                          {getTypeIcon(report.type)}
                          {report.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getPriorityBadge(report.priority)}`}>
                          {getPriorityIcon(report.priority)}
                          {report.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {report.status === "in-progress" ? "In Progress" : report.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setReplyTo(report);
                              setReplyModal(true);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                            title="Send Reply"
                          >
                            <Send size={16} />
                          </button>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete"
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

          <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedReport(null)}>
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedReport(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition">
              <X size={20} />
            </button>

            <div className="relative h-28 bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                  <Flag size={28} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Report Details</h2>
                <p className="text-sm text-slate-500 mt-1">ID: {selectedReport.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                <div>
                  <p className="text-xs text-slate-500">User</p>
                  <p className="text-sm font-medium text-slate-900">{selectedReport.userName || "Anonymous"}</p>
                  <p className="text-xs text-slate-500 break-all">{selectedReport.userEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Submitted</p>
                  <p className="text-sm text-slate-900">{formatDate(selectedReport.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Type</p>
                  <p className="text-sm font-medium capitalize">{selectedReport.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Priority</p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getPriorityBadge(selectedReport.priority)}`}>
                    {selectedReport.priority}
                  </span>
                </div>
                {selectedReport.orderId && (
                  <div>
                    <p className="text-xs text-slate-500">Order ID</p>
                    <p className="text-sm text-purple-600 font-mono">#{selectedReport.orderId}</p>
                  </div>
                )}
                {selectedReport.storeId && (
                  <div>
                    <p className="text-xs text-slate-500">Store ID</p>
                    <p className="text-sm text-purple-600 font-mono">#{selectedReport.storeId}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Subject</h4>
                <p className="text-sm text-slate-700 p-3 bg-slate-50 rounded-lg">{selectedReport.subject}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
                <p className="text-sm text-slate-700 p-3 bg-slate-50 rounded-lg whitespace-pre-wrap">{selectedReport.description}</p>
              </div>

              {selectedReport.reply && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-blue-700 mb-2">Reply Sent</h4>
                  <p className="text-sm text-slate-700">{selectedReport.reply}</p>
                  <p className="text-xs text-slate-500 mt-2">Replied on: {formatDate(selectedReport.repliedAt)}</p>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {["pending", "in-progress", "resolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateReportStatus(selectedReport.id, status)}
                      disabled={updating}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        selectedReport.status === status
                          ? getStatusBadge(status)
                          : "bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-600"
                      }`}
                    >
                      {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setReplyTo(selectedReport);
                    setReplyModal(true);
                    setSelectedReport(null);
                  }}
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 font-semibold text-white hover:bg-purple-700 transition"
                >
                  Send Reply
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyModal && replyTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setReplyModal(false)}>
          <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Send Reply</h3>
                <button onClick={() => setReplyModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Replying to: <span className="font-medium text-slate-900">{replyTo.userName || replyTo.userEmail}</span>
              </p>
              <div className="mb-2 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Original Report:</p>
                <p className="text-sm text-slate-700">{replyTo.subject}</p>
              </div>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 resize-none"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setReplyModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  Send Reply
                </button>
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