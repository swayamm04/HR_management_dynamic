"use client";

import { FileText, Save, Trash2, Plus } from "lucide-react";
import { useState } from "react";

const lineItems = [
  { desc: "Security Supervisor", posts: 2, days: 26, rate: 850, amount: 44200 },
  { desc: "Security Guard (Unarmed)", posts: 8, days: 30, rate: 620, amount: 148800 },
];

export default function BillingInvoices() {
  const [client] = useState("Quantum Dynamics Inc.");
  const subTotal = lineItems.reduce((s, l) => s + l.amount, 0);
  const pf = subTotal * 0.13;
  const esi = subTotal * 0.0325;
  const service = subTotal * 0.03;
  const taxable = subTotal + pf + esi + service;
  const cgst = taxable * 0.09;
  const sgst = taxable * 0.09;
  const grand = taxable + cgst + sgst;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span> <span>›</span> <span className="text-foreground font-medium">New Invoice</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Generate Billing</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Trash2 className="h-4 w-4" /> Discard Draft
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4" /> Save Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-bold text-foreground mb-4">Client Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Client Name</label>
                <select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">{<option>{client}</option>}</select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Billing Month</label>
                <select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>October 2023</option></select>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Service Itemization</h2>
              <button className="text-xs font-semibold text-primary flex items-center gap-1"><Plus className="h-3 w-3" /> Add Row</button>
            </div>
            {lineItems.map((item, i) => (
              <div key={i} className="grid grid-cols-4 gap-3 mb-3">
                <div><label className="text-[10px] font-semibold uppercase text-muted-foreground">Job Role / Service</label><select className="mt-1 w-full rounded-lg border border-border px-2 py-2 text-sm"><option>{item.desc.substring(0,10)}...</option></select></div>
                <div><label className="text-[10px] font-semibold uppercase text-muted-foreground">Posts</label><input className="mt-1 w-full rounded-lg border border-border px-2 py-2 text-sm" defaultValue={item.posts} /></div>
                <div><label className="text-[10px] font-semibold uppercase text-muted-foreground">Days</label><input className="mt-1 w-full rounded-lg border border-border px-2 py-2 text-sm" defaultValue={item.days} /></div>
                <div><label className="text-[10px] font-semibold uppercase text-muted-foreground">Rate</label><input className="mt-1 w-full rounded-lg border border-border px-2 py-2 text-sm" defaultValue={`₹ ${item.rate}`} /></div>
              </div>
            ))}
            <button className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg w-full justify-center py-3">
              <Plus className="h-4 w-4" /> Insert Additional Line Item
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-primary p-6 text-primary-foreground">
            <p className="text-xs uppercase tracking-widest text-primary-foreground/60">Invoice Preview</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="font-bold">Manpower Pro Services</p>
                <p className="text-xs text-primary-foreground/70">Reg No: MP-992-8812-X</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-primary-foreground/60">Invoice No.</p>
                <p className="text-lg font-bold">INV-2023-10-044</p>
                <p className="text-xs text-primary-foreground/70">Date: October 27, 2023</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Billed To</p>
                <p className="font-semibold text-foreground">{client}</p>
                <p className="text-xs text-muted-foreground">Building 4, Tech Plaza, Silicon Heights</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Service Period</p>
                <p className="text-xs text-foreground">October 01 - October 31, 2023</p>
                <p className="text-xs text-muted-foreground">Payment Due: Nov 15, 2023</p>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                {["Description", "Posts", "Days", "Rate", "Amount"].map(h => (
                  <th key={h} className="pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-left">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-3 font-medium text-foreground">{item.desc}</td>
                    <td className="py-3 text-muted-foreground">{item.posts}</td>
                    <td className="py-3 text-muted-foreground">{item.days}</td>
                    <td className="py-3 text-muted-foreground">₹{item.rate.toFixed(2)}</td>
                    <td className="py-3 font-semibold text-foreground">₹{item.amount.toLocaleString()}.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-1 text-sm text-right">
              <div className="flex justify-between"><span className="text-primary font-medium">Sub-Total (Basic Wage)</span><span className="font-semibold">₹{subTotal.toLocaleString()}.00</span></div>
              <div className="flex justify-between text-muted-foreground"><span>PF Contribution (13%)</span><span>₹{pf.toLocaleString()}.00</span></div>
              <div className="flex justify-between text-muted-foreground"><span>ESI Contribution (3.25%)</span><span>₹{esi.toLocaleString()}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Service Charge (3%)</span><span>₹{service.toLocaleString()}.00</span></div>
              <div className="flex justify-between pt-2 border-t border-border"><span className="text-muted-foreground">Taxable Value</span><span className="font-semibold">₹{taxable.toLocaleString()}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>CGST (9%)</span><span>₹{cgst.toLocaleString()}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>SGST (9%)</span><span>₹{sgst.toLocaleString()}</span></div>
              <div className="flex justify-between pt-3 border-t border-border mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Grand Total Amount</span>
                <span className="text-2xl font-bold text-foreground">₹{grand.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 border-t border-border p-4">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"><FileText className="h-4 w-4" /> Generate PDF</button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted">Print Invoice</button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted">Send to Client</button>
          </div>
        </div>
      </div>
    </div>
  );
}
