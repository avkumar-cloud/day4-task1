// app/login/page.tsx
"use client";//use client client 
import Link from "next/link";// link a 

import { useState } from "react";// 
import AuthCard from "@/components/AuthCard";
import OTPInput from "@/components/OTPInput";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const {login} = useAuth()
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const sendOtp = async () => {
    setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email,password }),
    });

    if (!res.ok) return setError("Failed to send OTP");
    setStep("otp");// 
  };

  const verifyOtp = async () => {
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",//2
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email,password, otp: otp.join("") }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);
    console.log("data",data);
    login(data.accessToken);
    router.push(`/${data.user.role}`);
  };

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Login
      </h1>

      {step === "email" && (
        <>
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 rounded bg-gray-800 text-white mb-4 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 text-white mb-4 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={sendOtp}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded"
          >
            Send OTP
          </button>
          <Link
          href="/resetPassword"
          className="block text-sm text-indigo-400 hover:underline text-center mt-4"
          >
            Forgot password?
          </Link>
        </>
      )}

      {step === "otp" && (
        <>
          <OTPInput otp={otp} setOtp={setOtp} />
          <button
            onClick={verifyOtp}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded"
          >
            Verify OTP
          </button>
        </>
      )}

      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
    </AuthCard>
  );
}
