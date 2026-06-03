// src/users/pages/Cart.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [stockErrors, setStockErrors] = useState({});

  // Fixed delivery fee - KSh 150 for all orders
  const DELIVERY_FEE = 150;

  // Load current user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
  }, []);

  // Load cart when user changes
  useEffect(() => {
    loadCart();
    fetchRecommendedProducts();
  }, [currentUser]);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    setStockErrors({});
    
    try {
      // If user is logged in, load from database
      if (currentUser && currentUser.id) {
        console.log("Loading cart for user:", currentUser.id);
        
        const response = await fetch(`http://localhost:5000/cart_items?userId=${currentUser.id}`);
        const cartItems = await response.json();
        
        console.log("Cart items from DB:", cartItems);
        
        if (cartItems.length > 0) {
          const enrichedCart = [];
          const errorsMap = {};
          
          for (const cartItem of cartItems) {
            try {
              const productRes = await fetch(`http://localhost:5000/products/${cartItem.productId}`);
              if (productRes.ok) {
                const product = await productRes.json();
                const currentStock = product.stock || 0;
                
                if (cartItem.quantity > currentStock) {
                  errorsMap[cartItem.productId] = `Only ${currentStock} available in stock`;
                }
                
                enrichedCart.push({
                  id: cartItem.productId,
                  cartItemId: cartItem.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                  quantity: Math.min(cartItem.quantity, currentStock),
                  stock: currentStock,
                });
              }
            } catch (err) {
              console.error("Error fetching product:", err);
            }
          }
          
          setStockErrors(errorsMap);
          setCart(enrichedCart);
        } else {
          // Check localStorage for guest cart to migrate
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (parsedCart.length > 0) {
              await migrateGuestCartToDatabase(parsedCart);
            } else {
              setCart([]);
            }
          } else {
            setCart([]);
          }
        }
      } else {
        // Guest user - load from localStorage only
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
        } else {
          setCart([]);
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      setError("Failed to load cart. Please refresh.");
      // Fallback to localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } finally {
      setLoading(false);
    }
  };

  const migrateGuestCartToDatabase = async (guestCart) => {
    if (!currentUser || !currentUser.id) return;
    
    console.log("Migrating guest cart to database:", guestCart);
    
    for (const item of guestCart) {
      try {
        // Check if item already exists
        const checkRes = await fetch(`http://localhost:5000/cart_items?userId=${currentUser.id}&productId=${item.id}`);
        const existing = await checkRes.json();
        
        if (existing.length > 0) {
          // Update existing item
          await fetch(`http://localhost:5000/cart_items/${existing[0].id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quantity: existing[0].quantity + item.quantity,
              updatedAt: new Date().toISOString(),
            }),
          });
        } else {
          // Create new cart item
          await fetch("http://localhost:5000/cart_items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: Date.now() + Math.random(),
              userId: currentUser.id,
              productId: item.id,
              quantity: item.quantity,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }),
          });
        }
        console.log(`Migrated ${item.name} to database`);
      } catch (err) {
        console.error("Failed to migrate item:", err);
      }
    }
    
    // Clear guest cart after migration
    localStorage.removeItem("cart");
    // Reload cart from database
    await loadCart();
  };

  const syncCartToDatabase = async (updatedCart) => {
    if (!currentUser || !currentUser.id) return;

    setSyncing(true);
    
    try {
      // Get current cart items from database
      const response = await fetch(`http://localhost:5000/cart_items?userId=${currentUser.id}`);
      const existingItems = await response.json();
      
      // Delete items not in updated cart
      for (const existingItem of existingItems) {
        const stillExists = updatedCart.find(item => item.id == existingItem.productId);
        if (!stillExists) {
          await fetch(`http://localhost:5000/cart_items/${existingItem.id}`, {
            method: "DELETE",
          });
          console.log(`Deleted cart item ${existingItem.id}`);
        }
      }
      
      // Update or create items
      for (const cartItem of updatedCart) {
        const existingItem = existingItems.find(item => item.productId == cartItem.id);
        
        if (existingItem) {
          // Update existing item
          await fetch(`http://localhost:5000/cart_items/${existingItem.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quantity: cartItem.quantity,
              updatedAt: new Date().toISOString(),
            }),
          });
          console.log(`Updated cart item ${cartItem.id} to quantity ${cartItem.quantity}`);
        } else {
          // Create new item
          await fetch("http://localhost:5000/cart_items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: Date.now() + Math.random(),
              userId: currentUser.id,
              productId: cartItem.id,
              quantity: cartItem.quantity,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }),
          });
          console.log(`Created new cart item for ${cartItem.name}`);
        }
      }
    } catch (error) {
      console.error("Failed to sync cart to database:", error);
      setError("Failed to sync with server. Changes saved locally.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSyncing(false);
    }
  };

  const saveCart = async (updatedCart) => {
    setCart(updatedCart);
    
    // Always save to localStorage as backup
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // If user is logged in, sync to database
    if (currentUser && currentUser.id) {
      await syncCartToDatabase(updatedCart);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const data = await response.json();
      const activeProducts = data.filter((p) => p.status === "active").slice(0, 4);
      setRecommendedProducts(activeProducts);
    } catch (error) {
      console.error("Failed to fetch recommended products:", error);
      setRecommendedProducts([]);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    
    setSyncing(true);
    
    try {
      // Fetch the latest product stock from database
      const productRes = await fetch(`http://localhost:5000/products/${productId}`);
      if (!productRes.ok) {
        throw new Error("Failed to fetch product stock");
      }
      const product = await productRes.json();
      const currentStock = product.stock || 0;
      
      // Check if new quantity exceeds stock
      if (newQuantity > currentStock) {
        setStockErrors(prev => ({
          ...prev,
          [productId]: `Only ${currentStock} available in stock. Cannot add more than ${currentStock}.`
        }));
        setSyncing(false);
        return;
      }
      
      // Clear error for this product
      setStockErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[productId];
        return newErrors;
      });
      
      // Update cart with new quantity and current stock
      const updatedCart = cart.map((item) =>
        item.id === productId 
          ? { ...item, quantity: newQuantity, stock: currentStock } 
          : item
      );
      
      await saveCart(updatedCart);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setError("Failed to update quantity. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSyncing(false);
    }
  };

  const removeItem = async (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    await saveCart(updatedCart);
    // Remove stock error for this product
    setStockErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[productId];
      return newErrors;
    });
  };

  const clearCart = async () => {
    if (window.confirm("Clear all items from your cart?")) {
      await saveCart([]);
      setStockErrors({});
    }
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    if (getSubtotal() === 0) return 0;
    return DELIVERY_FEE;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const hasStockIssues = Object.keys(stockErrors).length > 0;
    if (hasStockIssues) {
      alert("Please fix stock issues before proceeding to checkout.");
      return;
    }
    
    // Save cart to sessionStorage for checkout
    sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
    
    // If not logged in, store where to redirect after login
    if (!currentUser) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      alert("Please login to proceed with checkout");
      navigate("/login");
      return;
    }
    
    navigate("/checkout", { state: { cart, total: getTotal(), deliveryFee: DELIVERY_FEE } });
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6 pt-24">
        <div className="text-center max-w-md">
          <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={48} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-bold hover:bg-purple-700 transition"
          >
            <ArrowLeft size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-5">
        {syncing && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-2 text-sm text-blue-700">
            <RefreshCw size={16} className="animate-spin" />
            Validating stock...
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200 flex items-center gap-2 text-sm text-yellow-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/categories"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:bg-purple-50 transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Shopping Cart</h1>
            <p className="text-sm text-slate-500 mt-1">
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"} in your cart
              {!currentUser && <span className="ml-2 text-yellow-600">• Guest cart</span>}
              {currentUser && <span className="ml-2 text-purple-600">• Synced with account</span>}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-slate-100 rounded-xl text-sm font-semibold text-slate-600">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {cart.map((item) => {
              const currentStock = item.stock || 0;
              const isMaxStock = item.quantity >= currentStock && currentStock > 0;
              
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-4 md:gap-6">
                    <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
                      <img
                        src={item.image || "https://via.placeholder.com/120"}
                        alt={item.name}
                        className="w-full h-full rounded-xl object-cover bg-slate-100"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/120"; }}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-base md:text-lg">{item.name}</h3>
                          <p className="text-sm text-purple-600 mt-1">{item.category}</p>
                          {stockErrors[item.id] && (
                            <p className="text-xs text-red-500 mt-1">{stockErrors[item.id]}</p>
                          )}
                          {!stockErrors[item.id] && currentStock <= 5 && currentStock > 0 && (
                            <p className="text-xs text-orange-500 mt-1">Only {currentStock} left in stock!</p>
                          )}
                          <div className="mt-2 md:hidden">
                            <p className="text-lg font-bold text-purple-600">KSh {item.price.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="hidden md:flex md:items-center md:gap-6">
                          <div className="w-24 text-center">
                            <p className="font-semibold text-slate-900">KSh {item.price.toLocaleString()}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={syncing}
                              className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-purple-50 hover:border-purple-200 transition disabled:opacity-50"
                            >
                              <Minus size={14} className="mx-auto" />
                            </button>
                            <span className="w-10 text-center font-semibold text-slate-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={syncing || (currentStock > 0 && item.quantity >= currentStock)}
                              className={`h-8 w-8 rounded-lg border transition ${
                                (syncing || (currentStock > 0 && item.quantity >= currentStock))
                                  ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed" 
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-purple-50 hover:border-purple-200"
                              }`}
                            >
                              <Plus size={14} className="mx-auto" />
                            </button>
                          </div>
                          {(currentStock > 0 && item.quantity >= currentStock) && (
                            <span className="text-[10px] text-orange-500">Max ({currentStock})</span>
                          )}

                          <div className="w-24 text-right">
                            <p className="font-bold text-purple-600">KSh {(item.price * item.quantity).toLocaleString()}</p>
                          </div>

                          <button onClick={() => removeItem(item.id)} disabled={syncing} className="text-red-400 hover:text-red-600 transition disabled:opacity-50">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 md:hidden">
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={syncing} className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-600">
                            <Minus size={14} className="mx-auto" />
                          </button>
                          <span className="font-semibold text-slate-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={syncing || (currentStock > 0 && item.quantity >= currentStock)} className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50">
                            <Plus size={14} className="mx-auto" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-bold text-purple-600">KSh {(item.price * item.quantity).toLocaleString()}</p>
                          <button onClick={() => removeItem(item.id)} disabled={syncing} className="text-red-400">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Stock progress bar */}
                      {currentStock > 0 && (
                        <div className="mt-3 hidden md:block">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>Available: {currentStock} units</span>
                            <span>{Math.min(Math.round((item.quantity / currentStock) * 100), 100)}% of stock</span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-200 rounded-full transition-all"
                              style={{ width: `${Math.min((item.quantity / currentStock) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {cart.length > 0 && (
              <div className="flex justify-between items-center pt-2">
                <button onClick={clearCart} disabled={syncing} className="text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50">
                  Clear Cart
                </button>
                <Link to="/categories" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Continue Shopping →
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-28">
              <h3 className="text-xl font-black text-slate-900 mb-4">Order Summary</h3>

              <div className="space-y-3 pb-4 border-b border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-900">KSh {getSubtotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-slate-400" />
                    <span className="text-slate-600">Delivery Fee</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {getSubtotal() === 0 ? "KSh 0" : `KSh ${DELIVERY_FEE.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-4">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-purple-600">
                  KSh {getTotal().toLocaleString()}
                </span>
              </div>

              <div className="mb-4 p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-2 justify-center text-xs text-purple-600">
                  <Truck size={14} />
                  <span>Flat delivery fee of KSh {DELIVERY_FEE} for all orders</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || Object.keys(stockErrors).length > 0 || syncing}
                className="w-full rounded-xl bg-purple-600 py-3.5 font-bold text-white transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                Proceed to Checkout
              </button>

              {Object.keys(stockErrors).length > 0 && (
                <p className="text-xs text-red-500 text-center mt-2">Please adjust quantities that exceed available stock</p>
              )}

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1"><ShieldCheck size={12} /><span>Secure Payment</span></div>
                <div className="flex items-center gap-1"><Truck size={12} /><span>Fast Delivery</span></div>
              </div>
            </div>
          </div>
        </div>

        {recommendedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">You may also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="bg-white rounded-xl border border-slate-200 p-3 text-center hover:shadow-md transition">
                    <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="h-24 w-full object-contain mb-2" onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }} />
                    <p className="text-sm font-medium text-slate-800 line-clamp-2">{product.name}</p>
                    <p className="text-purple-600 font-bold mt-1">KSh {product.price?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}