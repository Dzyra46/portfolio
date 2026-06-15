"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Fire pageview event
    const trackPageView = async () => {
      try {
        await fetch("/api/v1/public/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: "page_view",
            page_path: pathname,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
          }),
        });
      } catch (error) {
        // Silently fail - analytics should never block
      }
    };

    trackPageView();
  }, [pathname]);

  // Global click tracker for specific interactive elements
  useEffect(() => {
    const handleGlobalClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trackableElement = target.closest('[data-track]');
      
      if (trackableElement) {
        const eventType = trackableElement.getAttribute("data-track");
        const targetId = trackableElement.getAttribute("data-track-id");
        
        try {
          await fetch("/api/v1/public/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_type: eventType,
              page_path: pathname,
              target_id: targetId,
            }),
          });
        } catch (error) {
          // Silently fail
        }
      }
    };

    document.addEventListener("click", handleGlobalClick, { passive: true });
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [pathname]);

  return null;
}

export function LiveViewersBadge({ baseCount = 1 }: { baseCount?: number }) {
  const [viewers, setViewers] = useState(baseCount);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const fetchViewers = async () => {
      if (!pathname) return;
      try {
        const res = await fetch(`/api/v1/public/analytics/active-viewers?page_path=${encodeURIComponent(pathname)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data && typeof data.active_viewers === 'number') {
          setViewers(data.active_viewers);
        }
      } catch (error) {
        // Silently fail
      }
    };

    // Initial fetch
    fetchViewers();
    
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchViewers, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center space-x-2 bg-slate-900/80 border border-purple-500/30 backdrop-blur-md px-4 py-2 rounded-full shadow-lg shadow-purple-500/10"
    >
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
      </div>
      <Users size={14} className="text-slate-400" />
      <span className="text-sm font-medium text-slate-300 tracking-wide">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={viewers}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="inline-block min-w-[1ch] text-center"
          >
            {viewers}
          </motion.span>
        </AnimatePresence>
        {" "}people viewing
      </span>
    </motion.div>
  );
}
