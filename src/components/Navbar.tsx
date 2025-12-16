// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout()
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900">
      <Link href="/" className="text-xl font-bold text-white">MyApp</Link>
      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link href="/login" className="bg-indigo-600 px-4 py-2 rounded text-white">Login</Link>
            <Link href="/signup" className="bg-indigo-600 px-4 py-2 rounded text-white">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-300">{user.email} ({user.role})</span>
            <Link href={`/${user.role}`} className="text-indigo-400">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
