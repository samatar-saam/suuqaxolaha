// src/components/PublicWishlist.jsx
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
  ShoppingBag,
  LogIn,
} from "lucide-react";

export default function PublicWishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [migrating, setMigrating] = useState(false);

  // Load current user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
  }, []);

  // Load wishlist from localStorage
  useEffect(() => {
    loadWishlistFromStorage();
  }, []);

  // Check for pending items after login and migrate guest wishlist to database
  useEffect(() => {
    const migrateGuestWishlist = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const hasMigrated = sessionStorage.getItem("wishlist_migrated");
      
      if (user && user.id && wishlist.length > 0 && !hasMigrated) {
        setMigrating(true);
        
        try {
          // Get user's existing database wishlist
          const dbRes = await fetch(`http://localhost:5000/wishlists?userId=${user.id}`);
          const dbWishlist = await dbRes.json();
          const dbProductIds = new Set(dbWishlist.map(item => item.productId));
          
          // Add guest wishlist items that aren't already in database
          let addedCount = 0;
          for (const item of wishlist) {
            if (!dbProductIds.has(item.id)) {
              const response = await fetch("http://localhost:5000/wishlists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: Date.now() + addedCount,
                  userId: user.id,
                  productId: item.id,
                  createdAt: new Date().toISOString()
                }),
              });
              
              if (response.ok) {
                addedCount++;
              }
            }
          }
          
          if (addedCount > 0) {
            alert(`✨ ${addedCount} item(s) from your guest wishlist have been saved to your account!`);
          }
          
          // Mark as migrated and clear guest wishlist
          sessionStorage.setItem("wishlist_migrated", "true");
          localStorage.removeItem("public_wishlist");
          setWishlist([]);
          
          // Redirect to user wishlist
          navigate("/dashboard/wishlist");
        } catch (error) {
          console.error("Failed to migrate wishlist:", error);
        } finally {
          setMigrating(false);
        }
      }
    };
    
    if (wishlist.length > 0 && currentUser) {
      migrateGuestWishlist();
    }
  }, [wishlist, currentUser, navigate]);

  const loadWishlistFromStorage = () => {
    setLoading(true);
    try {
      const savedWishlist = localStorage.getItem("public_wishlist");
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        const validWishlist = parsedWishlist.filter(
          (item) => item.id && item.name && typeof item.price === "number"
        );
        setWishlist(validWishlist);
        if (validWishlist.length !== parsedWishlist.length) {
          localStorage.setItem("public_wishlist", JSON.stringify(validWishlist));
        }
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const saveWishlistToStorage = (updatedWishlist) => {
    localStorage.setItem("public_wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
  };

  const removeFromWishlist = (productId, productName) => {
    if (!confirm(`Remove "${productName}" from your wishlist?`)) return;
    
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    saveWishlistToStorage(updatedWishlist);
  };

  const addToCart = async (product) => {
    if (!currentUser) {
      const confirmLogin = confirm("Please login to add items to cart. Would you like to login now?");
      if (confirmLogin) {
        sessionStorage.setItem("pendingCartItem", JSON.stringify(product));
        navigate("/login");
      }
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const cartResponse = await fetch(`http://localhost:5000/cart_items?userId=${currentUser.id}&productId=${product.id}`);
      const existingCartItems = await cartResponse.json();
      
      if (existingCartItems.length > 0) {
        const cartItem = existingCartItems[0];
        await fetch(`http://localhost:5000/cart_items/${cartItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: cartItem.quantity + 1,
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
            productId: product.id,
            quantity: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
      }
      
      alert(`✅ ${product.name} added to cart!`);
      
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const moveAllToCart = async () => {
    if (wishlist.length === 0) return;
    
    if (!currentUser) {
      const confirmLogin = confirm("Please login to add items to cart. Would you like to login now?");
      if (confirmLogin) {
        sessionStorage.setItem("pendingWishlistItems", JSON.stringify(wishlist));
        navigate("/login");
      }
      return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (const item of wishlist) {
      try {
        const cartResponse = await fetch(`http://localhost:5000/cart_items?userId=${currentUser.id}&productId=${item.id}`);
        const existingCartItems = await cartResponse.json();
        
        if (existingCartItems.length > 0) {
          const cartItem = existingCartItems[0];
          await fetch(`http://localhost:5000/cart_items/${cartItem.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quantity: cartItem.quantity + 1,
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
              productId: item.id,
              quantity: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }),
          });
        }
        successCount++;
      } catch (error) {
        console.error("Failed to add to cart:", error);
        failCount++;
      }
    }
    
    if (successCount > 0) {
      alert(`✅ Added ${successCount} items to cart. ${failCount} failed.`);
      saveWishlistToStorage([]);
    } else {
      alert("Failed to add items to cart. Please try again.");
    }
  };

  const clearWishlist = () => {
    if (wishlist.length === 0) return;
    if (confirm("Clear your entire wishlist?")) {
      saveWishlistToStorage([]);
    }
  };

  const formatPrice = (price) => {
    return `KSh ${price?.toLocaleString() || "0"}`;
  };

  // Check for pending items after login
  useEffect(() => {
    const pendingItem = sessionStorage.getItem("pendingCartItem");
    const pendingWishlist = sessionStorage.getItem("pendingWishlistItems");
    
    if (currentUser && (pendingItem || pendingWishlist)) {
      if (pendingItem) {
        const product = JSON.parse(pendingItem);
        addToCart(product);
        sessionStorage.removeItem("pendingCartItem");
      }
      if (pendingWishlist) {
        const items = JSON.parse(pendingWishlist);
        for (const item of items) {
          addToCart(item);
        }
        sessionStorage.removeItem("pendingWishlistItems");
      }
    }
  }, [currentUser]);

  if (migrating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Syncing your wishlist with your account...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Heart size={48} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6">
            Save your favorite items here to easily find them later.
          </p>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-bold hover:bg-purple-700 transition"
          >
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <Heart size={28} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">My Wishlist</h1>
              <p className="text-sm text-slate-500 mt-1">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={clearWishlist}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
            >
              Clear All
            </button>
            <button
              onClick={moveAllToCart}
              className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Move All to Cart
            </button>
          </div>
        </div>

        {/* Login Banner for Guests */}
        {!currentUser && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <LogIn size={24} className="text-purple-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Save your wishlist permanently!</p>
                  <p className="text-xs text-slate-600">Login to sync your wishlist across all devices</p>
                </div>
              </div>
              <Link
                to="/login"
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition flex items-center gap-2"
              >
                <LogIn size={14} />
                Login to Save
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition group"
            >
              {/* Product Image */}
              <Link to={`/product/${item.id}`} className="block relative overflow-hidden">
                <img
                  src={item.image || "https://via.placeholder.com/400"}
                  alt={item.name}
                  className="w-full h-48 object-cover bg-slate-100 group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400";
                  }}
                />
                {item.stock === 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    Out of Stock
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(item.id, item.name);
                  }}
                  className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 hover:text-purple-600 transition">
                    {item.name}
                  </h3>
                </Link>
                
                {item.category && (
                  <p className="text-xs text-slate-500 mb-2">{item.category}</p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-700">{item.rating || 4.5}</span>
                  </div>
                  <span className="text-xs text-slate-400">({item.reviews || 0} reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-purple-600">{formatPrice(item.price)}</span>
                  {item.originalPrice && (
                    <span className="ml-2 text-sm text-slate-400 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <button
                  onClick={() => addToCart(item)}
                  disabled={addingToCart[item.id] || item.stock === 0}
                  className="w-full rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingToCart[item.id] ? (
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
            </div>
          ))}
        </div>

        {/* Delivery Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
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
              Browse Products
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}