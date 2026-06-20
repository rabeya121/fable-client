"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RiBookOpenLine, RiArrowRightLine } from "react-icons/ri";
import EbookCard from "@/components/ebook/EbookCard";

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/ebooks/featured`)
      .then((res) => res.json())
      .then((data) => setEbooks(data))
      .catch(() => setEbooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#0f172a] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Ebooks</h2>
            <p className="text-gray-400">Discover thoughtfully selected favorites from our collection.</p>
          </div>
          <Link href="/browse" className="flex items-center gap-2 text-[#6366f1] hover:text-[#4f46e5] text-sm font-medium transition">
            View All <RiArrowRightLine />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1e293b] rounded-xl overflow-hidden animate-pulse">
                <div className="h-56 bg-[#0f172a]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#0f172a] rounded w-3/4" />
                  <div className="h-3 bg-[#0f172a] rounded w-1/2" />
                  <div className="h-9 bg-[#0f172a] rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-16">
            <RiBookOpenLine className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No featured ebooks yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook, i) => (
              <motion.div
                key={ebook._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <EbookCard ebook={ebook} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}