// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { apiHandler } from "@/lib/apiHandler";

export const POST=apiHandler(async(req: NextRequest)=>{
  await connectDB();
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (refreshToken) {
    await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
  }

  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.delete("refreshToken");
  return res;

})
  
