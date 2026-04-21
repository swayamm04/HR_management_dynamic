import type { Request, Response } from 'express';
import Company from '../models/Company.js';

// @desc    Get company details
// @route   GET /api/company
// @access  Public (for now)
export const getCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    let company = await Company.findOne();
    
    // If no company exists, create a default one
    if (!company) {
      company = await Company.create({
        name: 'Vasantha Metal Industries',
        gstin: '29FIRPS9029F2ZC',
        pan: 'ABIFA9390C',
        pfCode: 'KN/SHG/40327',
        esicCode: '58000014810001001',
        email: 'vasanthametalindustries@gmail.com',
        phone: '9448146514',
        mobile: '9448146514',
        address: 'Plot no : 97 "KIADB" Industrial area, Devakathikoppa Gejjenahalli Road, Shivamogga-577204',
        bankRecipientId: '3000137776',
        pfRate: 13,
        esiRate: 3.25,
        serviceRate: 3,
        cgstRate: 9,
        sgstRate: 9,
      });
    }
    
    res.json(company);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error fetching company details' });
  }
};

// @desc    Update company details
// @route   PUT /api/company
// @access  Public (for now)
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    let company = await Company.findOne();

    if (company) {
      // Update all fields from body
      Object.assign(company, req.body);
      const updatedCompany = await company.save();
      res.json(updatedCompany);
    } else {
      // If somehow it doesn't exist, create it
      const newCompany = await Company.create(req.body);
      res.json(newCompany);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error updating company details' });
  }
};
