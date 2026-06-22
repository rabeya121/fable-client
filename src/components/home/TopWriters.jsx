"use client";
import { useEffect, useState } from "react";
import { RiUserLine, RiMedalLine, RiShoppingBagLine } from "react-icons/ri";

const rankColors = [
  { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", medal: "🥇" },
  { bg: "bg-gray-400/20", text: "text-gray-300", border: "border-gray-400/30", medal: "🥈" },
  { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", medal: "🥉" },
];

export default function TopWriters() {
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/writers/top`)
      .then((res) => res.json())
      .then((data) => setWriters(Array.isArray(data) ? data : []))
      .catch(() => setWriters([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Top Writers</h2>
          <p className="text-gray-400">Celebrating authors loved by readers.</p>
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#1e293b] rounded-2xl p-8 animate-pulse border border-gray-800">
                <div className="w-20 h-20 rounded-full bg-[#0f172a] mx-auto mb-4" />
                <div className="h-4 bg-[#0f172a] rounded w-32 mx-auto mb-2" />
                <div className="h-3 bg-[#0f172a] rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        ) : writers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No writers yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {writers.map((writer, i) => (
              <div
                key={i}
                className={`bg-[#1e293b] rounded-2xl p-8 border ${rankColors[i]?.border || "border-gray-800"} hover:border-[#6366f1]/40 transition-all duration-300 group relative overflow-hidden`}
              >
                {/* Background glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : "bg-orange-400"}`} />

                {/* Rank Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${rankColors[i]?.bg} ${rankColors[i]?.text}`}>
                    #{i + 1} Top Writer
                  </span>
                  <span className="text-2xl">{rankColors[i]?.medal}</span>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-full ${rankColors[i]?.bg} border-2 ${rankColors[i]?.border} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    {writer.avatar ? (
                      <img
                        src={writer.avatar}
                        alt={writer.writerName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className={`text-2xl font-bold ${rankColors[i]?.text}`}>
                        {writer.writerName?.charAt(0) || <RiUserLine />}
                      </span>
                    )}
                  </div>

                  <h3 className="text-white font-bold text-lg mb-1">{writer.writerName}</h3>
                  <p className="text-gray-500 text-xs mb-4">{writer._id}</p>

                  {/* Sales Badge */}
                  <div className={`flex items-center gap-2 ${rankColors[i]?.bg} px-4 py-2 rounded-full`}>
                    <RiShoppingBagLine className={`${rankColors[i]?.text} text-sm`} />
                    <span className={`${rankColors[i]?.text} text-sm font-bold`}>
                      {writer.totalSales} Sales
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}