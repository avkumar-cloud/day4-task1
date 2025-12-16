// lib/auth.ts
import {jwtDecode} from "jwt-decode";

interface TokenPayload {
  id: string;
  role: "admin" | "provider" | "customer";
  email?: string;
  exp: number;
}

export function getUserFromToken() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}
