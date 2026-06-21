"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RiBookOpenLine,
  RiHeartLine,
  RiHistoryLine,
  RiEditLine,
  RiUploadLine,
  RiSaveLine,
  RiCloseLine,
  RiUserLine,
  RiShoppingBagLine,
} from "react-icons/ri";
import { updateUser } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [editing, setEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setProfileImage(user.image || "");
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookmarks/${user.email}`)
        .then((r) => r.json())
        .then((d) => setBookmarks(Array.isArray(d) ? d : []))
        .catch(() => setBookmarks([]));

      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases/${user.email}`)
        .then((r) => r.json())
        .then((d) => setPurchases(Array.isArray(d) ? d : []))
        .catch(() => setPurchases([]));
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      const imageUrl = data.data.url;
      setProfileImage(imageUrl);
      await updateUser({ image: imageUrl });
      toast.success("Image updated!");
    } catch {
      toast.error("Upload failed!");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateUser({ name, image: profileImage });
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Update failed!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#6366f1]/20 via-[#1e293b] to-[#0f172a]" />
        <div className="px-6 pb-6 -mt-10 flex flex-col md:flex-row items-start md:items-end gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full border-4 border-[#1e293b] bg-[#6366f1] overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            {editing && (
              <label className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer">
                <RiUploadLine className="text-white text-lg" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1e293b]" />
          </div>

          {/* Name + Meta */}
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0f172a] text-white text-xl font-bold px-3 py-1 rounded-xl border border-[#6366f1] outline-none mb-2"
              />
            ) : (
              <h2 className="text-white text-2xl font-bold">{user?.name}</h2>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <RiUserLine /> {user?.role || "Reader"}
              </span>
              <span className="text-gray-400 text-xs">✉ {user?.email}</span>
              <span className="text-gray-400 text-xs">
                📅 Member since{" "}
                {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  },
                )}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs px-4 py-2 rounded-xl transition"
                >
                  <RiSaveLine /> Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 bg-[#0f172a] border border-gray-700 text-white text-xs px-4 py-2 rounded-xl transition"
                >
                  <RiCloseLine /> Cancel
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/user/purchases"
                  className="flex items-center gap-2 bg-[#0f172a] border border-gray-700 hover:border-[#6366f1]/40 text-white text-xs px-4 py-2 rounded-xl transition"
                >
                  <RiBookOpenLine /> My Ebooks
                </Link>
                <Link
                  href="/dashboard/user/bookmarks"
                  className="flex items-center gap-2 bg-[#0f172a] border border-gray-700 hover:border-[#6366f1]/40 text-white text-xs px-4 py-2 rounded-xl transition"
                >
                  <RiHeartLine /> Bookmarks
                </Link>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-[#0f172a] border border-gray-700 hover:border-[#6366f1]/40 text-white text-xs px-4 py-2 rounded-xl transition"
                >
                  <RiEditLine /> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Stats */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold text-lg mb-4">
            Activity Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <RiBookOpenLine className="text-blue-400 text-sm" />
                </div>
                <span className="text-gray-300 text-sm">Books Read</span>
              </div>
              <span className="text-white font-bold">{purchases.length}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <RiShoppingBagLine className="text-green-400 text-sm" />
                </div>
                <span className="text-gray-300 text-sm">Purchased</span>
              </div>
              <span className="text-white font-bold">{purchases.length}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <RiHeartLine className="text-red-400 text-sm" />
                </div>
                <span className="text-gray-300 text-sm">Bookmarks</span>
              </div>
              <span className="text-white font-bold">{bookmarks.length}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <RiHistoryLine className="text-purple-400 text-sm" />
                </div>
                <span className="text-gray-300 text-sm">Last Active</span>
              </div>
              <span className="text-purple-400 font-bold text-sm">
                Just now
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold text-lg mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {purchases.slice(0, 2).map((purchase, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border-b border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <RiShoppingBagLine className="text-green-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm">
                      Purchased "{purchase.ebookTitle}"
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(purchase.purchasedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  Purchase
                </span>
              </div>
            ))}

            {bookmarks.slice(0, 2).map((bookmark, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border-b border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <RiHeartLine className="text-red-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm">
                      Bookmarked "{bookmark.title}"
                    </p>
                    <p className="text-gray-500 text-xs">Recently</p>
                  </div>
                </div>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                  Bookmark
                </span>
              </div>
            ))}

            {purchases.length === 0 && bookmarks.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold text-lg mb-4">
            Account Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-700/50 pb-3">
              <span className="text-gray-400 text-sm">User ID</span>
              <span className="text-gray-300 text-sm font-mono">
                {user?.id?.slice(0, 15)}...
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-700/50 pb-3">
              <span className="text-gray-400 text-sm">Email Verified</span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  user?.emailVerified
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {user?.emailVerified ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-700/50 pb-3">
              <span className="text-gray-400 text-sm">Account Status</span>
              <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Account Type</span>
              <span className="text-gray-300 text-sm font-medium capitalize">
                {user?.role || "Reader"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <RiBookOpenLine className="text-gray-400 text-xl mb-2" />
              <h3 className="text-white font-semibold mb-1 text-xs">
                My Library
              </h3>
              <p className="text-gray-400 text-xs">
                View all your purchased ebooks
              </p>
            </div>
            <Link
              href="/dashboard/user/purchases"
              className="mt-3 inline-block bg-[#0f172a] border border-gray-700 hover:border-[#6366f1]/40 text-white text-xs px-3 py-1.5 rounded-xl transition text-center"
            >
              Go to Library →
            </Link>
          </div>

          <div className="bg-purple-600 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <RiHeartLine className="text-white text-xl mb-2" />
              <h3 className="text-white font-semibold mb-1 text-xs">
                Saved Books
              </h3>
              <p className="text-white/70 text-xs">Manage your bookmarks</p>
            </div>
            <Link
              href="/dashboard/user/bookmarks"
              className="mt-3 inline-block bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-xl transition text-center"
            >
              View Bookmarks →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
