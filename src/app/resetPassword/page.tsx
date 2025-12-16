"use client";

import { useState } from "react";
import AuthCard from "@/components/AuthCard";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setSuccess("Reset instructions sent to your email");
  };

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Reset Password
      </h1>

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-3 rounded bg-gray-800 text-white mb-4 outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded"
      >
        Continue
      </button>

      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      {success && <p className="text-green-500 mt-4 text-sm">{success}</p>}
    </AuthCard>
  );
}
