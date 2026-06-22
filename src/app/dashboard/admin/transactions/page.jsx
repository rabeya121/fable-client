"use client";
import { useState, useEffect } from "react";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import toast from "react-hot-toast";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/transactions`)
      .then((res) => res.json())
      .then((data) => setTransactions(Array.isArray(data) ? data : []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = transactions.reduce(
    (acc, t) => acc + (t.amount || 0),
    0,
  );
  const completed = transactions.filter((t) => (t.status || "completed") === "completed").length;
const pending = transactions.filter((t) => (t.status || "completed") === "pending" || (t.status || "completed") === "refunded").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          Payments Overview 💳
        </h1>
        <p className="text-gray-400 text-sm">
          Track all transactions between readers and writers.
        </p>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden mb-6">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-[#0f172a] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20">
            <RiMoneyDollarCircleLine className="text-5xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No transactions yet!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="text-left px-6 py-4">Reader</th>
                  <th className="text-left px-6 py-4">Writer</th>
                  <th className="text-left px-6 py-4">Book</th>
                  <th className="text-left px-6 py-4">Amount</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {transactions.map((t, i) => (
                  <tr key={i} className="hover:bg-[#0f172a]/30 transition">
                    <td className="px-6 py-4 text-white text-sm font-medium">
                      {t.userEmail?.split("@")[0] || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {t.writerName || t.writerEmail?.split("@")[0] || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {t.ebookTitle || "—"}
                    </td>
                    <td className="px-6 py-4 text-white text-sm font-semibold">
                      ${t.amount}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={t.status || "completed"}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await fetch(
                              `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/transactions/${t._id}/status`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: newStatus }),
                              },
                            );
                            setTransactions((prev) =>
                              prev.map((tr) =>
                                tr._id === t._id
                                  ? { ...tr, status: newStatus }
                                  : tr,
                              ),
                            );
                            toast.success("Status updated!");
                          } catch {
                            toast.error("Failed!");
                          }
                        }}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border outline-none cursor-pointer bg-transparent ${
                          (t.status || "completed") === "completed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : (t.status || "completed") === "refunded"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(t.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-800">
          <p className="text-gray-400 text-xs mb-2">Total Revenue</p>
          <p className="text-white text-2xl font-bold">
            ${totalRevenue.toFixed(0)}
          </p>
        </div>
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-800">
          <p className="text-gray-400 text-xs mb-2">Completed</p>
          <p className="text-white text-2xl font-bold">{completed}</p>
        </div>
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-800">
          <p className="text-gray-400 text-xs mb-2">Pending / Refunded</p>
          <p className="text-white text-2xl font-bold">{pending}</p>
        </div>
      </div>
    </div>
  );
}
