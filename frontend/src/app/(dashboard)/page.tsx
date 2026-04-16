"use client";

import { Users, Building2, IndianRupee, AlertTriangle, TrendingUp, FileText, UserPlus, AlertCircle, PenLine } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "JAN", invoiced: 120000, collected: 95000 },
  { month: "FEB", invoiced: 135000, collected: 110000 },
  { month: "MAR", invoiced: 128000, collected: 120000 },
  { month: "APR", invoiced: 150000, collected: 130000 },
  { month: "MAY", invoiced: 165000, collected: 150000 },
  { month: "JUN", invoiced: 155000, collected: 140000 },
];

const activityLogs = [
  { icon: FileText, color: "bg-primary/10 text-primary", title: "New Invoice Generated", desc: "Client: TechCorp Solutions", time: "2 mins ago" },
  { icon: UserPlus, color: "bg-success/10 text-success", title: "15 New Employees Onboarded", desc: "Role: Logistic Staff", time: "1 hour ago" },
  { icon: AlertCircle, color: "bg-destructive/10 text-destructive", title: "Payment Overdue", desc: "Client: Global Logistics Ltd.", time: "3 hours ago" },
  { icon: PenLine, color: "bg-muted text-muted-foreground", title: "Settings Updated", desc: "By Admin: Sarah Chen", time: "Yesterday" },
];

const topClients = [
  { name: "TechCorp Solutions", revenue: 45200, pct: 100 },
  { name: "Innovate Retail", revenue: 32100, pct: 71 },
  { name: "Eco-Logistics", revenue: 28500, pct: 63 },
  { name: "Harbor Maritime", revenue: 21000, pct: 46 },
];

const employees = [
  { name: "Alex Rivera", client: "TechCorp Solutions", role: "Project Lead", status: "On Site", statusColor: "bg-success/10 text-success" },
  { name: "Maya Sterling", client: "Innovate Retail", role: "QA Engineer", status: "Remote", statusColor: "bg-primary/10 text-primary" },
  { name: "Jordan Hayes", client: "Eco-Logistics", role: "Senior Developer", status: "On Leave", statusColor: "bg-warning/10 text-warning" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organization Overview</h1>
          <p className="text-sm text-muted-foreground">Real-time pulse of your workforce and financial performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <TrendingUp className="h-4 w-4" /> Export PDF
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            + New Entry
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Users, label: "TOTAL EMPLOYEES", value: "1,284", change: "+4%", bg: "bg-card" },
          { icon: Building2, label: "TOTAL CLIENTS", value: "86", change: "Steady", bg: "bg-card" },
          { icon: IndianRupee, label: "MONTHLY REVENUE", value: "₹150,000", change: "+12.5%", bg: "bg-primary text-primary-foreground", highlight: true },
          { icon: AlertTriangle, label: "PENDING BILLS", value: "12", change: "Critical", bg: "bg-card", critical: true },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl border border-border p-5 ${stat.bg} ${stat.highlight ? "shadow-lg shadow-primary/20" : ""}`}>
            <div className="flex items-center justify-between">
              <stat.icon className={`h-5 w-5 ${stat.highlight ? "text-primary-foreground/70" : "text-primary"}`} />
              <span className={`text-xs font-semibold ${stat.critical ? "text-destructive" : stat.highlight ? "text-primary-foreground/80" : "text-success"}`}>
                {stat.change}
              </span>
            </div>
            <p className={`mt-1 text-[10px] font-semibold uppercase tracking-wider ${stat.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {stat.label}
            </p>
            <p className={`mt-1 text-2xl font-bold ${stat.highlight ? "" : "text-foreground"}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Activity Logs */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Billing Trends</h2>
              <p className="text-sm text-muted-foreground">Historical analysis of invoicing vs collections</p>
            </div>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground">6 Months</button>
              <button className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted">1 Year</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="invoiced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(213, 94%, 38%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(213, 94%, 38%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="collected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <Tooltip />
              <Area type="monotone" dataKey="invoiced" stroke="hsl(213, 94%, 38%)" fill="url(#invoiced)" strokeWidth={2} />
              <Area type="monotone" dataKey="collected" stroke="hsl(142, 71%, 45%)" fill="url(#collected)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Activity Logs</h2>
            <button className="text-xs font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {activityLogs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${log.color}`}>
                  <log.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{log.title}</p>
                  <p className="text-xs text-muted-foreground">{log.desc}</p>
                  <p className="text-[10px] text-muted-foreground">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clients + Employee Snapshot */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Top Clients by Revenue</h2>
          <div className="space-y-4">
            {topClients.map((client) => (
              <div key={client.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">{client.name}</span>
                  <span className="font-bold text-foreground">₹{client.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${client.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Employee Snapshot</h2>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-card text-primary border-b-2 border-primary">Active Projects</button>
              <button className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Archived</button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Employee Name</th>
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Current Client</th>
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Job Role</th>
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.name} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium text-foreground">{emp.name}</td>
                  <td className="py-3 text-muted-foreground">{emp.client}</td>
                  <td className="py-3 text-muted-foreground">{emp.role}</td>
                  <td className="py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${emp.statusColor}`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
            Show All 1,284 Employees
          </button>
        </div>
      </div>
    </div>
  );
}
