"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, Loader2, Calendar, User, IndianRupee, Search, MoreVertical, Eye, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { InvoicePreview } from "@/components/billing/InvoicePreview";

async function fetchInvoices() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/api/invoices`);
  if (!response.ok) throw new Error("Failed to fetch invoices");
  return response.json();
}

export default function InvoiceHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
  });

  const filteredInvoices = invoices?.filter((inv: any) => 
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadPDF = async (inv: any) => {
    setDownloadingId(inv._id);
    // Allow a small delay for the hidden preview to render with the correct data
    setTimeout(async () => {
      if (!previewRef.current) {
        setDownloadingId(null);
        return;
      }
      
      try {
        const element = previewRef.current;
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
        pdf.save(`${inv.invoiceNumber}.pdf`);
      } catch (error) {
        console.error("PDF Generation Error:", error);
      } finally {
        setDownloadingId(null);
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span> <span>›</span> <span className="text-foreground font-medium">Invoice History</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices List</h1>
          <p className="text-sm text-muted-foreground">Manage and track all generated billing records.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by invoice number or client..."
              className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-destructive">
            Failed to load invoices.
          </div>
        ) : filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Invoice Details</th>
                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Client & Month</th>
                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Grand Total</th>
                  <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Generated On</th>
                  <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredInvoices.map((inv: any) => (
                  <tr key={inv._id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{inv.invoiceNumber}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">{inv.lineItems?.length} Line Items</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{inv.clientName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Calendar className="h-3 w-3" />
                          <span>{inv.billingMonth}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-1 font-bold text-primary text-base">
                        <span>{formatCurrency(inv.grandTotal)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-right">
                      <p className="text-xs font-semibold text-foreground">
                        {format(new Date(inv.createdAt), "MMM d, yyyy")}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {format(new Date(inv.createdAt), "hh:mm a")}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50" 
                          title="Download PDF"
                          onClick={() => handleDownloadPDF(inv)}
                          disabled={downloadingId === inv._id}
                        >
                          {downloadingId === inv._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No invoices generated yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Go to the creation page to generate your first professional billing record.
            </p>
          </div>
        )}
      </div>

      {/* Hidden container for PDF rendering */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        {(() => {
          if (!downloadingId || !invoices) return null;
          const inv = invoices.find((i: any) => i._id === downloadingId);
          if (!inv) return null;
          
          return (
            <InvoicePreview 
              ref={previewRef}
              invoiceNumber={inv.invoiceNumber}
              clientAddress={inv.clientAddress}
              billingMonth={inv.billingMonth}
              lineItems={inv.lineItems || []}
              subTotal={inv.subTotal}
              pf={inv.pf}
              esi={inv.esi}
              totalBeforeService={inv.taxableValue}
              service={inv.serviceCharge}
              grand={inv.grandTotal}
              date={format(new Date(inv.createdAt), "dd.MM.yyyy")}
            />
          );
        })()}
      </div>
    </div>
  );
}
