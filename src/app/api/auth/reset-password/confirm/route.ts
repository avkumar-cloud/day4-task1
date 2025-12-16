export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();// db connect 
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token is invalid or expired" },
        { status: 400 }
      );
    }

    user.password = password; // auto-hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("CONFIRM RESET ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
