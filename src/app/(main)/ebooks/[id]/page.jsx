"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  RiBookOpenLine,
  RiArrowLeftLine,
  RiHeartLine,
  RiHeartFill,
  RiCalendarLine,
  RiUserLine,
  RiShoppingBagLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import toast from "react-hot-toast";

export default function EbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ebooks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Ebook not found") setEbook(null);
        else setEbook(data);
      })
      .catch(() => setEbook(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Check already purchased + bookmarked
  useEffect(() => {
    if (!user?.email || !id) return;

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases/${user.email}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((p) => p.ebookId === id);
          if (found) setPurchased(true);
        }
      })
      .catch(() => {});

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookmarks/${user.email}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((b) => b._id?.toString() === id);
          if (found) setBookmarked(true);
        }
      })
      .catch(() => {});
  }, [user, id]);

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase!");
      router.push(`/login?callbackUrl=/ebooks/${id}`);
      return;
    }
    setPurchasing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/create-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ebookId: ebook._id,
            ebookTitle: ebook.title,
            price: ebook.price,
            userEmail: user.email,
          }),
        },
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Payment failed!");
      }
    } catch {
      toast.error("Payment failed!");
    } finally {
      setPurchasing(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark!");
      router.push("/login");
      return;
    }
    try {
      if (bookmarked) {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookmarks/${ebook._id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail: user.email }),
          },
        );
        setBookmarked(false);
        toast.success("Bookmark removed!");
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookmarks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ebookId: ebook._id, userEmail: user.email }),
        });
        setBookmarked(true);
        toast.success("Bookmarked!");
      }
    } catch {
      toast.error("Failed!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] px-4 py-10">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-6 bg-[#1e293b] rounded w-32 mb-8" />
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-72 h-96 bg-[#1e293b] rounded-2xl" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-[#1e293b] rounded w-3/4" />
              <div className="h-4 bg-[#1e293b] rounded w-1/2" />
              <div className="h-4 bg-[#1e293b] rounded w-1/3" />
              <div className="h-24 bg-[#1e293b] rounded" />
              <div className="h-12 bg-[#1e293b] rounded w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
        <RiBookOpenLine className="text-8xl text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ebook not found</h2>
        <p className="text-gray-400 mb-6">
          The ebook you are looking for does not exist.
        </p>
        <Link
          href="/browse"
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-3 rounded-xl transition"
        >
          Browse Ebooks
        </Link>
      </div>
    );
  }

  const isWriter = user?.email === ebook.writerEmail;

  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link
          href="/browse"
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition w-fit"
        >
          <RiArrowLeftLine /> Back to Browse
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Cover Image */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="h-96 bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
              {ebook.coverImage ? (
                <img
                  src={ebook.coverImage}
                  alt={ebook.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <RiBookOpenLine className="text-8xl text-[#6366f1]/30" />
                </div>
              )}
            </div>

            {/* Meta info below cover */}
            <div className="mt-4 bg-[#1e293b] rounded-2xl p-4 border border-gray-800 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-[#6366f1]/20 rounded-lg flex items-center justify-center">
                  <RiUserLine className="text-[#6366f1] text-sm" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Writer</p>
                  <p className="text-white font-medium">{ebook.writerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <RiShoppingBagLine className="text-green-400 text-sm" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total Sales</p>
                  <p className="text-white font-medium">
                    {ebook.sales || 0} copies
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <RiCalendarLine className="text-blue-400 text-sm" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Published</p>
                  <p className="text-white font-medium">
                    {new Date(ebook.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            {/* Title + Bookmark */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl font-bold text-white leading-tight">
                {ebook.title}
              </h1>
              <button
                onClick={handleBookmark}
                className={`text-2xl transition hover:scale-110 flex-shrink-0 ${
                  bookmarked
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-400"
                }`}
              >
                {bookmarked ? <RiHeartFill /> : <RiHeartLine />}
              </button>
            </div>

            {/* Writer */}
            <p className="text-gray-400 mb-4">
              by{" "}
              <Link
                href={`/browse?writer=${ebook.writerEmail}`}
                className="text-[#6366f1] hover:underline font-medium"
              >
                {ebook.writerName}
              </Link>
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-[#6366f1]/20 text-[#6366f1] px-3 py-1 rounded-full text-xs font-semibold">
                {ebook.genre}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  ebook.status === "published"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {ebook.status === "published" ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Description */}
            <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-800 mb-6">
              <h3 className="text-white font-semibold mb-3">About this book</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {ebook.description}
              </p>
            </div>

            {/* Price + Button */}
            <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Price</p>
                  <p className="text-3xl font-bold text-white">
                    ${ebook.price}
                  </p>
                </div>
                {purchased && (
                  <span className="flex items-center gap-1 text-green-400 text-sm font-semibold bg-green-500/10 px-3 py-1 rounded-full">
                    <RiCheckboxCircleLine /> Purchased
                  </span>
                )}
              </div>

              {isWriter ? (
                <button
                  disabled
                  className="w-full bg-gray-700 text-gray-400 py-3 rounded-xl font-semibold cursor-not-allowed text-sm"
                >
                  You are the writer of this book
                </button>
              ) : purchased ? (
                <Link
                  href={`/dashboard/user/purchases`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2"
                >
                  <RiBookOpenLine /> Read Now
                </Link>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || ebook.status !== "published"}
                  className="w-full bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition text-sm"
                >
                  {purchasing ? "Processing..." : `Buy Now — $${ebook.price}`}
                </button>
              )}

              {!user && (
                <p className="text-gray-500 text-xs text-center mt-3">
                  <Link
                    href="/login"
                    className="text-[#6366f1] hover:underline"
                  >
                    Login
                  </Link>{" "}
                  to purchase this ebook
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
