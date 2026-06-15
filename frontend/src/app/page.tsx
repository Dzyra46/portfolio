import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import Skills from "@/components/public/Skills";
import Projects from "@/components/public/Projects";
import Experience from "@/components/public/Experience";
import Education from "@/components/public/Education";
import Certificates from "@/components/public/Certificates";
import Testimonials from "@/components/public/Testimonials";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Certificates />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
