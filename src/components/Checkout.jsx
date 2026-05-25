// src/users/pages/Checkout.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Banknote,
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Form states
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Garissa",
    postalCode: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart.length === 0) {
        navigate("/cart");
      }
      setCart(parsedCart);
    } else {
      navigate("/cart");
    }

    // Pre-fill user data if logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setShippingDetails(prev => ({
          ...prev,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || prev.fullName,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
        }));
      } catch (e) {}
    }
  }, [navigate]);

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal > 2500 ? 0 : 250;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() - promoDiscount;
  };

  const applyPromo = () => {
    // Simulate promo logic – replace with actual API call
    const promos = {
      SAVE10: 0.1,
      SAVE20: 0.2,
      FREESHIP: 0,
    };
    if (promos[promoCode.toUpperCase()]) {
      const discountPercent = promos[promoCode.toUpperCase()];
      let discount = 0;
      if (discountPercent === 0) {
        // free shipping applied elsewhere
        discount = 0;
      } else {
        discount = getSubtotal() * discountPercent;
      }
      setPromoDiscount(discount);
      setPromoApplied(true);
      alert(`Promo code ${promoCode} applied!`);
    } else {
      alert("Invalid promo code");
    }
  };

  const handleInputChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingDetails.fullName || !shippingDetails.email || !shippingDetails.phone || !shippingDetails.address) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // Create order object
    const orderData = {
      id: `ORD-${Date.now()}`,
      customerName: shippingDetails.fullName,
      customerEmail: shippingDetails.email,
      customerPhone: shippingDetails.phone,
      shippingAddress: {
        street: shippingDetails.address,
        city: shippingDetails.city,
        postalCode: shippingDetails.postalCode,
        country: "Kenya",
      },
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      discount: promoDiscount,
      total: getTotal(),
      paymentMethod: paymentMethod,
      status: "pending",
      notes: shippingDetails.notes,
      createdAt: new Date().toISOString(),
    };

    try {
      // Simulate API call – replace with actual POST to /orders
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Clear cart after successful order
        localStorage.removeItem("cart");
        setOrderId(orderData.id);
        setOrderPlaced(true);
        setStep(3);
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-slate-500 mb-2">Your order ID: <span className="font-mono font-semibold text-purple-600">{orderId}</span></p>
            <p className="text-slate-500 mb-6">A confirmation email has been sent to {shippingDetails.email}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard/orders" className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition">
                View My Orders
              </Link>
              <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:bg-purple-50 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
            <p className="text-sm text-slate-500 mt-1">Complete your order securely</p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-purple-600" : "text-slate-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-500"}`}>1</div>
            <span className="text-sm font-medium hidden sm:inline">Cart</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-purple-600" : "text-slate-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-500"}`}>2</div>
            <span className="text-sm font-medium hidden sm:inline">Details</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? "text-purple-600" : "text-slate-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-500"}`}>3</div>
            <span className="text-sm font-medium hidden sm:inline">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-purple-600" />
                Shipping Information
              </h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input type="text" name="fullName" value={shippingDetails.fullName} onChange={handleInputChange} required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input type="email" name="email" value={shippingDetails.email} onChange={handleInputChange} required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                    <input type="tel" name="phone" value={shippingDetails.phone} onChange={handleInputChange} required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                    <input type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Street Address *</label>
                    <input type="text" name="address" value={shippingDetails.address} onChange={handleInputChange} required placeholder="House number, street name" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Order Notes (Optional)</label>
                    <textarea rows={3} name="notes" value={shippingDetails.notes} onChange={handleInputChange} placeholder="Special delivery instructions" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none resize-none focus:border-purple-400" />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-purple-600" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === "mpesa" ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-purple-200"}`}>
                  <input type="radio" name="payment" value="mpesa" checked={paymentMethod === "mpesa"} onChange={() => setPaymentMethod("mpesa")} className="text-purple-600" />
                  <Smartphone size={20} className="text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">M-PESA</p>
                    <p className="text-xs text-slate-500">Pay with M-PESA mobile money</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === "card" ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-purple-200"}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="text-purple-600" />
                  <CreditCard size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Credit / Debit Card</p>
                    <p className="text-xs text-slate-500">Visa, Mastercard, American Express</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === "cod" ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-purple-200"}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="text-purple-600" />
                  <Banknote size={20} className="text-emerald-600" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Cash on Delivery</p>
                    <p className="text-xs text-slate-500">Pay when you receive the order</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="flex justify-end">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Place Order"}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-purple-600">KSh {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input type="text" placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400" />
                  <button onClick={applyPromo} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-purple-50 transition">Apply</button>
                </div>
                {promoApplied && <p className="text-xs text-green-600 mt-1">Discount applied!</p>}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">KSh {getSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Delivery Fee</span>
                  <span className="text-slate-900">{getDeliveryFee() === 0 ? "Free" : `KSh ${getDeliveryFee()}`}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>- KSh {promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-xl font-black text-purple-600">KSh {getTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={12} />
                <span>Secure payment • SSL encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}