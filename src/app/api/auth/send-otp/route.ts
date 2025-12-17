// app/api/auth/send-otp/route.ts
export const runtime = "nodejs";
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/utils/sendEmail";
import { AppError } from "@/lib/AppError";
import { ERROR_CODES } from "@/lib/errorCodes";
import { apiHandler } from "@/lib/apiHandler";

export const POST = apiHandler(async(req:NextRequest)=>{
   await connectDB();

    const { email, role , password} = await req.json();

    if (!email || !password) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,"Email or Password missing",400
      )
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({ email });

    if (role) {
      if (user) {
        throw new AppError(
          ERROR_CODES.USER_ALREADY_EXISTS,"User already Exist",400
        )
      }
      
      user = await User.create({
        email,
        role,
        password: hashedPassword
      });
    }

    if (!role && !user) {
      throw new AppError(
        ERROR_CODES.USER_NOT_FOUND,"User not found",404
      )
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user!.otp = otp;
    user!.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user!.save();

    await sendEmail(email, `Your OTP is ${otp}`);

    return NextResponse.json({ message: "OTP sent successfully" });
}) 
  
   
   

