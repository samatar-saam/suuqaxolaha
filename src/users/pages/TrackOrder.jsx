// src/users/pages/TrackOrder.jsx
import { useState, useEffect } from "react";
import {
  MapPin,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Calendar,
  Search,
  Eye,
  Download,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);

  // Mock recent orders - In production, fetch from API
  useEffect(() => {
    // Fetch user's recent orders from API
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/orders?limit=3");
        const data = await response.json();
        setRecentOrders(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    };
    fetchRecentOrders();
  }, []);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderId && !trackingNumber) {
      setError("Please enter either Order ID or Tracking Number");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      // Mock API call - Replace with actual API endpoint
      // const response = await fetch(`http://localhost:5000/orders/${orderId}`);
      // const data = await response.json();
      
      // Mock order data for demonstration
      setTimeout(() => {
        const mockOrder = {
          id: orderId || "SUQ-2024-001234",
          trackingNumber: trackingNumber || "1Z999AA10123456784",
          date: "2024-01-15",
          estimatedDelivery: "2024-01-20",
          total: 4999,
          status: "shipped",
          statusHistory: [
            { status: "Order Placed", date: "2024-01-15 10:30 AM", completed: true, description: "Your order has been confirmed" },
            { status: "Processing", date: "2024-01-16 02:15 PM", completed: true, description: "Order is being processed" },
            { status: "Shipped", date: "2024-01-17 09:00 AM", completed: true, description: "Your order has been shipped" },
            { status: "Out for Delivery", date: "2024-01-19 08:00 AM", completed: false, description: "Order is out for delivery" },
            { status: "Delivered", date: "2024-01-20", completed: false, description: "Order delivered successfully" },
          ],
          items: [
            { name: "Wireless Headphones", quantity: 1, price: 4999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" },
          ],
          shippingAddress: {
            street: "123 Business Street",
            city: "Garissa",
            postalCode: "70100",
            country: "Kenya"
          },
          customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+254 700 000 000"
          }
        };
        setOrder(mockOrder);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError("Order not found. Please check your Order ID or Tracking Number.");
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case "order placed": return <Package className="w-6 h-6" />;
      case "processing": return <Clock className="w-6 h-6" />;
      case "shipped": return <Truck className="w-6 h-6" />;
      case "out for delivery": return <MapPin className="w-6 h-6" />;
      case "delivered": return <CheckCircle className="w-6 h-6" />;
      default: return <Package className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case "order placed": return "border-purple-500";
      case "processing": return "border-blue-500";
      case "shipped": return "border-indigo-500";
      case "out for delivery": return "border-orange-500";
      case "delivered": return "border-green-500";
      default: return "border-gray-300";
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      "order placed": "bg-purple-100 text-purple-700",
      "processing": "bg-blue-100 text-blue-700",
      "shipped": "bg-indigo-100 text-indigo-700",
      "out for delivery": "bg-orange-100 text-orange-700",
      "delivered": "bg-green-100 text-green-700"
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Track Your Order</h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter your Order ID or Tracking Number to see real-time updates
        </p>
      </div>

      {/* Track Order Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleTrackOrder} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., SUQ-2024-001234"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g., 1Z999AA10123456784"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:bg-white transition"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Tracking...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Track Order
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Details */}
      {order && (
        <div className="space-y-6 animate-fade-in">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-sm text-slate-500">Order ID</p>
                <p className="text-lg font-bold text-purple-600">#{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tracking Number</p>
                <p className="text-lg font-semibold text-slate-900">{order.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Order Date</p>
                <p className="text-lg font-semibold text-slate-900">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="text-lg font-bold text-purple-600">KSh {order.total.toLocaleString()}</p>
              </div>
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Order Progress</h3>
              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200"></div>
                <div className="relative flex justify-between">
                  {order.statusHistory.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
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
                      <p className="mt-2 text-xs font-semibold text-slate-700 max-w-[80px]">
                        {step.status}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(step.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-purple-600">KSh {item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Customer Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Shipping Address
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700">{order.shippingAddress.street}</p>
                <p className="text-slate-700">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="text-slate-700">{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Need Help?
              </h3>
              <div className="space-y-3">
                <button className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700">
                  <Phone className="w-4 h-4" />
                  Contact Support
                </button>
                <button className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700">
                  <MessageCircle className="w-4 h-4" />
                  Live Chat
                </button>
                <button className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700">
                  <Mail className="w-4 h-4" />
                  Email Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && !order && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((recentOrder) => (
              <div key={recentOrder.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-900">#{recentOrder.id}</p>
                  <p className="text-sm text-slate-500">{recentOrder.date}</p>
                </div>
                <p className="font-bold text-purple-600">KSh {recentOrder.total?.toLocaleString() || 0}</p>
                <button
                  onClick={() => setOrderId(recentOrder.id)}
                  className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                >
                  <Eye className="w-4 h-4" />
                  Track
                </button>
              </div>
            ))}
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