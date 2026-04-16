import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  contact: string;
  status: "Active" | "Inactive";
  createdAt: Date;
}

const EmployeeSchema: Schema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for now, usually hashed if used for login
  role: { type: String, required: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
