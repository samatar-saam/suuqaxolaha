// src/admin/pages/ManageStores.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Store,
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
  MapPin,
  Clock,
  Users,
  Package,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";

const STORES_API = "http://localhost:5000/sellers";
const PRODUCTS_API = "http://localhost:5000/products";
const ORDERS_API = "http://localhost:5000/orders";

export default function ManageStores() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [storeForm, setStoreForm] = useState({
    business_name: "",
    business_email: "",
    phone: "",
    logo_url: "",
    description: "",
    category: "",
    address: "",
    city: "",
    opening_hours: "",
    status: "active",
    is_verified: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [storesRes, productsRes, ordersRes] = await Promise.all([
        fetch(STORES_API),
        fetch(PRODUCTS_API),
        fetch(ORDERS_API),
      ]);
      setStores(await storesRes.json());
      setProducts(await productsRes.json());
      setOrders(await ordersRes.json());
    } catch (error) {
      console.error("Failed to load stores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setStoreForm({
      business_name: "",
      business_email: "",
      phone: "",
      logo_url: "",
      description: "",
      category: "",
      address: "",
      city: "",
      opening_hours: "",
      status: "active",
      is_verified: false,
    });
    setEditingStore(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingStore ? "PATCH" : "POST";
    const url = editingStore ? `${STORES_API}/${editingStore.id}` : STORES_API;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...storeForm,
          createdAt: editingStore ? editingStore.createdAt : new Date().toISOString(),
        }),
      });
      await fetchData();
      setShowModal(false);
      resetForm();
      alert(editingStore ? "Store updated successfully!" : "Store added successfully!");
    } catch (error) {
      console.error("Failed to save store:", error);
      alert("Failed to save store. Please try again.");
    }
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setStoreForm({
      business_name: store.business_name || "",
      business_email: store.business_email || "",
      phone: store.phone || "",
      logo_url: store.logo_url || "",
      description: store.description || "",
      category: store.category || "",
      address: store.address || "",
      city: store.city || "",
      opening_hours: store.opening_hours || "",
      status: store.status || "active",
      is_verified: store.is_verified || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this store? This will also remove all associated products.")) return;
    try {
      await fetch(`${STORES_API}/${id}`, { method: "DELETE" });
      await fetchData();
      alert("Store deleted successfully!");
    } catch (error) {
      console.error("Failed to delete store:", error);
      alert("Failed to delete store.");
    }
  };

  const toggleVerification = async (store) => {
    try {
      await fetch(`${STORES_API}/${store.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_verified: !store.is_verified }),
      });
      await fetchData();
    } catch (error) {
      console.error("Failed to update verification:", error);
    }
  };

  const toggleStatus = async (store) => {
    const newStatus = store.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${STORES_API}/${store.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchData();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStoreStats = (storeId) => {
    const storeProducts = products.filter(p => p.sellerId === storeId || p.seller === storeId);
    const storeOrders = orders.filter(o => o.sellerId === storeId);
    const totalProducts = storeProducts.length;
    const totalSales = storeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = storeOrders.length;
    return { totalProducts, totalSales, totalOrders };
  };

  const filteredStores = useMemo(() => {
    let filtered = stores;
    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.business_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(store => store.status === statusFilter);
    }
    if (verificationFilter !== "all") {
      const isVerified = verificationFilter === "verified";
      filtered = filtered.filter(store => store.is_verified === isVerified);
    }
    return filtered;
  }, [stores, searchTerm, statusFilter, verificationFilter]);

  const stats = {
    total: stores.length,
    active: stores.filter(s => s.status === "active").length,
    inactive: stores.filter(s => s.status === "inactive").length,
    verified: stores.filter(s => s.is_verified).length,
    unverified: stores.filter(s => !s.is_verified).length,
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700"><CheckCircle size={12} /> Active</span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700"><AlertCircle size={12} /> Inactive</span>;
  };

  const getVerificationBadge = (isVerified) => {
    if (isVerified) {
      return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700"><CheckCircle size={12} /> Verified</span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700"><AlertCircle size={12} /> Pending</span>;
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
                <Store size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">Store Management</span>
              </div>
              <h1 className="text-3xl font-black">Manage Stores</h1>
              <p className="mt-1 text-purple-100">View, add, edit, and manage all vendor stores</p>
            </div>
            <div className="flex gap-3">
              <button onClick={fetchData} className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30">
                <RefreshCw size={16} /> Refresh
              </button>
              <button onClick={openAddModal} className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-purple-600 transition hover:scale-105">
                <Store size={18} /> Add Store
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total Stores" value={stats.total} icon={Store} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Active Stores" value={stats.active} icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
          <StatCard label="Inactive Stores" value={stats.inactive} icon={AlertCircle} color="text-red-600" bg="bg-red-50" />
          <StatCard label="Verified" value={stats.verified} icon={Shield} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Pending Verification" value={stats.unverified} icon={Clock} color="text-orange-600" bg="bg-orange-50" />
        </div>

        {/* Filters Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search stores by name, email, or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-400" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-purple-50">
              <Filter size={14} /> Filters {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showFilters && (
              <>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                  <option value="all">All Stores</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Stores Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Store</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Products/Sales</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Verification</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="6" className="py-20 text-center"><div className="flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div></div></td></tr>
                ) : filteredStores.length === 0 ? (
                  <tr><td colSpan="6" className="py-20 text-center"><Store size={48} className="mx-auto text-slate-300" /><p className="mt-3 text-slate-500">No stores found</p><button onClick={openAddModal} className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white">Add Your First Store</button></td></tr>
                ) : (
                  filteredStores.map((store) => {
                    const storeStats = getStoreStats(store.id);
                    return (
                      <tr key={store.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                              {store.business_name ? store.business_name.charAt(0).toUpperCase() : "S"}
                            </div>
                            <div><p className="font-semibold text-slate-900">{store.business_name}</p><p className="text-xs text-slate-400">{store.category || "General Store"}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><p className="text-sm text-slate-600">{store.business_email}</p><p className="text-xs text-slate-400">{store.phone}</p></td>
                        <td className="px-4 py-3"><p className="text-sm font-semibold text-purple-600">{storeStats.totalProducts} products</p><p className="text-xs text-slate-400">KSh {storeStats.totalSales.toLocaleString()} sales</p></td>
                        <td className="px-4 py-3"><button onClick={() => toggleStatus(store)} className="cursor-pointer">{getStatusBadge(store.status)}</button></td>
                        <td className="px-4 py-3"><button onClick={() => toggleVerification(store)} className="cursor-pointer">{getVerificationBadge(store.is_verified)}</button></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedStore(store)} className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600" title="View Details"><Eye size={16} /></button>
                            <button onClick={() => handleEdit(store)} className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600" title="Edit Store"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(store.id)} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Delete Store"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">Showing {filteredStores.length} of {stores.length} stores</div>
        </div>
      </div>

      {/* Add/Edit Store Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div><h2 className="text-xl font-bold text-slate-900">{editingStore ? "Edit Store" : "Add New Store"}</h2><p className="text-sm text-slate-500">Fill in the store details below</p></div>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 hover:bg-slate-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2"><label className="mb-1 block text-sm font-semibold text-slate-700">Business Name *</label><input type="text" value={storeForm.business_name} onChange={(e) => setStoreForm({ ...storeForm, business_name: e.target.value })} placeholder="e.g., TechHub Electronics" required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="mb-1 block text-sm font-semibold text-slate-700">Email *</label><input type="email" value={storeForm.business_email} onChange={(e) => setStoreForm({ ...storeForm, business_email: e.target.value })} placeholder="store@example.com" required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="mb-1 block text-sm font-semibold text-slate-700">Phone *</label><input type="tel" value={storeForm.phone} onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })} placeholder="+254 700 000 000" required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="mb-1 block text-sm font-semibold text-slate-700">Category</label><input type="text" value={storeForm.category} onChange={(e) => setStoreForm({ ...storeForm, category: e.target.value })} placeholder="e.g., Electronics, Fashion" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="mb-1 block text-sm font-semibold text-slate-700">Address</label><input type="text" value={storeForm.address} onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} placeholder="Street address" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="mb-1 block text-sm font-semibold text-slate-700">City</label><input type="text" value={storeForm.city} onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })} placeholder="City name" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="mb-1 block text-sm font-semibold text-slate-700">Opening Hours</label><input type="text" value={storeForm.opening_hours} onChange={(e) => setStoreForm({ ...storeForm, opening_hours: e.target.value })} placeholder="e.g., 9:00 AM - 9:00 PM" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="mb-1 block text-sm font-semibold text-slate-700">Status</label><select value={storeForm.status} onChange={(e) => setStoreForm({ ...storeForm, status: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
                <div className="md:col-span-2"><label className="mb-1 block text-sm font-semibold text-slate-700">Logo URL</label><input type="url" value={storeForm.logo_url} onChange={(e) => setStoreForm({ ...storeForm, logo_url: e.target.value })} placeholder="https://example.com/logo.png" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" /></div>
                <div className="md:col-span-2"><label className="mb-1 block text-sm font-semibold text-slate-700">Description</label><textarea rows={3} value={storeForm.description} onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })} placeholder="Describe the store, products, and services..." className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" /></div>
                <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <input type="checkbox" checked={storeForm.is_verified} onChange={(e) => setStoreForm({ ...storeForm, is_verified: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Mark as Verified Store</span>
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"><Save size={16} /> {editingStore ? "Update Store" : "Add Store"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Store Details Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedStore(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedStore(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg"><X size={20} /></button>
            <div className="relative h-28 bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg"><span className="text-3xl font-bold text-purple-600">{selectedStore.business_name ? selectedStore.business_name.charAt(0).toUpperCase() : "S"}</span></div></div>
            </div>
            <div className="px-6 pt-12 pb-6">
              <div className="text-center mb-6"><h2 className="text-2xl font-bold text-slate-900">{selectedStore.business_name}</h2><p className="text-sm text-purple-600">{selectedStore.category || "General Store"}</p><div className="mt-2 flex justify-center gap-2">{getStatusBadge(selectedStore.status)}{getVerificationBadge(selectedStore.is_verified)}</div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-purple-500" /><span className="text-slate-600">{selectedStore.business_email}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-purple-500" /><span className="text-slate-600">{selectedStore.phone}</span></div>
                <div className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-purple-500" /><span className="text-slate-600">{selectedStore.address}, {selectedStore.city}</span></div>
                <div className="flex items-center gap-2 text-sm"><Clock size={14} className="text-purple-500" /><span className="text-slate-600">{selectedStore.opening_hours}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-purple-50 rounded-xl"><Package size={18} className="mx-auto text-purple-500 mb-1" /><p className="text-xs text-slate-500">Products</p><p className="font-bold text-slate-900">{getStoreStats(selectedStore.id).totalProducts}</p></div>
                <div className="text-center p-3 bg-green-50 rounded-xl"><DollarSign size={18} className="mx-auto text-green-500 mb-1" /><p className="text-xs text-slate-500">Sales</p><p className="font-bold text-slate-900">KSh {getStoreStats(selectedStore.id).totalSales.toLocaleString()}</p></div>
                <div className="text-center p-3 bg-blue-50 rounded-xl"><Users size={18} className="mx-auto text-blue-500 mb-1" /><p className="text-xs text-slate-500">Orders</p><p className="font-bold text-slate-900">{getStoreStats(selectedStore.id).totalOrders}</p></div>
              </div>
              {selectedStore.description && <div className="mb-4"><p className="text-sm text-slate-600"><strong>Description:</strong> {selectedStore.description}</p></div>}
              <div className="flex gap-3">
                <button onClick={() => { setSelectedStore(null); handleEdit(selectedStore); }} className="flex-1 rounded-xl bg-purple-600 py-2.5 font-semibold text-white hover:bg-purple-700 transition">Edit Store</button>
                <button onClick={() => { setSelectedStore(null); handleDelete(selectedStore.id); }} className="flex-1 rounded-xl border border-red-200 py-2.5 font-semibold text-red-600 hover:bg-red-50 transition">Delete Store</button>
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
        <div className={`rounded-lg ${bg} p-2`}><Icon size={18} className={color} /></div>
        <span className="text-2xl font-black text-slate-900">{value}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}