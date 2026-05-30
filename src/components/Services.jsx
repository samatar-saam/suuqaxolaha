// src/components/Services.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  Store,
  Truck,
  ShieldCheck,
  Headphones,
  Clock,
  CreditCard,
  Package,
  TrendingUp,
  Users,
  Globe,
  Sparkles,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function ServicesPage() {
  const buyerServices = [
    {
      title: "Fast Delivery",
      description: "Get your orders delivered quickly across Kenya with real-time tracking.",
      icon: Truck,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Secure Payments",
      description: "Pay safely with M-Pesa, cards, or cash on delivery – 100% protected.",
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Easy Returns",
      description: "Hassle-free returns within 7 days if you're not satisfied.",
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "24/7 Customer Support",
      description: "Our support team is always here to help you with any issue.",
      icon: Headphones,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Wide Product Selection",
      description: "Thousands of products from local vendors across all categories.",
      icon: ShoppingBag,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      title: "Real-time Order Tracking",
      description: "Follow your order from checkout to your doorstep in real time.",
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const sellerServices = [
    {
      title: "Free Registration",
      description: "Join SuuqHub as a seller at no cost and start selling immediately.",
      icon: Store,
      color: "text-emerald-600",
    },
    {
      title: "Reach More Customers",
      description: "Tap into a growing customer base across Kenya and beyond.",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Easy Product Management",
      description: "Simple dashboard to manage your products, inventory, and orders.",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Analytics & Insights",
      description: "Get valuable insights to grow your sales and understand your audience.",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Secure Payments",
      description: "Receive your earnings securely and on time through multiple channels.",
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      title: "Dedicated Support",
      description: "Seller success team available to help you grow your business.",
      icon: Headphones,
      color: "text-slate-600",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers", icon: Users },
    { value: "500+", label: "Active Sellers", icon: Store },
    { value: "50K+", label: "Products Listed", icon: Package },
    { value: "98%", label: "Satisfaction Rate", icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50 py-20">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-purple-100/50 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 mb-6">
              <Sparkles size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Our Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                shop and sell with confidence
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Whether you're a customer looking for the best local products or a seller
              wanting to grow your business, SuuqHub offers the tools and support you need.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-purple-700 transition"
              >
                Start Shopping <ArrowRight size={16} />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-6 py-3 text-sm font-bold text-purple-600 shadow-sm hover:bg-purple-50 transition"
              >
                Become a Seller
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* For Buyers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-slate-950">
              For <span className="text-purple-600">Buyers</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-slate-500 max-w-2xl mx-auto">
              Enjoy a seamless, secure, and satisfying shopping experience.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {buyerServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  variants={fadeUp}
                  className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${service.bg}`}>
                    <Icon size={22} className={service.color} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                  <p className="mt-2 text-slate-500 leading-relaxed">{service.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon size={20} className="text-purple-600" />
                  </div>
                  <div className="text-3xl font-black text-purple-700">{stat.value}</div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Sellers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-slate-950">
              For <span className="text-purple-600">Sellers</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-slate-500 max-w-2xl mx-auto">
              Grow your business with powerful tools and dedicated support.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sellerServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  variants={fadeUp}
                  className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Icon size={22} className={service.color} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                  <p className="mt-2 text-slate-500 leading-relaxed">{service.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-purple-900">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Ready to experience the best of local commerce?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-purple-100 text-lg">
              Join thousands of happy customers and successful sellers on SuuqHub today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-purple-700 shadow-lg hover:shadow-xl transition"
              >
                Start Shopping <ArrowRight size={16} />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-3 text-sm font-bold text-white hover:bg-white/20 transition"
              >
                Join as Seller
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}