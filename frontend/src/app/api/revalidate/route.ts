import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const path = body.path;

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, now: Date.now(), path });
    }

    // Default revalidations
    revalidatePath("/admin/github");
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
