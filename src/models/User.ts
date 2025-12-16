
import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt"
export interface IUser extends Document {
  email: string;
  role: "admin" | "provider" | "customer";
  otp?: string;
  otpExpires?: Date;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires: Date;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "provider", "customer"], required: true },
  otp: String,
  otpExpires: Date,
  refreshToken: String,
  password: {type: String},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.models.User || model<IUser>("User", userSchema);
