// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   RiUserLine,
//   RiBookOpenLine,
//   RiShoppingBagLine,
//   RiMoneyDollarCircleLine,
//   RiEditLine,
// } from "react-icons/ri";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const MONTHS = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// export default function AdminDashboard() {
//   const [analytics, setAnalytics] = useState(null);
//   const [monthlySales, setMonthlySales] = useState([]);
//   const [genreData, setGenreData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/analytics`)
//       .then((r) => r.json())
//       .then((data) => {
//         setAnalytics(data);
//         const monthly = MONTHS.map((month, i) => {
//           const found = data.monthlySales?.find((m) => m._id === i + 1);
//           return {
//             month,
//             sales: found?.sales || 0,
//             revenue: found?.revenue || 0,
//           };
//         });
//         setMonthlySales(monthly);
//         setGenreData(data.genreData || []);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const maxGenreCount = Math.max(...genreData.map((g) => g.count || 0), 1);

//   const stats = [
//     {
//       label: "Total Users",
//       value: analytics?.totalUsers || 0,
//       icon: "👥",
//       color: "text-purple-400",
//     },
//     {
//       label: "Total Writers",
//       value: analytics?.totalWriters || 0,
//       icon: "✍️",
//       color: "text-orange-400",
//     },
//     {
//       label: "Ebooks Sold",
//       value: analytics?.totalPurchases || 0,
//       icon: "📗",
//       color: "text-green-400",
//     },
//     {
//       label: "Total Revenue",
//       value: `$${(analytics?.totalRevenue || 0).toLocaleString()}`,
//       icon: "💰",
//       color: "text-yellow-400",
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
//           Admin Dashboard 📊
//         </h1>
//         <p className="text-gray-400 text-sm">
//           Monitor the platform's growth, sales, and reader activity.
//         </p>
//       </div>

//       {/* Stats */}
//       {loading ? (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[...Array(4)].map((_, i) => (
//             <div
//               key={i}
//               className="bg-[#1e293b] rounded-2xl p-6 h-24 animate-pulse border border-gray-800"
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {stats.map((stat, i) => (
//             <div
//               key={i}
//               className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 flex items-center justify-between"
//             >
//               <div>
//                 <p className="text-gray-400 text-xs mb-2">{stat.label}</p>
//                 <p className={`text-2xl font-bold ${stat.color}`}>
//                   {stat.value}
//                 </p>
//               </div>
//               <span className="text-3xl">{stat.icon}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Monthly Sales Chart */}
//       <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="text-white font-semibold text-base">
//               Monthly Sales Trend
//             </h3>
//             <p className="text-gray-400 text-xs mt-1">
//               Total sales per month this year
//             </p>
//           </div>
//           <span className="text-xs bg-[#6366f1]/20 text-[#6366f1] px-3 py-1 rounded-full font-medium">
//             {new Date().getFullYear()}
//           </span>
//         </div>
//         {loading ? (
//           <div className="h-64 bg-[#0f172a] rounded-xl animate-pulse" />
//         ) : (
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart
//               data={monthlySales}
//               barSize={32}
//               margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
//             >
//               <defs>
//                 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
//                   <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="#ffffff08"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fill: "#6b7280", fontSize: 11 }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis
//                 tick={{ fill: "#6b7280", fontSize: 11 }}
//                 axisLine={false}
//                 tickLine={false}
//                 width={30}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#0f172a",
//                   border: "1px solid #6366f1",
//                   borderRadius: "12px",
//                   color: "#fff",
//                   fontSize: "12px",
//                   boxShadow: "0 4px 20px rgba(99,102,241,0.2)",
//                 }}
//                 formatter={(value) => [value, "Sales"]}
//                 labelStyle={{ color: "#a5b4fc", fontWeight: "bold" }}
//                 cursor={{ fill: "rgba(99,102,241,0.05)", radius: 6 }}
//               />
//               <Bar
//                 dataKey="sales"
//                 fill="url(#barGradient)"
//                 radius={[6, 6, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </div>

//       {/* Genre Progress Bars */}
//       <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
//         <h3 className="text-white font-semibold text-base mb-6">
//           Ebooks Sold by Genre
//         </h3>
//         {loading ? (
//           <div className="space-y-4">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="h-8 bg-[#0f172a] rounded animate-pulse" />
//             ))}
//           </div>
//         ) : genreData.length === 0 ? (
//           <p className="text-gray-400 text-sm text-center py-8">
//             No genre data yet
//           </p>
//         ) : (
//           <div className="space-y-4">
//             {genreData.map((genre, i) => (
//               <div key={i}>
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-white text-sm">{genre._id}</span>
//                   <span className="text-gray-400 text-xs">
//                     {genre.count} sales
//                   </span>
//                 </div>
//                 <div className="w-full bg-[#0f172a] rounded-full h-1.5">
//                   <div
//                     className="h-1.5 rounded-full bg-white"
//                     style={{ width: `${(genre.count / maxGenreCount) * 100}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

// {/* Recent Activity */}
// <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
//   <h3 className="text-white font-semibold text-base mb-4">
//     Recent Activity
//   </h3>
//   <ul className="space-y-2">
//     {[
//       `${analytics?.totalUsers || 0} total users on the platform.`,
//       `${analytics?.totalEbooks || 0} total ebooks published.`,
//       `${analytics?.totalPurchases || 0} total purchases made.`,
//       `$${(analytics?.totalRevenue || 0).toFixed(2)} total revenue generated.`,
//     ].map((item, i) => (
//       <li
//         key={i}
//         className="text-[#6366f1] text-sm flex items-start gap-2"
//       >
//         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6366f1] flex-shrink-0" />
//         {item}
//       </li>
//     ))}
//   </ul>
// </div>

//       {/* Platform Management */}
//       <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
//         <h3 className="text-white font-semibold text-base mb-1">
//           Platform Management
//         </h3>
//         <p className="text-gray-400 text-sm mb-5">
//           Review users, monitor sales, and maintain the health of the
//           marketplace.
//         </p>
//         <div className="flex gap-3">
//           <Link
//             href="/dashboard/admin/ebooks"
//             className="border border-gray-600 hover:border-[#6366f1] text-white text-sm px-5 py-2 rounded-xl transition"
//           >
//             Review Stories
//           </Link>
//           <Link
//             href="/dashboard/admin/transactions"
//             className="border border-gray-600 hover:border-[#6366f1] text-white text-sm px-5 py-2 rounded-xl transition"
//           >
//             View Reports
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

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
const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#84cc16",
];

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
                  outerRadius={80}
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
