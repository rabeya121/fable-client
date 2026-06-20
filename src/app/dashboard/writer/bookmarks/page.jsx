"use client";
import { RiHeartLine } from "react-icons/ri";

export default function WriterBookmarksPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Bookmarked Books</h1>
        <p className="text-gray-400">Books you have saved for later</p>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 text-center py-20">
        <RiHeartLine className="text-5xl text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No bookmarks yet!</p>
      </div>
    </div>
  );
}