
import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  role: "admin" | "provider" | "customer";
  otp?: string;
  otpExpires?: Date;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "provider", "customer"], required: true },
  otp: String,
  otpExpires: Date,
  refreshToken: String,
});

export default mongoose.models.User || model<IUser>("User", userSchema);
