"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiUserLine, RiBookLine } from "react-icons/ri";

export default function TopWriters() {
  const [writers, setWriters] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/writers/top`)
      .then((res) => res.json())
      .then((data) => setWriters(data))
      .catch(() => setWriters([]));
  }, []);

  return (
    <section className="bg-[#1e293b] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Top Writers</h2>
          <p className="text-gray-400">Writers with the most sales on Fable</p>
        </div>

        {writers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No writers yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {writers.map((writer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0f172a] rounded-2xl p-6 text-center border border-gray-800 hover:border-[#6366f1]/40 transition"
              >
                <div className="w-16 h-16 rounded-full bg-[#6366f1] flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {writer.writerName?.charAt(0) || <RiUserLine />}
                </div>
                <h3 className="text-white font-semibold mb-1">{writer.writerName}</h3>
                <p className="text-[#6366f1] text-sm font-medium">{writer.totalSales} Sales</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}