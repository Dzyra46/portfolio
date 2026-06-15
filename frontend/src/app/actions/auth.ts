"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = `${baseUrl}/api/v1/auth/login`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return {
        error: errorData?.detail || "Invalid username or password",
      };
    }

    const data = await res.json();

    if (data.access_token) {
      const cookieStore = await cookies();
      cookieStore.set("token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "An error occurred while connecting to the server" };
  }

  // Redirect on success (must be outside try-catch to work properly)
  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/admin/login");
}
