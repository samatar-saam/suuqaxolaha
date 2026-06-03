// src/components/NewArrivals.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Clock,
  TrendingUp,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Filter,
  ChevronDown,
  Grid,
  List,
  Package,
  Truck,
  Shield,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [addingToCart, setAddingToCart] = useState({});
  const [cartMessage, setCartMessage] = useState(null);

  // Fixed delivery fee
  const DELIVERY_FEE = 150;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    loadWishlist();
    loadCart();
  }, []);

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem("public_wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const data = await response.json();
      
      const activeProducts = data.filter(p => p.status === "active");
      
      const sortedByNewest = activeProducts.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return b.id.localeCompare(a.id);
      });
      
      setProducts(sortedByNewest);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const addToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check stock
    if (product.stock === 0) {
      alert("Sorry, this product is out of stock!");
      return;
    }
    
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    // Get current cart
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = currentCart.find(item => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      // Check if adding one more exceeds stock
      if (existingItem.quantity + 1 > (product.stock || 10)) {
        alert(`Only ${product.stock} items available in stock.`);
        setAddingToCart(prev => ({ ...prev, [product.id]: false }));
        return;
      }
      // Update quantity
      updatedCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Add new item
      updatedCart = [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: 1,
          deliveryFee: DELIVERY_FEE,
        },
      ];
    }
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    
    // Show success message
    setCartMessage({
      type: "success",
      text: `✓ ${product.name} added to cart!`
    });
    setTimeout(() => setCartMessage(null), 2000);
    
    setAddingToCart(prev => ({ ...prev, [product.id]: false }));
  };

  const addToWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentWishlist = JSON.parse(localStorage.getItem("public_wishlist") || "[]");
    const alreadyExists = currentWishlist.some(item => item.id === product.id);
    
    if (alreadyExists) {
      setCartMessage({
        type: "info",
        text: `${product.name} is already in your wishlist!`
      });
      setTimeout(() => setCartMessage(null), 2000);
      return;
    }
    
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      addedAt: new Date().toISOString(),
    };
    
    const updatedWishlist = [...currentWishlist, wishlistItem];
    localStorage.setItem("public_wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    
    setCartMessage({
      type: "success",
      text: `❤️ ${product.name} added to wishlist!`
    });
    setTimeout(() => setCartMessage(null), 2000);
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(p => p.category === filterCategory);
    }
    
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const formatPrice = (price) => {
    return `KSh ${price?.toLocaleString() || "0"}`;
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= (rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading new arrivals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Toast Message */}
        {cartMessage && (
          <div className={`fixed top-24 right-5 z-50 px-4 py-3 rounded-lg shadow-lg ${
            cartMessage.type === "success" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          }`}>
            {cartMessage.text}
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-4">
            <Sparkles size={32} className="text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            New Arrivals
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Discover the latest products added to SuuqHub. Be the first to get your hands on these fresh items!
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 mb-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{products.length}</p>
              <p className="text-sm text-purple-200">New Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{categories.length}</p>
              <p className="text-sm text-purple-200">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
              <p className="text-sm text-purple-200">Latest Updates</p>
            </div>
            <div>
              <p className="text-3xl font-bold">✨ Fresh</p>
              <p className="text-sm text-purple-200">Just Added</p>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-purple-50"
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
              
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-2 transition ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-2 transition ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price Range</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <button
            onClick={fetchProducts}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Package size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your filters or check back later for new arrivals.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isInWishlist = wishlist.some(item => item.id === product.id);
              const isAdding = addingToCart[product.id];
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition group"
                >
                  <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
                    <img
                      src={product.image || "https://via.placeholder.com/400"}
                      alt={product.name}
                      className="w-full h-48 object-cover bg-slate-100 group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400";
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Sparkles size={10} />
                      New
                    </div>
                    <button
                      onClick={(e) => addToWishlist(product, e)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                    >
                      <Heart size={16} className={isInWishlist ? "fill-red-500 text-red-500" : "text-slate-500"} />
                    </button>
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 hover:text-purple-600 transition">
                        {product.name}
                      </h3>
                    </Link>
                    {product.category && (
                      <p className="text-xs text-slate-500 mb-2">{product.category}</p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      {getRatingStars(product.rating || 4.5)}
                      <span className="text-xs text-slate-400">({product.reviews || 0})</span>
                    </div>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-purple-600">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="ml-2 text-sm text-slate-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => addToCart(product, e)}
                      disabled={isAdding || product.stock === 0}
                      className="w-full rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAdding ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : product.stock === 0 ? (
                        "Out of Stock"
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const isInWishlist = wishlist.some(item => item.id === product.id);
              const isAdding = addingToCart[product.id];
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition group"
                >
                  <div className="flex gap-4">
                    <Link to={`/product/${product.id}`} className="flex-shrink-0">
                      <img
                        src={product.image || "https://via.placeholder.com/100"}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-xl bg-slate-100"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100";
                        }}
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-bold text-slate-900 hover:text-purple-600 transition">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-slate-500 mt-1">{product.category}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {getRatingStars(product.rating || 4.5)}
                            <span className="text-xs text-slate-400">({product.reviews || 0})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{formatPrice(product.price)}</p>
                          {product.oldPrice && (
                            <p className="text-xs text-slate-400 line-through">{formatPrice(product.oldPrice)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => addToCart(product, e)}
                          disabled={isAdding || product.stock === 0}
                          className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50"
                        >
                          {isAdding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <button
                          onClick={(e) => addToWishlist(product, e)}
                          className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <Heart size={18} className={isInWishlist ? "fill-red-500 text-red-500" : ""} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Features Banner - Updated with flat delivery fee */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Truck size={32} className="text-purple-600" />
              <h3 className="font-bold text-slate-900">Flat Delivery Fee</h3>
              <p className="text-sm text-slate-500">Only KSh {DELIVERY_FEE} on all orders</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield size={32} className="text-purple-600" />
              <h3 className="font-bold text-slate-900">Secure Payment</h3>
              <p className="text-sm text-slate-500">100% secure transactions</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock size={32} className="text-purple-600" />
              <h3 className="font-bold text-slate-900">24/7 Support</h3>
              <p className="text-sm text-slate-500">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}