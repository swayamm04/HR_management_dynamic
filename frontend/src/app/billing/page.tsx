"use client";

import { FileText, Save, Trash2, Plus, MinusCircle, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { numberToIndianWords } from "@/lib/utils/numberToWords";
import { InvoicePreview } from "@/components/billing/InvoicePreview";
import { Download, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, setYear, setMonth, getYear, getMonth } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { type Client } from "@/types/client";

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
  amount: number;
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openClient, setOpenClient] = useState(false);
  const [openRole, setOpenRole] = useState<string | null>(null); // To track which row's role dropdown is open
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [billingMonth, setBillingMonth] = useState<string>("");
  const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isGST, setIsGST] = useState(true);

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [clientAddress, setClientAddress] = useState<string>("");

  const resetForm = () => {
    setSelectedClientName("");
    setBillingMonth("");
    setClientAddress("");
    setLineItems([]);
    setOpenRole(null);
    setOpenClient(false);
    setIsGST(true);
  };

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  const { data: jobRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ["job-roles"],
    queryFn: fetchJobRoles,
  });

  const { data: companyDetails } = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/company`);
      if (!response.ok) throw new Error("Failed to fetch company details");
      return response.json();
    },
  });


  const handleAddRow = () => {
    setLineItems([
      ...lineItems,
      { id: crypto.randomUUID(), roleName: "", posts: 1, days: 30, rate: 0, amount: 0 }
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate item amount
        updatedItem.amount = updatedItem.posts * updatedItem.days * updatedItem.rate;
        return updatedItem;
      }
      return item;
    }));
  };

  const handleRoleSelect = (id: string, roleTitle: string) => {
    const role = jobRoles?.find(r => r.title === roleTitle);
    const rate = role ? (role as any).salaryPerDay || 0 : 0;

    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, roleName: roleTitle, rate };
        updatedItem.amount = updatedItem.posts * updatedItem.days * updatedItem.rate;
        return updatedItem;
      }
      return item;
    }));
  };

  const handleClientSelect = (clientName: string) => {
    setSelectedClientName(clientName);
    const client = clients?.find(c => c.name === clientName);
    if (client && (client as any).address) {
      setClientAddress((client as any).address);
    } else {
      setClientAddress("");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };


  // Calculations matching Akhila Enterprises logic
  const calculations = useMemo(() => {
    const rates = {
      pf: (companyDetails?.pfRate || 13) / 100,
      esi: (companyDetails?.esiRate || 3.25) / 100,
      service: (companyDetails?.serviceRate || 3) / 100,
      cgst: (companyDetails?.cgstRate || 9) / 100,
      sgst: (companyDetails?.sgstRate || 9) / 100,
    };

    const subTotal = lineItems.reduce((acc, item) => acc + item.amount, 0);
    const pf = Number((subTotal * rates.pf).toFixed(2));
    const esi = Number((subTotal * rates.esi).toFixed(2));
    const totalBeforeService = Number((subTotal + pf + esi).toFixed(2));
    const service = Number((totalBeforeService * rates.service).toFixed(2));
    const taxableValue = Number((totalBeforeService + service).toFixed(2));
    const cgst = isGST ? Number((taxableValue * rates.cgst).toFixed(2)) : 0;
    const sgst = isGST ? Number((taxableValue * rates.sgst).toFixed(2)) : 0;
    const finalBeforeRound = taxableValue + cgst + sgst;
    const grand = Math.ceil(finalBeforeRound);
    const roundOff = Number((grand - finalBeforeRound).toFixed(2));

    return { subTotal, pf, esi, totalBeforeService, service, taxableValue, cgst, sgst, grand, roundOff, rates };
  }, [lineItems, companyDetails, isGST]);

  const { subTotal, pf, esi, totalBeforeService, service, taxableValue, cgst, sgst, grand, roundOff, rates } = calculations;
  const displayRates = {
    pf: companyDetails?.pfRate || 13,
    esi: companyDetails?.esiRate || 3.25,
    service: companyDetails?.serviceRate || 3,
    cgst: companyDetails?.cgstRate || 9,
    sgst: companyDetails?.sgstRate || 9,
  };

  const saveInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
      if (!response.ok) throw new Error("Failed to save invoice");
      return response.json();
    },
    onSuccess: (data: any) => {
      toast.success("Invoice saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      handleDownloadPDF();
      resetForm();
    },
    onError: (error: any) => {
      toast.error("Error", { description: error.message });
    },
  });

  const handleSaveInvoice = () => {
    if (!selectedClientName) return toast.error("Please select a client.");
    if (!billingMonth) return toast.error("Please select a billing month.");
    if (lineItems.length === 0) return toast.error("Please add at least one line item.");

    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`, // Temporary, backend handles it but we keep it for preview
      clientName: selectedClientName,
      clientAddress,
      billingMonth,
      lineItems: lineItems.map(({ roleName, posts, days, rate }) => ({ roleName, posts, days, rate })),
      subTotal,
      pf,
      esi,
      serviceCharge: service,
      taxableValue,
      cgst,
      sgst,
      isGST,
      roundOff,
      grandTotal: grand,
      grandTotalInWords: numberToIndianWords(grand), 
    };

    saveInvoiceMutation.mutate(invoiceData);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Generate Billing</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-bold text-foreground mb-4">Client Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Client Name</label>
                <div className="relative mt-1">
                  <Popover open={openClient} onOpenChange={setOpenClient}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openClient}
                        className="w-full justify-between h-9 px-3 rounded-lg border-border font-normal bg-card"
                        disabled={clientsLoading}
                      >
                        {selectedClientName
                          ? clients?.find((client) => client.name === selectedClientName)?.name
                          : "Select Client..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search client..." />
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {clients?.map((client) => (
                              <CommandItem
                                key={client._id}
                                value={client.name}
                                onSelect={(currentValue) => {
                                  // Find the actual client name to maintain exact case/spacing
                                  const c = clients.find(cl => cl.name.toLowerCase() === currentValue.toLowerCase());
                                  handleClientSelect(c ? c.name : currentValue);
                                  setOpenClient(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedClientName === client.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {client.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Billing Month</label>
                <div className="relative mt-1">
                  <Popover open={isMonthPickerOpen} onOpenChange={setIsMonthPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-9 px-3 rounded-lg border-border",
                          !billingMonth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {billingMonth ? billingMonth : <span>Select Month...</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="start">
                      <div className="flex items-center justify-between mb-4 px-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setViewYear(prev => prev - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-bold">{viewYear}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setViewYear(prev => prev + 1)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, idx) => {
                          const isSelected = billingMonth.startsWith(month === "Jan" ? "January" : month === "Feb" ? "February" : month === "Mar" ? "March" : month === "Apr" ? "April" : month === "Jun" ? "June" : month === "Jul" ? "July" : month === "Sep" ? "September" : month === "Oct" ? "October" : month === "Nov" ? "November" : month === "Dec" ? "December" : month) && billingMonth.endsWith(viewYear.toString());

                          return (
                            <Button
                              key={month}
                              variant={isSelected ? "default" : "ghost"}
                              className={cn(
                                "h-9 w-full text-xs font-medium",
                                isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted"
                              )}
                              onClick={() => {
                                const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                setBillingMonth(`${fullMonthNames[idx]} ${viewYear}`);
                                setIsMonthPickerOpen(false);
                              }}
                            >
                              {month}
                            </Button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Recipient Address (To:)</span>
                <span className="text-[9px] lowercase italic text-primary/70">Auto-fetched from client management</span>
              </label>
              <div className="mt-1 w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm min-h-[96px] text-foreground leading-relaxed whitespace-pre-wrap">
                {clientAddress || (
                  <span className="text-muted-foreground italic">
                    Select a client to fetch address...
                  </span>
                )}
                {selectedClientName && !clientAddress && (
                  <div className="mt-2 text-[10px] text-destructive">
                    No address found for this client.
                    <button
                      onClick={() => router.push("/clients")}
                      className="ml-1 text-primary underline hover:text-primary/80"
                    >
                      Add one in Client Management
                    </button>
                  </div>
                )}
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
                      <div className="relative">
                        <Popover open={openRole === item.id} onOpenChange={(open) => setOpenRole(open ? item.id : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openRole === item.id}
                              className="w-full justify-between h-9 px-2 rounded-lg border-border font-normal bg-card text-xs"
                              disabled={rolesLoading}
                            >
                              <span className="truncate">
                                {item.roleName || "Select Role..."}
                              </span>
                              <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[180px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search role..." className="h-8 text-xs" />
                              <CommandEmpty className="text-[10px] py-2">No role found.</CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {jobRoles?.map((role) => (
                                    <CommandItem
                                      key={role._id}
                                      value={role.title}
                                      className="text-xs"
                                      onSelect={(currentValue) => {
                                        // Find exact case role title
                                        const r = jobRoles.find(jr => jr.title.toLowerCase() === currentValue.toLowerCase());
                                        handleRoleSelect(item.id, r ? r.title : currentValue);
                                        setOpenRole(null);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
                                          item.roleName === role.title ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {role.title}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">Posts</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full rounded-lg border border-border px-2 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={item.posts}
                        onChange={(e) => handleUpdateRow(item.id, "posts", parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                        onFocus={(e) => e.target.select()}
                        onBlur={(e) => {
                          if (item.posts === 0) handleUpdateRow(item.id, "posts", 0);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">Days</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full rounded-lg border border-border px-2 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={item.days}
                        onChange={(e) => handleUpdateRow(item.id, "days", parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                        onFocus={(e) => e.target.select()}
                        onBlur={(e) => {
                          if (item.days === 0) handleUpdateRow(item.id, "days", 0);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">Rate (₹)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full rounded-lg border border-border px-2 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={item.rate}
                        onChange={(e) => handleUpdateRow(item.id, "rate", parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                        onFocus={(e) => e.target.select()}
                        onBlur={(e) => {
                          if (item.rate === 0) handleUpdateRow(item.id, "rate", 0);
                        }}
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

        {/* Right: Preview (Responsive Web Style) */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm sticky top-6 self-start">
          <div className="bg-primary p-6 text-primary-foreground">
            <p className="text-xs uppercase tracking-widest text-primary-foreground/70 font-semibold mb-1">Invoice Preview</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="font-bold text-lg">Akhila Enterprises</p>
                <p className="text-xs text-primary-foreground/70 tracking-tight">Manpower Recruitment Agency</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-primary-foreground/70 font-semibold mb-0.5">Draft Invoice</p>
                <p className="text-xl font-bold">INV-PREVIEW</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-between text-sm">
              <div className="max-w-[60%]">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Billed To</p>
                <p className="font-bold text-foreground text-base truncate">{selectedClientName || "Select a client..."}</p>
                <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line line-clamp-3">
                  {clientAddress || "Address will populate here..."}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Service Period</p>
                <p className="text-sm font-medium text-foreground">{billingMonth || "Select Month"}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-left">Particulars</th>
                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Amt (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-foreground">Providing Of {item.roleName || "Unspecified"}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {item.posts} Posts • {item.days} Days • @ {formatCurrency(item.rate)}
                        </p>
                      </td>
                      <td className="py-3 font-bold text-foreground text-right align-top">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-muted-foreground text-sm italic">
                        No service items added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 text-sm pt-4 border-t border-border mt-4">
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Basic Wage Sub-Total</span>
                <span className="font-medium text-foreground">{formatCurrency(subTotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>PF Contribution ({displayRates.pf}%)</span>
                <span>{formatCurrency(pf)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs border-b border-border/50 pb-2">
                <span>ESI Contribution ({displayRates.esi}%)</span>
                <span>{formatCurrency(esi)}</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-2">
                <span className="text-muted-foreground font-medium uppercase tracking-wider">Total (Basic + PF + ESI)</span>
                <span className="font-semibold text-foreground">{formatCurrency(totalBeforeService)}</span>
              </div>
              
              <div className="flex justify-between text-muted-foreground text-xs border-b border-border/50 pb-2">
                <span>Service Charge ({displayRates.service}%)</span>
                <span>{formatCurrency(service)}</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span 
                  className="text-primary font-bold uppercase tracking-wider cursor-pointer select-none"
                  onDoubleClick={() => {
                    setIsGST(!isGST);
                  }}
                >
                  Total {isGST && "(Taxable Value)"}
                </span>
                <span className="font-bold text-primary">{formatCurrency(taxableValue)}</span>
              </div>
              {isGST && (
                <>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>CGST ({displayRates.cgst}%)</span>
                    <span>{formatCurrency(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>SGST ({displayRates.sgst}%)</span>
                    <span>{formatCurrency(sgst)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-muted-foreground text-xs italic">
                <span>Round Off</span>
                <span>{roundOff > 0 ? "+" : ""}{roundOff.toFixed(2)}</span>
              </div>

              <div className="flex justify-between pt-3 border-t-2 border-border mt-3 items-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Grand Total Amount</span>
                <span className="text-2xl font-black text-primary">{formatCurrency(grand)}</span>
              </div>

              <div className="pt-2">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1 italic">Total in Words</p>
                <p className="text-[11px] font-bold text-foreground italic leading-tight">{numberToIndianWords(grand)}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/20 border-t border-border flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-xs font-semibold hover:bg-muted transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Discard Draft
            </button>
            <button
              onClick={handleSaveInvoice}
              disabled={saveInvoiceMutation.isPending}
              className="flex-[2] flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saveInvoiceMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save & Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Hidden high-fidelity render container for PDF generation */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        <InvoicePreview
          ref={invoiceRef}
          company={companyDetails}
          invoiceNumber={saveInvoiceMutation.isSuccess ? (saveInvoiceMutation.data as any).invoiceNumber : "031U"}
          clientAddress={clientAddress}
          billingMonth={billingMonth}
          lineItems={lineItems.map(item => ({
            roleName: item.roleName,
            posts: item.posts,
            days: item.days,
            rate: item.rate,
            amount: item.amount
          }))}
          subTotal={subTotal}
          pf={pf}
          esi={esi}
          totalBeforeService={totalBeforeService}
          service={service}
          cgst={cgst}
          sgst={sgst}
          grand={grand}
          roundOff={roundOff}
          pfRate={displayRates.pf}
          esiRate={displayRates.esi}
          serviceRate={displayRates.service}
          cgstRate={displayRates.cgst}
          sgstRate={displayRates.sgst}
          isGST={isGST}
        />
      </div>
    </div>
  );
}
