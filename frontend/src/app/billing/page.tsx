"use client";

import { FileText, Save, Trash2, Plus, MinusCircle, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Client {
  _id: string;
  name: string;
}

interface JobRole {
  _id: string;
  title: string;
}

interface LineItem {
  id: string;
  roleName: string;
  posts: number;
  days: number;
  rate: number;
}

async function fetchClients(): Promise<Client[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/api/clients`);
  if (!response.ok) throw new Error("Failed to fetch clients");
  return response.json();
}

async function fetchJobRoles(): Promise<JobRole[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/api/job-roles`);
  if (!response.ok) throw new Error("Failed to fetch job roles");
  return response.json();
}

export default function BillingInvoices() {
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [billingMonth, setBillingMonth] = useState<string>("October 2023");
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), roleName: "Security Supervisor", posts: 2, days: 26, rate: 850 },
    { id: crypto.randomUUID(), roleName: "Security Guard (Unarmed)", posts: 8, days: 30, rate: 620 },
  ]);

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  const { data: jobRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ["job-roles"],
    queryFn: fetchJobRoles,
  });

  // Set default client if available
  useEffect(() => {
    if (clients && clients.length > 0 && !selectedClientName) {
      setSelectedClientName(clients[0].name);
    }
  }, [clients, selectedClientName]);

  const handleAddRow = () => {
    setLineItems([
      ...lineItems,
      { id: crypto.randomUUID(), roleName: "", posts: 1, days: 30, rate: 0 }
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculations
  const calculations = useMemo(() => {
    const subTotal = lineItems.reduce((acc, item) => acc + (item.posts * item.days * item.rate), 0);
    const pf = subTotal * 0.13;
    const esi = subTotal * 0.0325;
    const service = subTotal * 0.03;
    const taxable = subTotal + pf + esi + service;
    const cgst = taxable * 0.09;
    const sgst = taxable * 0.09;
    const grand = taxable + cgst + sgst;

    return { subTotal, pf, esi, service, taxable, cgst, sgst, grand };
  }, [lineItems]);

  const { subTotal, pf, esi, service, taxable, cgst, sgst, grand } = calculations;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span> <span>›</span> <span className="text-foreground font-medium">New Invoice</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Generate Billing</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Trash2 className="h-4 w-4" /> Discard Draft
          </button>
          <button 
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            onClick={() => toast.success("Invoice saved successfully! (Simulated)")}
          >
            <Save className="h-4 w-4" /> Save Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-bold text-foreground mb-4">Client Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Client Name</label>
                <div className="relative">
                  <select 
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={selectedClientName}
                    onChange={(e) => setSelectedClientName(e.target.value)}
                    disabled={clientsLoading}
                  >
                    {clientsLoading ? (
                      <option>Loading clients...</option>
                    ) : clients?.length ? (
                      clients.map(c => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))
                    ) : (
                      <option value="">No clients found</option>
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Billing Month</label>
                <div className="relative">
                  <select 
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={billingMonth}
                    onChange={(e) => setBillingMonth(e.target.value)}
                  >
                    <option value="August 2023">August 2023</option>
                    <option value="September 2023">September 2023</option>
                    <option value="October 2023">October 2023</option>
                    <option value="November 2023">November 2023</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Service Itemization</h2>
              <button 
                onClick={handleAddRow}
                className="text-xs font-semibold text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Row
              </button>
            </div>
            
            <div className="space-y-3">
              {lineItems.map((item) => (
                <div key={item.id} className="flex gap-2 items-start relative group">
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    <div className="col-span-1">
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">Job Role</label>
                      <select 
                        className="w-full rounded-lg border border-border px-2 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={item.roleName}
                        onChange={(e) => handleUpdateRow(item.id, "roleName", e.target.value)}
                        disabled={rolesLoading}
                      >
                        <option value="" disabled>Select Role...</option>
                        {/* Currently we just list the DB roles, plus we keep the custom ones from mock data if they don't match */}
                        {!rolesLoading && jobRoles?.map(role => (
                           <option key={role._id} value={role.title}>{role.title}</option>
                        ))}
                        {/* Fallback for pre-existing mock items if not in DB */}
                        {item.roleName && (!jobRoles || !jobRoles.find(r => r.title === item.roleName)) && (
                          <option value={item.roleName}>{item.roleName}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">Posts</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full rounded-lg border border-border px-2 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20" 
                        value={item.posts} 
                        onChange={(e) => handleUpdateRow(item.id, "posts", parseInt(e.target.value) || 0)}
                        onFocus={(e) => e.target.select()}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">Days</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full rounded-lg border border-border px-2 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20" 
                        value={item.days} 
                        onChange={(e) => handleUpdateRow(item.id, "days", parseInt(e.target.value) || 0)}
                        onFocus={(e) => e.target.select()}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">Rate (₹)</label>
                      <input 
                        type="number" 
                        min="0"
                        step="10"
                        className="w-full rounded-lg border border-border px-2 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20" 
                        value={item.rate} 
                        onChange={(e) => handleUpdateRow(item.id, "rate", parseFloat(e.target.value) || 0)}
                        onFocus={(e) => e.target.select()}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveRow(item.id)}
                    className="mt-6 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remove item"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {lineItems.length === 0 && (
                <div className="text-center py-4 border border-dashed border-border rounded-lg text-sm text-muted-foreground">
                  No line items. Add a row to get started.
                </div>
              )}
            </div>
            
            <button 
              onClick={handleAddRow}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg w-full py-3 transition-colors hover:bg-muted/50"
            >
              <Plus className="h-4 w-4" /> Insert Additional Line Item
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-primary p-6 text-primary-foreground">
            <p className="text-xs uppercase tracking-widest text-primary-foreground/70 font-semibold mb-1">Invoice Preview</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="font-bold text-lg">Manpower Pro Services</p>
                <p className="text-xs text-primary-foreground/70">Reg No: MP-992-8812-X</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-primary-foreground/70 font-semibold mb-0.5">Invoice No.</p>
                <p className="text-xl font-bold">INV-2023-10-044</p>
                <p className="text-xs text-primary-foreground/80 mt-0.5">Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex justify-between text-sm">
              <div className="max-w-[50%]">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Billed To</p>
                <p className="font-bold text-foreground text-base truncate">{selectedClientName || "Select a client..."}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Registered Office Address</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Service Period</p>
                <p className="text-sm font-medium text-foreground">{billingMonth}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Payment Due: Net 15</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-left w-2/5">Description</th>
                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Posts</th>
                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Days</th>
                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Rate</th>
                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => {
                    const itemAmount = item.posts * item.days * item.rate;
                    return (
                      <tr key={item.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 font-medium text-foreground pr-2">{item.roleName || "No role specified"}</td>
                        <td className="py-3 text-muted-foreground text-right">{item.posts}</td>
                        <td className="py-3 text-muted-foreground text-right">{item.days}</td>
                        <td className="py-3 text-muted-foreground text-right">{formatCurrency(item.rate)}</td>
                        <td className="py-3 font-bold text-foreground text-right">{formatCurrency(itemAmount)}</td>
                      </tr>
                    );
                  })}
                  {lineItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground text-sm italic border-b border-border/50">
                        No service items added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="space-y-1.5 text-sm pt-4 w-full sm:w-80 ml-auto border-t border-border mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">Sub-Total (Basic Wage)</span>
                <span className="font-bold text-base">{formatCurrency(subTotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs"><span>PF Contribution (13%)</span><span>{formatCurrency(pf)}</span></div>
              <div className="flex justify-between text-muted-foreground text-xs"><span>ESI Contribution (3.25%)</span><span>{formatCurrency(esi)}</span></div>
              <div className="flex justify-between text-muted-foreground text-xs mb-2"><span>Service Charge (3%)</span><span>{formatCurrency(service)}</span></div>
              
              <div className="flex justify-between pt-2 border-t border-border items-center">
                <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Taxable Value</span>
                <span className="font-semibold text-foreground">{formatCurrency(taxable)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs mt-1"><span>CGST (9%)</span><span>{formatCurrency(cgst)}</span></div>
              <div className="flex justify-between text-muted-foreground text-xs"><span>SGST (9%)</span><span>{formatCurrency(sgst)}</span></div>
              
              <div className="flex justify-between pt-3 border-t-2 border-border mt-3 items-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Grand Total Amount</span>
                <span className="text-2xl font-black text-foreground">{formatCurrency(grand)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 border-t border-border p-4 bg-muted/20">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"><FileText className="h-4 w-4" /> Download PDF</button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors">Print Invoice</button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-foreground text-card py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity">Submit to Client</button>
          </div>
        </div>
      </div>
    </div>
  );
}
