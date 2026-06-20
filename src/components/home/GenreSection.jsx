"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const genres = [
  { name: "Fiction", icon: "📖", color: "from-purple-500 to-indigo-500" },
  { name: "Mystery", icon: "🔍", color: "from-gray-500 to-gray-700" },
  { name: "Romance", icon: "💕", color: "from-pink-500 to-rose-500" },
  { name: "Sci-Fi", icon: "🚀", color: "from-blue-500 to-cyan-500" },
  { name: "Fantasy", icon: "🧙", color: "from-violet-500 to-purple-500" },
  { name: "Horror", icon: "👻", color: "from-red-500 to-orange-500" },
  { name: "Biography", icon: "👤", color: "from-green-500 to-teal-500" },
  { name: "Self-Help", icon: "💡", color: "from-yellow-500 to-amber-500" },
];

export default function GenreSection() {
  return (
    <section className="bg-[#0f172a] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Browse by Genre</h2>
          <p className="text-gray-400">Find your perfect read by genre</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {genres.map((genre, i) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href={`/browse?genre=${genre.name}`}>
                <div className={`bg-gradient-to-br ${genre.color} rounded-2xl p-6 text-center cursor-pointer hover:opacity-90 transition`}>
                  <p className="text-4xl mb-3">{genre.icon}</p>
                  <p className="text-white font-semibold">{genre.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}