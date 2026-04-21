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
    const { name, status, contactPerson, email, address, activeEmployees, totalBilled } = req.body;

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
      address: address || '',
      activeEmployees: activeEmployees || 0,
      totalBilled: totalBilled || 0,
    });

    res.status(201).json(client);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error creating client' });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Public (for now)
export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status, contactPerson, email, address, activeEmployees, totalBilled } = req.body;

    const client = await Client.findById(req.params.id);

    if (client) {
      client.name = name || client.name;
      client.status = status || client.status;
      client.contactPerson = contactPerson || client.contactPerson;
      client.email = email || client.email;
      client.address = address !== undefined ? address : client.address;
      client.activeEmployees = activeEmployees !== undefined ? activeEmployees : client.activeEmployees;
      client.totalBilled = totalBilled !== undefined ? totalBilled : client.totalBilled;

      const updatedClient = await client.save();
      res.json(updatedClient);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error updating client' });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Public (for now)
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findById(req.params.id);

    if (client) {
      await client.deleteOne();
      res.json({ message: 'Client removed' });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error deleting client' });
  }
};
