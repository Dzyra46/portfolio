import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="w-full min-h-[100dvh] flex flex-col items-center justify-center py-12 relative border-t border-slate-800/50">
      <Container className="max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Initialize Contact</h2>
          <p className="text-slate-400 text-lg">Send a transmission to discuss opportunities, collaborations, or just say hello.</p>
        </div>
        <Card className="p-8 border-slate-800/60 bg-slate-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />
          <ContactForm />
        </Card>
      </Container>
    </section>
  );
}
