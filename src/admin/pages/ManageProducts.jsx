// src/admin/pages/ManageProducts.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Package,
  CheckCircle2,
  AlertCircle,
  ImagePlus,
  Save,
  RefreshCw,
  Filter,
  ArrowUpDown,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Truck,
  Star,
} from "lucide-react";

const PRODUCTS_API = "http://localhost:5000/products";
const CATEGORIES_API = "http://localhost:5000/categories";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    oldPrice: "",
    image: "",
    description: "",
    stock: 1,
    status: "active",
    featured: false,
    sku: "",
    weight: "",
    dimensions: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(PRODUCTS_API),
        fetch(CATEGORIES_API),
      ]);
      setProducts(await productsRes.json());
      setCategories(await categoriesRes.json());
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setProductForm({
      name: "",
      category: "",
      subcategory: "",
      price: "",
      oldPrice: "",
      image: "",
      description: "",
      stock: 1,
      status: "active",
      featured: false,
      sku: "",
      weight: "",
      dimensions: "",
    });
    setEditingProduct(null);
    setFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingProduct ? "PATCH" : "POST";
    const url = editingProduct ? `${PRODUCTS_API}/${editingProduct.id}` : PRODUCTS_API;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...productForm,
        price: Number(productForm.price),
        oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
        stock: Number(productForm.stock),
        createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      }),
    });

    await fetchData();
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      image: product.image || "",
      description: product.description || "",
      stock: product.stock || 1,
      status: product.status || "active",
      featured: product.featured || false,
      sku: product.sku || "",
      weight: product.weight || "",
      dimensions: product.dimensions || "",
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This action cannot be undone.")) return;
    await fetch(`${PRODUCTS_API}/${id}`, { method: "DELETE" });
    await fetchData();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProducts.length} products?`)) return;
    for (const id of selectedProducts) {
      await fetch(`${PRODUCTS_API}/${id}`, { method: "DELETE" });
    }
    await fetchData();
    setSelectedProducts([]);
  };

  const handleBulkStatus = async (status) => {
    for (const id of selectedProducts) {
      await fetch(`${PRODUCTS_API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    }
    await fetchData();
    setSelectedProducts([]);
  };

  const toggleStatus = async (product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    await fetch(`${PRODUCTS_API}/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await fetchData();
  };

  const toggleSelect = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === "price") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [products, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === "active").length,
    inactive: products.filter(p => p.status === "inactive").length,
    lowStock: products.filter(p => p.stock < 10).length,
    featured: products.filter(p => p.featured).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Package size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">Product Management</span>
              </div>
              <h1 className="text-3xl font-black">Manage Products</h1>
              <p className="mt-1 text-purple-100">Add, edit, and manage all products in your marketplace</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchData}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setFormOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-purple-600 transition hover:scale-105"
              >
                <Plus size={18} />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <StatCard label="Total Products" value={stats.total} icon={Package} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Active" value={stats.active} icon={CheckCircle2} color="text-green-600" bg="bg-green-50" />
          <StatCard label="Inactive" value={stats.inactive} icon={AlertCircle} color="text-red-600" bg="bg-red-50" />
          <StatCard label="Low Stock" value={stats.lowStock} icon={AlertCircle} color="text-orange-600" bg="bg-orange-50" />
          <StatCard label="Featured" value={stats.featured} icon={Star} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="Inventory Value" value={`KSh ${(stats.totalValue / 1000).toFixed(0)}K`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        </div>

        {/* Filters Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name, category, or SKU..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                  <ArrowUpDown size={14} className="text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm outline-none"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                    <option value="stock">Sort by Stock</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="rounded p-1 hover:bg-slate-100"
                  >
                    {sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </>
            )}

            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-slate-600">{selectedProducts.length} selected</span>
                <select
                  value={bulkAction}
                  onChange={(e) => {
                    const action = e.target.value;
                    if (action === "delete") handleBulkDelete();
                    if (action === "active") handleBulkStatus("active");
                    if (action === "inactive") handleBulkStatus("inactive");
                    setBulkAction("");
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none"
                >
                  <option value="">Bulk Actions</option>
                  <option value="active">Set Active</option>
                  <option value="inactive">Set Inactive</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Product Form Modal */}
        {formOpen && (
          <ProductForm
            data={productForm}
            setData={setProductForm}
            editing={editingProduct}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            categories={categories}
          />
        )}

        {/* Products Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={selectAll}
                      className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Actions</th>
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
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <Package size={48} className="mx-auto text-slate-300" />
                      <p className="mt-3 text-slate-500">No products found</p>
                      <button
                        onClick={() => setFormOpen(true)}
                        className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white"
                      >
                        Add Your First Product
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="h-4 w-4 rounded border-slate-300 text-purple-600"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "https://via.placeholder.com/40"}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{product.name}</p>
                            {product.sku && <p className="text-xs text-slate-400">SKU: {product.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{product.category}</td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-purple-600">KSh {product.price?.toLocaleString()}</p>
                        {product.oldPrice && <p className="text-xs text-slate-400 line-through">KSh {product.oldPrice}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${product.stock < 10 ? "text-red-600" : "text-slate-600"}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStatus(product)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                            product.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.status === "active" ? <Eye size={12} /> : <EyeOff size={12} />}
                          {product.status}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
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

          <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>
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

function ProductForm({ data, setData, editing, onSubmit, onCancel, categories }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{editing ? "Edit Product" : "Add New Product"}</h2>
            <p className="text-sm text-slate-500">Fill in the product details below</p>
          </div>
          <button onClick={onCancel} className="rounded-lg p-1 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Product Name *</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="e.g., Wireless Headphones"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Category *</label>
              <select
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              >
                <option value="">Select Category</option>
                {categories.filter(c => c.status === "active").map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Subcategory</label>
              <input
                type="text"
                value={data.subcategory}
                onChange={(e) => setData({ ...data, subcategory: e.target.value })}
                placeholder="e.g., Audio Accessories"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Price (KSh) *</label>
              <input
                type="number"
                value={data.price}
                onChange={(e) => setData({ ...data, price: e.target.value })}
                placeholder="4999"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Old Price (Optional)</label>
              <input
                type="number"
                value={data.oldPrice}
                onChange={(e) => setData({ ...data, oldPrice: e.target.value })}
                placeholder="6499"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Stock Quantity *</label>
              <input
                type="number"
                value={data.stock}
                onChange={(e) => setData({ ...data, stock: e.target.value })}
                placeholder="100"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">SKU (Optional)</label>
              <input
                type="text"
                value={data.sku}
                onChange={(e) => setData({ ...data, sku: e.target.value })}
                placeholder="PROD-001"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Image URL</label>
              <input
                type="url"
                value={data.image}
                onChange={(e) => setData({ ...data, image: e.target.value })}
                placeholder="https://example.com/product-image.jpg"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
              <textarea
                rows={4}
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Detailed product description..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
              <select
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={data.featured}
                onChange={(e) => setData({ ...data, featured: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-purple-600"
              />
              <span className="text-sm font-medium text-slate-700">Feature this product</span>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              <Save size={16} />
              {editing ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}