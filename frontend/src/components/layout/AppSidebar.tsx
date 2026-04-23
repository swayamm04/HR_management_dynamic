"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CalendarCheck,
  FileText,
  BarChart3,
  Activity,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Client Management", icon: Building2, path: "/clients" },
  { label: "Job Roles", icon: Briefcase, path: "/job-roles" },
  { label: "Create Bills/Invoice", icon: FileText, path: "/billing" },
  { label: "Invoices List", icon: CalendarCheck, path: "/invoices" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Activity Logs", icon: Activity, path: "/activity-logs", roles: ["Administrator"] },
  { label: "User Management", icon: Users, path: "/settings/users", roles: ["Administrator"] },
  { label: "Settings", icon: Settings, path: "/settings" },
];

import { useAuth } from "@/context/AuthContext";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [clickCount, setClickCount] = useState(0);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    setClickCount(clickCountRef.current);
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      // Use the ref to get the most recent count
      if (clickCountRef.current > 0 && clickCountRef.current < 5) {
        // Only redirect to dashboard if we're not already on the secret page
        if (pathname !== "/secret-invoices") {
          router.push("/");
        }
      }
      clickCountRef.current = 0;
      setClickCount(0);
    }, 500); 
  };

  useEffect(() => {
    if (clickCount >= 5) {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      router.push("/secret-invoices");
      clickCountRef.current = 0;
      setClickCount(0);
    }
  }, [clickCount, router]);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div 
        className="flex items-center gap-2.5 px-4 py-5 cursor-pointer select-none"
        onClick={handleLogoClick}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Briefcase className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[13px] font-bold text-foreground whitespace-nowrap leading-none mb-0.5">AKHILA ENTERPRISES</h1>
          <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground italic whitespace-nowrap">
            Manpower Agency
          </p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navItems
          .filter((item) => !item.roles || (user && item.roles.includes(user.role)))
          .map((item) => {
            const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>





    </aside>
  );
}
