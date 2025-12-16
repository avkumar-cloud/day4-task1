"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";

export default function NewPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);

    setSuccess("Password updated successfully");
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Set New Password
      </h1>

      <input
        type="password"
        placeholder="New password"
        className="w-full p-3 rounded bg-gray-800 text-white mb-4 outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm password"
        className="w-full p-3 rounded bg-gray-800 text-white mb-4 outline-none"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button
        onClick={handleReset}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded"
      >
        Reset Password
      </button>

      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      {success && <p className="text-green-500 mt-4 text-sm">{success}</p>}
    </AuthCard>
  );
}
