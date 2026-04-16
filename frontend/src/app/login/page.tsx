"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { User, Lock, Loader2, ArrowRight, Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        toast.success("Welcome back!", {
          description: "Login successful. Redirecting...",
          duration: 1500,
          position: "bottom-right",
        });
        router.push("/");
      } else {
        toast.error("Authentication Failed", {
          description: data.message || "Invalid email or password",
          position: "bottom-right",
          className: "bg-red-50 text-red-600 border border-red-100",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Connection Error", {
        description: "Could not connect to the authentication server.",
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Simple & Classy Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 border border-blue-100">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">Portal Access</h1>
            <p className="text-slate-500 text-sm">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-700 ml-1">Email ID</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@hrmanagement.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/40 transition-all text-[15px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    disabled={isSubmitting}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/40 transition-all text-[15px]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">HR Management v2026</p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-xs">
          Built with enterprise-grade security and encryption
        </p>
      </div>
    </div>
  );
}
