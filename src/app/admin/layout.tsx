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
  ChevronLeft,
  Bell,
  FileText,
  BarChart3,
} from 'lucide-react';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Lessons', href: '/admin/lessons', icon: BookOpen },
  { name: 'Templates', href: '/admin/templates', icon: FileText },
  { name: 'Vocabulary', href: '/admin/vocabulary', icon: Type },
  { name: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070910' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user || !userProfile?.isAdmin) {
    return null;
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070910', color: '#dce4f0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0c0e16}
        ::-webkit-scrollbar-thumb{background:#2a2d3a;border-radius:2px}
      `}</style>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, zIndex: 50,
        height: '100vh',
        width: sidebarOpen ? 220 : 64,
        background: '#0a0c14',
        borderRight: '1px solid #1e2130',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        transform: mobileOpen ? 'translateX(0)' : undefined,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '0 16px' : '0', height: 60, borderBottom: '1px solid #1e2130', flexShrink: 0 }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#10b981,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>د</span>
            </div>
            {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', whiteSpace: 'nowrap' }}>DarijaAdmin</span>}
          </Link>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'transparent', border: 'none', color: '#3a4050', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {adminNavigation.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: sidebarOpen ? '9px 12px' : '9px',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  background: active ? 'linear-gradient(135deg,rgba(16,185,129,.12),rgba(8,145,178,.08))' : 'transparent',
                  border: `1px solid ${active ? 'rgba(16,185,129,.25)' : 'transparent'}`,
                  borderRadius: 9,
                  color: active ? '#6ee7b7' : '#5a6880',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  transition: 'all 0.15s',
                }}
              >
                <item.icon size={17} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (collapsed state) */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} style={{ margin: '10px 10px 14px', padding: 8, background: 'transparent', border: '1px solid #1e2130', borderRadius: 8, cursor: 'pointer', color: '#3a4050', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Menu size={16} />
          </button>
        )}

        {/* User + logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #1e2130', flexShrink: 0 }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '6px 8px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6ee7b7,#7dd3fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0a0c14', flexShrink: 0 }}>
                {(user.displayName || user.email || 'A')[0].toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f4ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.displayName || 'Admin'}</div>
                <div style={{ fontSize: 10, color: '#3a4050', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
              </div>
            </div>
          )}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '8px 12px' : '8px', justifyContent: sidebarOpen ? 'flex-start' : 'center', borderRadius: 8, color: '#5a6880', textDecoration: 'none', fontSize: 13, transition: 'color 0.15s' }}>
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Back to App</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? 220 : 64, transition: 'margin-left 0.25s ease', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 30, height: 60, background: '#0a0c14', borderBottom: '1px solid #1e2130', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setMobileOpen(true)} style={{ display: 'none', padding: 6, background: 'transparent', border: 'none', color: '#5a6880', cursor: 'pointer', borderRadius: 8 }}>
              <Menu size={18} />
            </button>
            {/* Breadcrumb */}
            <div style={{ fontSize: 13, color: '#5a6880' }}>
              {adminNavigation.find(n => isActive(n.href))?.name || 'Admin'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ width: 34, height: 34, borderRadius: 9, background: '#0f1117', border: '1px solid #1e2130', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5a6880' }}>
              <Bell size={15} />
            </button>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6ee7b7,#7dd3fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0a0c14' }}>
              {(user.displayName || user.email || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
