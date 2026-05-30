// src/users/pages/UserWishlist.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Trash2,
  ShoppingCart,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Star,
  Truck,
  Clock,
  Package,
  Plus,
} from "lucide-react";

export default function UserWishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [removingItem, setRemovingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.id) {
      setCurrentUser(user);
      fetchWishlist(user.id);
      fetchAvailableProducts();
    } else {
      setError("Please login to view your wishlist");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [navigate]);

  const fetchAvailableProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const products = await response.json();
      setAvailableProducts(products.filter(p => p.status === "active"));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchWishlist = async (userId, showRefresh = false) => {
    if (!showRefresh) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/wishlists?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const wishlistItems = await response.json();
      console.log("Fetched wishlist items:", wishlistItems);
      
      if (wishlistItems.length === 0) {
        setWishlist([]);
        setLoading(false);
        return;
      }
      
      const enrichedWishlist = await Promise.all(
        wishlistItems.map(async (item) => {
          try {
            const productRes = await fetch(`http://localhost:5000/products/${item.productId}`);
            if (productRes.ok) {
              const product = await productRes.json();
              return {
                id: item.id,
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                rating: product.rating || 4.5,
                reviews: product.reviews || 0,
                inStock: (product.stock || 0) > 0,
                stock: product.stock || 0,
                addedAt: item.createdAt,
              };
            }
            return null;
          } catch (error) {
            console.error("Failed to fetch product:", error);
            return null;
          }
        })
      );
      
      const validWishlist = enrichedWishlist.filter(item => item !== null);
      setWishlist(validWishlist);
      
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setError("Failed to load wishlist. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlistDirectly = async (product) => {
    try {
      const response = await fetch("http://localhost:5000/wishlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Date.now(),
          userId: currentUser.id,
          productId: product.id,
          createdAt: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        setSuccessMessage({
          type: "success",
          text: `✅ "${product.name}" added to your wishlist!`
        });
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchWishlist(currentUser.id);
        setShowAddModal(false);
      } else {
        throw new Error("Failed to add");
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      setSuccessMessage({
        type: "error",
        text: "Failed to add item. Please try again."
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const removeFromWishlist = async (wishlistItemId, productName) => {
    if (!confirm(`Remove "${productName}" from your wishlist?`)) return;
    
    setRemovingItem(wishlistItemId);
    
    try {
      const response = await fetch(`http://localhost:5000/wishlists/${wishlistItemId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setWishlist(wishlist.filter(item => item.id !== wishlistItemId));
        setSuccessMessage({
          type: "success",
          text: `"${productName}" removed from wishlist`
        });
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      setSuccessMessage({
        type: "error",
        text: "Failed to remove item. Please try again."
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setRemovingItem(null);
    }
  };

  const addToCart = async (product) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.productId]: true }));
    
    try {
      const cartResponse = await fetch(`http://localhost:5000/cart_items?userId=${currentUser.id}&productId=${product.productId}`);
      const existingCartItems = await cartResponse.json();
      
      if (existingCartItems.length > 0) {
        const cartItem = existingCartItems[0];
        const newQuantity = cartItem.quantity + 1;
        
        if (newQuantity > (product.stock || 10)) {
          alert(`Only ${product.stock} items available in stock.`);
          setAddingToCart(prev => ({ ...prev, [product.productId]: false }));
          return;
        }
        
        await fetch(`http://localhost:5000/cart_items/${cartItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: newQuantity,
            updatedAt: new Date().toISOString(),
          }),
        });
      } else {
        await fetch("http://localhost:5000/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: Date.now(),
            userId: currentUser.id,
            productId: product.productId,
            quantity: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
      }
      
      setSuccessMessage({
        type: "success",
        text: `✅ "${product.name}" added to cart!`
      });
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setSuccessMessage({
        type: "error",
        text: "Failed to add to cart. Please try again."
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.productId]: false }));
    }
  };

  const formatPrice = (price) => {
    return `KSh ${price?.toLocaleString() || "0"}`;
  };

  const formatDate = (date) => {
    if (!date) return "Recently added";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes("login")) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Login Required</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-bold hover:bg-purple-700 transition"
          >
            Login Now
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-slate-700 font-bold hover:bg-slate-50 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Wishlist</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button
          onClick={() => currentUser && fetchWishlist(currentUser.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state with option to add products
  if (wishlist.length === 0) {
    return (
      <div className="space-y-6">
        {/* Success/Error Toast */}
        {successMessage && (
          <div className={`fixed top-24 right-5 z-50 px-4 py-3 rounded-lg shadow-lg ${
            successMessage.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {successMessage.text}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Heart size={48} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Save your favorite items here to easily find them later.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-bold hover:bg-purple-700 transition"
            >
              <Package size={18} />
              Browse Products
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-6 py-3 text-purple-600 font-bold hover:bg-purple-100 transition"
            >
              <Plus size={18} />
              Add Products to Wishlist
            </button>
          </div>
        </div>

        {/* Add Products Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddModal(false)}>
            <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Add Products to Wishlist</h2>
                <button onClick={() => setShowAddModal(false)} className="rounded-full p-2 hover:bg-slate-100">
                  ✕
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {availableProducts.map((product) => {
                    const alreadyInWishlist = wishlist.some(item => item.productId === product.id);
                    return (
                      <div key={product.id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl hover:bg-slate-50">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{product.name}</h3>
                          <p className="text-sm text-purple-600">{formatPrice(product.price)}</p>
                        </div>
                        <button
                          onClick={() => addToWishlistDirectly(product)}
                          disabled={alreadyInWishlist}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                            alreadyInWishlist
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-purple-600 text-white hover:bg-purple-700"
                          }`}
                        >
                          {alreadyInWishlist ? "Already Added" : "Add to Wishlist"}
                        </button>
                      </div>
                    );
                  })}
                  {availableProducts.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No products available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Toast */}
      {successMessage && (
        <div className={`fixed top-24 right-5 z-50 px-4 py-3 rounded-lg shadow-lg ${
          successMessage.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {successMessage.text}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Heart size={24} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
              <p className="text-sm text-slate-500 mt-1">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchWishlist(currentUser.id, true)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-purple-50 transition"
            >
              <RefreshCw size={14} className="inline mr-1" />
              Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-100 transition"
            >
              <Plus size={14} className="inline mr-1" />
              Add Items
            </button>
          </div>
        </div>
      </div>

      {/* Wishlist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Total Items</p>
          <p className="text-2xl font-bold text-slate-900">{wishlist.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">In Stock</p>
          <p className="text-2xl font-bold text-green-600">
            {wishlist.filter(item => item.inStock).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Total Value</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatPrice(wishlist.reduce((sum, item) => sum + item.price, 0))}
          </p>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group ${
              !item.inStock ? "opacity-60" : ""
            }`}
          >
            <Link to={`/product/${item.productId}`} className="block relative overflow-hidden">
              <img
                src={item.image || "https://via.placeholder.com/400"}
                alt={item.name}
                className="w-full h-48 object-cover bg-slate-100 group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400";
                }}
              />
              {!item.inStock && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  Out of Stock
                </div>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWishlist(item.id, item.name);
                }}
                disabled={removingItem === item.id}
                className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition disabled:opacity-50"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </Link>

            <div className="p-4">
              <Link to={`/product/${item.productId}`}>
                <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 hover:text-purple-600 transition">
                  {item.name}
                </h3>
              </Link>
              
              {item.category && (
                <p className="text-xs text-slate-500 mb-2">{item.category}</p>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-slate-700">{item.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({item.reviews} reviews)</span>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-purple-600">{formatPrice(item.price)}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(item)}
                  disabled={addingToCart[item.productId] || !item.inStock}
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingToCart[item.productId] ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-400">
                <Clock size={12} />
                Added {formatDate(item.addedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Info Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Truck size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Free Delivery on orders over KSh 2,500</h3>
              <p className="text-sm text-slate-600">
                Add items from your wishlist to your cart and enjoy free delivery across Kenya.
              </p>
            </div>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-purple-600 shadow-sm hover:shadow-md transition whitespace-nowrap"
          >
            Browse More Products
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Add Products Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddModal(false)}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Add Products to Wishlist</h2>
              <button onClick={() => setShowAddModal(false)} className="rounded-full p-2 hover:bg-slate-100">
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {availableProducts.map((product) => {
                  const alreadyInWishlist = wishlist.some(item => item.productId === product.id);
                  return (
                    <div key={product.id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl hover:bg-slate-50">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <p className="text-sm text-purple-600">{formatPrice(product.price)}</p>
                      </div>
                      <button
                        onClick={() => addToWishlistDirectly(product)}
                        disabled={alreadyInWishlist}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                          alreadyInWishlist
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        {alreadyInWishlist ? "Already Added" : "Add to Wishlist"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}