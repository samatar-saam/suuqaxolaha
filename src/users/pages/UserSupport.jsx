// src/users/pages/UserSupport.jsx
import { useState, useEffect } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Send,
  AlertCircle,
  CheckCircle,
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  User,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function UserSupport() {
  const [activeTab, setActiveTab] = useState("faq");
  const [formData, setFormData] = useState({
    subject: "",
    orderId: "",
    message: "",
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      setCurrentUser(user);
    } else {
      setError("Please login to submit support tickets");
    }
  }, []);

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by going to 'My Orders' in your dashboard or using the tracking number sent to your email.",
      category: "orders",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy for eligible items. Items must be unused and in original packaging.",
      category: "returns",
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery typically takes 3-5 business days within major cities, and 5-7 business days for rural areas.",
      category: "shipping",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-PESA, Credit/Debit Cards (Visa, Mastercard), and Cash on Delivery.",
      category: "payments",
    },
    {
      question: "How do I cancel my order?",
      answer: "Orders can be cancelled within 1 hour of placement. Go to 'My Orders' and click 'Cancel Order'.",
      category: "orders",
    },
    {
      question: "How do I become a seller?",
      answer: "Click 'Become a Seller' on our homepage or contact our sales team for more information.",
      category: "seller",
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+254 700 000 000",
      sub: "Mon-Fri, 9am-6pm",
      action: "tel:+254700000000",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "support@suuqhub.com",
      sub: "24/7 Response within 24h",
      action: "mailto:support@suuqhub.com",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      details: "Chat with an agent",
      sub: "Available 9am-9pm",
      action: "#",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError("Please login to submit a support ticket");
      return;
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError("Please fill in subject and message");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const ticketData = {
      id: `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      subject: formData.subject,
      orderId: formData.orderId || "",
      message: formData.message,
      priority: formData.priority,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.email,
      status: "open",
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/support_tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ subject: "", orderId: "", message: "", priority: "medium" });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to submit ticket: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Support ticket error:", error);
      setError(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { name: "All", value: "all", icon: FileText },
    { name: "Orders", value: "orders", icon: ShoppingBag },
    { name: "Payments", value: "payments", icon: CreditCard },
    { name: "Shipping", value: "shipping", icon: Truck },
    { name: "Account", value: "account", icon: User },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const filteredFaqs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const [openFaq, setOpenFaq] = useState(null);

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Please Login</h2>
        <p className="text-slate-500 mb-4">You need to be logged in to access support.</p>
        <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2 text-white">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with View Tickets Button */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <MessageCircle size={24} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Customer Support</h1>
              <p className="text-sm text-slate-500 mt-1">
                Get help with your orders, account, or any questions you have
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/tickets"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
          >
            <Ticket size={16} />
            My Tickets
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method, idx) => {
          const Icon = method.icon;
          return (
            <a
              key={idx}
              href={method.action}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition">
                  <Icon size={22} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{method.title}</h3>
                  <p className="text-sm text-purple-600 mt-1">{method.details}</p>
                  <p className="text-xs text-slate-500 mt-1">{method.sub}</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-slate-400 group-hover:translate-x-1 transition" />
              </div>
            </a>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "faq"
                ? "border-b-2 border-purple-600 text-purple-600 bg-purple-50/30"
                : "text-slate-600 hover:text-purple-600"
            }`}
          >
            Frequently Asked Questions
          </button>
          <button
            onClick={() => setActiveTab("ticket")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "ticket"
                ? "border-b-2 border-purple-600 text-purple-600 bg-purple-50/30"
                : "text-slate-600 hover:text-purple-600"
            }`}
          >
            Submit a Ticket
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === "faq" && (
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedCategory === cat.value
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-purple-100"
                    }`}
                  >
                    <Icon size={14} />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition"
                  >
                    <span className="font-semibold text-slate-900">{faq.question}</span>
                    <ChevronRight
                      size={18}
                      className={`text-slate-400 transition-transform ${
                        openFaq === idx ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
                      <p className="text-sm text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">No FAQs found for this category</p>
              </div>
            )}
          </div>
        )}

        {/* Support Ticket Section */}
        {activeTab === "ticket" && (
          <div className="p-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ticket Submitted!</h3>
                <p className="text-slate-500 mb-6">
                  Thank you for reaching out. Our support team will respond within 24-48 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2 text-white font-semibold hover:bg-purple-700"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief description of your issue"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Order ID (Optional)
                    </label>
                    <input
                      type="text"
                      name="orderId"
                      value={formData.orderId}
                      onChange={handleChange}
                      placeholder="e.g., ORD-12345"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Need assistance</option>
                    <option value="high">High - Urgent issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Please describe your issue in detail..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 resize-none"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-700 transition disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Ticket
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Business Hours</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Monday - Friday</span>
              <span className="font-semibold text-slate-800">9:00 AM - 9:00 PM</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Saturday</span>
              <span className="font-semibold text-slate-800">10:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Sunday</span>
              <span className="font-semibold text-slate-800">Closed</span>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-purple-700">
              <strong>📞 Emergency Support:</strong> For urgent issues outside business hours,
              please email support@suuqhub.com and we'll respond within 2 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}