import type { Request, Response } from 'express';
import Employee from '../models/Employee.js';

// Helper to generate a unique employee ID (e.g., EMP-0001)
const generateEmployeeId = async (): Promise<string> => {
    try {
        const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });
        
        if (!lastEmployee || !lastEmployee.employeeId) return 'EMP-0001';

        const lastId = lastEmployee.employeeId;
        const parts = lastId.split('-');

        if (parts.length < 2 || isNaN(parseInt(parts[1] as string))) {
            // Fallback for messy data: count total and add 1
            const count = await Employee.countDocuments();
            return `EMP-${(count + 1).toString().padStart(4, '0')}`;
        }

        const lastNumber = parseInt(parts[1] as string);
        return `EMP-${(lastNumber + 1).toString().padStart(4, '0')}`;
    } catch (error) {
        console.error('ID generation failed, using count fallback:', error);
        const count = await Employee.countDocuments();
        return `EMP-${(count + 1).toString().padStart(4, '0')}`;
    }
};

// Migration helper to re-index all employees
export const migrateEmployeeIds = async (req?: Request, res?: Response) => {
    try {
        const employees = await Employee.find().sort({ createdAt: 1 });
        
        for (let i = 0; i < employees.length; i++) {
            const employee = employees[i];
            if (!employee) continue;

            const newId = `EMP-${(i + 1).toString().padStart(4, '0')}`;
            await Employee.findByIdAndUpdate(employee._id, { employeeId: newId });
        }

        if (res) {
            res.status(200).json({ message: `Successfully re-indexed ${employees.length} employees.` });
        } else {
            console.log(`Successfully re-indexed ${employees.length} employees.`);
        }
    } catch (error) {
        console.error('Migration failed:', error);
        if (res) res.status(500).json({ message: 'Migration failed' });
    }
};

export const getEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        console.error('Fetch employees error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, contact } = req.body;

        if (!name || !email || !role || !contact || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if email already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        const employeeId = await generateEmployeeId();

        const employee = new Employee({
            employeeId,
            name,
            email,
            password, // Store as plain text
            role,
            contact,
            status: 'Active'
        });

        await employee.save();

        res.status(201).json({
            message: 'Employee created successfully',
            employee
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role, contact, status, password } = req.body;

        const employee = await Employee.findOne({ employeeId: id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update fields
        if (name) employee.name = name;
        if (email) employee.email = email;
        if (role) employee.role = role;
        if (contact) employee.contact = contact;
        if (status) employee.status = status;

        // Update password directly (plain text)
        if (password !== undefined) {
            employee.password = password;
        }

        await employee.save();

        res.status(200).json({
            message: 'Employee updated successfully',
            employee
        });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await Employee.findOneAndDelete({ employeeId: id });

        if (!result) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
