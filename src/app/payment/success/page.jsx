"use client";
import { useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RiCheckboxCircleLine } from "react-icons/ri";

function SuccessContent() {
  const searchParams = useSearchParams();
  const hasSaved = useRef(false);

  const ebookId = searchParams.get("ebookId");
  const userEmail = searchParams.get("userEmail");

  useEffect(() => {
    if (!ebookId || !userEmail || hasSaved.current) return;
    hasSaved.current = true;

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ebooks/${ebookId}`)
      .then((res) => res.json())
      .then((ebook) => {
        return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/save-purchase`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ebookId,
            userEmail,
            ebookTitle: ebook.title,
            price: ebook.price,
            writerEmail: ebook.writerEmail,
            writerName: ebook.writerName,
            coverImage: ebook.coverImage,
          }),
        });
      })
      .then((res) => res.json())
      .then((data) => console.log("Purchase saved:", data))
      .catch((err) => console.error("Failed:", err));
  }, [ebookId, userEmail]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="bg-[#1e293b] rounded-2xl p-10 max-w-md w-full text-center border border-gray-800">
        <RiCheckboxCircleLine className="text-7xl text-green-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-400 mb-8">
          Your ebook has been purchased successfully.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard/user/purchases"
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-3 rounded-xl font-medium transition"
          >
            View Purchases
          </Link>
          <Link
            href="/browse"
            className="bg-[#0f172a] border border-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:border-[#6366f1]/40 transition"
          >
            Browse More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <SuccessContent />
    </Suspense>
  );
}