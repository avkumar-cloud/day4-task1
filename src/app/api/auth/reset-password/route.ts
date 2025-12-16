export const runtime = "nodejs";
import * as crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req: NextRequest) {
  try {
    await connectDB();// db conenct 

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/resetPassword/${token}`;

    await sendEmail(
      email,
      `Click the link to reset your password:\n\n${resetLink}\n\nThis link expires in 15 minutes.`
    );

    return NextResponse.json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
