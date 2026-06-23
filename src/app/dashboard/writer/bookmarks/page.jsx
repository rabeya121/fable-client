"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { RiHeartLine, RiBookOpenLine } from "react-icons/ri";

export default function WriterBookmarksPage() {
  const { user, isPending } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !isPending) {
      router.push("/login");
    }
  }, [user, isPending]);

  useEffect(() => {
    if (user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookmarks/${user.email}`)
        .then((res) => res.json())
        .then((data) => setBookmarks(Array.isArray(data) ? data : []))
        .catch(() => setBookmarks([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Bookmarked Books</h1>
        <p className="text-gray-400">Books you saved for later</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1e293b] rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-[#1e293b] rounded-2xl border border-gray-800 text-center py-20">
          <RiHeartLine className="text-5xl text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">No bookmarks yet!</p>
          <Link href="/browse" className="text-[#6366f1] text-sm hover:underline">
            Browse Ebooks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((ebook) => (
            <Link key={ebook._id} href={`/ebooks/${ebook._id}`}>
              <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-gray-800 hover:border-[#6366f1]/40 transition cursor-pointer">
                <div className="h-48 bg-[#0f172a] overflow-hidden">
                  {ebook.coverImage ? (
                    <img src={ebook.coverImage} alt={ebook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <RiBookOpenLine className="text-5xl text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">{ebook.title}</h3>
                  <p className="text-gray-400 text-xs mb-2">by {ebook.writerName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6366f1] font-bold text-sm">${ebook.price}</span>
                    <span className="text-gray-500 text-xs bg-[#0f172a] px-2 py-1 rounded-full">{ebook.genre}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}