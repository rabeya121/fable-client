"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ManageWritersPage() {
  const [writers, setWriters] = useState([]);

  const fetchWriters = async () => {
    const res = await axios.get(`${BASE_URL}/api/admin/writers`);
    setWriters(res.data);
  };

  useEffect(() => {
    fetchWriters();
  }, []);

  const toggleFeatured = async (email, current) => {
    await axios.patch(`${BASE_URL}/api/admin/writers/${email}/featured`, {
      featured: !current,
    });
    fetchWriters();
  };

  const editSales = async (email) => {
    const sales = prompt("নতুন sales সংখ্যা দাও:");
    if (!sales) return;
    await axios.patch(`${BASE_URL}/api/admin/writers/${email}/sales`, {
      sales: Number(sales),
    });
    fetchWriters();
  };

  const removeWriter = async (email) => {
    if (!confirm("এই writer কে remove করবে?")) return;
    await axios.patch(`${BASE_URL}/api/admin/users/${email}/role`, {
      role: "user",
    });
    fetchWriters();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Writers</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Featured</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {writers.map((w) => (
            <tr key={w.email} className="border-b border-gray-600">
              <td className="p-2">{w.name}</td>
              <td className="p-2">{w.email}</td>
              <td className="p-2">{w.featured ? "⭐ Featured" : "—"}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => toggleFeatured(w.email, w.featured)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                >
                  {w.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => editSales(w.email)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                >
                  Edit Sales
                </button>
                <button
                  onClick={() => removeWriter(w.email)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}