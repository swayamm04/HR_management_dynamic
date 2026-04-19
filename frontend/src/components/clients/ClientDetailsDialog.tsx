import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Building2, Users, IndianRupee, Mail, Calendar, BarChart3 } from "lucide-react";

interface Client {
  _id: string;
  name: string;
  status: string;
  contactPerson: string;
  email: string;
  activeEmployees: number;
  totalBilled: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ClientDetailsDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDetailsDialog({ client, open, onOpenChange }: ClientDetailsDialogProps) {
  if (!client) return null;

  const statusColor = client.status === "ACTIVE CONTRACT" 
    ? "text-success" 
    : client.status === "REVIEW PENDING" 
      ? "text-destructive" 
      : "text-muted-foreground";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl">{client.name}</DialogTitle>
              <p className={`text-xs font-semibold uppercase tracking-wider mt-1 ${statusColor}`}>
                ● {client.status}
              </p>
            </div>
          </div>
          <DialogDescription className="sr-only">Client details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6 bg-muted/30 p-4 rounded-xl border border-border">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Contact Person
              </p>
              <p className="font-medium text-foreground">{client.contactPerson}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email Address
              </p>
              <p className="font-medium text-foreground">
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${client.email}`} target="_blank" rel="noreferrer" className="hover:underline">
                  {client.email || "Not provided"}
                </a>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Active Employees</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{client.activeEmployees}</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <IndianRupee className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Total Billed</span>
              </div>
              <p className="text-2xl font-bold text-primary">{formatCurrency(client.totalBilled)}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex justify-between space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Onboarded: <span className="font-medium text-foreground">{formatDate(client.createdAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
