"use client";

import { Building2, Users, IndianRupee, MoreVertical, Mail } from "lucide-react";

const clients = [
  { name: "Green Valley School", status: "ACTIVE CONTRACT", statusColor: "text-success", contact: "Dr. Sarah Jenkins", employees: 124, billed: "₹412,850.00" },
  { name: "City Hospital", status: "ACTIVE CONTRACT", statusColor: "text-success", contact: "Marcus Thorne", employees: 458, billed: "₹1,245,300.00" },
  { name: "Horizon Tech Park", status: "REVIEW PENDING", statusColor: "text-destructive", contact: "Lila Vance", employees: 82, billed: "₹189,400.00" },
  { name: "Metro Transit", status: "ACTIVE CONTRACT", statusColor: "text-success", contact: "Elena Rodriguez", employees: 312, billed: "₹892,100.00" },
];

export default function ClientManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client Management</h1>
          <p className="text-sm text-muted-foreground">Oversee your active partnerships, track staffing density across organizations, and monitor historical billing performance.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          + Onboard New Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Clients</p>
          <p className="text-2xl font-bold text-foreground">142</p>
          <p className="mt-1 text-xs text-success">↗ 12% from last month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center"><IndianRupee className="h-5 w-5 text-success" /></div>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Billed</p>
          <p className="text-2xl font-bold text-foreground">₹1.2M</p>
          <p className="mt-1 text-xs text-muted-foreground">Fiscal Year 2024</p>
        </div>
        <div className="rounded-xl bg-primary p-5 text-primary-foreground">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/70">Active Manpower</p>
          <p className="text-2xl font-bold">2,840 Employees</p>
          <p className="mt-1 text-xs text-primary-foreground/80">Currently deployed across all client sites with a 94% attendance rate this week.</p>
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-3 gap-4">
        {clients.map((client) => (
          <div key={client.name} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{client.name}</h3>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${client.statusColor}`}>● {client.status}</p>
                </div>
              </div>
              <button className="text-muted-foreground"><MoreVertical className="h-4 w-4" /></button>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" /> <span>Contact Person</span> <span className="ml-auto font-medium text-foreground">{client.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" /> <span>Active Employees</span> <span className="ml-auto font-bold text-foreground">{client.employees}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IndianRupee className="h-4 w-4" /> <span>Total Billed</span> <span className="ml-auto font-bold text-primary">{client.billed}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 rounded-full bg-foreground py-2 text-xs font-semibold text-card hover:opacity-90 transition-opacity">View Details</button>
              <button className="rounded-full border border-border p-2 text-muted-foreground hover:bg-muted"><Mail className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
