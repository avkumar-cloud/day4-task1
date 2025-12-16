// components/OTPInput.tsx
"use client";

import { useRef } from "react";

export default function OTPInput({
  otp,
  setOtp,
}: {
  otp: string[];
  setOtp: (otp: string[]) => void;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          maxLength={1}
          className="w-12 h-12 text-center text-xl rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ))}
    </div>
  );
}
