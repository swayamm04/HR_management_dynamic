import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  name: string;
  status: 'ACTIVE CONTRACT' | 'REVIEW PENDING' | 'INACTIVE';
  contactPerson: string;
  email: string;
  address: string;
  activeEmployees: number;
  totalBilled: number;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE CONTRACT', 'REVIEW PENDING', 'INACTIVE'],
      default: 'ACTIVE CONTRACT',
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    activeEmployees: {
      type: Number,
      default: 0,
    },
    totalBilled: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model<IClient>('Client', clientSchema);

export default Client;
