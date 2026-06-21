"use client";
import Link from "next/link";
import { RiCloseCircleLine } from "react-icons/ri";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="bg-[#1e293b] rounded-2xl p-10 max-w-md w-full text-center border border-gray-800">
        <RiCloseCircleLine className="text-7xl text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h1>
        <p className="text-gray-400 mb-8">Your payment was cancelled. No charges were made.</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/browse"
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Browse Ebooks
          </Link>
          <Link
            href="/"
            className="bg-[#0f172a] border border-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:border-[#6366f1]/40 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}