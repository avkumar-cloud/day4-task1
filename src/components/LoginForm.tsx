// app/login/page.tsx
"use client";

import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import OTPInput from "@/components/OTPInput";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role,setRole] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) return setError("Failed to send OTP");
    setStep("otp");
  };

  const verifyOtp = async () => {
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: otp.join("") }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);

    localStorage.setItem("accessToken", data.accessToken);

    router.push(`/${data.role}`);
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
            type="text"
            placeholder="Role"
            className="w-full p-3 rounded bg-gray-800 text-white mb-4 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <button
            onClick={sendOtp}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded"
          >
            Send OTP
          </button>
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
