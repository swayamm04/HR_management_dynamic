"use client";

import React, { useState, useEffect } from "react";
import { User, Building2, Shield, CreditCard, Edit3, Save, Loader2, Mail, Phone, MapPin, Globe, Landmark } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type Tab = "profile" | "company" | "billing_rates";

interface CompanyDetails {
  name: string;
  gstin: string;
  pan: string;
  pfCode: string;
  esicCode: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  bankRecipientId: string;
  pfRate: number;
  esiRate: number;
  serviceRate: number;
  cgstRate: number;
  sgstRate: number;
}

async function fetchCompanyDetails(): Promise<CompanyDetails> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/api/company`);
  if (!response.ok) throw new Error("Failed to fetch company details");
  return response.json();
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Admin User",
    newPassword: "",
    confirmPassword: ""
  });

  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const queryClient = useQueryClient();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompanyDetails,
  });

  const [formData, setFormData] = useState<CompanyDetails>({
    name: "", gstin: "", pan: "", pfCode: "", esicCode: "", email: "", phone: "", mobile: "", address: "", bankRecipientId: "",
    pfRate: 13, esiRate: 3.25, serviceRate: 3, cgstRate: 9, sgstRate: 9
  });

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  useEffect(() => {
    if (user?.name) {
      setProfileData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (data: CompanyDetails) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/company`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update company details");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
      toast.success("Settings updated successfully");
      setIsEditingCompany(false);
      setIsEditingRates(false);
    },
    onError: (err: any) => {
      toast.error("Error", { description: err.message });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCompany = () => {
    updateMutation.mutate(formData);
  };

  const renderProfile = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Account Profile</h2>
          <p className="text-sm text-muted-foreground">Update your personal information and password</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditingProfile ? (
            <>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  toast.success("Profile updated successfully");
                  setIsEditingProfile(false);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
            >
              <Edit3 className="h-4 w-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
          <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
            isEditingProfile ? "border-primary bg-card ring-2 ring-primary/10" : "border-border bg-muted/30"
          }`}>
            <User className={`h-4 w-4 ${isEditingProfile ? "text-primary" : "text-muted-foreground"}`} />
            {isEditingProfile ? (
              <input 
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            ) : (
              <span className="text-sm font-medium text-foreground">{profileData.name}</span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">Account Role</label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 opacity-70 cursor-not-allowed">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{user?.role || "Administrator"}</span>
          </div>
        </div>
      </div>

      {isEditingProfile && (
        <div className="pt-6 border-t border-border space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-base font-bold text-foreground">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">New Password</label>
              <input 
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={profileData.newPassword}
                onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">Confirm Password</label>
              <input 
                type="password"
                className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={profileData.confirmPassword}
                onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompany = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Company Configuration</h2>
          <p className="text-sm text-muted-foreground">Business details and payment information</p>
        </div>
        <button 
          onClick={() => isEditingCompany ? handleSaveCompany() : setIsEditingCompany(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEditingCompany ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit3 className="h-4 w-4" />
          )}
          {isEditingCompany ? "Save Details" : "Edit Details"}
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Building2 className="h-5 w-5" />
          <h3 className="font-bold text-lg text-foreground">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Company Name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditingCompany} />
          <InputField label="GSTIN" name="gstin" value={formData.gstin} onChange={handleInputChange} disabled={!isEditingCompany} />
          <InputField label="PAN" name="pan" value={formData.pan} onChange={handleInputChange} disabled={!isEditingCompany} />
          <InputField label="PF Code" name="pfCode" value={formData.pfCode} onChange={handleInputChange} disabled={!isEditingCompany} />
          <InputField label="ESIC Code" name="esicCode" value={formData.esicCode} onChange={handleInputChange} disabled={!isEditingCompany} />
          <InputField label="Bank Recipient ID" name="bankRecipientId" value={formData.bankRecipientId} onChange={handleInputChange} disabled={!isEditingCompany} />
          <InputField label="Business Email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditingCompany} />
          <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditingCompany} />
          <InputField 
            label="Mobile Number" 
            name="mobile" 
            value={formData.mobile} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormData(prev => ({ ...prev, mobile: val }));
            }} 
            disabled={!isEditingCompany} 
            placeholder="10-digit mobile number" 
          />
          <div className="col-span-1 md:col-span-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block ml-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditingCompany}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 resize-none min-h-[80px]"
            />
          </div>
        </div>
      </section>
    </div>
  );

  const renderBillingRates = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Billing Rates Configuration</h2>
          <p className="text-sm text-muted-foreground">Adjust statutory contribution and tax percentages</p>
        </div>
        <button 
          onClick={() => isEditingRates ? handleSaveCompany() : setIsEditingRates(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEditingRates ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit3 className="h-4 w-4" />
          )}
          {isEditingRates ? "Save Rates" : "Edit Rates"}
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Landmark className="h-5 w-5" />
          <h3 className="font-bold text-lg text-foreground">Statutory Rates (%)</h3>
        </div>
        <p className="text-[11px] text-muted-foreground italic mb-2">These percentages are used to calculate PF and ESI contributions on the basic sub-total.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField 
            label="PF Contribution (%)" 
            name="pfRate" 
            value={formData.pfRate} 
            onChange={handleInputChange} 
            disabled={!isEditingRates} 
            type="number"
          />
          <InputField 
            label="ESI Contribution (%)" 
            name="esiRate" 
            value={formData.esiRate} 
            onChange={handleInputChange} 
            disabled={!isEditingRates} 
            type="number"
          />
        </div>
      </section>

      <section className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-primary">
          <CreditCard className="h-5 w-5" />
          <h3 className="font-bold text-lg text-foreground">Service & Tax Rates (%)</h3>
        </div>
        <p className="text-[11px] text-muted-foreground italic mb-2">These rates apply to the total taxable value of the invoice.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField 
            label="Service Charge (%)" 
            name="serviceRate" 
            value={formData.serviceRate} 
            onChange={handleInputChange} 
            disabled={!isEditingRates} 
            type="number"
          />
          <InputField 
            label="CGST (%)" 
            name="cgstRate" 
            value={formData.cgstRate} 
            onChange={handleInputChange} 
            disabled={!isEditingRates} 
            type="number"
          />
          <InputField 
            label="SGST (%)" 
            name="sgstRate" 
            value={formData.sgstRate} 
            onChange={handleInputChange} 
            disabled={!isEditingRates} 
            type="number"
          />
        </div>
      </section>

      {!isEditingRates && (
        <div className="rounded-xl bg-muted/30 p-4 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Note:</span> Changing these rates will update the calculations for all <span className="font-semibold italic">new</span> invoices instantly. Saved records will remain unaffected.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your personal profile and business configurations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              activeTab === "profile" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <User className="h-4.5 w-4.5" />
            Account Profile
          </button>
          <button 
            onClick={() => setActiveTab("company")}
            className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              activeTab === "company" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Building2 className="h-4.5 w-4.5" />
            Company Details
          </button>
          <button 
            onClick={() => setActiveTab("billing_rates")}
            className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              activeTab === "billing_rates" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Landmark className="h-4.5 w-4.5" />
            Billing Rates
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1 rounded-2xl border border-border bg-card p-6 min-h-[500px] shadow-sm">
          {isLoading ? (
            <div className="flex h-full items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeTab === "profile" ? (
            renderProfile()
          ) : activeTab === "company" ? (
            renderCompany()
          ) : (
            renderBillingRates()
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, disabled, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        onWheel={(e) => type === "number" && (e.target as HTMLInputElement).blur()}
        disabled={disabled}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 transition-all border-slate-200/50"
      />
    </div>
  );
}
