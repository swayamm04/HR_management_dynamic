import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoiceItem {
  roleName: string;
  posts: number;
  days: number;
  rate: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  clientName: string;
  clientAddress: string;
  billingMonth: string;
  lineItems: IInvoiceItem[];
  subTotal: number;
  pf: number;
  esi: number;
  serviceCharge: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  grandTotalInWords: string;
  createdAt: Date;
}

const invoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientAddress: {
      type: String,
      required: false,
    },
    billingMonth: {
      type: String,
      required: true,
    },
    lineItems: [
      {
        roleName: String,
        posts: Number,
        days: Number,
        rate: Number,
      },
    ],
    subTotal: { type: Number, required: true },
    pf: { type: Number, required: true },
    esi: { type: Number, required: true },
    serviceCharge: { type: Number, required: true },
    taxableValue: { type: Number, required: true },
    cgst: { type: Number, required: true },
    sgst: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    grandTotalInWords: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice;
