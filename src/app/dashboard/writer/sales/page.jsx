"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

export default function WriterSalesPage() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sales/writer/${user.email}`)
        .then((res) => res.json())
        .then((data) => setSales(Array.isArray(data) ? data : []))
        .catch(() => setSales([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const totalRevenue = sales.reduce(
    (acc, s) => acc + (s.price || s.amount || 0),
    0,
  );
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Sales History</h1>
        <p className="text-gray-400">Track your earnings and sales</p>
      </div>

      {/* Total Revenue */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <RiMoneyDollarCircleLine className="text-green-500 text-2xl" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-white text-3xl font-bold">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-[#0f172a] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-20">
            <RiMoneyDollarCircleLine className="text-5xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No sales yet!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f172a] text-gray-400 text-sm">
                <tr>
                  <th className="text-left px-6 py-4">Ebook Title</th>
                  <th className="text-left px-6 py-4">Buyer</th>
                  <th className="text-left px-6 py-4">Amount</th>
                  <th className="text-left px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {sales.map((sale, i) => (
                  <tr key={i} className="hover:bg-[#0f172a] transition">
                    <td className="px-6 py-4 text-white text-sm font-medium">
                      {sale.ebookTitle}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {sale.userEmail}
                    </td>
                    <td className="px-6 py-4 text-green-400 text-sm font-bold">
                      ${sale.price || sale.amount || 0}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {sale.purchasedAt
                        ? new Date(sale.purchasedAt).toLocaleDateString()
                        : sale.createdAt
                          ? new Date(sale.createdAt).toLocaleDateString()
                          : "N/A"}
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
