// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, otp } = await req.json();

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpires! < new Date()) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  user.refreshToken = refreshToken;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const res = NextResponse.json({
    accessToken,
    role: user.role,
  });

  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
}
