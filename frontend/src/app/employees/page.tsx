"use client";

import React, { useState } from "react";
import { Download, Printer, Pencil, Trash2, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AddEmployeeDialog from "@/components/employees/AddEmployeeDialog";
import EditEmployeeDialog from "@/components/employees/EditEmployeeDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  contact: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

async function fetchEmployees(): Promise<Employee[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/api/employees`);
  if (!response.ok) throw new Error("Failed to fetch employees");
  return response.json();
}

export default function EmployeeManagement() {
  const [statusFilter, setStatusFilter] = useState("All Employees");
  const [roleFilter, setRoleFilter] = useState("All Positions");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const queryClient = useQueryClient();

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete employee");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted successfully");
      setIsConfirmOpen(false);
      setEmployeeToDelete(null);
    },
    onError: (err: any) => {
      toast.error("Error", { description: err.message });
      setIsConfirmOpen(false);
    },
  });

  const handleDelete = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setIsConfirmOpen(true);
  };

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  // Extract unique roles dynamically
  const uniqueRoles = React.useMemo(() => {
    if (!employees) return [];
    const roles = employees.map(emp => emp.role);
    return Array.from(new Set(roles)).sort();
  }, [employees]);

  // Apply filters
  const filteredEmployees = React.useMemo(() => {
    if (!employees) return [];
    return employees.filter(emp => {
      const statusMatch =
        statusFilter === "All Employees" || emp.status === statusFilter;
      const roleMatch =
        roleFilter === "All Positions" || emp.role === roleFilter;
      return statusMatch && roleMatch;
    });
  }, [employees, statusFilter, roleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employee Management</h1>
          <p className="text-sm text-muted-foreground">Oversee your workforce, track roles, and manage active personnel.</p>
        </div>
        <AddEmployeeDialog />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {["All Employees", "Active", "Inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${statusFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="All Positions">Role: All Positions</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted transition-colors"><Download className="h-4 w-4" /></button>
          <button className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted transition-colors"><Printer className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Table - No Pagination */}
      <div className="rounded-xl border border-border bg-card overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-destructive">
            <p>Error loading employees. Please check your connection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["ID", "NAME", "ROLE", "CONTACT", "STATUS", "ACTIONS"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.employeeId} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{emp.employeeId}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">
                          Joined {new Date(emp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs uppercase">
                            {emp.name?.split(" ").map((n: string) => n[0]).join("") || "E"}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{emp.role}</td>
                      <td className="px-5 py-4 text-muted-foreground">{emp.contact}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${emp.status === "Active" ? "text-success" : "text-warning"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${emp.status === "Active" ? "bg-success" : "bg-warning"}`} />
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setSelectedEmployee(emp); setIsEditDialogOpen(true); }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(emp)}
                            className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-20 text-center text-muted-foreground italic">
                      No employees match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-primary p-5 text-primary-foreground shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/70">Total Headcount</p>
          <p className="mt-1 text-3xl font-bold">{employees?.length || 0}</p>
          <p className="mt-2 text-xs text-primary-foreground/80 font-medium">↗ Real-time active count</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Average Retention</p>
          <p className="mt-1 text-3xl font-bold text-foreground">94.2%</p>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-[94%] rounded-full bg-primary" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Industry standard: 82%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Open Requisitions</p>
          <p className="mt-1 text-3xl font-bold text-foreground">24</p>
          <p className="mt-2 text-xs text-muted-foreground font-medium text-warning">4 Urgent vacancies</p>
        </div>
      </div>
      {selectedEmployee && (
        <EditEmployeeDialog 
          employee={selectedEmployee} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
        />
      )}
      
      {employeeToDelete && (
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete Employee"
          description={`Are you sure you want to delete ${employeeToDelete.name}? This action cannot be undone and will remove all associated data.`}
          confirmText="Delete Employee"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={() => deleteMutation.mutate(employeeToDelete.employeeId)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
