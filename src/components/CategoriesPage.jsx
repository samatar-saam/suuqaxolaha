// src/components/CategoriesPage.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ArrowLeft,
  ChevronRight,
  Headphones,
  FlaskConical,
  Sofa,
  Shirt,
  Laptop,
  Gamepad2,
  Baby,
  Dumbbell,
  ShoppingBasket,
  Car,
  BookOpen,
  Flower2,
  Package,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  MessageSquare,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Electronics");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [user, setUser] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState(null);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        const totalItems = parsedCart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } catch (e) {}
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart]);

  // Load wishlist based on user login status
  useEffect(() => {
    loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    setLoadingWishlist(true);
    
    if (user && user.id) {
      // Logged in user - load from database
      try {
        const response = await fetch(`http://localhost:5000/wishlists?userId=${user.id}`);
        const wishlistItems = await response.json();
        
        // Fetch product details for each wishlist item
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
                  addedAt: item.createdAt
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
        setWishlistIds(new Set(validWishlist.map(item => item.productId)));
        
      } catch (error) {
        console.error("Failed to load wishlist from database:", error);
      }
    } else {
      // Guest user - load from localStorage
      const savedWishlist = localStorage.getItem("public_wishlist");
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlist(parsedWishlist);
          setWishlistIds(new Set(parsedWishlist.map(item => item.id)));
        } catch (e) {}
      }
    }
    
    setLoadingWishlist(false);
  };

  // Fetch products, reviews, and user orders
  useEffect(() => {
    fetchProducts();
    fetchReviews();
    if (user) fetchUserOrders();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders");
      const allOrders = await res.json();
      const userOrdersList = allOrders.filter(
        (order) => order.customerEmail === user.email || order.userId === user.id
      );
      setUserOrders(userOrdersList);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const categories = [
    { name: "Electronics", icon: Headphones },
    { name: "Health & Beauty", icon: FlaskConical },
    { name: "Home & Living", icon: Sofa },
    { name: "Fashion", icon: Shirt },
    { name: "Computing", icon: Laptop },
    { name: "Gaming", icon: Gamepad2 },
    { name: "Baby Products", icon: Baby },
    { name: "Sports & Outdoors", icon: Dumbbell },
    { name: "Supermarket", icon: ShoppingBasket },
    { name: "Automotive", icon: Car },
    { name: "Books & Stationery", icon: BookOpen },
    { name: "Garden & Outdoor", icon: Flower2 },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = product.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && product.status === "active";
    });
  }, [products, activeCategory, searchTerm]);

  const productReviews = useMemo(() => {
    if (!selectedProduct) return [];
    return reviews.filter(
      (review) => review.productId === selectedProduct.id && review.status === "approved"
    );
  }, [reviews, selectedProduct]);

  const checkCanReview = (product) => {
    if (!user) return false;
    const alreadyReviewed = reviews.some(
      (review) => review.productId === product.id && review.userEmail === user.email
    );
    if (alreadyReviewed) return false;
    const hasPurchased = userOrders.some((order) =>
      order.items?.some((item) => item.productId === product.id || item.id === product.id)
    );
    return hasPurchased;
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    if (user) setCanReview(checkCanReview(product));
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setShowReviewModal(false);
    setReviewRating(5);
    setReviewComment("");
  };

  const handleQuantityChange = (newQuantity) => {
    if (!selectedProduct) return;
    const stock = selectedProduct.stock || 1;
    const clamped = Math.min(Math.max(1, newQuantity), stock);
    setQuantity(clamped);
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const stock = selectedProduct.stock || 1;
    if (quantity > stock) {
      alert(`Only ${stock} item(s) available in stock.`);
      return;
    }
    if (stock === 0) {
      alert("This product is out of stock.");
      return;
    }

    const existingItem = cart.find((item) => item.id === selectedProduct.id);
    let updatedCart;
    if (existingItem) {
      const newTotal = existingItem.quantity + quantity;
      if (newTotal > stock) {
        alert(`You already have ${existingItem.quantity} in cart. Only ${stock - existingItem.quantity} more can be added.`);
        return;
      }
      updatedCart = cart.map((item) =>
        item.id === selectedProduct.id ? { ...item, quantity: newTotal } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
          category: selectedProduct.category,
          quantity,
        },
      ];
    }
    setCart(updatedCart);
    closeModal();
    alert(`Added ${quantity} x ${selectedProduct.name} to cart!`);
  };

  // Updated addToWishlist function - works for both guest and logged-in users
  const addToWishlist = async (product, e) => {
    e.stopPropagation();
    
    if (user && user.id) {
      // LOGGED IN USER - Save to database
      setLoadingWishlist(true);
      
      try {
        // Check if already in wishlist
        const checkRes = await fetch(`http://localhost:5000/wishlists?userId=${user.id}&productId=${product.id}`);
        const existing = await checkRes.json();
        
        if (existing.length > 0) {
          setWishlistMessage({
            type: "info",
            text: `${product.name} is already in your wishlist! ❤️`
          });
          setTimeout(() => setWishlistMessage(null), 2000);
          setLoadingWishlist(false);
          return;
        }
        
        // Add to database wishlist
        const response = await fetch("http://localhost:5000/wishlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: Date.now(),
            userId: user.id,
            productId: product.id,
            createdAt: new Date().toISOString()
          }),
        });
        
        if (response.ok) {
          // Update local state
          const wishlistItem = {
            id: Date.now(),
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            addedAt: new Date().toISOString()
          };
          setWishlist(prev => [...prev, wishlistItem]);
          setWishlistIds(prev => new Set([...prev, product.id]));
          
          setWishlistMessage({
            type: "success",
            text: `✅ "${product.name}" added to your wishlist!`
          });
          setTimeout(() => setWishlistMessage(null), 2000);
        }
      } catch (error) {
        console.error("Failed to add to wishlist:", error);
        setWishlistMessage({
          type: "error",
          text: "Failed to add to wishlist. Please try again."
        });
        setTimeout(() => setWishlistMessage(null), 2000);
      } finally {
        setLoadingWishlist(false);
      }
    } else {
      // GUEST USER - Save to localStorage
      const currentWishlist = JSON.parse(localStorage.getItem("public_wishlist") || "[]");
      const already = currentWishlist.some((item) => item.id === product.id);
      
      if (already) {
        setWishlistMessage({
          type: "info",
          text: `${product.name} is already in your wishlist! ❤️`
        });
        setTimeout(() => setWishlistMessage(null), 2000);
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
        stock: product.stock || 10,
        addedAt: new Date().toISOString()
      };
      
      const updatedWishlist = [...currentWishlist, wishlistItem];
      setWishlist(updatedWishlist);
      setWishlistIds(new Set([...wishlistIds, product.id]));
      localStorage.setItem("public_wishlist", JSON.stringify(updatedWishlist));
      
      setWishlistMessage({
        type: "success",
        text: `✅ "${product.name}" added to wishlist!`
      });
      setTimeout(() => setWishlistMessage(null), 2000);
    }
  };

  const submitReview = async () => {
    if (!user) {
      alert("Please login to leave a review.");
      return;
    }
    if (!reviewComment.trim()) {
      alert("Please enter a review comment.");
      return;
    }

    const reviewData = {
      id: `rev_${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      userId: user.id,
      userEmail: user.email,
      userName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
      rating: reviewRating,
      comment: reviewComment,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      if (response.ok) {
        alert("Review submitted! It will appear after admin approval.");
        setShowReviewModal(false);
        setReviewRating(5);
        setReviewComment("");
        await fetchReviews();
        setCanReview(false);
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const getRatingStars = (rating, size = 14) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = (productId) => {
    const productReviewsList = reviews.filter(
      (r) => r.productId === productId && r.status === "approved"
    );
    if (productReviewsList.length === 0) return null;
    const avg = productReviewsList.reduce((sum, r) => sum + r.rating, 0) / productReviewsList.length;
    return avg.toFixed(1);
  };

  const isOutOfStock = (product) => !product.stock || product.stock === 0;

  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      {/* Toast Message */}
      {wishlistMessage && (
        <div className={`fixed top-24 right-5 z-50 px-4 py-2 rounded-lg shadow-lg ${
          wishlistMessage.type === "success" ? "bg-green-500 text-white" : 
          wishlistMessage.type === "error" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
        }`}>
          {wishlistMessage.text}
        </div>
      )}

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:text-purple-600 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          {/* Search Bar */}
          <div className="flex flex-1 items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2">
            <Search className="text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search products on SuuqHub..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-3 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={() => navigate(user && user.id ? "/dashboard/wishlist" : "/wishlist")}
            className="relative p-2 rounded-full hover:bg-purple-50 transition"
          >
            <Heart size={20} className="text-slate-600 hover:text-purple-600 transition" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 rounded-full hover:bg-purple-50 transition"
          >
            <ShoppingCart size={20} className="text-slate-600 hover:text-purple-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl grid grid-cols-[260px_1fr] gap-6 px-5 py-6">
        {/* Sidebar categories */}
        <aside className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex w-full items-center gap-3 border-b border-slate-100 px-5 py-4 text-left transition ${
                  isActive
                    ? "border-l-4 border-l-purple-600 bg-purple-50 text-purple-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-purple-600"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-semibold">{category.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Product grid */}
        <div className="space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Package size={52} className="text-purple-500" />
              <h2 className="mt-5 text-2xl font-black text-slate-900">No products found</h2>
              <p className="mt-2 max-w-md text-slate-500">
                Products posted by the admin under {activeCategory} will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-950">{activeCategory}</h2>
                <button className="flex items-center gap-1 text-sm font-black text-purple-600">
                  See All <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => {
                  const avgRating = getAverageRating(product.id);
                  const isInWishlist = wishlistIds.has(product.id);
                  
                  return (
                    <div
                      key={product.id}
                      className={`group relative cursor-pointer text-center ${
                        isOutOfStock(product) ? "opacity-50" : ""
                      }`}
                      onClick={() => !isOutOfStock(product) && openModal(product)}
                    >
                      {/* Heart button - always clickable */}
                      <button
                        onClick={(e) => addToWishlist(product, e)}
                        disabled={loadingWishlist}
                        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition disabled:opacity-50"
                      >
                        <Heart
                          size={16}
                          className={
                            isInWishlist
                              ? "fill-red-500 text-red-500"
                              : "text-slate-500 hover:text-red-500"
                          }
                        />
                      </button>

                      <div className="overflow-hidden rounded-xl bg-slate-50 p-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-32 w-full object-contain transition duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-slate-800 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm font-black text-purple-600">
                        KSh {product.price?.toLocaleString()}
                      </p>
                      {product.oldPrice && (
                        <p className="text-xs text-slate-400 line-through">
                          KSh {product.oldPrice?.toLocaleString()}
                        </p>
                      )}
                      {avgRating && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {getRatingStars(parseFloat(avgRating), 10)}
                          <span className="text-[10px] text-slate-500">({avgRating})</span>
                        </div>
                      )}
                      {isOutOfStock(product) && (
                        <p className="text-xs text-red-500 mt-1">Out of stock</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>
            <div className="grid md:grid-cols-2">
              <div className="bg-slate-100 p-6 flex items-center justify-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-64 w-full object-contain"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-black text-slate-950">{selectedProduct.name}</h2>
                <p className="text-sm text-purple-600 mt-1">{selectedProduct.category}</p>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  {selectedProduct.description || "No description available."}
                </p>
                <div className="mt-4">
                  <p className="text-2xl font-black text-purple-600">
                    KSh {selectedProduct.price?.toLocaleString()}
                  </p>
                  {selectedProduct.oldPrice && (
                    <p className="text-sm text-slate-400 line-through">
                      KSh {selectedProduct.oldPrice?.toLocaleString()}
                    </p>
                  )}
                </div>
                {productReviews.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    {getRatingStars(parseFloat(getAverageRating(selectedProduct.id) || "0"), 14)}
                    <span className="text-sm text-slate-600">
                      ({productReviews.length} {productReviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-sm text-slate-500">Stock: {selectedProduct.stock || 0} units</p>
                  {selectedProduct.stock === 0 && (
                    <p className="text-sm text-red-500 mt-1">Out of stock</p>
                  )}
                </div>
                {selectedProduct.stock > 0 ? (
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-slate-100 disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= (selectedProduct.stock || 0)}
                        className="p-2 hover:bg-slate-100 disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={addToCart}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-sm font-bold text-white hover:bg-purple-700 transition"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>
                ) : (
                  <div className="mt-5">
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-300 py-2.5 text-sm font-bold text-gray-500 cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  </div>
                )}
                {canReview && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-50 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-100 transition"
                  >
                    <MessageSquare size={14} /> Write a Review
                  </button>
                )}
              </div>
            </div>
            {productReviews.length > 0 && (
              <div className="border-t border-slate-200 p-5">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MessageSquare size={16} className="text-purple-600" />
                  Customer Reviews
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {productReviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 pb-3 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRatingStars(review.rating, 12)}
                          <span className="text-sm font-medium text-slate-900">
                            {review.userName || "Customer"}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>
            <div className="p-5">
              <div className="text-center mb-3">
                <img
                  src={selectedProduct?.image}
                  alt={selectedProduct?.name}
                  className="w-14 h-14 rounded-xl object-cover mx-auto mb-2"
                />
                <h3 className="text-lg font-bold text-slate-900">Write a Review</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedProduct?.name}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Your Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={28}
                          className={
                            star <= reviewRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReview}
                    className="flex-1 rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}