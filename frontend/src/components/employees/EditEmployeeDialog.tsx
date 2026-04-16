"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, Briefcase } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  contact: z.string().min(10, "Contact must be at least 10 digits"),
  status: z.enum(["Active", "Inactive"]),
});

type FormValues = z.infer<typeof formSchema>;

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  contact: string;
  status: "Active" | "Inactive";
}

interface EditEmployeeDialogProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function fetchJobRoles(): Promise<{ title: string }[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/api/job-roles`);
  if (!response.ok) throw new Error("Failed to fetch job roles");
  return response.json();
}

export default function EditEmployeeDialog({ employee, open, onOpenChange }: EditEmployeeDialogProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: jobRoles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["job-roles"],
    queryFn: fetchJobRoles,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email,
      password: employee.password || "",
      role: employee.role,
      contact: employee.contact,
      status: employee.status,
    },
  });

  // Reset form when employee changes
  React.useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        email: employee.email,
        password: employee.password || "",
        role: employee.role,
        contact: employee.contact,
        status: employee.status,
      });
    }
  }, [employee, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      // We don't send the password back because it's read-only here
      const { password, ...updateData } = values;
      const response = await fetch(`${apiUrl}/api/employees/${employee.employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update employee");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee updated successfully");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  // Ensure the current role is an option even if not in the official list
  const roleOptions = React.useMemo(() => {
    if (!jobRoles) return [];
    const titles = jobRoles.map(r => r.title);
    if (employee.role && !titles.includes(employee.role)) {
      return [{ title: employee.role }, ...jobRoles];
    }
    return jobRoles;
  }, [jobRoles, employee.role]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Employee Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ID</FormLabel>
                  <FormControl>
                    <Input placeholder="john@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stored Password (View Only)</FormLabel>
                  <div className="relative group">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        {...field} 
                        readOnly 
                        className="bg-slate-50 cursor-default pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 border-slate-200"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Position</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoadingRoles}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                    >
                      {roleOptions.map((role) => (
                        <option key={role.title} value={role.title}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        {...field} 
                        value="Active" 
                        checked={field.value === "Active"}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        {...field} 
                        value="Inactive" 
                        checked={field.value === "Inactive"}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm">Inactive</span>
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
