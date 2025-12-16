// app/api/auth/send-otp/route.ts
export const runtime = "nodejs";
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, role , password} = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email or Password is required" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({ email });

    if (role) {
      if (user) {
        return NextResponse.json(
          { error: "User already exists. Please login." },
          { status: 400 }
        );
      }
      
      user = await User.create({
        email,
        role,
        password: hashedPassword
      });
    }

    if (!role && !user) {
      return NextResponse.json(
        { error: "User not found. Please sign up." },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user!.otp = otp;
    user!.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user!.save();

    await sendEmail(email, `Your OTP is ${otp}`);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
