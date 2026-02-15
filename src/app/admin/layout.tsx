'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  BookOpen, 
  Type, 
  HelpCircle, 
  Users, 
  LogOut,
  Menu,
  X,
  Settings,
  BarChart3,
  ChevronLeft
} from 'lucide-react';
import { clsx } from 'clsx';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Lessons', href: '/admin/lessons', icon: BookOpen },
  { name: 'Vocabulary', href: '/admin/vocabulary', icon: Type },
  { name: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !userProfile?.isAdmin)) {
      router.push('/');
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user || !userProfile?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed top-0 left-0 z-50 h-screen bg-zinc-900 dark:bg-zinc-950 border-r border-zinc-800/60 transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64" : "w-20",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800/60">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow-sm transition-shadow">
                <span className="text-white font-bold text-lg">د</span>
              </div>
              {sidebarOpen && (
                <span className="text-white font-bold text-lg whitespace-nowrap">Admin</span>
              )}
            </Link>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className={clsx("w-5 h-5 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
            </button>
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  )}
                >
                  <item.icon className={clsx("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                  {sidebarOpen && (
                    <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow-sm" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-3 border-t border-zinc-800/60">
            <div className={clsx("flex items-center", sidebarOpen ? "mb-3" : "justify-center mb-3")}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-white font-medium text-sm">
                  {(user.displayName || user.email || 'A')[0].toUpperCase()}
                </span>
              </div>
              {sidebarOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user.displayName || 'Admin'}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
              )}
            </div>
            <Link
              href="/"
              className={clsx(
                "flex items-center w-full px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors",
                !sidebarOpen && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3 font-medium">Back to App</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={clsx(
        "transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/admin/settings" className="p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
