"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiMenu3Line,
  RiCloseLine,
  RiUserLine,
  RiSunLine,
  RiMoonLine,
} from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isPending } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out!");
    router.push("/");
    router.refresh();
  };

  const ThemeButton = ({ className = "" }) => (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={className}
    >
      {mounted ? (
        theme === "dark" ? <RiSunLine /> : <RiMoonLine />
      ) : (
        <RiMoonLine />
      )}
    </button>
  );

  return (
    <nav className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <div className="bg-[#6366f1] w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          Fable
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium transition ${isActive("/") ? "text-[#6366f1]" : "text-gray-300 hover:text-white"}`}>
            Home
          </Link>
          <Link href="/browse" className={`text-sm font-medium transition ${isActive("/browse") ? "text-[#6366f1]" : "text-gray-300 hover:text-white"}`}>
            Browse Ebooks
          </Link>

          {!isPending && (
            <>
              {user ? (
                <>
                  <Link
                    href={`/dashboard/${user.role || "user"}`}
                    className={`text-sm font-medium transition ${pathname.startsWith("/dashboard") ? "text-[#6366f1]" : "text-gray-300 hover:text-white"}`}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-semibold text-xs">
                      {user.name?.charAt(0).toUpperCase() || <RiUserLine />}
                    </div>
                    <span>{user.name?.split(" ")[0]}</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-300 hover:text-white transition">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition">
                    Sign In
                  </Link>
                  <Link href="/register" className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition">
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}

          <ThemeButton className="text-gray-400 hover:text-white transition text-xl" />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1e293b] px-4 pb-4 flex flex-col gap-3">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-medium py-2 text-gray-300 hover:text-white transition">
            Home
          </Link>
          <Link href="/browse" onClick={() => setIsOpen(false)} className="text-sm font-medium py-2 text-gray-300 hover:text-white transition">
            Browse Ebooks
          </Link>
          {user ? (
            <>
              <Link href={`/dashboard/${user.role || "user"}`} onClick={() => setIsOpen(false)} className="text-sm font-medium py-2 text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium py-2 text-left text-gray-300 hover:text-white transition">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-sm font-medium py-2 text-gray-300 hover:text-white transition">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-full text-center hover:bg-gray-200 transition">
                Get Started
              </Link>
            </>
          )}
          <ThemeButton className="flex items-center gap-2 text-sm font-medium py-2 text-gray-300 hover:text-white transition" />
        </div>
      )}
    </nav>
  );
}