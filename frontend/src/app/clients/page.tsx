"use client";

import React, { useState } from "react";
import { Building2, Users, IndianRupee, MoreVertical, Mail, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OnboardClientDialog } from "@/components/clients/OnboardClientDialog";
import { ClientDetailsDialog } from "@/components/clients/ClientDetailsDialog";

interface Client {
  _id: string;
  name: string;
  status: string;
  contactPerson: string;
  email: string;
  activeEmployees: number;
  totalBilled: number;
}

async function fetchClients(): Promise<Client[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/api/clients`);
  if (!response.ok) throw new Error("Failed to fetch clients");
  return response.json();
}

export default function ClientManagement() {
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  const createMutation = useMutation({
    mutationFn: async (clientData: any) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to create client");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client onboarded successfully");
    },
    onError: (err: any) => {
      toast.error("Error", { description: err.message });
    },
  });

  const handleOnboardSubmit = async (data: any) => {
    await createMutation.mutateAsync(data);
  };

  const calculateTotalBilled = () => {
    return clients?.reduce((sum, client) => sum + (client.totalBilled || 0), 0) || 0;
  };

  const calculateTotalEmployees = () => {
    return clients?.reduce((sum, client) => sum + (client.activeEmployees || 0), 0) || 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Ensure default format if no clients
  const totalBilledFormatted = clients?.length ? formatCurrency(calculateTotalBilled()) : "₹0";
  // The UI had a short format e.g., ₹1.2M. We can just use standard Intl for now, or make a custom shortener.
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client Management</h1>
          <p className="text-sm text-muted-foreground">Oversee your active partnerships, track staffing density across organizations, and monitor historical billing performance.</p>
        </div>
        <button 
          onClick={() => setIsOnboardOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
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
          <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : (clients?.length || 0)}</p>
          <p className="mt-1 text-xs text-success">Active Partnerships</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center"><IndianRupee className="h-5 w-5 text-success" /></div>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Billed</p>
          <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : totalBilledFormatted}</p>
          <p className="mt-1 text-xs text-muted-foreground">Overall</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active Manpower</p>
          <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : calculateTotalEmployees()} Employees</p>
          <p className="mt-1 text-xs text-muted-foreground">Currently deployed across all client sites.</p>
        </div>
      </div>

      {/* Client Cards */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : clients && clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => {
            const statusColor = client.status === "ACTIVE CONTRACT" 
              ? "text-success" 
              : client.status === "REVIEW PENDING" 
                ? "text-destructive" 
                : "text-muted-foreground";

            return (
              <div key={client._id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${statusColor}`}>● {client.status}</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground"><MoreVertical className="h-4 w-4" /></button>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" /> <span>Contact Person</span> <span className="ml-auto font-medium text-foreground truncate pl-2">{client.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" /> <span>Active Employees</span> <span className="ml-auto font-bold text-foreground">{client.activeEmployees}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4 shrink-0" /> <span>Total Billed</span> <span className="ml-auto font-bold text-primary">{formatCurrency(client.totalBilled)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setSelectedClient(client)} className="flex-1 rounded-full bg-foreground py-2 text-xs font-semibold text-card hover:opacity-90 transition-opacity">View Details</button>
                  <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${client.email}`} target="_blank" rel="noreferrer" title={client.email} className="rounded-full border border-border p-2 text-muted-foreground hover:bg-muted flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No clients found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't onboarded any clients yet.</p>
          <button 
            onClick={() => setIsOnboardOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Onboard Your First Client
          </button>
        </div>
      )}

      <OnboardClientDialog 
        open={isOnboardOpen} 
        onOpenChange={setIsOnboardOpen} 
        onSubmit={handleOnboardSubmit}
        isLoading={createMutation.isPending}
      />
      <ClientDetailsDialog
        client={selectedClient}
        open={!!selectedClient}
        onOpenChange={(open) => !open && setSelectedClient(null)}
      />
    </div>
  );
}
