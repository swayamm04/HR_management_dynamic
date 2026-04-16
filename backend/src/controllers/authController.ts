import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee.js';

const ADMIN_EMAIL = 'admin@hrmanagement.com';
const ADMIN_PASSWORD = '123456';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 1. Check for Admin
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = jwt.sign(
                { email: ADMIN_EMAIL, role: 'Administrator' },
                process.env.JWT_SECRET as string,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    email: ADMIN_EMAIL,
                    name: 'Admin User',
                    role: 'Administrator'
                }
            });
        }

        // 2. Check for Employee
        const employee = await Employee.findOne({ email });
        if (!employee || !employee.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Plain text comparison
        const isMatch = employee.password === password;
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token for employee
        const token = jwt.sign(
            { email: employee.email, role: employee.role, id: employee._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                email: employee.email,
                name: employee.name,
                role: employee.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
