"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (user.role === "writer") {
        router.push("/dashboard/writer");
      } else {
        router.push("/dashboard/user");
      }
    }
  }, [user, isPending]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}