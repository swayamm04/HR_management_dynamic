import mongoose, { Schema, type Types } from "mongoose";
import type { Document } from "mongoose";

export interface IJobRole extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  salaryPerDay: number;
  createdAt: Date;
}

const JobRoleSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  salaryPerDay: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IJobRole>("JobRole", JobRoleSchema);
