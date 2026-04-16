"use client";

import AppSidebar from "./AppSidebar";
import { Search, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-60 flex-1">
        {/* Top search bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-8 py-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employees, invoices, or clients..."
              className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs font-semibold text-foreground">{user?.name || "Loading..."}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                {user?.role || "Administrator"}
              </span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all border border-border"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
