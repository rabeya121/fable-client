"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RiBookOpenLine,
  RiShoppingBagLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

export default function UserPurchasesPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases/${user.email}`)
        .then((r) => r.json())
        .then((d) => setPurchases(Array.isArray(d) ? d : []))
        .catch(() => setPurchases([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const totalSpent = purchases.reduce((acc, p) => acc + (p.price || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Purchased Books</h1>
        <p className="text-gray-400 text-sm">All your purchased ebooks in one place</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1e293b] rounded-2xl p-5 flex items-center justify-between border border-gray-800">
          <div>
            <p className="text-gray-400 text-xs mb-1">Total Purchased</p>
            <p className="text-white text-2xl font-bold">{purchases.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <RiBookOpenLine className="text-blue-400 text-xl" />
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 flex items-center justify-between border border-gray-800">
          <div>
            <p className="text-gray-400 text-xs mb-1">Total Spent</p>
            <p className="text-white text-2xl font-bold">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <RiMoneyDollarCircleLine className="text-green-400 text-xl" />
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 flex items-center justify-between border border-gray-800 col-span-2 md:col-span-1">
          <div>
            <p className="text-gray-400 text-xs mb-1">Last Purchase</p>
            <p className="text-white text-sm font-bold">
              {purchases.length > 0
                ? new Date(purchases[purchases.length - 1]?.purchasedAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <RiCalendarLine className="text-purple-400 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-[#0f172a] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-20">
            <RiShoppingBagLine className="text-5xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No purchases yet!</p>
            <Link
              href="/browse"
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-2 rounded-xl text-sm transition"
            >
              Browse Ebooks
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-6 py-4">Book</th>
                  <th className="text-left px-6 py-4">Writer</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {purchases.map((purchase, i) => (
                  <tr key={i} className="hover:bg-[#0f172a]/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-[#0f172a] rounded-lg overflow-hidden flex-shrink-0">
                          {purchase.coverImage ? (
                            <img
                              src={purchase.coverImage}
                              alt={purchase.ebookTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <RiBookOpenLine className="text-gray-600" />
                            </div>
                          )}
                        </div>
                        <p className="text-white text-sm font-medium line-clamp-1">
                          {purchase.ebookTitle}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {purchase.writerName || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-[#6366f1] text-sm font-bold">
                      ${purchase.price}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(purchase.purchasedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/ebooks/${purchase.ebookId}`}
                        className="flex items-center gap-1 text-xs bg-[#6366f1]/20 text-[#6366f1] hover:bg-[#6366f1]/30 px-3 py-1.5 rounded-xl transition w-fit"
                      >
                        <RiBookOpenLine className="text-sm" /> Read
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}