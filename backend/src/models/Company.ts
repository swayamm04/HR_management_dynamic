import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  gstin: { type: String },
  pan: { type: String },
  pfCode: { type: String },
  esicCode: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  bankRecipientId: { type: String },
  
  // Calculation Rates (Percentages)
  pfRate: { type: Number, default: 13 },
  esiRate: { type: Number, default: 3.25 },
  serviceRate: { type: Number, default: 3 },
  cgstRate: { type: Number, default: 9 },
  sgstRate: { type: Number, default: 9 },
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

export default Company;
