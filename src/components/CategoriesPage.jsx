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
} from "lucide-react";

export default function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Electronics");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on mount
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart]);

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

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  // Filter products by active category and search term
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = product.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && product.status === "active";
    });
  }, [products, activeCategory, searchTerm]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  const addToCart = () => {
    if (!selectedProduct) return;

    const existingItem = cart.find(item => item.id === selectedProduct.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
        category: selectedProduct.category,
        quantity: quantity,
      }];
    }

    setCart(updatedCart);
    closeModal();
    alert(`Added ${quantity} x ${selectedProduct.name} to cart!`);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-24 max-w-7xl items-center gap-5 px-5">
          <a href="/" className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:text-purple-600">
            <ArrowLeft size={24} />
          </a>
          <div className="flex flex-1 items-center rounded-full border border-slate-200 bg-slate-100 px-5 py-4">
            <Search className="text-slate-400" size={24} />
            <input
              type="text"
              placeholder="Search on SuuqHub"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-4 w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <ShoppingCart size={24} className="text-slate-600" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-[260px_1fr] gap-6 px-5 py-6">
        <aside className="sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-sm">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex w-full items-center gap-4 border-b border-slate-100 px-6 py-6 text-left transition ${
                  isActive ? "border-l-4 border-l-purple-600 bg-purple-50 text-purple-700" : "text-slate-700 hover:bg-slate-50 hover:text-purple-600"
                }`}
              >
                <Icon size={22} />
                <span className="text-sm font-bold">{category.name}</span>
              </button>
            );
          })}
        </aside>

        <div className="space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[30px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Package size={52} className="text-purple-500" />
              <h2 className="mt-5 text-2xl font-black text-slate-900">No products found</h2>
              <p className="mt-2 max-w-md text-slate-500">
                Products posted by the admin under {activeCategory} will appear here automatically.
              </p>
            </div>
          ) : (
            // Single card for the active category (no subcategory grouping)
            <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-7 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-950">{activeCategory}</h2>
                <button className="flex items-center gap-1 text-sm font-black text-purple-600">
                  See All <ChevronRight size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group cursor-pointer text-center"
                    onClick={() => openModal(product)}
                  >
                    <div className="overflow-hidden rounded-[24px] bg-slate-50 p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-40 w-full object-contain transition duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-800">{product.name}</h3>
                    <p className="mt-1 text-sm font-black text-purple-600">
                      KSh {product.price?.toLocaleString()}
                    </p>
                    {product.oldPrice && (
                      <p className="text-xs text-slate-400 line-through">
                        KSh {product.oldPrice?.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal (unchanged) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeModal}>
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg"
            >
              <X size={20} />
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
                <h2 className="text-2xl font-black text-slate-950">
                  {selectedProduct.name}
                </h2>
                <p className="text-sm text-purple-600 mt-1">{selectedProduct.category}</p>
                <p className="mt-3 text-slate-600">
                  {selectedProduct.description || "No description available."}
                </p>

                <div className="mt-4">
                  <p className="text-3xl font-black text-purple-600">
                    KSh {selectedProduct.price?.toLocaleString()}
                  </p>
                  {selectedProduct.oldPrice && (
                    <p className="text-sm text-slate-400 line-through">
                      KSh {selectedProduct.oldPrice?.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-slate-500">
                    Stock: {selectedProduct.stock || 1} units
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-slate-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-slate-100"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-slate-100"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={addToCart}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-bold text-white hover:bg-purple-700"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
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