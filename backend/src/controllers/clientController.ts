import type { Request, Response } from 'express';
import Client from '../models/Client.js';

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public (for now)
export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error fetching clients' });
  }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Public (for now)
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status, contactPerson, email, activeEmployees, totalBilled } = req.body;

    // Optional validation
    if (!name || !contactPerson) {
      res.status(400).json({ message: 'Name and contact person are required' });
      return;
    }

    const clientExists = await Client.findOne({ name });
    if (clientExists) {
      res.status(400).json({ message: 'Client already exists' });
      return;
    }

    const client = await Client.create({
      name,
      status: status || 'ACTIVE CONTRACT',
      contactPerson,
      email: email || '',
      activeEmployees: activeEmployees || 0,
      totalBilled: totalBilled || 0,
    });

    res.status(201).json(client);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error creating client' });
  }
};
