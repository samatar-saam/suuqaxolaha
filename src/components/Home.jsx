// src/components/HomePage.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import hero1 from "../image/hero1.png";

import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  RotateCcw,
  BadgeCheck,
  Smartphone,
  Shirt,
  Sofa,
  Sparkles,
  Dumbbell,
  BookOpen,
  Car,
  ShoppingBasket,
  Grid2X2,
  Zap,
  Heart,
  Star,
  Store,
  ShoppingBag,
  Users,
  Clock,
  Award,
  TrendingUp,
  CreditCard,
  Package,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function HomePage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);

  const categories = [
    { name: "Electronics", icon: Smartphone, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1400&auto=format&fit=crop", items: "245+ items" },
    { name: "Fashion", icon: Shirt, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1400&auto=format&fit=crop", items: "532+ items" },
    { name: "Home & Living", icon: Sofa, image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1400&auto=format&fit=crop", items: "189+ items" },
    { name: "Beauty", icon: Sparkles, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1400&auto=format&fit=crop", items: "312+ items" },
    { name: "Sports", icon: Dumbbell, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop", items: "167+ items" },
    { name: "Books", icon: BookOpen, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1400&auto=format&fit=crop", items: "423+ items" },
    { name: "Automotive", icon: Car, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop", items: "98+ items" },
    { name: "Groceries", icon: ShoppingBasket, image: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1400&auto=format&fit=crop", items: "567+ items" },
    { name: "More", icon: Grid2X2, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop", items: "Explore" },
  ];

  const featuredProducts = [
    { name: "Premium Wireless Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop", price: "KSh 4,999", oldPrice: "KSh 7,999", rating: 4.9, sales: "2.3k sold" },
    { name: "SmartWatch Ultra", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop", price: "KSh 15,999", oldPrice: "KSh 21,999", rating: 4.8, sales: "1.8k sold" },
    { name: "Designer Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop", price: "KSh 7,999", oldPrice: "KSh 12,999", rating: 4.9, sales: "3.1k sold" },
    { name: "Leather Handbag", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop", price: "KSh 3,499", oldPrice: "KSh 5,999", rating: 4.7, sales: "1.2k sold" },
    { name: "Gaming Keyboard", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1400&auto=format&fit=crop", price: "KSh 6,999", oldPrice: "KSh 9,999", rating: 4.8, sales: "892 sold" },
    { name: "Smart TV 55\"", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1400&auto=format&fit=crop", price: "KSh 54,999", oldPrice: "KSh 69,999", rating: 4.9, sales: "456 sold" },
  ];

  const features = [
    { title: "Free Delivery", text: "On orders over KSh 2,500", icon: Truck },
    { title: "Secure Payments", text: "100% protected transactions", icon: ShieldCheck },
    { title: "Easy Returns", text: "7-day hassle-free returns", icon: RotateCcw },
    { title: "24/7 Support", text: "We're here to help anytime", icon: Headphones },
    { title: "Trusted Vendors", text: "All sellers are verified", icon: BadgeCheck },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers", icon: Users, trend: "+25% this month" },
    { value: "500+", label: "Local Sellers", icon: Store, trend: "+15% this month" },
    { value: "98%", label: "Satisfaction Rate", icon: Award, trend: "+5% this month" },
    { value: "24/7", label: "Customer Support", icon: Clock, trend: "Always available" },
  ];

  const testimonials = [
    { name: "Sarah Mwangi", role: "Fashion Designer", comment: "SuuqHub has transformed my business! The platform is easy to use and customers love it.", rating: 5, image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "James Otieno", role: "Tech Enthusiast", comment: "Best online shopping experience in Kenya. Fast delivery and authentic products.", rating: 5, image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Amina Hassan", role: "Home Baker", comment: "I've found amazing kitchen equipment here. The seller support is incredible!", rating: 4, image: "https://randomuser.me/api/portraits/women/68.jpg" },
  ];

  const brands = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/PayPal_logo.svg/200px-PayPal_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/M-PESA_Logo.svg/200px-M-PESA_Logo.svg.png",
  ];

  const marqueeTexts = [
    "TechHub KE", "Mama Njeri's", "Pure Organics", "StyleHouse", "Urban Fit",
    "Suuq Electronics", "Nairobi Fashion", "Fresh Market", "Garissa Stores", "Smart Deals",
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden" ref={targetRef}>
      {/* HERO SECTION - Clean version with purple blurs and hero1 image */}
      <section className="relative overflow-hidden bg-white px-4 pt-32 pb-12 sm:px-6 md:pt-36 md:pb-16 lg:min-h-[calc(100vh-80px)] lg:py-0">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[280px] w-[280px] rounded-full bg-purple-100/70 blur-[90px] sm:-left-40 sm:-top-40 sm:h-[420px] sm:w-[420px] md:h-[520px] md:w-[520px] md:blur-[110px]" />
          <div className="absolute -bottom-20 -right-24 h-[260px] w-[260px] rounded-full bg-violet-100/60 blur-[90px] sm:bottom-0 sm:right-0 sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] md:blur-[110px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl lg:px-8 xl:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* LEFT CONTENT */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex flex-col justify-center space-y-5 text-center lg:text-left"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-purple-600 w-fit mx-auto lg:mx-0"
              >
                <Sparkles size={16} />
                <span className="text-sm font-medium">#1 Marketplace in Kenya</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mx-auto max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:mx-0 lg:text-[clamp(3rem,5.6vw,5.3rem)] lg:leading-[1.03]"
              >
                Shop Local.
                <br />
                Empower{" "}
                <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-400 bg-clip-text text-transparent">
                  Business.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg lg:mx-0"
              >
                Discover thousands of products from local vendors across Kenya.
                Support your community while enjoying a world-class shopping
                experience.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-400/30 transition-all duration-300 hover:bg-purple-700 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                >
                  <ShoppingBag size={18} />
                  Shop Now
                  <ArrowRight
                    size={16}
                    className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-purple-300 hover:text-purple-700 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                >
                  <Store size={18} />
                  Explore Stores
                </motion.button>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start pt-4"
              >
                {stats.slice(0, 2).map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="text-base sm:text-xl font-black text-gray-900">{stat.value}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 35 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15,
              }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute h-[240px] w-[240px] rounded-full bg-purple-200/40 blur-3xl sm:h-[350px] sm:w-[350px] md:h-[420px] md:w-[420px] lg:h-[470px] lg:w-[470px]" />

              <div className="relative h-[280px] w-full max-w-[320px] overflow-hidden rounded-[42%_58%_50%_50%/45%_45%_55%_55%] bg-purple-50 shadow-2xl shadow-purple-200/70 sm:h-[380px] sm:max-w-[420px] md:h-[450px] md:max-w-[500px] lg:h-[500px] lg:max-w-[550px]">
                <img
                  src={hero1}
                  alt="SuuqHub marketplace"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 shadow-xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
                    <Truck size={18} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-gray-900">Free Delivery</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">On orders over KSh 2,500</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 rounded-full border-2 border-purple-300 flex justify-center">
            <div className="w-1 h-2 bg-purple-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">{feature.text}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* TEXT MARQUEE */}
      <section className="overflow-hidden border-y-2 border-purple-400 bg-white py-4 sm:py-6 shadow-lg">
        <div className="animate-text-marquee flex w-max items-center gap-16 sm:gap-20 whitespace-nowrap">
          {marqueeTexts.map((text, index) => (
            <span
              key={index}
              className="text-xl sm:text-2xl font-black tracking-[0.18em] sm:tracking-[0.22em] text-purple-600 drop-shadow-md"
            >
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950">Shop by Categories</h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">Explore products from trusted local sellers.</p>
          </div>
          <button className="text-xs sm:text-sm font-black text-purple-600 hover:text-purple-700">View all →</button>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-28 sm:h-36 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white text-purple-600">
                    <Icon size={16} />
                  </div>
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="text-sm sm:text-base font-black text-gray-950">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">{category.items}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16 bg-slate-50 rounded-3xl my-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
              <TrendingUp className="text-purple-600" size={18} />
              <span className="text-xs sm:text-sm font-black text-purple-600">Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950">Featured Products</h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">Most popular items this week</p>
          </div>
          <button className="text-xs sm:text-sm font-black text-purple-600 hover:text-purple-700">View all →</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 3).map((product, idx) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <button className="absolute right-3 top-3 sm:right-4 sm:top-4 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-purple-600 hover:text-white">
                  <Heart size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-xs font-semibold">{product.sales}</p>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={12} className={`${star <= product.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-950 line-clamp-2">{product.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-lg sm:text-xl font-black text-purple-600">{product.price}</p>
                  <p className="text-xs sm:text-sm text-gray-400 line-through">{product.oldPrice}</p>
                </div>
                <button className="mt-3 sm:mt-4 w-full rounded-xl bg-purple-600 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-purple-700">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition"
              >
                <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Icon size={22} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-700">{stat.value}</div>
                <div className="text-sm sm:text-base font-semibold text-gray-900 mt-1">{stat.label}</div>
                <div className="text-xs text-green-600 mt-2">{stat.trend}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16 bg-slate-50 rounded-3xl my-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950">What Our Customers Say</h2>
          <p className="mt-2 text-sm text-gray-500">Trusted by thousands of happy shoppers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className={`${star <= testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">"{testimonial.comment}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRANDS SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Trusted Partners</p>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">Secure Payments With</h3>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {brands.map((brand, idx) => (
            <img key={idx} src={brand} alt="Payment method" className="h-8 sm:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition" />
          ))}
        </div>
      </section>

      {/* SELL CTA */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 sm:px-8 py-10 sm:py-14 text-white shadow-xl lg:px-14">
          <div className="grid items-center gap-6 sm:gap-8 text-center lg:grid-cols-2 lg:text-left">
            <div>
              <div className="mb-4 sm:mb-5 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/15 mx-auto lg:mx-0">
                <Store size={22} />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
                Start selling on SuuqHub today.
              </h2>
              <p className="mt-2 sm:mt-4 max-w-lg text-purple-100 text-sm sm:text-base">
                Join thousands of local sellers who are growing their business online.
              </p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-xs text-purple-200">
                  <CreditCard size={14} />
                  <span>No hidden fees</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-200">
                  <Package size={14} />
                  <span>Easy management</span>
                </div>
              </div>
            </div>
            <div className="flex lg:justify-end">
              <button className="inline-flex items-center gap-2 rounded-xl bg-white px-5 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-black text-purple-600 transition hover:bg-gray-50 hover:scale-105">
                Become a Seller <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 sm:px-8 py-10 sm:py-14 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950">
            Get the latest deals first.
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-gray-500">
            Subscribe to receive updates about new products and exclusive offers.
          </p>
          <div className="mx-auto mt-6 sm:mt-8 flex flex-col sm:flex-row max-w-xl rounded-xl border border-gray-300 bg-white p-1 sm:p-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none rounded-xl"
            />
            <button className="mt-2 sm:mt-0 rounded-xl bg-purple-600 px-5 sm:px-6 py-2 sm:py-3 text-sm font-black text-white transition hover:bg-purple-700 sm:ml-2">
              Subscribe
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-400">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-text-marquee {
          animation: marquee 25s linear infinite;
        }
        @media (max-width: 640px) {
          .animate-text-marquee {
            animation-duration: 20s;
          }
        }
      `}</style>
    </main>
  );
}