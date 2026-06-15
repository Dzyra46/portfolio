"use client";

import { Card } from "@/components/ui/Card";
import { BarChart3, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AnalyticsClient({ 
  initialSummary, 
  initialEvents, 
  currentPage 
}: { 
  initialSummary: { summary: Record<string, number>, total: number };
  initialEvents: { items: any[], total: number, limit: number, offset: number };
  currentPage: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalEvents = initialSummary.total || 1; // Prevent division by zero
  const sortedSummary = Object.entries(initialSummary.summary).sort((a, b) => b[1] - a[1]);
  const totalPages = Math.ceil(initialEvents.total / initialEvents.limit) || 1;

  const formatEventName = (name: string) => {
    return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><BarChart3 /> Analytics Dashboard</h1>
        <p className="text-slate-400 mt-2">Track user interactions across your portfolio. Total Events: {initialEvents.total}</p>
      </div>

      {/* Summary Section - Macro View */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Activity size={20} className="text-purple-400" /> Interaction Summary</h2>
        <Card className="p-6 overflow-hidden border-slate-800/60 bg-slate-900/40">
          <div className="space-y-6">
            {sortedSummary.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No data available yet.</p>
            ) : (
              sortedSummary.map(([event_type, count]) => {
                const percentage = Math.round((count / totalEvents) * 100);
                return (
                  <div key={event_type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-300">{formatEventName(event_type)}</span>
                      <span className="text-slate-400 font-mono tabular-nums">{count} <span className="text-slate-600 text-xs ml-1">({percentage}%)</span></span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: mounted ? `${percentage}%` : '0%' }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </section>

      {/* Events List - Micro View */}
      <section>
        <h2 className="text-xl font-bold mb-4">Event Log</h2>
        <Card className="overflow-hidden border-slate-800/60 bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 border-b border-slate-800/60 text-xs uppercase font-semibold text-slate-400">
                <tr>
                  <th className="px-6 py-4">Event Type</th>
                  <th className="px-6 py-4">Page Path</th>
                  <th className="px-6 py-4">Target ID</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {initialEvents.items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      No analytics events recorded yet.
                    </td>
                  </tr>
                ) : (
                  initialEvents.items.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-purple-400">
                        {formatEventName(event.event_type)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-cyan-200/70">
                        {event.page_path}
                      </td>
                      <td className="px-6 py-4 text-slate-400 tabular-nums">
                        {event.target_id || "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-slate-500 tabular-nums">
                        {new Date(event.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-800/60 bg-slate-900/50 flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Link 
                  href={`/admin/analytics?page=${currentPage > 1 ? currentPage - 1 : 1}`}
                  className={`p-2 rounded border border-slate-700 hover:bg-slate-800 transition-colors ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <ChevronLeft size={16} />
                </Link>
                <Link 
                  href={`/admin/analytics?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}
                  className={`p-2 rounded border border-slate-700 hover:bg-slate-800 transition-colors ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
