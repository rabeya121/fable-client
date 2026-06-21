"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  RiUserLine,
  RiBookOpenLine,
  RiShoppingBagLine,
  RiMoneyDollarCircleLine,
  RiEditLine,
} from "react-icons/ri";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/analytics`)
      .then((r) => r.json())
      .then((data) => {
        setAnalytics(data);
        const monthly = MONTHS.map((month, i) => {
          const found = data.monthlySales?.find((m) => m._id === i + 1);
          return {
            month,
            sales: found?.sales || 0,
            revenue: found?.revenue || 0,
          };
        });
        setMonthlySales(monthly);
        setGenreData(data.genreData || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxGenreCount = Math.max(...genreData.map((g) => g.count || 0), 1);

  const stats = [
    {
      label: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: "👥",
      color: "text-purple-400",
    },
    {
      label: "Total Writers",
      value: analytics?.totalWriters || 0,
      icon: "✍️",
      color: "text-orange-400",
    },
    {
      label: "Ebooks Sold",
      value: analytics?.totalPurchases || 0,
      icon: "📗",
      color: "text-green-400",
    },
    {
      label: "Total Revenue",
      value: `$${(analytics?.totalRevenue || 0).toLocaleString()}`,
      icon: "💰",
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          Admin Dashboard 📊
        </h1>
        <p className="text-gray-400 text-sm">
          Monitor the platform's growth, sales, and reader activity.
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#1e293b] rounded-2xl p-6 h-24 animate-pulse border border-gray-800"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-400 text-xs mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          ))}
        </div>
      )}

      {/* Monthly Sales Chart */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-base">
              Monthly Sales Trend
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              Total sales per month this year
            </p>
          </div>
          <span className="text-xs bg-[#6366f1]/20 text-[#6366f1] px-3 py-1 rounded-full font-medium">
            {new Date().getFullYear()}
          </span>
        </div>
        {loading ? (
          <div className="h-64 bg-[#0f172a] rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={monthlySales}
              barSize={32}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff08"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #6366f1",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.2)",
                }}
                formatter={(value) => [value, "Sales"]}
                labelStyle={{ color: "#a5b4fc", fontWeight: "bold" }}
                cursor={{ fill: "rgba(99,102,241,0.05)", radius: 6 }}
              />
              <Bar
                dataKey="sales"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Genre Progress Bars */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
        <h3 className="text-white font-semibold text-base mb-6">
          Ebooks Sold by Genre
        </h3>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-[#0f172a] rounded animate-pulse" />
            ))}
          </div>
        ) : genreData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No genre data yet
          </p>
        ) : (
          <div className="space-y-4">
            {genreData.map((genre, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm">{genre._id}</span>
                  <span className="text-gray-400 text-xs">
                    {genre.count} sales
                  </span>
                </div>
                <div className="w-full bg-[#0f172a] rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-white"
                    style={{ width: `${(genre.count / maxGenreCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
        <h3 className="text-white font-semibold text-base mb-4">
          Recent Activity
        </h3>
        <ul className="space-y-2">
          {[
            `${analytics?.totalUsers || 0} total users on the platform.`,
            `${analytics?.totalEbooks || 0} total ebooks published.`,
            `${analytics?.totalPurchases || 0} total purchases made.`,
            `$${(analytics?.totalRevenue || 0).toFixed(2)} total revenue generated.`,
          ].map((item, i) => (
            <li
              key={i}
              className="text-[#6366f1] text-sm flex items-start gap-2"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6366f1] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Platform Management */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
        <h3 className="text-white font-semibold text-base mb-1">
          Platform Management
        </h3>
        <p className="text-gray-400 text-sm mb-5">
          Review users, monitor sales, and maintain the health of the
          marketplace.
        </p>
        <div className="flex gap-3">
          <Link
            href="/dashboard/admin/ebooks"
            className="border border-gray-600 hover:border-[#6366f1] text-white text-sm px-5 py-2 rounded-xl transition"
          >
            Review Stories
          </Link>
          <Link
            href="/dashboard/admin/transactions"
            className="border border-gray-600 hover:border-[#6366f1] text-white text-sm px-5 py-2 rounded-xl transition"
          >
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
