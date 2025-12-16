// app/api/admin/send-bulk-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendBulkEmails } from "@/services/bulkEmail.services";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {

    await connectDB();

  
    const token = req.headers.get("Authorization")?.split(" ")[1];//1
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });// error handler

    const payload: any = jwt.verify(token, process.env.ACCESS_SECRET!);
    if (payload.role !== "admin") {
      // return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      return ""//3
    }

    const { targetRole, subject, message } = await req.json();

    // targetRole = "provider" | "customer"
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
  } catch (err) {
    console.error("BULK EMAIL ERROR:", err);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
