// src/users/pages/Stores.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Store,
  Search,
  MapPin,
  Star,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  Package,
  Users,
  TrendingUp,
  Filter,
  X,
  Eye,
  Heart,
  Share2,
  CheckCircle,
} from "lucide-react";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchProducts();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch("http://localhost:5000/sellers");
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const storesWithStats = useMemo(() => {
    return stores.map(store => {
      const storeProducts = products.filter(p => p.sellerId === store.id || p.seller === store.business_name);
      const totalProducts = storeProducts.length;
      const totalSales = storeProducts.reduce((sum, p) => sum + (p.soldCount || 0), 0);
      const avgRating = store.rating || 4.5;
      const ratingCount = store.reviewCount || Math.floor(Math.random() * 500) + 50;
      return {
        ...store,
        totalProducts,
        totalSales,
        avgRating,
        ratingCount,
        coverImage: store.cover_image_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
        logo: store.logo_url || "https://via.placeholder.com/80",
        isVerified: store.is_verified || true,
      };
    });
  }, [stores, products]);

  const filteredStores = useMemo(() => {
    let filtered = storesWithStats;
    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(store => store.category === selectedCategory);
    }
    if (selectedRating !== "all") {
      const minRating = parseInt(selectedRating);
      filtered = filtered.filter(store => store.avgRating >= minRating);
    }
    return filtered;
  }, [storesWithStats, searchTerm, selectedCategory, selectedRating]);

  const categories = [...new Set(stores.map(s => s.category).filter(Boolean))];

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} size={14} className="fill-yellow-400 text-yellow-400" />)}
        {hasHalfStar && <Star size={14} className="fill-yellow-400 text-yellow-400 opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} size={14} className="text-slate-300" />)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-5 py-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Local Stores</h1>
          <p className="text-purple-100 text-lg max-w-2xl">
            Discover and support local businesses in Garissa. Shop directly from trusted vendors.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search stores by name, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-purple-50 transition"
            >
              <Filter size={18} /> Filters {showFilters ? <X size={16} /> : <ChevronRight size={16} />}
            </button>
            <div className="flex rounded-xl border border-slate-200 bg-white p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${viewMode === "grid" ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-purple-50"}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${viewMode === "list" ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-purple-50"}`}
              >
                List
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Rating</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4">4★ & above</option>
                    <option value="3">3★ & above</option>
                    <option value="2">2★ & above</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Found <span className="font-semibold text-purple-600">{filteredStores.length}</span> stores
          </p>
          {searchTerm && <button onClick={() => setSearchTerm("")} className="text-sm text-purple-600 hover:text-purple-700">Clear search</button>}
        </div>

        {filteredStores.length === 0 ? (
          <div className="text-center py-16">
            <Store size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No stores found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} getRatingStars={getRatingStars} onViewDetails={() => setSelectedStore(store)} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStores.map((store) => (
              <StoreListItem key={store.id} store={store} getRatingStars={getRatingStars} onViewDetails={() => setSelectedStore(store)} />
            ))}
          </div>
        )}
      </div>

      {selectedStore && <StoreModal store={selectedStore} onClose={() => setSelectedStore(null)} getRatingStars={getRatingStars} />}
    </main>
  );
}

// Grid View Card – removed "Followers" stat, "Visit Store" opens modal
function StoreCard({ store, getRatingStars, onViewDetails }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-32 bg-gradient-to-r from-purple-500 to-purple-600">
        <img src={store.coverImage} alt={store.business_name} className="w-full h-full object-cover" />
        {store.isVerified && <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1"><CheckCircle size={14} className="text-white" /></div>}
      </div>
      <div className="px-5 pb-5">
        <div className="flex items-end -mt-10 mb-3">
          <img src={store.logo} alt={store.business_name} className="w-20 h-20 rounded-xl border-4 border-white bg-white object-cover shadow-md" />
          <div className="ml-3 flex-1">
            <h3 className="font-bold text-slate-900 line-clamp-1">{store.business_name}</h3>
            <div className="flex items-center gap-2 mt-1">{getRatingStars(store.avgRating)}<span className="text-xs text-slate-500">({store.ratingCount})</span></div>
          </div>
        </div>
        {/* Stats – removed "Followers" */}
        <div className="flex items-center justify-between gap-3 py-3 border-y border-slate-100">
          <div className="text-center flex-1"><Package size={16} className="mx-auto text-purple-500 mb-1" /><p className="text-xs text-slate-500">Products</p><p className="font-bold text-slate-900">{store.totalProducts}</p></div>
          <div className="text-center flex-1"><TrendingUp size={16} className="mx-auto text-purple-500 mb-1" /><p className="text-xs text-slate-500">Sales</p><p className="font-bold text-slate-900">{store.totalSales}</p></div>
        </div>
        <p className="text-sm text-slate-500 mt-3 line-clamp-2">{store.description || "Leading local store in Garissa offering quality products at affordable prices."}</p>
        <div className="flex gap-2 mt-4">
          <button onClick={onViewDetails} className="flex-1 text-center rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition">Visit Store</button>
          <button onClick={() => setShowDetails(true)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-purple-50 transition"><Eye size={16} /></button>
        </div>
      </div>
    </div>
  );
}

// List View Item – removed "Followers", "Visit" opens modal
function StoreListItem({ store, getRatingStars, onViewDetails }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
      <div className="flex gap-5">
        <img src={store.logo} alt={store.business_name} className="w-20 h-20 rounded-xl object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-bold text-slate-900">{store.business_name}</h3>
            {store.isVerified && <CheckCircle size={16} className="text-green-500" />}
            <div className="flex items-center gap-1">{getRatingStars(store.avgRating)}<span className="text-xs text-slate-500 ml-1">({store.ratingCount})</span></div>
          </div>
          <p className="text-sm text-slate-500 mt-1 line-clamp-1">{store.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Package size={12} /> {store.totalProducts} products</span>
            <span className="flex items-center gap-1"><TrendingUp size={12} /> {store.totalSales} sales</span>
          </div>
        </div>
        <button onClick={onViewDetails} className="self-center rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition">Visit Store</button>
      </div>
    </div>
  );
}

// Store Details Modal – "Visit Store" button replaced with "Close"
function StoreModal({ store, onClose, getRatingStars }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg"><X size={20} /></button>
        <div className="h-40 bg-gradient-to-r from-purple-500 to-purple-600"><img src={store.coverImage} alt="" className="w-full h-full object-cover" /></div>
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-12 mb-4">
            <img src={store.logo} alt={store.business_name} className="w-24 h-24 rounded-xl border-4 border-white bg-white object-cover shadow-md" />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2"><h2 className="text-2xl font-bold text-slate-900">{store.business_name}</h2>{store.isVerified && <CheckCircle size={18} className="text-green-500" />}</div>
              <div className="flex items-center gap-2 mt-1">{getRatingStars(store.avgRating)}<span className="text-sm text-slate-500">({store.ratingCount} reviews)</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl mb-4">
            <div className="flex items-center gap-2 text-sm"><Mail size={16} className="text-purple-500" /><span className="text-slate-600">{store.business_email}</span></div>
            <div className="flex items-center gap-2 text-sm"><Phone size={16} className="text-purple-500" /><span className="text-slate-600">{store.phone}</span></div>
            <div className="flex items-center gap-2 text-sm"><MapPin size={16} className="text-purple-500" /><span className="text-slate-600">Garissa, Kenya</span></div>
            <div className="flex items-center gap-2 text-sm"><Clock size={16} className="text-purple-500" /><span className="text-slate-600">Open 9AM - 9PM</span></div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{store.description || "We are a trusted local store in Garissa, committed to providing quality products and excellent customer service. Shop with confidence!"}</p>
          <div className="flex gap-3 mb-5">
            <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"><Facebook size={18} /></button>
            <button className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100"><Instagram size={18} /></button>
            <button className="p-2 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100"><Twitter size={18} /></button>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 text-center rounded-xl bg-purple-600 py-3 font-bold text-white hover:bg-purple-700 transition">Close</button>
            <button className="rounded-xl border border-slate-200 px-5 py-3 text-slate-600 hover:bg-purple-50 transition"><Heart size={18} /></button>
            <button className="rounded-xl border border-slate-200 px-5 py-3 text-slate-600 hover:bg-purple-50 transition"><Share2 size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}