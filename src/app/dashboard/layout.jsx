"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiBookOpenLine,
  RiShoppingBagLine,
  RiHeartLine,
  RiUserLine,
  RiAddLine,
  RiGroupLine,
  RiMoneyDollarCircleLine,
  RiMenuLine,
  RiCloseLine,
} from "react-icons/ri";

const userLinks = [
  { href: "/dashboard/user", label: "Overview", icon: RiDashboardLine },
  { href: "/dashboard/user/purchases", label: "Purchases", icon: RiShoppingBagLine },
  { href: "/dashboard/user/bookmarks", label: "Bookmarks", icon: RiHeartLine },
  { href: "/dashboard/user/profile", label: "Profile", icon: RiUserLine },
];

const writerLinks = [
  { href: "/dashboard/writer", label: "Overview", icon: RiDashboardLine },
  { href: "/dashboard/writer/ebooks", label: "My Ebooks", icon: RiBookOpenLine },
  { href: "/dashboard/writer/add-ebook", label: "Add Ebook", icon: RiAddLine },
  { href: "/dashboard/writer/sales", label: "Sales History", icon: RiMoneyDollarCircleLine },
  { href: "/dashboard/writer/bookmarks", label: "Bookmarks", icon: RiHeartLine },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Overview", icon: RiDashboardLine },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: RiGroupLine },
  { href: "/dashboard/admin/ebooks", label: "Manage Ebooks", icon: RiBookOpenLine },
  { href: "/dashboard/admin/transactions", label: "Transactions", icon: RiMoneyDollarCircleLine },
];

export default function DashboardLayout({ children }) {
  const { user, isPending } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const role = user?.role || "user";
  const links = role === "admin" ? adminLinks : role === "writer" ? writerLinks : userLinks;

  return (
    <div className="min-h-screen bg-[#0f172a] flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-gray-800 transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-[#6366f1] text-xs capitalize">{role}</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400">
              <RiCloseLine className="text-xl" />
            </button>
          </div>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#6366f1] text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#0f172a]"
                }`}
              >
                <Icon className="text-lg" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-[#1e293b] border-b border-gray-800 px-4 py-4 flex items-center gap-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <RiMenuLine className="text-xl" />
          </button>
          <p className="text-white font-semibold">Dashboard</p>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}