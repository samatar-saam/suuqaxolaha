// src/users/pages/UserTickets.jsx
import { useState, useEffect } from "react";
import {
  MessageCircle,
  Eye,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Ticket,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.id) {
      setCurrentUser(user);
      fetchUserTickets(user);
    } else {
      setError("Please login to view your tickets");
      setLoading(false);
    }
  }, []);

  const fetchUserTickets = async (user, showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/support_tickets");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allTickets = await response.json();
      
      // Filter tickets for current user by userId or userEmail
      const userTickets = allTickets.filter(ticket => {
        // Handle different possible ID types (number vs string)
        const userIdMatch = ticket.userId == user.id; // Use == for type coercion
        const emailMatch = ticket.userEmail === user.email;
        return userIdMatch || emailMatch;
      });
      
      // Ensure each ticket has a replies array
      const ticketsWithReplies = userTickets.map(ticket => ({
        ...ticket,
        replies: ticket.replies || [],
        status: ticket.status || "open",
        priority: ticket.priority || "medium",
      }));
      
      // Sort by most recent first
      const sortedTickets = ticketsWithReplies.sort((a, b) => 
        new Date(b.createdAt || b.createdAt) - new Date(a.createdAt || a.createdAt)
      );
      
      setTickets(sortedTickets);
      
      if (sortedTickets.length === 0) {
        setError("No tickets found");
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError("Failed to load tickets. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-yellow-100 text-yellow-700",
      in_progress: "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
    };
    return styles[status] || "bg-yellow-100 text-yellow-700";
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    };
    return styles[priority] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "resolved": return <CheckCircle size={14} className="text-green-600" />;
      case "closed": return <XCircle size={14} className="text-gray-600" />;
      case "in_progress": return <AlertCircle size={14} className="text-blue-600" />;
      default: return <Clock size={14} className="text-yellow-600" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error && tickets.length === 0 && error !== "No tickets found") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Tickets</h2>
        <p className="text-slate-500 mb-4">{error}</p>
        <button
          onClick={() => currentUser && fetchUserTickets(currentUser)}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Ticket size={24} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Support Tickets</h1>
              <p className="text-sm text-slate-500 mt-1">
                Track and manage your support requests
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => currentUser && fetchUserTickets(currentUser, true)}
              disabled={refreshing}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-purple-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={`inline mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link
              to="/dashboard/support"
              className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
            >
              New Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Open Tickets</span>
            <Clock size={18} className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {tickets.filter(t => t.status === "open" || t.status === "in_progress").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Resolved</span>
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {tickets.filter(t => t.status === "resolved").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total Tickets</span>
            <MessageCircle size={18} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{tickets.length}</p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-900">Your Support History</h3>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 mb-4">You haven't submitted any support tickets yet</p>
            <Link
              to="/dashboard/support"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Create Your First Ticket
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className="p-4 hover:bg-slate-50 transition cursor-pointer" 
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-purple-600">
                        {ticket.id?.length > 20 ? `${ticket.id.substring(0, 20)}...` : ticket.id}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status?.replace("_", " ") || "Open"}
                      </span>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      {ticket.replies && ticket.replies.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-600">
                          <MessageCircle size={10} />
                          {ticket.replies.length} repl{ticket.replies.length === 1 ? 'y' : 'ies'}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">{ticket.subject}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">{ticket.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>Created: {formatDate(ticket.createdAt)}</span>
                      {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                        <span>Updated: {formatDate(ticket.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-400 ml-4 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedTicket(null)}>
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Ticket Details</h2>
                <p className="text-xs text-purple-600 font-mono">{selectedTicket.id}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="rounded-full p-2 hover:bg-slate-100">
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(selectedTicket.status)}`}>
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status?.replace("_", " ") || "Open"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Priority</p>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm text-slate-700">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="text-sm text-slate-700">{formatDate(selectedTicket.updatedAt || selectedTicket.createdAt)}</p>
                </div>
                {selectedTicket.orderId && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Order ID</p>
                    <p className="text-sm text-purple-600 font-mono">{selectedTicket.orderId}</p>
                  </div>
                )}
              </div>

              {/* Original Message */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Your Message</h3>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>

              {/* Admin Replies */}
              {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <MessageCircle size={16} className="text-purple-600" />
                    Support Team Responses ({selectedTicket.replies.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedTicket.replies.map((reply, idx) => (
                      <div key={idx} className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">S</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-green-800">{reply.adminName || "Support Team"}</p>
                              <p className="text-xs text-green-600">Admin</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">{formatDate(reply.createdAt)}</p>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap ml-9">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Replies Message */}
              {(!selectedTicket.replies || selectedTicket.replies.length === 0) && 
               selectedTicket.status !== "resolved" && 
               selectedTicket.status !== "closed" && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-center">
                  <Clock size={24} className="mx-auto text-yellow-600 mb-2" />
                  <p className="text-sm text-yellow-700">
                    Our support team is reviewing your ticket and will respond soon.
                  </p>
                </div>
              )}

              {/* Resolved/Closed Message */}
              {(selectedTicket.status === "resolved" || selectedTicket.status === "closed") && 
               (!selectedTicket.replies || selectedTicket.replies.length === 0) && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                  <CheckCircle size={24} className="mx-auto text-green-600 mb-2" />
                  <p className="text-sm text-green-700">
                    This ticket has been {selectedTicket.status}. If you have further questions, please create a new ticket.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Link
                  to="/dashboard/support"
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 text-center font-semibold text-white hover:bg-purple-700 transition"
                >
                  Create New Ticket
                </Link>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
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