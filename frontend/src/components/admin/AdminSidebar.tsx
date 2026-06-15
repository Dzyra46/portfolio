"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderGit2, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  MessageSquare,
  BarChart3,
  LogOut,
  User,
  Github
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/github", label: "GitHub Sync", icon: Github },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-purple-500/10 text-purple-400" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form action={logoutAction}>
            <button 
              type="submit" 
              className="flex w-full items-center space-x-3 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-slate-950 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
