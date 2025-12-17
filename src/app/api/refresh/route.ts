import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/lib/jwt";
import { apiHandler } from "@/lib/apiHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { AppError } from "@/lib/AppError";

export const POST=apiHandler(async(req: NextRequest)=>{
    await connectDB();

    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,"Refresh Token missing",403
      )
    }

    // Verify refresh token signature
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError(
        ERROR_CODES.USER_NOT_FOUND,"user not found", 401
      )
    }

    // Create new access token
    const newAccessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      accessToken: newAccessToken,
    });
})
  
    
  

