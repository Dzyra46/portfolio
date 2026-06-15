"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Projects", href: "/#projects" },
  { name: "Experience", href: "/#experience" },
  { name: "Contact", href: "/#contact" },
];

export default function Header({ resumeUrl }: { resumeUrl?: string | null }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Glassmorphism background trigger
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled ? "bg-slate-950/70 backdrop-blur-md border-b border-slate-800/50" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              [ NOZYRA ]
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a
              href={resumeUrl || "/resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-sm font-medium rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 hover:border-purple-500/50"
            >
              Resume
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </motion.header>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col items-center space-y-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    delay: 0.1 + index * 0.1,
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1], // Sine-wave easing curve
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-bold tracking-tight text-slate-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 transition-all"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  delay: 0.1 + navLinks.length * 0.1,
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <a
                  href={resumeUrl || "/resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 mt-4 text-lg font-bold rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25"
                >
                  Download CV
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
