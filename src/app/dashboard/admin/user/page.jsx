"use client";
import { useState, useEffect } from "react";
import { RiGroupLine, RiDeleteBinLine, RiShieldLine } from "react-icons/ri";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/admin/users`)
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (email, role) => {
    try {
      await fetch(`http://localhost:8000/api/admin/users/${email}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setUsers(users.map((u) => u.email === email ? { ...u, role } : u));
      toast.success("Role updated!");
    } catch {
      toast.error("Failed!");
    }
  };

  const handleDelete = async (email) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`http://localhost:8000/api/admin/users/${email}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.email !== email));
      toast.success("User deleted!");
    } catch {
      toast.error("Failed!");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Manage Users</h1>
        <p className="text-gray-400">View and manage all users</p>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-[#0f172a] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <RiGroupLine className="text-5xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No users found!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f172a] text-gray-400 text-sm">
                <tr>
                  <th className="text-left px-6 py-4">Name</th>
                  <th className="text-left px-6 py-4">Email</th>
                  <th className="text-left px-6 py-4">Role</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#0f172a] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.charAt(0)}
                        </div>
                        <span className="text-white text-sm font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role || "user"}
                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                        className="bg-[#0f172a] text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:ring-1 focus:ring-[#6366f1]"
                      >
                        <option value="user">User</option>
                        <option value="writer">Writer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(user.email)}
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