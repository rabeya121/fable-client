"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RiDashboardLine,
  RiBookOpenLine,
  RiHeartLine,
  RiAddLine,
  RiMoneyDollarCircleLine,
  RiUserLine,
} from "react-icons/ri";

export default function WriterDashboard() {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [sales, setSales] = useState([]);

 useEffect(() => {
  if (!user?.email) return;

  setLoading(true);

  Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ebooks/writer/${user.email}`).then(res => res.json()),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookmarks/${user.email}`).then(res => res.json()),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sales/writer/${user.email}`).then(res => res.json()),
  ])
    .then(([ebooksData, bookmarksData, salesData]) => {
      setEbooks(Array.isArray(ebooksData) ? ebooksData : []);
      setBookmarks(Array.isArray(bookmarksData) ? bookmarksData : []);
      setSales(Array.isArray(salesData) ? salesData : []);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });
}, [user?.email]);

  const totalSales = sales.length;
  const totalRevenue = sales.reduce(
    (acc, s) => acc + (s.price || s.amount || 0),
    0,
  );

  const stats = [
    {
      label: "Published Stories",
      value: ebooks.length,
      icon: RiBookOpenLine,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      label: "Total Sales",
      value: totalSales,
      icon: RiMoneyDollarCircleLine,
      color: "bg-yellow-500/20 text-yellow-400",
    },
    {
      label: "Bookmarks",
      value: bookmarks.length,
      icon: RiHeartLine,
      color: "bg-pink-500/20 text-pink-400",
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: RiDashboardLine,
      color: "bg-green-500/20 text-green-400",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user?.name?.split(" ")[0]}! ✍️
        </h1>
        <p className="text-gray-400">
          Manage your stories, track your growth, and connect with your readers.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}
              >
                <Icon className="text-2xl" />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 mb-6">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg">Recent Ebooks</h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-[#0f172a] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-16">
            <RiBookOpenLine className="text-5xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No ebooks yet!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {ebooks.slice(0, 5).map((ebook, i) => (
              <div
                key={ebook._id}
                className="flex items-center gap-4 p-4 hover:bg-[#0f172a] transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-[#6366f1] font-bold text-sm">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    {ebook.title}
                  </p>
                  <p className="text-gray-400 text-xs">{ebook.genre}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#6366f1] text-sm font-bold">
                    ${ebook.price}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {ebook.sales || 0} sold
                  </p>
                </div>
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
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
        <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/writer/add-ebook"
            className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            <RiAddLine /> Add New Ebook
          </Link>
          <Link
            href="/dashboard/writer/ebooks"
            className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#6366f1]/10 border border-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            <RiBookOpenLine /> Manage Ebooks
          </Link>
          <Link
            href="/dashboard/writer/sales"
            className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#6366f1]/10 border border-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            <RiMoneyDollarCircleLine /> View Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
