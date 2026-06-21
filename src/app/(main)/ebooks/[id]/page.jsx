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
} from "react-icons/ri";
import toast from "react-hot-toast";

export default function EbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/ebooks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Ebook not found") {
          setEbook(null);
        } else {
          setEbook(data);
        }
      })
      .catch(() => setEbook(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase!");
      router.push("/login");
      return;
    }
    setPurchasing(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/payment/create-checkout`,
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
        await fetch(`http://localhost:8000/api/bookmarks/${ebook._id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email }),
        });
        setBookmarked(false);
        toast.success("Bookmark removed!");
      } else {
        await fetch(`http://localhost:8000/api/bookmarks`, {
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
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 animate-pulse">
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
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-3 rounded-lg transition"
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
        {/* Back Button */}
        <Link
          href="/browse"
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition"
        >
          <RiArrowLeftLine /> Back to Browse
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Cover Image */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="h-96 bg-[#1e293b] rounded-2xl overflow-hidden">
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
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-white">{ebook.title}</h1>
              <button
                onClick={handleBookmark}
                className="text-2xl text-[#6366f1] hover:scale-110 transition"
              >
                {bookmarked ? <RiHeartFill /> : <RiHeartLine />}
              </button>
            </div>

            <p className="text-gray-400 mb-2">
              by{" "}
              <Link
                href={`/browse?writer=${ebook.writerEmail}`}
                className="text-[#6366f1] hover:underline"
              >
                {ebook.writerName}
              </Link>
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-[#6366f1]/20 text-[#6366f1] px-3 py-1 rounded-full text-sm">
                {ebook.genre}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  ebook.status === "published"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {ebook.status === "published" ? "Available" : "Sold Out"}
              </span>
              <span className="bg-[#1e293b] text-gray-400 px-3 py-1 rounded-full text-sm">
                {new Date(ebook.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              {ebook.description}
            </p>

            <div className="flex items-center gap-6 mb-8">
              <span className="text-4xl font-bold text-white">
                ${ebook.price}
              </span>
              <span className="text-gray-500 text-sm">
                {ebook.sales || 0} sold
              </span>
            </div>

            {/* Purchase Button */}
            {isWriter ? (
              <button
                disabled
                className="bg-gray-700 text-gray-400 px-8 py-3 rounded-xl font-semibold cursor-not-allowed"
              >
                You are the writer
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                {purchasing ? "Processing..." : `Buy Now — $${ebook.price}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
