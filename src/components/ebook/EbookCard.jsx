import Link from "next/link";
import { RiBookOpenLine } from "react-icons/ri";

export default function EbookCard({ ebook, isPurchased = false }) {
  return (
    <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-gray-800 hover:border-[#6366f1]/40 transition duration-300">
      
      {/* Cover Image */}
      <div className="h-56 bg-[#0f172a] flex items-center justify-center overflow-hidden relative">
        {ebook.coverImage ? (
          <img
            src={ebook.coverImage}
            alt={ebook.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <RiBookOpenLine className="text-6xl text-[#6366f1]/40" />
        )}

        {/* Sold Badge */}
        {isPurchased && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ✓ Purchased
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
          {ebook.title}
        </h3>
        <p className="text-gray-400 text-xs mb-2">by {ebook.writerName}</p>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">
          {ebook.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-[#0f172a] text-gray-400 px-2 py-1 rounded-full">
            {ebook.genre}
          </span>
          <span className="text-white font-bold">${ebook.price}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500 text-xs">
            Sales: {ebook.sales || 0}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              ebook.status === "published"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {ebook.status}
          </span>
        </div>

        <Link href={`/ebooks/${ebook._id}`}>
          <button className="w-full bg-[#0f172a] hover:bg-[#6366f1] text-white text-sm font-medium py-2 rounded-lg transition">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}