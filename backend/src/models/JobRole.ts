import mongoose, { Schema, type Types } from "mongoose";
import type { Document } from "mongoose";

export interface IJobRole extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  createdAt: Date;
}

const JobRoleSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IJobRole>("JobRole", JobRoleSchema);
