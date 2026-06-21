"use client";
import { useState, useEffect } from "react";
import { RiGroupLine, RiDeleteBinLine, RiUserLine, RiShieldLine } from "react-icons/ri";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users`)
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (email, role) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users/${email}/role`, {
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
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users/${email}`, {
        method: "DELETE",
      });
      setUsers(users.filter((u) => u.email !== email));
      toast.success("User deleted!");
    } catch {
      toast.error("Failed!");
    }
  };

  const handleToggleBan = async (email, banned) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users/${email}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned: !banned }),
      });
      setUsers(users.map((u) => u.email === email ? { ...u, banned: !banned } : u));
      toast.success(banned ? "User unbanned!" : "User banned!");
    } catch {
      toast.error("Failed!");
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.banned).length;
  const bannedUsers = users.filter((u) => u.banned).length;

  const roleColors = {
    admin: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    writer: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    user: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  };

  const roleLabels = {
    admin: "Admin",
    writer: "Writer",
    user: "Reader",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          User Management 👥
        </h1>
        <p className="text-gray-400 text-sm">Review user accounts and manage access to the platform.</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#1e293b] rounded-2xl p-5 h-20 animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">Total Users</p>
            <p className="text-white text-2xl font-bold">{totalUsers}</p>
          </div>
          <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">Active Users</p>
            <p className="text-white text-2xl font-bold">{activeUsers}</p>
          </div>
          <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">Banned Users</p>
            <p className="text-white text-2xl font-bold">{bannedUsers}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-white font-semibold">All Users</h3>
        </div>

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
              <thead className="text-gray-400 text-xs uppercase tracking-wider">
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3">User</th>
                  <th className="text-left px-6 py-3">Role</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Joined</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#0f172a]/30 transition">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#6366f1] overflow-hidden flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{user.name}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <select
                        value={user.role || "user"}
                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full outline-none cursor-pointer ${
                          roleColors[user.role || "user"]
                        } bg-transparent`}
                      >
                        <option value="user">Reader</option>
                        <option value="writer">Writer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        user.banned
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                      }`}>
                        {user.banned ? "Banned" : "Active"}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBan(user.email, user.banned)}
                          className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition ${
                            user.banned
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          {user.banned ? "Unban" : "Ban"}
                        </button>
                        <button
                          onClick={() => handleDelete(user.email)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition"
                        >
                          <RiDeleteBinLine className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-3 border-t border-gray-800">
              <p className="text-gray-500 text-xs">
                Role changes update immediately. Ban/Unban controls user access to the platform.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}