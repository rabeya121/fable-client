import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
      <h1 className="text-9xl font-bold text-[#6366f1]">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-8">Oops! The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-3 rounded-lg transition"
      >
        Go Home
      </Link>
    </div>
  );
}