import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { fetchClient } from "@/lib/api/client";
import { Testimonial } from "@/types/portfolio";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import Image from "next/image";

export default async function Testimonials() {
  let testimonials: Testimonial[] = [];

  try {
    testimonials = await fetchClient<Testimonial[]>("/api/v1/public/testimonials?featured=true");
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
  }

  // If no testimonials, we gracefully skip this entire section visually or show a tiny subtle prompt 
  // depending on design preference. Here we just hide it completely since an empty testimonial section adds no value.
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <SectionWrapper id="testimonials" className="bg-slate-900/50">
      <Container>
        <ScrollReveal direction="down">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center tracking-tight">Client Feedback</h2>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <Card className="p-8 h-full flex flex-col justify-between border-slate-800/60 bg-slate-950/40 relative group">
                <div className="absolute top-4 right-4 text-purple-500/20 group-hover:text-purple-500/40 transition-colors">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                </div>

                <p className="italic text-slate-300 mb-8 leading-relaxed relative z-10">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  {testimonial.author_avatar_url ? (
                    <Image
                      src={testimonial.author_avatar_url}
                      alt={testimonial.author_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-500">
                      {testimonial.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-200">{testimonial.author_name}</h4>
                    <p className="text-sm text-slate-500">
                      {testimonial.author_title} {testimonial.author_company && `at ${testimonial.author_company}`}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </SectionWrapper>
  );
}
