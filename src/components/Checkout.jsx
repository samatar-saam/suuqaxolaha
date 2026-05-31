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
  Smartphone,
  Banknote,
  ChevronRight,
  ChevronLeft,
  Package,
  Lock,
  Key,
  AlertCircle,
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  
  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentPin, setPaymentPin] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const generateTrackingNumber = () => {
    const prefix = "SUQ";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 2500 ? 0 : 250;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleInputChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    if (step === 1) {
      if (cart.length === 0) {
        alert("Your cart is empty");
        navigate("/cart");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!shippingDetails.fullName || !shippingDetails.email || !shippingDetails.phone || !shippingDetails.address) {
        alert("Please fill in all required fields.");
        return;
      }
      if (!shippingDetails.email.includes("@")) {
        alert("Please enter a valid email address.");
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Open payment modal instead of placing order directly
  const openPaymentModal = () => {
    if (!shippingDetails.fullName || !shippingDetails.email || !shippingDetails.phone || !shippingDetails.address) {
      alert("Please fill in all required fields.");
      return;
    }
    setShowPaymentModal(true);
    setPaymentPin("");
    setPaymentError("");
  };

  // Process payment with PIN
  const processPayment = async () => {
    if (!paymentPin.trim()) {
      setPaymentError("Please enter your PIN/Password");
      return;
    }

    // Validate PIN based on payment method
    if (paymentMethod === "mpesa") {
      if (paymentPin.length < 4) {
        setPaymentError("M-PESA PIN must be at least 4 digits");
        return;
      }
      if (!/^\d+$/.test(paymentPin)) {
        setPaymentError("M-PESA PIN must contain only numbers");
        return;
      }
    } else if (paymentMethod === "card") {
      if (paymentPin.length < 3) {
        setPaymentError("Card CVV must be 3-4 digits");
        return;
      }
    } else if (paymentMethod === "cod") {
      // Cash on Delivery - no PIN validation needed
      // Just confirm the order
    }

    setIsProcessing(true);
    setPaymentError("");

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, accept any valid PIN
    // In production, you would verify with your payment gateway
    
    setShowPaymentModal(false);
    await placeOrder();
    setIsProcessing(false);
  };

  const placeOrder = async () => {
    setLoading(true);

    const newTrackingNumber = generateTrackingNumber();
    const orderIdValue = `ORD-${Date.now()}`;

    const orderData = {
      id: orderIdValue,
      trackingNumber: newTrackingNumber,
      customerName: shippingDetails.fullName,
      customerEmail: shippingDetails.email,
      customerPhone: shippingDetails.phone,
      shippingAddress: {
        street: shippingDetails.address,
        city: shippingDetails.city,
        postalCode: shippingDetails.postalCode || "70100",
        country: "Kenya",
      },
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      total: getTotal(),
      paymentMethod: paymentMethod,
      paymentStatus: "completed",
      status: "pending",
      notes: shippingDetails.notes,
      createdAt: new Date().toISOString(),
    };

    try {
      const orderResponse = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderItemsPromises = cart.map(async (item) => {
        const orderItem = {
          id: `ITEM-${Date.now()}-${item.id}`,
          orderId: orderIdValue,
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          category: item.category || "Uncategorized",
          createdAt: new Date().toISOString(),
        };

        const response = await fetch("http://localhost:5000/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderItem),
        });

        if (!response.ok) {
          console.error("Failed to save order item:", item.name);
        }
        return response;
      });

      await Promise.all(orderItemsPromises);

      localStorage.removeItem("cart");
      setOrderId(orderIdValue);
      setTrackingNumber(newTrackingNumber);
      setOrderPlaced(true);
      
    } catch (error) {
      console.error("Order error:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get modal title and placeholder based on payment method
  const getPaymentModalConfig = () => {
    switch (paymentMethod) {
      case "mpesa":
        return {
          title: "Enter M-PESA PIN",
          icon: Smartphone,
          placeholder: "Enter your M-PESA PIN",
          inputType: "password",
          hint: "Enter the 4-6 digit PIN you use for M-PESA transactions",
        };
      case "card":
        return {
          title: "Enter Card CVV",
          icon: CreditCard,
          placeholder: "Enter CVV",
          inputType: "password",
          hint: "Enter the 3-digit security code on the back of your card",
        };
      case "cod":
        return {
          title: "Confirm Cash on Delivery",
          icon: Banknote,
          placeholder: "Type 'CONFIRM' to proceed",
          inputType: "text",
          hint: "You will pay KSh " + getTotal().toLocaleString() + " when your order arrives",
        };
      default:
        return {
          title: "Payment Confirmation",
          icon: Lock,
          placeholder: "Enter confirmation",
          inputType: "password",
          hint: "Please enter your payment confirmation",
        };
    }
  };

  const modalConfig = getPaymentModalConfig();
  const ModalIcon = modalConfig.icon;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-slate-500 mb-1">Order ID: <span className="font-mono font-semibold text-purple-600">{orderId}</span></p>
            <p className="text-slate-500 mb-4">Tracking Number: <span className="font-mono font-semibold text-purple-600">{trackingNumber}</span></p>
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
          {step > 1 ? (
            <button onClick={prevStep} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:bg-purple-50 transition">
              <ChevronLeft size={20} />
            </button>
          ) : (
            <Link to="/cart" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:bg-purple-50 transition">
              <ArrowLeft size={20} />
            </Link>
          )}
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
            {/* Step 1: Cart Review */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-purple-600" />
                  Review Your Cart
                </h2>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Your cart is empty</p>
                    <Link to="/categories" className="mt-4 inline-block text-purple-600 hover:underline">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-purple-600">KSh {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Shipping Details */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-purple-600" />
                  Shipping Information
                </h2>
                <div className="space-y-4">
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
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-purple-600" />
                  Select Payment Method
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
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <button onClick={prevStep} className="px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">
                  Back
                </button>
              )}
              {step < 3 ? (
                <button onClick={nextStep} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition flex items-center gap-2 ml-auto">
                  Continue
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={openPaymentModal}
                  disabled={loading}
                  className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-70 flex items-center justify-center gap-2 ml-auto"
                >
                  <Lock size={18} />
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-purple-600">KSh {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">KSh {getSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-slate-400" />
                    <span className="text-slate-600">Delivery Fee</span>
                  </div>
                  <span className="text-slate-900">{getDeliveryFee() === 0 ? "Free" : `KSh ${getDeliveryFee()}`}</span>
                </div>
                {getSubtotal() > 2500 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Free Delivery Applied</span>
                    <span>✓</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-xl font-black text-purple-600">KSh {getTotal().toLocaleString()}</span>
                </div>
              </div>

              {getSubtotal() < 2500 && getSubtotal() > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-xl">
                  <div className="flex justify-between text-xs text-purple-600 mb-1">
                    <span>Add KSh {(2500 - getSubtotal()).toLocaleString()} more for FREE delivery</span>
                    <span>{Math.round((getSubtotal() / 2500) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-purple-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${Math.min((getSubtotal() / 2500) * 100, 100)}%` }} />
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={12} />
                <span>Secure payment • SSL encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment PIN Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => !isProcessing && setShowPaymentModal(false)}>
          <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ModalIcon size={28} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{modalConfig.title}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Amount: <span className="font-bold text-purple-600">KSh {getTotal().toLocaleString()}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {paymentMethod === "mpesa" ? "M-PESA PIN" : paymentMethod === "card" ? "CVV Code" : "Confirmation"}
                  </label>
                  <input
                    type={modalConfig.inputType}
                    value={paymentPin}
                    onChange={(e) => {
                      setPaymentPin(e.target.value);
                      setPaymentError("");
                    }}
                    placeholder={modalConfig.placeholder}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg outline-none focus:border-purple-400 text-center"
                    autoFocus
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Key size={12} />
                    {modalConfig.hint}
                  </p>
                </div>

                {paymentError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    <AlertCircle size={16} />
                    {paymentError}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={isProcessing}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={isProcessing}
                    className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Confirm Payment
                      </>
                    )}
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