import { fetchClient } from "@/lib/api/client";
import { TestimonialsClient } from "./TestimonialsClient";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await fetchClient<any[]>("/api/v1/admin/testimonials");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-slate-400 mt-2">Manage what clients and colleagues say about you.</p>
        </div>
      </div>

      <TestimonialsClient initialData={testimonials} />
    </div>
  );
}
