// src/admin/pages/ManageUsers.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  Mail,
  Phone,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Shield,
  UserCheck,
  UserX,
  Clock,
  MapPin,
} from "lucide-react";

const USERS_API = "http://localhost:5000/users";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    status: "active",
    address: "",
    city: "Garissa",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(USERS_API);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setUserForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "user",
      status: "active",
      address: "",
      city: "Garissa",
    });
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingUser ? "PATCH" : "POST";
    const url = editingUser ? `${USERS_API}/${editingUser.id}` : USERS_API;

    const userData = {
      ...userForm,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
    };

    // Only include password if it's provided (for updates)
    if (!userForm.password && editingUser) {
      delete userData.password;
    }

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      await fetchUsers();
      setShowModal(false);
      resetForm();
      alert(editingUser ? "User updated successfully!" : "User added successfully!");
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("Failed to save user. Please try again.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUserForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "user",
      status: user.status || "active",
      address: user.address || "",
      city: user.city || "Garissa",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await fetch(`${USERS_API}/${id}`, { method: "DELETE" });
      await fetchUsers();
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user.");
    }
  };

  const toggleUserStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${USERS_API}/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    inactive: users.filter(u => u.status === "inactive").length,
    customers: users.filter(u => u.role === "user").length,
    admins: users.filter(u => u.role === "admin").length,
  };

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700"><Shield size={12} /> Admin</span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700"><User size={12} /> Customer</span>;
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700"><CheckCircle size={12} /> Active</span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700"><AlertCircle size={12} /> Inactive</span>;
  };

  const openAddModal = (e) => {
    e?.preventDefault();
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Users size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">User Management</span>
              </div>
              <h1 className="text-3xl font-black">Manage Users</h1>
              <p className="mt-1 text-purple-100">View, add, edit, and manage all customer accounts</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={fetchUsers}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-purple-600 transition hover:scale-105"
              >
                <Users size={18} />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total Users" value={stats.total} icon={Users} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Active Users" value={stats.active} icon={UserCheck} color="text-green-600" bg="bg-green-50" />
          <StatCard label="Inactive Users" value={stats.inactive} icon={UserX} color="text-red-600" bg="bg-red-50" />
          <StatCard label="Customers" value={stats.customers} icon={User} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Admins" value={stats.admins} icon={Shield} color="text-purple-600" bg="bg-purple-50" />
        </div>

        {/* Filters Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="button"
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
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Customers</option>
                  <option value="admin">Admins</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Joined</th>
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
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <Users size={48} className="mx-auto text-slate-300" />
                      <p className="mt-3 text-slate-500">No users found</p>
                      <button
                        type="button"
                        onClick={openAddModal}
                        className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white"
                      >
                        Add Your First User
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                            {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-600">{user.email}</p>
                        <p className="text-xs text-slate-400">{user.phone || "No phone"}</p>
                      </td>
                      <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user)}
                          className="cursor-pointer"
                        >
                          {getStatusBadge(user.status)}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                            title="Edit User"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            title="Delete User"
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
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{editingUser ? "Edit User" : "Add New User"}</h2>
                <p className="text-sm text-slate-500">Fill in the user details below</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-lg p-1 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">First Name</label>
                  <input
                    type="text"
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                    placeholder="John"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    value={userForm.lastName}
                    onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    {editingUser ? "Password (leave blank to keep current)" : "Password *"}
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder={editingUser ? "Enter new password" : "Create a password"}
                    required={!editingUser}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Address</label>
                  <input
                    type="text"
                    value={userForm.address}
                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    placeholder="Street address"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    value={userForm.city}
                    onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                    placeholder="Garissa"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  <Save size={16} />
                  {editingUser ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedUser(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setSelectedUser(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg">
              <X size={20} />
            </button>

            <div className="relative h-28 bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                  <span className="text-3xl font-bold text-purple-600">
                    {selectedUser.firstName ? selectedUser.firstName.charAt(0).toUpperCase() : selectedUser.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 pt-12 pb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <p className="text-sm text-purple-600">{selectedUser.email}</p>
                <div className="mt-2 flex justify-center gap-2">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-purple-500" />
                  <span className="text-slate-600">{selectedUser.phone || "No phone number"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-purple-500" />
                  <span className="text-slate-600">{selectedUser.city || "No address"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-purple-500" />
                  <span className="text-slate-600">Joined: {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-purple-500" />
                  <span className="text-slate-600">ID: {selectedUser.id}</span>
                </div>
              </div>

              {selectedUser.address && (
                <div className="mb-4">
                  <p className="text-sm text-slate-600"><strong>Address:</strong> {selectedUser.address}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    handleEdit(selectedUser);
                  }}
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 font-semibold text-white hover:bg-purple-700 transition"
                >
                  Edit User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    handleDelete(selectedUser.id);
                  }}
                  className="flex-1 rounded-xl border border-red-200 py-2.5 font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  Delete User
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