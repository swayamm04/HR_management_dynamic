import type { Request, Response } from 'express';
import Invoice from '../models/Invoice.js';

// Get all invoices (Reverse Chronological Order)
export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { isGST } = req.query;
    const filter: any = {};
    
    if (isGST !== undefined) {
      filter.isGST = isGST === 'true';
    }
    
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new invoice
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceData = req.body;
    
    // Simple invoice number generation: INV-YYYY-MM-MS
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${dateStr}-${(count + 1).toString().padStart(3, '0')}`;
    
    const newInvoice = new Invoice({
      ...invoiceData,
      invoiceNumber
    });
    
    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
