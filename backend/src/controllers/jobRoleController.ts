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
        const { title, description, salaryPerDay } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const existingRole = await JobRole.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
        if (existingRole) {
            return res.status(400).json({ message: 'Job role already exists' });
        }

        const newRole = new JobRole({
            title,
            description,
            salaryPerDay: Number(salaryPerDay) || 0
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

export const updateJobRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, salaryPerDay } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const role = await JobRole.findById(id);
        if (!role) {
            return res.status(404).json({ message: 'Job role not found' });
        }

        // Check if new title already exists (excluding self)
        const existingRole = await JobRole.findOne({ 
            _id: { $ne: id },
            title: { $regex: new RegExp(`^${title}$`, 'i') } 
        });
        if (existingRole) {
            return res.status(400).json({ message: 'Job role with this title already exists' });
        }

        role.title = title;
        role.description = description;
        role.salaryPerDay = Number(salaryPerDay) || 0;

        await role.save();

        res.status(200).json({
            message: 'Job role updated successfully',
            role
        });
    } catch (error) {
        console.error('Update job role error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
