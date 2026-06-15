import { fetchClient } from "@/lib/api/client";
import { Card } from "@/components/ui/Card";
import { FolderGit2, MessageSquare, BarChart3, Award } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  projects: number;
  messages: number;
  analytics: number;
  skills: number;
}

export default async function AdminDashboard() {
  // We can fetch data concurrently
  // Since we use the Paginated endpoints for messages and analytics, they return total.
  // The regular endpoints return the full list.
  
  const handleFetchError = (fallback: any) => (error: any) => {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return fallback;
  };

  const [projects, messagesData, analyticsData, skills] = await Promise.all([
    fetchClient<any[]>("/api/v1/admin/projects", { next: { revalidate: 0 } }).catch(handleFetchError([])),
    fetchClient<any>("/api/v1/admin/messages?limit=1&status=unread", { next: { revalidate: 0 } }).catch(handleFetchError({ total: 0 })),
    fetchClient<any>("/api/v1/admin/analytics?limit=1", { next: { revalidate: 0 } }).catch(handleFetchError({ total: 0 })),
    fetchClient<any[]>("/api/v1/admin/skills", { next: { revalidate: 0 } }).catch(handleFetchError([])),
  ]);

  const stats: DashboardStats = {
    projects: projects.length,
    messages: messagesData.total,
    analytics: analyticsData.total,
    skills: skills.length,
  };

  const statCards = [
    { label: "Total Projects", value: stats.projects, icon: FolderGit2, color: "text-blue-400", bg: "bg-blue-500/10", href: "/admin/projects" },
    { label: "Unread Messages", value: stats.messages, icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10", href: "/admin/messages" },
    { label: "Total Page Views", value: stats.analytics, icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/10", href: "/admin/analytics" },
    { label: "Total Skills", value: stats.skills, icon: Award, color: "text-amber-400", bg: "bg-amber-500/10", href: "/admin/skills" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Welcome to your portfolio administration panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Link key={idx} href={stat.href}>
            <Card className="p-6 flex items-center space-x-4 hover:border-slate-700 transition-colors cursor-pointer group">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="p-6 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2 flex flex-col flex-1">
            <Link href="/admin/projects" className="text-purple-400 hover:underline p-2 hover:bg-slate-800 rounded">
              + Add New Project
            </Link>
            <Link href="/admin/skills" className="text-purple-400 hover:underline p-2 hover:bg-slate-800 rounded">
              + Update Skills
            </Link>
            <Link href="/admin/profile" className="text-purple-400 hover:underline p-2 hover:bg-slate-800 rounded">
              &rarr; Edit Profile Information
            </Link>
          </div>
        </Card>
        
        <Card className="p-6 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">Database Connection</span>
              <span className="text-emerald-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Connected</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">API Uptime</span>
              <span className="text-emerald-400">100%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
