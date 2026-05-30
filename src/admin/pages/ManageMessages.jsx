// src/admin/pages/ManageMessages.jsx
import { useState, useEffect } from "react";
import {
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  User,
  Calendar,
  Trash2,
  Search,
} from "lucide-react";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:5000/messages");
      const data = await response.json();
      setMessages(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchMessages();
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm("Delete this message? This action cannot be undone.")) return;
    try {
      await fetch(`http://localhost:5000/messages/${messageId}`, {
        method: "DELETE",
      });
      await fetchMessages();
      if (selectedMessage?.id === messageId) setSelectedMessage(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: messages.length,
    unread: messages.filter((m) => m.status === "unread").length,
    read: messages.filter((m) => m.status === "read").length,
    today: messages.filter(
      (m) => new Date(m.createdAt).toDateString() === new Date().toDateString()
    ).length,
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
          <p className="mt-4 text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Mail size={24} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
              <p className="text-sm text-slate-500 mt-1">
                Messages from the contact form
              </p>
            </div>
          </div>
          <button
            onClick={fetchMessages}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-purple-50"
          >
            <RefreshCw size={14} className="inline mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Total Messages</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Unread</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Read</p>
          <p className="text-2xl font-bold text-green-600">{stats.read}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Today</p>
          <p className="text-2xl font-bold text-purple-600">{stats.today}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-400"
        />
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">From</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Mail size={48} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">No messages found</p>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                    <td className="px-4 py-3">
                      {msg.status === "unread" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                          <Mail size={10} />
                          Unread
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle size={10} />
                          Read
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{msg.name}</p>
                        <p className="text-xs text-slate-500">{msg.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-800 max-w-xs truncate">{msg.subject || "No subject"}</p>
                      <p className="text-xs text-slate-400 truncate">{msg.message?.substring(0, 50)}...</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(msg.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessage(msg);
                          }}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(msg.id);
                          }}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
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
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedMessage(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Message Details</h2>
              <button onClick={() => setSelectedMessage(null)} className="rounded-full p-2 hover:bg-slate-100">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500">From</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedMessage.name}</p>
                  <p className="text-xs text-slate-500">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="text-sm text-slate-700">{formatDate(selectedMessage.createdAt)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Subject</p>
                  <p className="text-sm font-medium text-slate-900">{selectedMessage.subject || "No subject"}</p>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-xs text-slate-500 mb-1">Message</p>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    updateMessageStatus(selectedMessage.id, "read");
                    setSelectedMessage(null);
                  }}
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 font-semibold text-white hover:bg-purple-700"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
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