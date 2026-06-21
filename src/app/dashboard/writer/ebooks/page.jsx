"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RiBookOpenLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiToggleLine,
  RiSearchLine,
} from "react-icons/ri";
import toast from "react-hot-toast";

export default function WriterEbooksPage() {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.email) {
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ebooks/writer/${user.email}`,
      )
        .then((res) => res.json())
        .then((data) => setEbooks(Array.isArray(data) ? data : []))
        .catch(() => setEbooks([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ebooks/${id}`, {
        method: "DELETE",
      });
      setEbooks(ebooks.filter((e) => e._id !== id));
      toast.success("Ebook deleted!");
    } catch {
      toast.error("Failed to delete!");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "published" ? "unpublished" : "published";
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ebooks/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      setEbooks(
        ebooks.map((e) => (e._id === id ? { ...e, status: newStatus } : e)),
      );
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update!");
    }
  };

  // Stats
  const totalBooks = ebooks.length;
  const published = ebooks.filter((e) => e.status === "published").length;
  const totalSales = ebooks.reduce((acc, e) => acc + (e.sales || 0), 0);
  const revenue = ebooks.reduce(
    (acc, e) => acc + (e.sales || 0) * (e.price || 0),
    0,
  );

  // Search filter
  const filtered = ebooks.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.genre?.toLowerCase().includes(search.toLowerCase()),
  );

  const genreColors = {
    Fiction: "bg-blue-500/20 text-blue-400",
    Mystery: "bg-yellow-500/20 text-yellow-400",
    Romance: "bg-pink-500/20 text-pink-400",
    Fantasy: "bg-purple-500/20 text-purple-400",
    Horror: "bg-red-500/20 text-red-400",
    Thriller: "bg-orange-500/20 text-orange-400",
    "Sci-Fi": "bg-cyan-500/20 text-cyan-400",
    Biography: "bg-green-500/20 text-green-400",
    "Self-Help": "bg-teal-500/20 text-teal-400",
    Drama: "bg-rose-500/20 text-rose-400",
    Adventure: "bg-amber-500/20 text-amber-400",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Manage Books</h1>
          <p className="text-gray-400 text-sm">
            Manage all your published and unpublished ebooks
          </p>
        </div>
        <Link
          href="/dashboard/writer/add-ebook"
          className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
        >
          <RiAddLine className="text-base" /> Add New Book
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1e293b] rounded-2xl p-5 flex items-center justify-between border border-gray-800">
          <div>
            <p className="text-gray-400 text-xs mb-1">Total Books</p>
            <p className="text-white text-2xl font-bold">{totalBooks}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <RiBookOpenLine className="text-blue-400 text-xl" />
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 flex items-center justify-between border border-gray-800">
          <div>
            <p className="text-gray-400 text-xs mb-1">Published</p>
            <p className="text-white text-2xl font-bold">{published}</p>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <RiToggleLine className="text-green-400 text-xl" />
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 flex items-center justify-between border border-gray-800">
          <div>
            <p className="text-gray-400 text-xs mb-1">Total Sales</p>
            <p className="text-white text-2xl font-bold">{totalSales}</p>
          </div>
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <RiEyeLine className="text-purple-400 text-xl" />
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 flex items-center justify-between border border-gray-800">
          <div>
            <p className="text-gray-400 text-xs mb-1">Revenue</p>
            <p className="text-white text-2xl font-bold">
              ${revenue.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <span className="text-yellow-400 text-xl font-bold">$</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title or genre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1e293b] border border-gray-800 text-white pl-11 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-[#0f172a] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <RiBookOpenLine className="text-5xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No ebooks found!</p>
            <Link
              href="/dashboard/writer/add-ebook"
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-2 rounded-xl text-sm transition"
            >
              Add Your First Ebook
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-6 py-4">Book</th>
                  <th className="text-left px-6 py-4">Genre</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Sales</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((ebook) => (
                  <tr
                    key={ebook._id}
                    className="hover:bg-[#0f172a]/50 transition"
                  >
                    {/* Book */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-[#0f172a] rounded-lg overflow-hidden flex-shrink-0">
                          {ebook.coverImage ? (
                            <img
                              src={ebook.coverImage}
                              alt={ebook.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <RiBookOpenLine className="text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium line-clamp-1">
                            {ebook.title}
                          </p>
                          <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">
                            {ebook.description?.slice(0, 30)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Genre */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${genreColors[ebook.genre] || "bg-gray-500/20 text-gray-400"}`}
                      >
                        {ebook.genre}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-white text-sm font-bold">
                      ${ebook.price}
                    </td>

                    {/* Sales */}
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {ebook.sales || 0}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          ebook.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {ebook.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* View */}
                        <Link
                          href={`/ebooks/${ebook._id}`}
                          className="w-8 h-8 rounded-lg bg-gray-700/50 text-gray-400 flex items-center justify-center hover:bg-gray-700 transition"
                        >
                          <RiEyeLine className="text-sm" />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/dashboard/writer/edit-ebook/${ebook._id}`}
                          className="w-8 h-8 rounded-lg bg-[#6366f1]/20 text-[#6366f1] flex items-center justify-center hover:bg-[#6366f1]/30 transition"
                        >
                          <RiEditLine className="text-sm" />
                        </Link>

                        {/* Toggle */}
                        <button
                          onClick={() =>
                            handleToggleStatus(ebook._id, ebook.status)
                          }
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                            ebook.status === "published"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          <RiToggleLine className="text-sm" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(ebook._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition"
                        >
                          <RiDeleteBinLine className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
