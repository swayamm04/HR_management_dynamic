"use client";

import React, { useState } from "react";
import { Plus, Trash2, Briefcase, Loader2, Search, Pencil, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface JobRole {
  _id: string;
  title: string;
  description?: string;
  salaryPerDay: number;
  createdAt: string;
}

async function fetchJobRoles(): Promise<JobRole[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/api/job-roles`);
  if (!response.ok) throw new Error("Failed to fetch job roles");
  return response.json();
}

export default function JobRolesPage() {
  const [newRole, setNewRole] = useState({ title: "", description: "", salaryPerDay: "0" });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleToDelete, setRoleToDelete] = useState<JobRole | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<JobRole | null>(null);
  
  const queryClient = useQueryClient();

  // Queries
  const { data: roles, isLoading } = useQuery({
    queryKey: ["job-roles"],
    queryFn: fetchJobRoles,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (role: { title: string; description: string; salaryPerDay: string }) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/job-roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(role),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to create job role");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-roles"] });
      toast.success("Job role created successfully");
      setNewRole({ title: "", description: "", salaryPerDay: "" });
    },
    onError: (err: any) => {
      toast.error("Error", { description: err.message });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/job-roles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete job role");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-roles"] });
      toast.success("Job role deleted successfully");
      setIsConfirmOpen(false);
      setRoleToDelete(null);
    },
    onError: (err: any) => {
      toast.error("Error", { description: err.message });
      setIsConfirmOpen(false);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (role: { id: string; title: string; description: string; salaryPerDay: string }) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/job-roles/${role.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: role.title,
          description: role.description,
          salaryPerDay: role.salaryPerDay
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to update job role");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-roles"] });
      toast.success("Job role updated successfully");
      setRoleToEdit(null);
      setNewRole({ title: "", description: "", salaryPerDay: "0" });
    },
    onError: (err: any) => {
      toast.error("Error", { description: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.title.trim()) return;
    
    if (roleToEdit) {
      updateMutation.mutate({ id: roleToEdit._id, ...newRole });
    } else {
      createMutation.mutate(newRole);
    }
  };

  const filteredRoles = roles?.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Roles</h1>
          <p className="text-sm text-muted-foreground">Define and manage the positions available in your organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Role Form */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {roleToEdit ? "Update Job Role" : "Add New Role"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Developer"
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={newRole.title}
                  onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Description (Optional)</label>
                <textarea
                  placeholder="Briefly describe the responsibilities..."
                  className="w-full h-20 rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Salary Per Day (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 1500"
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={newRole.salaryPerDay}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setNewRole({ ...newRole, salaryPerDay: val });
                  }}
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => {
                    if (e.target.value === "") setNewRole({ ...newRole, salaryPerDay: "0" });
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={roleToEdit ? updateMutation.isPending : createMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {(roleToEdit ? updateMutation.isPending : createMutation.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : roleToEdit ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {roleToEdit ? "Save Changes" : "Create Role"}
              </button>

              {roleToEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setRoleToEdit(null);
                    setNewRole({ title: "", description: "", salaryPerDay: "0" });
                  }}
                  className="w-full rounded-lg border border-border py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Roles List */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-border bg-card overflow-hidden min-h-[400px]">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search roles..."
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
            ) : filteredRoles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Daily Salary</th>
                      <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoles.map((role) => (
                      <tr key={role._id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <Briefcase className="h-4 w-4" />
                            </div>
                            <p className="font-medium text-foreground">{role.title}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground max-w-xs truncate">
                          {role.description || <span className="italic text-muted-foreground/50">No description</span>}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-primary">₹{(role.salaryPerDay || 0).toLocaleString()}</p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { 
                                setRoleToEdit(role); 
                                setNewRole({ 
                                  title: role.title, 
                                  description: role.description || "", 
                                  salaryPerDay: role.salaryPerDay.toString() 
                                });
                                // Scroll to top of the form on mobile or small screens
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                              title="Edit Role"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => { setRoleToDelete(role); setIsConfirmOpen(true); }}
                              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Delete Role"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-foreground font-medium">No job roles found</h3>
                <p className="text-sm text-muted-foreground mt-1">Start by adding your first organizational position.</p>
              </div>
            )}
          </div>
        </div>
      </div>


      {roleToDelete && (
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete Job Role"
          description={`Are you sure you want to delete the "${roleToDelete.title}" role? This action cannot be undone.`}
          confirmText="Delete Role"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={() => deleteMutation.mutate(roleToDelete._id)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
