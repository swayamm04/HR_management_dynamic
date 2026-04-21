"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { label: "Activity Logs", icon: Activity, path: "/activity-logs" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5">
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
        {navItems.map((item) => {
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
