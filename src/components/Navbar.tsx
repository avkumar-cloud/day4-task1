// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";

type User = {
  role: "admin" | "provider" | "customer";
  email?: string;
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUserFromToken());
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      {/* Left */}
      <Link href="/" className="text-xl font-bold text-white">
        MyApp
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              href="/login"
              className="text-gray-300 hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-300 text-sm">
              {user.email ?? "Logged In"} ({user.role})
            </span>

            <Link
              href={`/${user.role}`}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
