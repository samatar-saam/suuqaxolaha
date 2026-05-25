import { motion } from "framer-motion";
import hero1 from "../image/hero1.png";
import {
  ArrowRight,
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
  const categories = [
    {
      name: "Electronics",
      icon: Smartphone,
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Fashion",
      icon: Shirt,
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Home & Living",
      icon: Sofa,
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Beauty",
      icon: Sparkles,
      image:
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Sports",
      icon: Dumbbell,
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Books",
      icon: BookOpen,
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Automotive",
      icon: Car,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Groceries",
      icon: ShoppingBasket,
      image:
        "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "More Categories",
      icon: Grid2X2,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop",
    },
  ];

  const products = [
    {
      name: "Wireless Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop",
      price: "KSh 4,999",
      oldPrice: "KSh 6,499",
      discount: "-20%",
    },
    {
      name: "Smart Watch",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop",
      price: "KSh 15,999",
      oldPrice: "KSh 18,999",
      discount: "-15%",
    },
    {
      name: "Nike Sneakers",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop",
      price: "KSh 7,999",
      oldPrice: "KSh 10,999",
      discount: "-25%",
    },
    {
      name: "Women Handbag",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop",
      price: "KSh 2,999",
      oldPrice: "KSh 4,299",
      discount: "-30%",
    },
  ];

  const marqueeTexts = [
    "TechHub KE",
    "Mama Njeri's",
    "Pure Organics",
    "StyleHouse",
    "Urban Fit",
    "Suuq Electronics",
    "Nairobi Fashion",
    "Fresh Market",
    "Garissa Stores",
    "Smart Deals",
    "TechHub KE",
    "Mama Njeri's",
    "Pure Organics",
    "StyleHouse",
    "Urban Fit",
    "Suuq Electronics",
    "Nairobi Fashion",
    "Fresh Market",
    "Garissa Stores",
    "Smart Deals",
  ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 md:py-16 lg:min-h-[calc(100vh-80px)] lg:py-0">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[280px] w-[280px] rounded-full bg-purple-100/70 blur-[90px] sm:-left-40 sm:-top-40 sm:h-[420px] sm:w-[420px] md:h-[520px] md:w-[520px] md:blur-[110px]" />
          <div className="absolute -bottom-20 -right-24 h-[260px] w-[260px] rounded-full bg-violet-100/60 blur-[90px] sm:bottom-0 sm:right-0 sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] md:blur-[110px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl lg:px-8 xl:px-12">
          <div className="grid items-center gap-8 lg:min-h-[calc(100vh-80px)] lg:grid-cols-2 lg:gap-12">
            {/* LEFT CONTENT */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex flex-col justify-center space-y-5 text-center lg:text-left"
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* TEXT MARQUEE */}
      <section className="overflow-hidden border-y-2 border-purple-400 bg-white py-3 shadow-lg sm:py-4 md:py-6">
        <div className="animate-text-marquee flex w-max items-center gap-8 whitespace-nowrap sm:gap-12 md:gap-20">
          {marqueeTexts.map((text, index) => (
            <span
              key={index}
              className="text-base font-black tracking-[0.12em] text-purple-600 drop-shadow-md sm:text-xl md:text-2xl md:tracking-[0.22em]"
            >
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-950 sm:text-3xl">
              Shop by Categories
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
              Explore products from trusted local sellers.
            </p>
          </div>
          <button className="w-fit text-xs font-black text-purple-600 sm:text-sm">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.name}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl"
              >
                <div className="relative h-36 overflow-hidden sm:h-44">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 sm:bottom-4 sm:left-4 sm:h-12 sm:w-12 sm:rounded-2xl">
                    <Icon size={20} className="sm:h-6 sm:w-6" />
                  </div>
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="text-sm font-black text-gray-950 sm:text-base">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Latest products
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FLASH DEALS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
              <Zap className="h-5 w-5 text-yellow-500 sm:h-[22px] sm:w-[22px]" />
              <span className="text-xs font-black text-purple-600 sm:text-sm">
                Limited time offers
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-950 sm:text-3xl">
              Flash Deals
            </h2>
          </div>
          <button className="w-fit text-xs font-black text-purple-600 sm:text-sm">
            View all deals
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.name}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl"
            >
              <div className="relative h-56 overflow-hidden bg-gray-50 sm:h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white sm:left-4 sm:top-4 sm:px-3 sm:py-1">
                  {product.discount}
                </span>
                <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-purple-600 hover:text-white sm:right-4 sm:top-4 sm:h-11 sm:w-11">
                  <Heart size={16} className="sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>

              <div className="p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-0.5 sm:mb-3 sm:gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className="fill-yellow-400 text-yellow-400 sm:h-[14px] sm:w-[14px]"
                    />
                  ))}
                  <span className="ml-1 text-xs font-semibold text-gray-500">
                    4.8
                  </span>
                </div>

                <h3 className="text-base font-black text-gray-950 sm:text-lg">
                  {product.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="text-lg font-black text-purple-600 sm:text-xl">
                    {product.price}
                  </p>
                  <p className="text-xs text-gray-400 line-through sm:text-sm">
                    {product.oldPrice}
                  </p>
                </div>

                <button className="mt-4 w-full rounded-xl bg-purple-600 py-2.5 text-xs font-black text-white transition hover:bg-purple-700 sm:mt-5 sm:rounded-2xl sm:py-3 sm:text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SELL CTA */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
        <div className="overflow-hidden rounded-2xl bg-purple-600 px-5 py-10 text-white sm:rounded-[32px] sm:px-8 sm:py-14 lg:px-14">
          <div className="grid items-center gap-6 text-center lg:grid-cols-2 lg:text-left">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 sm:mb-5 sm:h-14 sm:w-14">
                <Store size={24} className="sm:h-7 sm:w-7" />
              </div>
              <h2 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
                Start selling on SuuqHub today.
              </h2>
              <p className="mt-3 max-w-lg text-purple-100 sm:mt-4">
                Reach more customers and grow your local business online.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-purple-600 transition hover:bg-gray-50 sm:w-auto sm:px-7 sm:py-4">
                Become a Seller <ArrowRight size={16} className="sm:h-[17px] sm:w-[17px]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-10 text-center sm:rounded-[32px] sm:px-8 sm:py-14">
          <h2 className="text-2xl font-black text-gray-950 sm:text-3xl md:text-4xl">
            Get the latest deals first.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 sm:mt-4 sm:text-base">
            Subscribe to receive updates about new products and offers.
          </p>
          <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 rounded-xl border border-gray-300 bg-white p-1 sm:mt-8 sm:flex-row sm:rounded-2xl sm:p-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-h-10 flex-1 rounded-lg bg-transparent px-3 text-sm outline-none sm:min-h-12 sm:px-4"
            />
            <button className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-black text-white transition hover:bg-purple-700 sm:rounded-xl sm:px-6 sm:py-3">
              Subscribe
            </button>
          </div>
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