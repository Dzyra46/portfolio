import { fetchClient } from "@/lib/api/client";
import { Card } from "@/components/ui/Card";
import { updateMessageStatusAction } from "@/app/actions/portfolio";
import { Button } from "@/components/ui/Button";
import { Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const { items, total } = await fetchClient<{ items: any[]; total: number }>("/api/v1/admin/messages?limit=50&offset=0");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-slate-400 mt-2">Inbox ({total} total)</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="p-4 bg-slate-800 rounded-full mb-4">
              <Inbox size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Your inbox is clear</h3>
            <p className="text-slate-400 max-w-md">You don't have any messages yet.</p>
          </div>
        ) : (
          items.map((msg) => (
            <Card 
              key={msg.id} 
              className={`p-6 transition-all ${msg.status === "unread" ? "bg-slate-900 border-purple-500/30" : "bg-slate-900/50 opacity-80"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg ${msg.status === "unread" ? "font-bold text-white" : "font-medium text-slate-300"}`}>
                    {msg.subject || "No Subject"}
                  </h3>
                  <div className="text-sm text-slate-400 mt-1">
                    <span className="text-slate-300">{msg.name}</span> &middot; {msg.email}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                  {msg.status === "unread" ? (
                    <form action={async () => { 
                      "use server"; 
                      await updateMessageStatusAction(msg.id, "read"); 
                    }}>
                      <Button variant="outline" size="sm" className="h-8 text-xs">Mark as Read</Button>
                    </form>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded">Read</span>
                  )}
                </div>
              </div>
              <div className="p-4 bg-slate-950/50 rounded-md border border-slate-800 text-sm text-slate-300 whitespace-pre-wrap">
                {msg.message}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
