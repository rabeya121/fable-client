
"use client";
import { useState, useEffect } from "react";
import {
  RiGroupLine,
  RiBookOpenLine,
  RiMoneyDollarCircleLine,
  RiShoppingBagLine,
} from "react-icons/ri";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const MONTHS = [ "Jan","Feb","Mar","Apr", "May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
const COLORS = [ "#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#84cc16",];

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
    {
      label: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: RiGroupLine,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      label: "Total Writers",
      value: analytics?.totalWriters || 0,
      icon: RiGroupLine,
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      label: "Total Ebooks",
      value: analytics?.totalEbooks || 0,
      icon: RiBookOpenLine,
      color: "bg-green-500/20 text-green-400",
    },
    {
      label: "Total Revenue",
      value: `$${(analytics?.totalRevenue || 0).toFixed(2)}`,
      icon: RiMoneyDollarCircleLine,
      color: "bg-yellow-500/20 text-yellow-400",
    },
  ];

  const monthlySalesData = (analytics?.monthlySales || []).map((item) => ({
    month: MONTHS[(item._id || 1) - 1],
    sales: item.sales,
    revenue: item.revenue,
  }));

  const genreData = (analytics?.genreData || []).map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-gray-400">Overview of the entire platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800"
            >
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="w-12 h-12 bg-[#0f172a] rounded-xl" />
                  <div className="h-4 bg-[#0f172a] rounded w-3/4" />
                  <div className="h-8 bg-[#0f172a] rounded w-1/2" />
                </div>
              ) : (
                <>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}
                  >
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Sales Chart */}
        <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
          <h2 className="text-white font-semibold text-lg mb-6">
            Monthly Sales
          </h2>
          {loading ? (
            <div className="h-64 bg-[#0f172a] rounded-xl animate-pulse" />
          ) : monthlySalesData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400">No sales data yet!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar
                  dataKey="sales"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Sales"
                />
                <Bar
                  dataKey="revenue"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  name="Revenue ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Genre Pie Chart */}
        <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
          <h2 className="text-white font-semibold text-lg mb-6">
            Ebooks by Genre
          </h2>
          {loading ? (
            <div className="h-64 bg-[#0f172a] rounded-xl animate-pulse" />
          ) : genreData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400">No ebook data yet!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: "#6b7280" }}
                >
                  {genreData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#9ca3af" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 mb-6">
        <h3 className="text-white font-semibold text-base mb-4">
          Recent Activity
        </h3>
        <ul className="space-y-2">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <li key={i} className="h-5 bg-[#0f172a] rounded animate-pulse" />
            ))
          ) : (
            <>
              {(analytics?.recentPurchases || []).map((purchase, i) => (
                <li
                  key={`p-${i}`}
                  className="text-[#6366f1] text-sm flex items-start gap-2"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span>
                    <span className="text-green-400">{purchase.userEmail}</span>
                    <span className="text-gray-300"> purchased </span>
                    <span className="text-white font-medium">
                      {purchase.ebookTitle}
                    </span>
                    <span className="text-gray-500"> — ${purchase.price}</span>
                  </span>
                </li>
              ))}
              {(analytics?.recentBookmarks || []).map((user, i) => (
                <li
                  key={`b-${i}`}
                  className="text-[#6366f1] text-sm flex items-start gap-2"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0" />
                  <span>
                    <span className="text-pink-400">{user.email}</span>
                    <span className="text-gray-300"> bookmarked </span>
                    <span className="text-white font-medium">
                      {user.bookmarks?.length || 0} ebooks
                    </span>
                  </span>
                </li>
              ))}
              {(analytics?.recentPurchases || []).length === 0 &&
                (analytics?.recentBookmarks || []).length === 0 && (
                  <li className="text-gray-400 text-sm">No recent activity!</li>
                )}
            </>
          )}
        </ul>
      </div>
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/dashboard/admin/users"
          className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6 hover:border-[#6366f1]/40 transition"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <RiGroupLine className="text-blue-400 text-2xl" />
          </div>
          <h3 className="text-white font-semibold mb-1">Manage Users</h3>
          <p className="text-gray-400 text-sm">View, edit, and delete users</p>
        </a>

        <a
          href="/dashboard/admin/ebooks"
          className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6 hover:border-[#6366f1]/40 transition"
        >
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
            <RiBookOpenLine className="text-green-400 text-2xl" />
          </div>
          <h3 className="text-white font-semibold mb-1">Manage Ebooks</h3>
          <p className="text-gray-400 text-sm">
            Publish, unpublish, delete ebooks
          </p>
        </a>
        
       

        <a
          href="/dashboard/admin/transactions"
          className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6 hover:border-[#6366f1]/40 transition"
        >

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
