// src/components/Home.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/image/image.png"; 

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
  Globe,
  Clock,
  Award,
  TrendingUp,
  CreditCard,
  Package,
} from "lucide-react";

// Hero Background Image
const HERO_BG = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop";

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
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden" ref={targetRef}>
      {/* HERO SECTION - KEPT EXACTLY AS IS */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-0">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt="SuuqHub Marketplace" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/70" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 animate-float-slow z-10 opacity-10">
          <ShoppingBag size={100} className="text-white" />
        </div>
        <div className="absolute bottom-20 left-10 animate-float-fast z-10 opacity-10">
          <Truck size={80} className="text-white" />
        </div>
        <div className="absolute top-1/3 left-1/4 animate-pulse-slow z-10 opacity-5">
          <Star size={120} className="text-white" />
        </div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-5">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2"
          >
            {/* LEFT CONTENT */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex flex-col justify-center space-y-5 text-center lg:text-left py-6 lg:py-0"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-white w-fit mx-auto lg:mx-0"
              >
                <Sparkles size={16} />
                <span className="text-sm font-medium">#1 Marketplace in Kenya</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white"
              >
                Shop Local.
                <br />
                Empower{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                  Business.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg leading-relaxed text-purple-100 max-w-xl mx-auto lg:mx-0"
              >
                Discover thousands of products from local vendors across Kenya.
                Support your community while enjoying a world-class shopping experience.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/categories")}
                  className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  Shop Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                </motion.button>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start pt-4"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-yellow-300">
                    <Users size={14} />
                  </div>
                  <div>
                    <div className="text-base sm:text-xl font-black text-white">10K+</div>
                    <div className="text-[10px] sm:text-xs text-purple-200">Happy Customers</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-yellow-300">
                    <Store size={14} />
                  </div>
                  <div>
                    <div className="text-base sm:text-xl font-black text-white">500+</div>
                    <div className="text-[10px] sm:text-xs text-purple-200">Local Sellers</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex relative justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="relative rounded-[40%_60%_55%_45%/45%_40%_60%_55%] overflow-hidden shadow-2xl border-4 border-white/20">
                  <img
                    src={heroImage}
                    alt="SuuqHub marketplace"
                    className="h-[400px] lg:h-[450px] w-full object-cover"
                  />
                </div>
                {/* <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 shadow-xl"> */}
                  {/* <div className="flex items-center gap-2 sm:gap-3"> */}
                    {/* <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
                      <Truck size={18} />
                    </div> */}
                    {/* <div>
                      <div className="text-xs sm:text-sm font-black text-gray-900">Free Delivery</div>
                      <div className="text-[10px] sm:text-xs text-gray-500">On orders over KSh 2,500</div>
                    </div> */}
                  {/* </div> */}
                {/* </div> */}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid grid-cols-2 gap-4 rounded-[32px] border border-purple-100 bg-white p-5 shadow-xl md:grid-cols-3 lg:grid-cols-6">
          {[
            { value: "800+", label: "Local Vendors", icon: Users },
            { value: "50K+", label: "Products Listed", icon: ShoppingBag },
            { value: "20+", label: "Counties Served", icon: Globe },
            { value: "98%", label: "Secure Payments", icon: ShieldCheck },
            { value: "Fast", label: "Delivery", icon: Truck },
            { value: "4.9★", label: "Customer Rating", icon: Star },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-3xl bg-purple-50/70 p-5 text-center transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white">
                  <Icon size={24} />
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  {item.value}
                </h3>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PURPOSE / MISSION / VISION */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[32px] bg-white p-8 shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-purple-600">
              Our Purpose
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-950">
              Empowering local{" "}
              <span className="text-purple-600">businesses</span>, one order at a
              time.
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              SuuqHub helps local vendors reach more customers online while giving
              shoppers a smooth, trusted, and modern marketplace experience.
            </p>

            <div className="mt-7 h-2 w-24 rounded-full bg-purple-600" />
          </div>

          <div className="rounded-[32px] bg-gradient-to-br from-purple-100 to-fuchsia-100 p-8 shadow-lg">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-md">
              <ShoppingBag size={30} />
            </div>

            <h3 className="text-3xl font-black text-slate-950">Our Mission</h3>

            <p className="mt-4 leading-7 text-slate-600">
              To make online selling simple, secure, and affordable for local
              businesses across Kenya.
            </p>
          </div>

          <div className="rounded-[32px] bg-gradient-to-br from-orange-100 to-amber-100 p-8 shadow-lg">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-md">
              <Globe size={30} />
            </div>

            <h3 className="text-3xl font-black text-slate-950">Our Vision</h3>

            <p className="mt-4 leading-7 text-slate-600">
              To become Africa's trusted digital marketplace known for innovation,
              reliability, and community impact.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="rounded-[36px] bg-white p-8 shadow-xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-purple-600">
              Our Values
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-950">
              What drives SuuqHub every day
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              We build every feature around trust, convenience, and helping local
              businesses grow.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Local First",
                text: "We prioritize Kenyan vendors and local products.",
                icon: Users,
              },
              {
                title: "Trust & Security",
                text: "We protect buyers and sellers with safe experiences.",
                icon: ShieldCheck,
              },
              {
                title: "Quality",
                text: "We focus on better products and reliable service.",
                icon: BadgeCheck,
              },
              {
                title: "Innovation",
                text: "We use technology to improve local commerce.",
                icon: Zap,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-slate-100 bg-slate-50 p-6 text-center transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-white">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] bg-white p-8 shadow-xl">
            <h2 className="text-4xl font-black text-slate-950">
              Why choose{" "}
              <span className="text-purple-600">SuuqHub?</span>
            </h2>

            <div className="mt-8 space-y-4">
              {[
                {
                  title: "Verified Vendors",
                  text: "Shop confidently from trusted local sellers.",
                  icon: BadgeCheck,
                },
                {
                  title: "Secure Payments",
                  text: "Safe checkout with reliable payment options.",
                  icon: CreditCard,
                },
                {
                  title: "Fast Delivery",
                  text: "Quick delivery support across Kenya.",
                  icon: Truck,
                },
                {
                  title: "Customer Support",
                  text: "Helpful support whenever you need assistance.",
                  icon: Headphones,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-purple-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="font-black text-slate-950">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop"
              alt="SuuqHub delivery"
              className="h-72 w-full rounded-[32px] object-cover shadow-xl sm:h-full"
            />

            <div className="grid gap-5">
              <img
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1200&auto=format&fit=crop"
                alt="SuuqHub shopping"
                className="h-52 w-full rounded-[28px] object-cover shadow-xl"
              />

              <div className="rounded-[28px] bg-purple-600 p-7 text-white shadow-xl">
                <Package size={34} />

                <h3 className="mt-4 text-2xl font-black">
                  Built for local commerce
                </h3>

                <p className="mt-3 text-sm leading-6 text-purple-100">
                  Designed for Kenyan sellers, customers, and growing digital trade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="rounded-[36px] bg-gradient-to-r from-purple-700 via-violet-700 to-fuchsia-600 p-8 text-white shadow-2xl lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-4xl font-black leading-tight">
                Be part of the SuuqHub family.
              </h2>

              <p className="mt-3 max-w-2xl text-purple-100">
                Shop smarter, support local vendors, and grow with a marketplace
                built for the community.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-purple-700 hover:bg-gray-50 transition"
              >
                Start Shopping <ArrowRight size={18} />
              </a>

              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-7 py-4 text-sm font-black text-white hover:bg-white/10 transition"
              >
                Join SuuqHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.05); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}