"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    title: "Discover & Read Original Ebooks",
    subtitle: "Explore thousands of ebooks from talented writers around the world.",
    bg: "from-[#0f172a] to-[#1e1b4b]",
  },
  {
    id: 2,
    title: "Share Your Story With The World",
    subtitle: "Are you a writer? Upload your ebook and reach millions of readers.",
    bg: "from-[#0f172a] to-[#1a1a2e]",
  },
  {
    id: 3,
    title: "Find Your Next Favorite Book",
    subtitle: "Browse by genre, price, and popularity to find the perfect read.",
    bg: "from-[#0f172a] to-[#16213e]",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={`min-h-[90vh] bg-gradient-to-br ${slides[current].bg} flex items-center transition-all duration-700`}>
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-white"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-[#6366f1] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block"
            >
              📚 Ebook Sharing Platform
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            >
              {slides[current].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-lg mb-8 max-w-lg"
            >
              {slides[current].subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 flex-wrap"
            >
              <Link
                href="/browse"
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Browse Ebooks
              </Link>
              <Link
                href="/register"
                className="border border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1] hover:text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Start Writing
              </Link>
            </motion.div>

            {/* Dots */}
            <div className="flex gap-2 mt-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3 h-3 rounded-full transition ${
                    i === current ? "bg-[#6366f1] w-8" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              {/* Book Cards */}
              <div className="w-64 h-80 bg-[#1e293b] rounded-2xl shadow-2xl flex items-center justify-center border border-[#6366f1]/30">
                <div className="text-center text-white p-6">
                  <div className="text-8xl mb-4">📖</div>
                  <p className="text-[#6366f1] font-bold text-lg">10,000+</p>
                  <p className="text-gray-400 text-sm">Ebooks Available</p>
                </div>
              </div>
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-6 -right-6 bg-[#6366f1] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg"
              >
                ✨ New Arrivals
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-6 -left-6 bg-[#1e293b] border border-[#6366f1]/30 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg"
              >
                🔥 Trending Now
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}