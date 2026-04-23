"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }

    // Role-based protection
    if (!loading && isAuthenticated && user) {
      const adminOnlyRoutes = ["/activity-logs", "/settings/users"];
      if (user.role !== "Administrator" && adminOnlyRoutes.includes(pathname)) {
        router.push("/");
      }
    }
  }, [isAuthenticated, loading, pathname, router, user]);

  // Show nothing while loading the auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If on login page, just show children
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // If not authenticated, don't show the dashboard layout
  if (!isAuthenticated) {
    return null;
  }

  // Show the app with layout if authenticated
  return <AppLayout>{children}</AppLayout>;
}
