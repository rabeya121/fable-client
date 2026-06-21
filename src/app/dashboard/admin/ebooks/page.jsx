"use client";
import { useState, useEffect } from "react";
import { RiBookOpenLine, RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/admin/ebooks`)
      .then((res) => res.json())
      .then((data) => setEbooks(Array.isArray(data) ? data : []))
      .catch(() => setEbooks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "unpublished" : "published";
    try {
      await fetch(`http://localhost:8000/api/ebooks/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setEbooks(ebooks.map((e) => e._id === id ? { ...e, status: newStatus } : e));
      toast.success("Status updated!");
    } catch {
      toast.error("Failed!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`http://localhost:8000/api/ebooks/${id}`, { method: "DELETE" });
      setEbooks(ebooks.filter((e) => e._id !== id));
      toast.success("Ebook deleted!");
    } catch {
      toast.error("Failed!");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Manage Ebooks</h1>
        <p className="text-gray-400">View, publish, unpublish and delete ebooks</p>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-[#0f172a] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-20">
            <RiBookOpenLine className="text-5xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No ebooks found!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f172a] text-gray-400 text-sm">
                <tr>
                  <th className="text-left px-6 py-4">Title</th>
                  <th className="text-left px-6 py-4">Writer</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {ebooks.map((ebook) => (
                  <tr key={ebook._id} className="hover:bg-[#0f172a] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-[#0f172a] rounded overflow-hidden flex-shrink-0">
                          {ebook.coverImage ? (
                            <img src={ebook.coverImage} alt={ebook.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <RiBookOpenLine className="text-gray-600 text-xs" />
                            </div>
                          )}
                        </div>
                        <p className="text-white text-sm font-medium line-clamp-1">{ebook.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{ebook.writerName}</td>
                    <td className="px-6 py-4 text-[#6366f1] text-sm font-bold">${ebook.price}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(ebook._id, ebook.status)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                          ebook.status === "published"
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        }`}
                      >
                        {ebook.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(ebook._id)}
                        className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition"
                      >
                        <RiDeleteBinLine />
                      </button>
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