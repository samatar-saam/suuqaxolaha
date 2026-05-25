import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Eye,
  EyeOff,
  Grid2X2,
  Package,
  CheckCircle2,
  AlertCircle,
  ImagePlus,
  Save,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

const CATEGORIES_API = "http://localhost:5000/categories";
const PRODUCTS_API = "http://localhost:5000/products";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    icon: "",
    status: "active",
    featured: false,
    sortOrder: 1,
  });

  const [productFormData, setProductFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    oldPrice: "",
    image: "",
    description: "",
    stock: 1,
    status: "active",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(CATEGORIES_API);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(PRODUCTS_API);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const createSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      icon: "",
      status: "active",
      featured: false,
      sortOrder: 1,
    });
    setEditingCategory(null);
    setFormOpen(false);
  };

  const resetProductForm = () => {
    setProductFormData({
      name: "",
      category: "",
      subcategory: "",
      price: "",
      oldPrice: "",
      image: "",
      description: "",
      stock: 1,
      status: "active",
    });
    setEditingProduct(null);
    setProductFormOpen(false);
  };

  const handleCategoryNameChange = (value) => {
    setCategoryFormData({
      ...categoryFormData,
      name: value,
      slug: createSlug(value),
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const method = editingCategory ? "PATCH" : "POST";
    const url = editingCategory ? `${CATEGORIES_API}/${editingCategory.id}` : CATEGORIES_API;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...categoryFormData,
          sortOrder: Number(categoryFormData.sortOrder),
        }),
      });
      await fetchCategories();
      resetCategoryForm();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const method = editingProduct ? "PATCH" : "POST";
    const url = editingProduct ? `${PRODUCTS_API}/${editingProduct.id}` : PRODUCTS_API;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productFormData,
          price: Number(productFormData.price),
          oldPrice: productFormData.oldPrice ? Number(productFormData.oldPrice) : null,
          stock: Number(productFormData.stock),
        }),
      });
      await fetchProducts();
      resetProductForm();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`${PRODUCTS_API}/${id}`, { method: "DELETE" });
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await fetch(`${CATEGORIES_API}/${id}`, { method: "DELETE" });
      await fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) => {
        const matchesSearch = category.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || category.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  }, [categories, searchTerm, statusFilter]);

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === "active").length;
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Manage Store
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create and manage categories and products
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setActiveTab("categories");
                resetCategoryForm();
                setFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-purple-700"
            >
              <Plus size={18} />
              Add Category
            </button>

            <button
              onClick={() => {
                setActiveTab("products");
                resetProductForm();
                setProductFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-700"
            >
              <ShoppingBag size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 text-sm font-bold transition ${
              activeTab === "categories"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-slate-500 hover:text-purple-600"
            }`}
          >
            Categories ({totalCategories})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 text-sm font-bold transition ${
              activeTab === "products"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-slate-500 hover:text-purple-600"
            }`}
          >
            Products ({totalProducts})
          </button>
        </div>

        {/* Stats Cards */}
        {activeTab === "categories" ? (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <StatCard label="Total Categories" value={totalCategories} icon={Grid2X2} color="text-purple-600" />
            <StatCard label="Active Categories" value={activeCategories} icon={CheckCircle2} color="text-green-600" />
            <StatCard label="Inactive Categories" value={totalCategories - activeCategories} icon={AlertCircle} color="text-red-600" />
          </div>
        ) : (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <StatCard label="Total Products" value={totalProducts} icon={Package} color="text-purple-600" />
            <StatCard label="Active Products" value={activeProducts} icon={CheckCircle2} color="text-green-600" />
            <StatCard label="Inactive Products" value={totalProducts - activeProducts} icon={AlertCircle} color="text-red-600" />
          </div>
        )}

        {/* Category Form Modal */}
        {formOpen && activeTab === "categories" && (
          <CategoryForm
            categoryFormData={categoryFormData}
            editingCategory={editingCategory}
            handleCategoryNameChange={handleCategoryNameChange}
            setCategoryFormData={setCategoryFormData}
            handleCategorySubmit={handleCategorySubmit}
            resetCategoryForm={resetCategoryForm}
          />
        )}

        {/* Product Form Modal */}
        {productFormOpen && activeTab === "products" && (
          <ProductForm
            productFormData={productFormData}
            editingProduct={editingProduct}
            setProductFormData={setProductFormData}
            handleProductSubmit={handleProductSubmit}
            resetProductForm={resetProductForm}
            categories={categories}
          />
        )}

        {/* Categories List */}
        {activeTab === "categories" && (
          <CategoriesList
            filteredCategories={filteredCategories}
            loading={loading}
            handleEdit={setEditingCategory}
            handleDelete={handleDeleteCategory}
            setCategoryFormData={setCategoryFormData}
            setFormOpen={setFormOpen}
            setEditingCategory={setEditingCategory}
          />
        )}

        {/* Products List */}
        {activeTab === "products" && (
          <ProductsList
            products={products}
            loading={loading}
            handleEdit={setEditingProduct}
            handleDelete={handleDeleteProduct}
            setProductFormData={setProductFormData}
            setProductFormOpen={setProductFormOpen}
            setEditingProduct={setEditingProduct}
            categories={categories}
          />
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-950">{value}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <Icon size={23} className={color} />
        </div>
      </div>
    </div>
  );
}

function CategoryForm({ categoryFormData, editingCategory, handleCategoryNameChange, setCategoryFormData, handleCategorySubmit, resetCategoryForm }) {
  return (
    <section className="mb-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            {editingCategory ? "Edit Category" : "Create New Category"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">This category will appear on the customer categories page.</p>
        </div>
        <button onClick={resetCategoryForm} className="rounded-2xl p-3 text-slate-500 hover:bg-slate-100">
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleCategorySubmit} className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">Category Name</label>
            <input type="text" placeholder="Electronics" value={categoryFormData.name} onChange={(e) => handleCategoryNameChange(e.target.value)} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">Slug</label>
            <input type="text" placeholder="electronics" value={categoryFormData.slug} onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: createSlug(e.target.value) })} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500" />
          </div>
          {/* Add other category fields */}
        </div>
        <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-700">
            <Save size={18} />
            {editingCategory ? "Update Category" : "Save Category"}
          </button>
        </div>
      </form>
    </section>
  );
}

function ProductForm({ productFormData, editingProduct, setProductFormData, handleProductSubmit, resetProductForm, categories }) {
  return (
    <section className="mb-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Products will appear in the customer categories page.</p>
        </div>
        <button onClick={resetProductForm} className="rounded-2xl p-3 text-slate-500 hover:bg-slate-100">
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleProductSubmit} className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-black text-slate-700">Product Name</label>
            <input type="text" placeholder="Wireless Headphones" value={productFormData.name} onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">Category</label>
            <select value={productFormData.category} onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500">
              <option value="">Select Category</option>
              {categories.filter(c => c.status === "active").map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">Subcategory</label>
            <input type="text" placeholder="Electronics Accessories" value={productFormData.subcategory} onChange={(e) => setProductFormData({ ...productFormData, subcategory: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">Price (KSh)</label>
            <input type="number" placeholder="4999" value={productFormData.price} onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">Old Price (Optional)</label>
            <input type="number" placeholder="6499" value={productFormData.oldPrice} onChange={(e) => setProductFormData({ ...productFormData, oldPrice: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">Stock Quantity</label>
            <input type="number" placeholder="1" value={productFormData.stock} onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-black text-slate-700">Image URL</label>
            <input type="url" placeholder="https://example.com/product-image.jpg" value={productFormData.image} onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-black text-slate-700">Description</label>
            <textarea rows="3" placeholder="Product description..." value={productFormData.description} onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })} className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">Status</label>
            <select value={productFormData.status} onChange={(e) => setProductFormData({ ...productFormData, status: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <div className="flex h-44 items-center justify-center bg-slate-100">
              {productFormData.image ? (
                <img src={productFormData.image} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={42} className="text-slate-400" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-black text-slate-950">{productFormData.name || "Product Name"}</h3>
              <p className="text-xl font-black text-purple-600">KSh {productFormData.price || "0"}</p>
              {productFormData.oldPrice && <p className="text-sm text-slate-400 line-through">KSh {productFormData.oldPrice}</p>}
            </div>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-700">
            <Save size={18} />
            {editingProduct ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </section>
  );
}

function CategoriesList({ filteredCategories, loading, handleEdit, handleDelete, setCategoryFormData, setFormOpen, setEditingCategory }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-xl font-black text-slate-950">Category List</h2>
        <p className="text-sm text-slate-500">Showing {filteredCategories.length} categories</p>
      </div>

      {loading ? (
        <div className="p-10 text-center">Loading...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <Grid2X2 size={54} className="text-purple-500" />
          <h3 className="mt-4 text-2xl font-black text-slate-950">No categories found</h3>
        </div>
      ) : (
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => (
            <div key={category.id} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-black text-slate-950">{category.name}</h3>
                  <span className={`rounded-full px-2 py-1 text-xs font-black ${category.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {category.status}
                  </span>
                </div>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => {
                    setCategoryFormData(category);
                    setEditingCategory(category);
                    setFormOpen(true);
                  }} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-purple-50">
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-red-50">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ProductsList({ products, loading, handleEdit, handleDelete, setProductFormData, setProductFormOpen, setEditingProduct, categories }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-xl font-black text-slate-950">Product List</h2>
        <p className="text-sm text-slate-500">Showing {products.length} products</p>
      </div>

      {loading ? (
        <div className="p-10 text-center">Loading...</div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <Package size={54} className="text-purple-500" />
          <h3 className="mt-4 text-2xl font-black text-slate-950">No products found</h3>
          <button onClick={() => setProductFormOpen(true)} className="mt-4 rounded-2xl bg-purple-600 px-6 py-2 text-white">Add Product</button>
        </div>
      ) : (
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
              <div className="relative h-40 bg-slate-100">
                <img src={product.image || "https://via.placeholder.com/200"} alt={product.name} className="h-full w-full object-cover" />
                <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-xs font-black ${product.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {product.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-black text-slate-950">{product.name}</h3>
                <p className="text-sm text-purple-600">{product.category}</p>
                <p className="text-xl font-black text-purple-600">KSh {product.price}</p>
                {product.oldPrice && <p className="text-sm text-slate-400 line-through">KSh {product.oldPrice}</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => {
                    setProductFormData(product);
                    setEditingProduct(product);
                    setProductFormOpen(true);
                  }} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-purple-50">
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-red-50">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function createSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}