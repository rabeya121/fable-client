"use client";
import { useState, useEffect } from "react";
import {
  RiGroupLine,
  RiBookOpenLine,
  RiMoneyDollarCircleLine,
  RiShoppingBagLine,
} from "react-icons/ri";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/admin/analytics`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Users", value: analytics?.totalUsers || 0, icon: RiGroupLine, color: "bg-blue-500/20 text-blue-400" },
    { label: "Total Writers", value: analytics?.totalWriters || 0, icon: RiGroupLine, color: "bg-purple-500/20 text-purple-400" },
    { label: "Total Ebooks", value: analytics?.totalEbooks || 0, icon: RiBookOpenLine, color: "bg-green-500/20 text-green-400" },
    { label: "Total Revenue", value: `$${analytics?.totalRevenue?.toFixed(2) || "0.00"}`, icon: RiMoneyDollarCircleLine, color: "bg-yellow-500/20 text-yellow-400" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard 🛡️</h1>
        <p className="text-gray-400">Overview of the entire platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="w-12 h-12 bg-[#0f172a] rounded-xl" />
                  <div className="h-4 bg-[#0f172a] rounded w-3/4" />
                  <div className="h-8 bg-[#0f172a] rounded w-1/2" />
                </div>
              ) : (
                <>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                    <Icon className="text-2xl" />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/dashboard/admin/users" className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6 hover:border-[#6366f1]/40 transition">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <RiGroupLine className="text-blue-400 text-2xl" />
          </div>
          <h3 className="text-white font-semibold mb-1">Manage Users</h3>
          <p className="text-gray-400 text-sm">View, edit, and delete users</p>
        </a>

        <a href="/dashboard/admin/ebooks" className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6 hover:border-[#6366f1]/40 transition">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
            <RiBookOpenLine className="text-green-400 text-2xl" />
          </div>
          <h3 className="text-white font-semibold mb-1">Manage Ebooks</h3>
          <p className="text-gray-400 text-sm">Publish, unpublish, delete ebooks</p>
        </a>

        <a href="/dashboard/admin/transactions" className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6 hover:border-[#6366f1]/40 transition">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
            <RiMoneyDollarCircleLine className="text-yellow-400 text-2xl" />
          </div>
          <h3 className="text-white font-semibold mb-1">Transactions</h3>
          <p className="text-gray-400 text-sm">View all payment transactions</p>
        </a>
      </div>
    </div>
  );
}