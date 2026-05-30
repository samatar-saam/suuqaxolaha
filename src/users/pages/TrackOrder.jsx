// src/users/pages/TrackOrder.jsx
import { useState, useEffect } from "react";
import {
  MapPin,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        fetchUserOrders(user);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const fetchUserOrders = async (user) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/orders");
      const allOrders = await response.json();
      
      // Filter orders for current user
      const userOrders = allOrders.filter(order => 
        order.customerEmail?.toLowerCase() === user.email?.toLowerCase() ||
        order.userId === user.id
      );
      
      // Sort by date (newest first)
      userOrders.sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate));
      
      setOrders(userOrders);
      
      // If there are orders, select the most recent one by default
      if (userOrders.length > 0) {
        setSelectedOrder(userOrders[0]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setError("");
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case "delivered": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "shipped": return <Truck className="w-5 h-5 text-purple-500" />;
      case "processing": return <Clock className="w-5 h-5 text-blue-500" />;
      case "pending": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "cancelled": return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      "delivered": "bg-green-100 text-green-700",
      "shipped": "bg-purple-100 text-purple-700",
      "processing": "bg-blue-100 text-blue-700",
      "pending": "bg-yellow-100 text-yellow-700",
      "cancelled": "bg-red-100 text-red-700"
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  const getProgressSteps = (status) => {
    const allSteps = [
      { name: "Order Placed", key: "pending" },
      { name: "Processing", key: "processing" },
      { name: "Shipped", key: "shipped" },
      { name: "Out for Delivery", key: "out_for_delivery" },
      { name: "Delivered", key: "delivered" },
    ];
    
    let currentStepIndex = 0;
    switch(status?.toLowerCase()) {
      case "pending": currentStepIndex = 0; break;
      case "processing": currentStepIndex = 1; break;
      case "shipped": currentStepIndex = 2; break;
      case "out_for_delivery": currentStepIndex = 3; break;
      case "delivered": currentStepIndex = 4; break;
      default: currentStepIndex = 0;
    }
    
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentStepIndex,
      active: index === currentStepIndex,
    }));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
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
          <p className="mt-4 text-slate-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to load orders</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link to="/categories" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <Package size={64} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
        <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
        <Link to="/categories" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Track Your Order</h1>
          <p className="text-sm text-slate-500 mt-1">
            Select an order below to see real-time tracking information
          </p>
        </div>
      </div>

      {/* Orders List - Select order to track */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Orders</h2>
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleSelectOrder(order)}
              className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                selectedOrder?.id === order.id
                  ? "bg-purple-50 border-2 border-purple-500"
                  : "bg-slate-50 border border-slate-200 hover:bg-purple-50/50"
              }`}
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-semibold text-slate-900">#{order.id}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDate(order.createdAt || order.orderDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-purple-600">KSh {order.total?.toLocaleString() || 0}</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                  {order.status || "Pending"}
                </span>
                {selectedOrder?.id === order.id && (
                  <span className="text-purple-600 text-xs font-medium">✓ Selected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Details for Selected Order */}
      {selectedOrder && (
        <div className="space-y-6 animate-fade-in">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-sm text-slate-500">Order ID</p>
                <p className="text-lg font-bold text-purple-600">#{selectedOrder.id}</p>
              </div>
              {selectedOrder.trackingNumber && (
                <div>
                  <p className="text-sm text-slate-500">Tracking Number</p>
                  <p className="text-lg font-semibold text-slate-900 font-mono">{selectedOrder.trackingNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500">Order Date</p>
                <p className="text-lg font-semibold text-slate-900">{formatDate(selectedOrder.createdAt || selectedOrder.orderDate)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="text-lg font-bold text-purple-600">KSh {selectedOrder.total?.toLocaleString() || 0}</p>
              </div>
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status || "Pending"}
                </span>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-900 mb-6">Order Progress</h3>
              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 hidden sm:block"></div>
                <div className="relative flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                  {getProgressSteps(selectedOrder.status).map((step, index) => (
                    <div key={index} className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        step.completed 
                          ? "bg-purple-600 text-white shadow-lg" 
                          : "bg-white border-2 border-slate-300 text-slate-400"
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <div className="text-left sm:text-center">
                        <p className={`text-sm font-semibold ${step.active ? "text-purple-600" : step.completed ? "text-slate-700" : "text-slate-400"}`}>
                          {step.name}
                        </p>
                        {step.active && (
                          <p className="text-xs text-purple-500 mt-1">Current Status</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            {selectedOrder.status?.toLowerCase() !== "delivered" && selectedOrder.status?.toLowerCase() !== "cancelled" && (
              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-purple-700">Estimated Delivery</p>
                    <p className="text-sm text-purple-600">
                      {selectedOrder.estimatedDelivery 
                        ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString()
                        : "3-5 business days"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          {selectedOrder.items && selectedOrder.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Order Items
              </h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <img src={item.image || "https://via.placeholder.com/64"} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-purple-600">KSh {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {selectedOrder.shippingAddress && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm">
                <p className="text-slate-700">{selectedOrder.customerName}</p>
                <p className="text-slate-700">{selectedOrder.shippingAddress.street}</p>
                <p className="text-slate-700">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                <p className="text-slate-700">{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Need Help? - Only Phone Support */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              Need Help?
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition">
                <Phone className="w-4 h-4" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default TrackOrder;