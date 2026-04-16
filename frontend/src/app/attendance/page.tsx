"use client";

import { Calendar, Users, Save, AlertCircle } from "lucide-react";

const days = ["MON 01", "TUE 02", "WED 03", "THU 04", "FRI 05", "SAT 06", "SUN 07", "MON 08", "TUE 09", "WED 10", "THU 11"];

const attendanceData = [
  { name: "David Miller", role: "SITE SUPERVISOR", values: [1, 1, 0.5, 1, 1, null, null, 1, 0, 1, 1], total: 22.5 },
  { name: "Sarah Jenkins", role: "QA INSPECTOR", values: [1, 1, 1, 1, 1, null, null, 1, 1, 1, 1], total: 24.0 },
  { name: "Robert Wilson", role: "LEAD ELECTRICIAN", values: [0, 1, 1, 1, 1, null, null, 1, 0.5, 1, 1], total: 21.5 },
];

export default function Attendance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Monthly Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Managing records for <span className="text-primary font-semibold">October 2023</span> • 42 Active Personnel
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Calendar className="h-4 w-4" /> Change Month
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Users className="h-4 w-4" /> Bulk Entry
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4" /> Save Attendance
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option>PROJECT: Downtown Construction Site</option>
          </select>
          <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option>FILTER: All Staff</option>
          </select>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Present</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> Absent</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground/30" /> Weekend</span>
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground min-w-[200px]">Employee Details</th>
              {days.map((d) => {
                const isWeekend = d.includes("SAT") || d.includes("SUN");
                return (
                  <th key={d} className={`px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wider ${isWeekend ? "text-muted-foreground/50 bg-muted/30" : "text-muted-foreground"}`}>
                    <div>{d.split(" ")[0]}</div><div>{d.split(" ")[1]}</div>
                  </th>
                );
              })}
              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Days</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((emp) => (
              <tr key={emp.name} className="border-t border-border">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {emp.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{emp.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{emp.role}</p>
                    </div>
                  </div>
                </td>
                {emp.values.map((v, i) => {
                  const isWeekend = i === 5 || i === 6;
                  return (
                    <td key={i} className={`px-2 py-4 text-center font-semibold ${isWeekend ? "bg-muted/30 text-muted-foreground/30" : v === 1 ? "text-primary" : v === 0 ? "text-destructive" : v === 0.5 ? "text-warning" : "text-muted-foreground/30"}`}>
                      {isWeekend ? "" : v ?? ""}
                    </td>
                  );
                })}
                <td className="px-4 py-4 text-right font-bold text-primary">{emp.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border text-sm text-muted-foreground">
          <span>‹ Page 1 of 4 ›</span>
          <div className="flex gap-6">
            <span>Average Monthly Present: 22.4 Days</span>
            <span>Total Billable Units: 945</span>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-primary p-5 text-primary-foreground">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/70">Efficiency Rating</p>
          <p className="mt-1 text-3xl font-bold">98.2%</p>
          <p className="mt-1 text-xs text-primary-foreground/80">Overall attendance health for this period.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Absence Alerts</p>
            <AlertCircle className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-1 text-3xl font-bold text-foreground">3 Active Leaves</p>
          <p className="mt-1 text-xs text-muted-foreground">Pending approval in HR module.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Next Pay Cycle</p>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-1 text-3xl font-bold text-foreground">04 Nov 2023</p>
          <p className="mt-1 text-xs text-muted-foreground">Data locks in 12 days.</p>
        </div>
      </div>
    </div>
  );
}
