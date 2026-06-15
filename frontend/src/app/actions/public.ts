"use server";

import { fetchClient } from "@/lib/api/client";

export async function submitContactMessage(prevState: any, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    // In a real app, we'd add captcha/rate limiting validation here

    await fetchClient("/api/v1/public/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting message:", error);
    return { error: error.message || "Failed to send message. Please try again later." };
  }
}
