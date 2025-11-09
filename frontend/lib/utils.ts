// frontend/lib/utils.ts
"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* ✅ 1. Utility for combining classNames */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

/* ✅ 2. API base URL */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/* ✅ 3. JWT Token Helpers */
export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}

/* ✅ 4. Authorized API requests */
export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Request failed");
  }

  return res.json();
}
