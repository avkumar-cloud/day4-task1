// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp, password } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if(!user) return NextResponse.json(
      {message:"Invalid User"},
      {status: 400}
    );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    user.refreshToken = refreshToken;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const safeUser = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

    const response = NextResponse.json({
      accessToken,
      user: safeUser,
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
