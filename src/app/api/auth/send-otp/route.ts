// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, role } = await req.json();

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, role });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendEmail(email, `Your OTP is ${otp}`);

  return NextResponse.json({ message: "OTP sent" });
}
