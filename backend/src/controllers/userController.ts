import type { Request, Response } from 'express';
import User from '../models/User.js';

// Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: role || 'Staff'
        });

        const savedUser = await newUser.save();
        
        // Remove password from response
        const userResponse = savedUser.toObject();
        delete (userResponse as any).password;

        res.status(201).json(userResponse);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting yourself
        if ((req as any).user?.id === id) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
