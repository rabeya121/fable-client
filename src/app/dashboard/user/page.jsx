"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { RiBookOpenLine, RiShoppingBagLine, RiHeartLine } from "react-icons/ri";
import Link from "next/link";

export default function UserDashboard() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases/${user.email}`)
        .then((r) => r.json())
        .then((d) => setPurchases(Array.isArray(d) ? d : []))
        .catch(() => setPurchases([]));

      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookmarks/${user.email}`)
        .then((r) => r.json())
        .then((d) => setBookmarks(Array.isArray(d) ? d : []))
        .catch(() => setBookmarks([]));
    }
  }, [user]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-400">Here's what's happening with your account.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6366f1]/20 rounded-xl flex items-center justify-center">
              <RiShoppingBagLine className="text-[#6366f1] text-2xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Purchased</p>
              <p className="text-white text-2xl font-bold">{purchases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <RiHeartLine className="text-pink-500 text-2xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bookmarks</p>
              <p className="text-white text-2xl font-bold">{bookmarks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <RiBookOpenLine className="text-green-500 text-2xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Reading</p>
              <p className="text-white text-2xl font-bold">{purchases.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
        <h2 className="text-white font-semibold text-lg mb-4">My Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#6366f1] overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
            {user?.image ? (
              <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)
            )}
          </div>
          <div>
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <p className="text-[#6366f1] text-xs capitalize mt-1">{user?.role || "user"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link href="/dashboard/user/purchases" className="bg-[#0f172a] hover:bg-[#6366f1]/10 border border-gray-800 hover:border-[#6366f1]/40 rounded-xl p-4 flex items-center gap-3 transition">
            <RiShoppingBagLine className="text-[#6366f1] text-xl" />
            <span className="text-gray-300 text-sm">Purchase History</span>
          </Link>
          <Link href="/dashboard/user/bookmarks" className="bg-[#0f172a] hover:bg-[#6366f1]/10 border border-gray-800 hover:border-[#6366f1]/40 rounded-xl p-4 flex items-center gap-3 transition">
            <RiHeartLine className="text-pink-500 text-xl" />
            <span className="text-gray-300 text-sm">Bookmarks</span>
          </Link>
          <Link href="/browse" className="bg-[#0f172a] hover:bg-[#6366f1]/10 border border-gray-800 hover:border-[#6366f1]/40 rounded-xl p-4 flex items-center gap-3 transition">
            <RiBookOpenLine className="text-green-500 text-xl" />
            <span className="text-gray-300 text-sm">Browse Ebooks</span>
          </Link>
        </div>
      </div>
    </div>
  );
}