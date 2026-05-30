// src/admin/pages/ManageSupport.jsx
import { useState, useEffect } from "react";
import {
  MessageCircle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  User,
  Mail,
  Calendar,
  AlertCircle,
  Send,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  Flag,
  Reply,
} from "lucide-react";

export default function ManageSupport() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyModal, setReplyModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, usersRes] = await Promise.all([
        fetch("http://localhost:5000/support_tickets"),
        fetch("http://localhost:5000/users"),
      ]);
      const ticketsData = await ticketsRes.json();
      const usersData = await usersRes.json();
      
      // Enrich tickets with user info and ensure replies array exists
      const enrichedTickets = ticketsData.map(ticket => ({
        ...ticket,
        replies: ticket.replies || [], // Ensure replies array exists
        user: usersData.find(u => u.id === ticket.userId || u.email === ticket.userEmail),
      }));
      
      setTickets(enrichedTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch support data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/support_tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus, 
          updatedAt: new Date().toISOString() 
        }),
      });
      
      if (response.ok) {
        await fetchData();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Failed to update ticket:", error);
      alert("Failed to update ticket status");
    }
  };

  const addReply = async (ticketId, reply) => {
    if (!reply.trim()) {
      alert("Please enter a reply message");
      return;
    }

    setSendingReply(true);
    
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      const existingReplies = ticket.replies || [];
      
      const newReply = {
        id: Date.now().toString(),
        message: reply,
        adminName: "Support Team",
        adminEmail: "admin@suuqhub.com",
        createdAt: new Date().toISOString(),
      };
      
      const response = await fetch(`http://localhost:5000/support_tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          replies: [...existingReplies, newReply],
          status: ticket.status === "closed" ? "in_progress" : (ticket.status || "in_progress"),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await fetchData();
        setReplyModal(false);
        setReplyText("");
        // Show success message
        alert("Reply sent successfully!");
      } else {
        throw new Error("Failed to add reply");
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
      alert("Failed to send reply. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!confirm("Delete this ticket? This action cannot be undone.")) return;
    try {
      const response = await fetch(`http://localhost:5000/support_tickets/${ticketId}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        await fetchData();
        if (selectedTicket?.id === ticketId) setSelectedTicket(null);
        alert("Ticket deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete ticket:", error);
      alert("Failed to delete ticket");
    }
  };

  const filteredTickets = () => {
    let filtered = tickets;
    
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    return filtered;
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in_progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    closed: tickets.filter(t => t.status === "closed").length,
    highPriority: tickets.filter(t => t.priority === "high").length,
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    };
    return styles[priority] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-yellow-100 text-yellow-700",
      in_progress: "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case "high": return <Flag size={12} className="text-red-500" />;
      case "medium": return <AlertCircle size={12} className="text-yellow-500" />;
      default: return <Clock size={12} className="text-green-500" />;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <MessageCircle size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">Support Management</span>
              </div>
              <h1 className="text-3xl font-black">Support Tickets</h1>
              <p className="mt-1 text-purple-100">Manage and respond to customer support requests</p>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <StatCard label="Total Tickets" value={stats.total} icon={MessageCircle} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Open" value={stats.open} icon={Clock} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="In Progress" value={stats.inProgress} icon={AlertCircle} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
          <StatCard label="Closed" value={stats.closed} icon={XCircle} color="text-gray-600" bg="bg-gray-100" />
          <StatCard label="High Priority" value={stats.highPriority} icon={Flag} color="text-red-600" bg="bg-red-50" />
        </div>

        {/* Filters Bar */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ticket ID, subject, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-400"
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
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
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
                </select>
              </>
            )}
          </div>
        </div>

        {/* Tickets Table */}
        <div className="overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Ticket ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Replies</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets().length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-20 text-center">
                      <MessageCircle size={48} className="mx-auto text-slate-300" />
                      <p className="mt-3 text-slate-500">No support tickets found</p>
                    </td>
                  </tr>
                ) : (
                  filteredTickets().map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-mono text-sm font-semibold text-purple-600">#{ticket.id?.slice(0, 12)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                            {ticket.user?.firstName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {ticket.user?.firstName} {ticket.user?.lastName || "Customer"}
                            </p>
                            <p className="text-xs text-slate-500">{ticket.user?.email}</p>
                          </div>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-800 font-medium max-w-xs truncate">{ticket.subject}</p>
                       </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(ticket.priority)}
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <select
                          value={ticket.status || "open"}
                          onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold cursor-pointer ${getStatusBadge(ticket.status)}`}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                       </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Reply size={12} />
                          {ticket.replies?.length || 0}
                        </span>
                       </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(ticket.createdAt)}
                       </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setReplyTo(ticket);
                              setReplyModal(true);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                            title="Send Reply"
                          >
                            <Send size={16} />
                          </button>
                          <button
                            onClick={() => deleteTicket(ticket.id)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <XCircle size={16} />
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
            Showing {filteredTickets().length} of {tickets.length} tickets
          </div>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedTicket(null)}>
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedTicket(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition">
              <X size={20} />
            </button>

            <div className="relative h-24 bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                  <MessageCircle size={26} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="px-6 pt-10 pb-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">Ticket Details</h2>
                <p className="text-sm text-purple-600 font-mono mt-1">{selectedTicket.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="text-sm font-medium text-slate-900">{selectedTicket.user?.firstName} {selectedTicket.user?.lastName}</p>
                  <p className="text-xs text-slate-500">{selectedTicket.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Priority</p>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status || "Open"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm text-slate-700">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                {selectedTicket.orderId && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Order ID</p>
                    <p className="text-sm text-purple-600 font-mono">{selectedTicket.orderId}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Subject</h3>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700">{selectedTicket.subject}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Original Message</h3>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>

              {/* Conversation Thread */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MessageCircle size={16} className="text-purple-600" />
                  Conversation Thread ({selectedTicket.replies?.length || 0} replies)
                </h3>
                
                {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
                  <div className="space-y-4">
                    {selectedTicket.replies.map((reply, idx) => (
                      <div key={idx} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">A</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-800">{reply.adminName || "Support Team"}</p>
                              <p className="text-xs text-blue-600">Admin</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">{formatDate(reply.createdAt)}</p>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap ml-8">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-center">
                    <AlertCircle size={24} className="mx-auto text-yellow-600 mb-2" />
                    <p className="text-sm text-yellow-700">No replies yet. Click "Send Reply" to respond to this ticket.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setReplyTo(selectedTicket);
                    setReplyModal(true);
                    setSelectedTicket(null);
                  }}
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 font-semibold text-white hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send Reply
                </button>
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
                Replying to: <span className="font-medium text-slate-900">{replyTo.user?.firstName || "Customer"}</span>
              </p>
              <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Original Ticket:</p>
                <p className="text-sm text-slate-700 font-medium">{replyTo.subject}</p>
              </div>
              <textarea
                rows={5}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here... The customer will see this response in their ticket."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setReplyModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addReply(replyTo.id, replyText)}
                  disabled={sendingReply || !replyText.trim()}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingReply ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Reply
                    </>
                  )}
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