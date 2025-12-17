export const runtime = "nodejs";
import * as crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/utils/sendEmail";
import { AppError } from "@/lib/AppError";
import { ERROR_CODES } from "@/lib/errorCodes";
import { apiHandler } from "@/lib/apiHandler";

export const POST=apiHandler(async(req) =>{

    await connectDB();

    const { email } = await req.json();

    if (!email) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,"Email Required",400
      )
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(
        ERROR_CODES.USER_NOT_FOUND,"User not found",404
      )
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
   
    
  
})
