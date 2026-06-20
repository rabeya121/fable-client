"use client";
import { useAuth } from "@/context/AuthContext";
import { RiUserLine, RiMailLine, RiShieldLine } from "react-icons/ri";

export default function WriterProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
        <p className="text-gray-400">Your account information</p>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-8 max-w-lg">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">{user?.name}</h2>
            <p className="text-[#6366f1] text-sm capitalize">{user?.role || "writer"}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-[#0f172a] rounded-xl p-4">
            <RiUserLine className="text-[#6366f1] text-xl" />
            <div>
              <p className="text-gray-400 text-xs">Full Name</p>
              <p className="text-white text-sm font-medium">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[#0f172a] rounded-xl p-4">
            <RiMailLine className="text-[#6366f1] text-xl" />
            <div>
              <p className="text-gray-400 text-xs">Email</p>
              <p className="text-white text-sm font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[#0f172a] rounded-xl p-4">
            <RiShieldLine className="text-[#6366f1] text-xl" />
            <div>
              <p className="text-gray-400 text-xs">Role</p>
              <p className="text-white text-sm font-medium capitalize">{user?.role || "writer"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}