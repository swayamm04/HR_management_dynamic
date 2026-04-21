import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Assuming standard UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Using what I saw in job-roles

interface OnboardClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  initialData?: any;
}

export function OnboardClientDialog({ open, onOpenChange, onSubmit, isLoading, initialData }: OnboardClientDialogProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    contactPerson: initialData?.contactPerson || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    status: initialData?.status || "ACTIVE CONTRACT",
    activeEmployees: initialData?.activeEmployees || 0,
    totalBilled: initialData?.totalBilled || 0,
  });

  // Since we use useState with initial props, we need to sync when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        contactPerson: initialData.contactPerson || "",
        email: initialData.email || "",
        address: initialData.address || "",
        status: initialData.status || "ACTIVE CONTRACT",
        activeEmployees: initialData.activeEmployees || 0,
        totalBilled: initialData.totalBilled || 0,
      });
    } else {
      // Reset for new client
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        address: "",
        status: "ACTIVE CONTRACT",
        activeEmployees: 0,
        totalBilled: 0,
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contactPerson.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        address: "",
        status: "ACTIVE CONTRACT",
        activeEmployees: 0,
        totalBilled: 0,
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent usually, but we can catch here if needed
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Client Details" : "Onboard New Client"}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Update the organization's profile information and billing address." 
              : "Enter the details for the new organization to add them to your roster."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="e.g. Acme Corp"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                placeholder="Manager Name"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@acme.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Organization Address</Label>
              <Input
                id="address"
                placeholder="e.g. 1st Floor, Main St, Bangalore"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="status">Contract Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE CONTRACT">Active Contract</SelectItem>
                  <SelectItem value="REVIEW PENDING">Review Pending</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activeEmployees">Active Employees</Label>
              <Input
                id="activeEmployees"
                type="number"
                min="0"
                value={formData.activeEmployees}
                onChange={(e) => setFormData({ ...formData, activeEmployees: parseInt(e.target.value) || 0 })}
                onFocus={(e) => e.target.select()}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBilled">Total Billed (₹)</Label>
              <Input
                id="totalBilled"
                type="number"
                min="0"
                value={formData.totalBilled}
                onChange={(e) => setFormData({ ...formData, totalBilled: parseInt(e.target.value) || 0 })}
                onFocus={(e) => e.target.select()}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {initialData ? "Save Changes" : "Save Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
