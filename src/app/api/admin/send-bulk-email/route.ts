
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendBulkEmails } from "@/services/bulkEmail.services";
import jwt from "jsonwebtoken";
import { ERROR_CODES } from "@/lib/errorCodes";
import { AppError } from "@/lib/AppError";
import { apiHandler } from "@/lib/apiHandler";

export const POST=apiHandler(async(req: NextRequest)=>{
   await connectDB();
   
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      throw new AppError(
        ERROR_CODES.AUTH_UNAUTHORIZED, "Unauthorized", 401
      )
    }

    const payload: any = jwt.verify(token, process.env.ACCESS_SECRET!);
    if (payload.role !== "admin") {
      throw new AppError(
        ERROR_CODES.AUTH_UNAUTHORIZED,"Unauthorized",403
      )
    }

    const { targetRole, subject, message } = await req.json();

    const users = await User.find({ role: targetRole }).select("email");

    const emails = users.map((u) => ({
      to: u.email,
      subject,
      html: `
        <div style="font-family:Arial">
          <h3>${subject}</h3>
          <p>${message}</p>
        </div>
      `,
    }));

    await sendBulkEmails(emails);

    return NextResponse.json({
      message: `Emails sent to ${emails.length} users`,
    });
})
  

   
   

