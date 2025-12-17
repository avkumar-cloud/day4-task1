export const runtime = "nodejs";

import {  NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { AppError } from "@/lib/AppError";
import { ERROR_CODES } from "@/lib/errorCodes";
import { apiHandler } from "@/lib/apiHandler";

export const POST=apiHandler(async(req)=>{
  await connectDB();// db connect 
    const { token, password } = await req.json();

    if (!token || !password) {
      throw new AppError(
        ERROR_CODES.AUTH_UNAUTHORIZED,"Invalid request",400
      )
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError(
        ERROR_CODES.AUTH_TOKEN_EXPIRED,"OTP invalid or expired",404
      )
    }

    user.password = password; // auto-hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
}) 
  
    
   
    
  

