// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {  generateAccessToken,  generateRefreshToken,} from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { ERROR_CODES } from "@/lib/errorCodes";
import { AppError } from "@/lib/AppError";
import { apiHandler } from "@/lib/apiHandler";

export const POST = apiHandler(async (req:NextRequest)=>{
  await connectDB();

    const { email, otp, password } = await req.json();

    if (!email || !otp) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,"Email or OTP missing",400
      )
    }

    const user = await User.findOne({ email });

    if(!user) {
      throw new AppError(
        ERROR_CODES.USER_NOT_FOUND,"User not found",404
      )
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    throw new AppError(
      ERROR_CODES.INVALID_CREDENTIAL,"Email or Passoword Mismatch",401
    )
  }

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      throw new AppError(
        ERROR_CODES.AUTH_OTP_EXPIRED, "Invalid OTP or OTP expired",400
      )
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
  
}) 
  
    

