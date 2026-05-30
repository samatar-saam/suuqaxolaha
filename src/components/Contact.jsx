// src/components/Contact.jsx
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
 
  CheckCircle,
  AlertCircle,
  Globe,
  Headphones,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate API call - In production, send to your backend
    const contactData = {
      id: `MSG-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: "unread",
    };

    try {
      // Save to your JSON server (optional)
      const response = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      // Still show success for demo, but log the error
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Garissa Town, Garissa, Kenya",
      sub: "Opposite Garissa University Gate",
      action: "https://maps.google.com/?q=Garissa,Kenya",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+254 727 568 279",
      sub: "Mon-Fri, 9am-6pm",
      action: "tel:+254727568279",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "support@suuqhub.com",
      sub: "24/7 Response within 24h",
      action: "mailto:support@suuqhub.com",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Monday - Friday: 9am - 9pm",
      sub: "Saturday: 10am - 6pm | Sunday: Closed",
      action: null,
    },
  ];



  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting 'My Orders' section, or using the tracking number sent to your email.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy for eligible items. Items must be unused and in original packaging.",
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery typically takes 3-5 business days within major cities, and 5-7 business days for rural areas.",
    },
    {
      question: "How do I become a seller?",
      answer: "Click 'Become a Seller' on our homepage or contact our sales team at sellers@suuqhub.com for more information.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-4">
            <Headphones size={32} className="text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Have questions about your order, need help with a product, or want to learn more about SuuqHub? 
            We'd love to hear from you!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-purple-50 rounded-xl mb-4 group-hover:bg-purple-100 transition">
                    <Icon size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{info.title}</h3>
                  <p className="text-sm text-slate-600 mb-1">{info.details}</p>
                  <p className="text-xs text-slate-400">{info.sub}</p>
                  {info.action && (
                    <a
                      href={info.action}
                      target={info.action.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="mt-3 text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
                    >
                      {info.title === "Call Us" ? "Call Now" : info.title === "Email Us" ? "Send Email" : "Get Directions"} →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Send size={20} />
                Send us a Message
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                We'll get back to you within 24 hours
              </p>
            </div>

            <div className="p-6">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 mb-4">
                    Thank you for reaching out. Our support team will respond to your message shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2 text-white font-semibold hover:bg-purple-700 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 transition"
                    />
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
                      placeholder="Please describe your question or concern in detail..."
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
                    className="w-full rounded-xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Side - FAQs & Social */}
          <div className="space-y-6">
            {/* FAQs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageCircle size={20} />
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  Quick answers to common questions
                </p>
              </div>
              <div className="p-6 space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                    <p className="text-sm text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe size={20} />
                  Connect With Us
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  Follow us on social media for updates and offers
                </p>
              </div>
              <div className="p-6">
                {/* <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 rounded-xl ${social.color} px-4 py-3 text-white font-semibold hover:opacity-90 transition`}
                      >
                        <Icon size={18} />
                        {social.name}
                      </a>
                    );
                  })}
                </div> */}
                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Headphones size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">24/7 Customer Support</p>
                      <p className="text-xs text-slate-500">Our team is always here to help you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-800 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin size={20} />
              Find Us Here
            </h2>
          </div>
          <div className="p-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255086.4407733637!2d39.6182921!3d-0.463859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1825da8a9dcf32e1%3A0xe4b2b8a2c9f7e2b!2sGarissa!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SuuqHub Location"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>

        {/* Support Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Need Immediate Assistance?</h3>
          <p className="text-purple-100 mb-6">
            Our customer support team is ready to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254727568279"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-purple-600 font-bold hover:bg-purple-50 transition"
            >
              <Phone size={18} />
              Call Support
            </a>
            <a
              href="mailto:support@suuqhub.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-6 py-3 text-white font-bold hover:bg-purple-800 transition"
            >
              <Mail size={18} />
              Email Support
            </a>
            <Link
              to="/dashboard/support"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-800 px-6 py-3 text-white font-bold hover:bg-purple-900 transition"
            >
              <MessageCircle size={18} />
              Submit a Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}