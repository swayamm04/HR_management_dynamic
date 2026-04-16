import type { Request, Response } from 'express';
import JobRole from '../models/JobRole.js';

export const getJobRoles = async (req: Request, res: Response) => {
    try {
        const roles = await JobRole.find().sort({ title: 1 });
        res.status(200).json(roles);
    } catch (error) {
        console.error('Fetch job roles error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createJobRole = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const existingRole = await JobRole.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
        if (existingRole) {
            return res.status(400).json({ message: 'Job role already exists' });
        }

        const newRole = new JobRole({
            title,
            description
        });

        await newRole.save();

        res.status(201).json({
            message: 'Job role created successfully',
            role: newRole
        });
    } catch (error) {
        console.error('Create job role error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteJobRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await JobRole.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Job role not found' });
        }

        res.status(200).json({ message: 'Job role deleted successfully' });
    } catch (error) {
        console.error('Delete job role error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
