"use server";

import { revalidatePath } from "next/cache";
import { fetchClient } from "@/lib/api/client";
import { redirect } from "next/navigation";

// Projects
export async function createProjectAction(prevState: any, formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      summary: formData.get("summary") as string,
      case_study: formData.get("case_study") as string || undefined,
      cover_image_url: formData.get("cover_image_url") as string || undefined,
      is_published: formData.get("is_published") === "true",
      featured: formData.get("featured") === "true",
      sort_order: parseInt(formData.get("sort_order") as string || "0", 10),
    };

    await fetchClient("/api/v1/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error("Error creating project:", error);
    return { error: error.message || "Failed to create project" };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  try {
    await fetchClient(`/api/v1/admin/projects/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to delete project" };
  }
}

// Skills
export async function createSkillAction(prevState: any, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      proficiency_level: parseInt(formData.get("proficiency") as string || "50", 10),
      icon_url: formData.get("icon_url") as string || undefined,
      is_published: formData.get("is_published") === "true",
      sort_order: parseInt(formData.get("sort_order") as string || "0", 10),
    };

    await fetchClient("/api/v1/admin/skills", {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to create skill" };
  }
}

export async function deleteSkillAction(id: string) {
  try {
    await fetchClient(`/api/v1/admin/skills/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to delete skill" };
  }
}

// Profile
export async function updateProfileAction(prevState: any, formData: FormData) {
  try {
    const data = {
      full_name: formData.get("full_name") as string,
      title: formData.get("title") as string,
      bio: formData.get("bio") as string || undefined,
      avatar_url: formData.get("avatar_url") as string || undefined,
      resume_url: formData.get("resume_url") as string || undefined,
      location: formData.get("location") as string || undefined,
      email: formData.get("email") as string || undefined,
    };

    await fetchClient("/api/v1/admin/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    revalidatePath("/admin/profile");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to update profile" };
  }
}

// File Upload
export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    const uploadData = new FormData();
    uploadData.append("file", file);

    // Cannot use fetchClient directly because of FormData and Content-Type boundary
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${baseUrl}/api/v1/admin/upload`, {
      method: "POST",
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: uploadData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || "Upload failed");
    }

    const data = await res.json();
    return { url: data.url };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Upload failed" };
  }
}

// Experience
export async function createExperienceAction(prevState: any, formData: FormData) {
  try {
    const data = {
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      location: formData.get("location") as string || undefined,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string || undefined,
      description: formData.get("description") as string || undefined,
      is_current: formData.get("is_current") === "true",
      is_published: formData.get("is_published") === "true",
      sort_order: parseInt(formData.get("sort_order") as string || "0", 10),
    };
    await fetchClient("/api/v1/admin/experiences", { method: "POST", body: JSON.stringify(data) });
    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to create experience" };
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    await fetchClient(`/api/v1/admin/experiences/${id}`, { method: "DELETE" });
    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to delete experience" };
  }
}

// Education
export async function createEducationAction(prevState: any, formData: FormData) {
  try {
    const data = {
      institution: formData.get("institution") as string,
      degree: formData.get("degree") as string,
      field_of_study: formData.get("field_of_study") as string || undefined,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string || undefined,
      description: formData.get("description") as string || undefined,
      is_published: formData.get("is_published") === "true",
      sort_order: parseInt(formData.get("sort_order") as string || "0", 10),
    };
    await fetchClient("/api/v1/admin/educations", { method: "POST", body: JSON.stringify(data) });
    revalidatePath("/admin/education");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to create education" };
  }
}

export async function deleteEducationAction(id: string) {
  try {
    await fetchClient(`/api/v1/admin/educations/${id}`, { method: "DELETE" });
    revalidatePath("/admin/education");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to delete education" };
  }
}

// Certificates
export async function createCertificateAction(prevState: any, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      issuer: formData.get("issuer") as string,
      credential_id: formData.get("credential_id") as string || undefined,
      credential_url: formData.get("credential_url") as string || undefined,
      issue_date: formData.get("issue_date") as string || undefined,
      expiry_date: formData.get("expiry_date") as string || undefined,
      image_url: formData.get("image_url") as string || undefined,
      is_published: formData.get("is_published") === "true",
      sort_order: parseInt(formData.get("sort_order") as string || "0", 10),
    };
    await fetchClient("/api/v1/admin/certificates", { method: "POST", body: JSON.stringify(data) });
    revalidatePath("/admin/certificates");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to create certificate" };
  }
}

export async function deleteCertificateAction(id: string) {
  try {
    await fetchClient(`/api/v1/admin/certificates/${id}`, { method: "DELETE" });
    revalidatePath("/admin/certificates");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to delete certificate" };
  }
}

// Testimonials
export async function createTestimonialAction(prevState: any, formData: FormData) {
  try {
    const data = {
      author_name: formData.get("author_name") as string,
      author_title: formData.get("author_title") as string || undefined,
      author_company: formData.get("author_company") as string || undefined,
      author_avatar_url: formData.get("author_avatar_url") as string || undefined,
      content: formData.get("content") as string,
      rating: parseInt(formData.get("rating") as string || "5", 10),
      is_published: formData.get("is_published") === "true",
      featured: formData.get("featured") === "true",
      sort_order: parseInt(formData.get("sort_order") as string || "0", 10),
    };
    await fetchClient("/api/v1/admin/testimonials", { method: "POST", body: JSON.stringify(data) });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to create testimonial" };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    await fetchClient(`/api/v1/admin/testimonials/${id}`, { method: "DELETE" });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to delete testimonial" };
  }
}

// Messages
export async function updateMessageStatusAction(id: string, status: string) {
  try {
    await fetchClient(`/api/v1/admin/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to update message status" };
  }
}

// Update Skills
export async function updateSkillAction(id: string, data: Record<string, any>) {
  try {
    await fetchClient(`/api/v1/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to update skill" };
  }
}

// Update Projects
export async function updateProjectAction(id: string, data: Record<string, any>) {
  try {
    await fetchClient(`/api/v1/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to update project" };
  }
}

// Update Experience
export async function updateExperienceAction(id: string, data: Record<string, any>) {
  try {
    await fetchClient(`/api/v1/admin/experiences/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to update experience" };
  }
}

// Update Education
export async function updateEducationAction(id: string, data: Record<string, any>) {
  try {
    await fetchClient(`/api/v1/admin/educations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    revalidatePath("/admin/education");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to update education" };
  }
}

// Update Certificates
export async function updateCertificateAction(id: string, data: Record<string, any>) {
  try {
    await fetchClient(`/api/v1/admin/certificates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    revalidatePath("/admin/certificates");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to update certificate" };
  }
}

// Update Testimonials
export async function updateTestimonialAction(id: string, data: Record<string, any>) {
  try {
    await fetchClient(`/api/v1/admin/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to update testimonial" };
  }
}

// Social Links
export async function createSocialLinkAction(data: Record<string, any>) {
  try {
    const response = await fetchClient("/api/v1/admin/social-links", {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath("/admin/profile");
    revalidatePath("/");
    return { success: true, data: response };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to create social link" };
  }
}

export async function updateSocialLinkAction(id: string, data: Record<string, any>) {
  try {
    await fetchClient(`/api/v1/admin/social-links/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    revalidatePath("/admin/profile");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to update social link" };
  }
}

export async function deleteSocialLinkAction(id: string) {
  try {
    await fetchClient(`/api/v1/admin/social-links/${id}`, { method: "DELETE" });
    revalidatePath("/admin/profile");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: error.message || "Failed to delete social link" };
  }
}
