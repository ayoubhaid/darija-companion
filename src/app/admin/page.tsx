'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllLessons, getAllVocabulary, getAllQuizzes, getAllUsers, getStats } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { Lesson, Quiz, VocabularyItem, UserProfile, Stats } from '@/types';
import {
  BookOpen, Type, HelpCircle, Users, Plus, ArrowRight,
  TrendingUp, Globe, BarChart2, Clock, ChevronRight,
} from 'lucide-react';

// ── Shared dark-theme primitives ──────────────────────────────────────────────
const S = {
  card: {
    background: '#0c0e16',
    border: '1px solid #1e2130',
    borderRadius: 14,
    padding: '20px 22px',
  } as React.CSSProperties,
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#3a4050',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  } as React.CSSProperties,
  h1: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: '#f0f4ff',
  } as React.CSSProperties,
  h2: {
    margin: '0 0 16px',
    fontSize: 14,
    fontWeight: 600,
    color: '#dce4f0',
  } as React.CSSProperties,
  muted: {
    fontSize: 13,
    color: '#5a6880',
  } as React.CSSProperties,
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, href }: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{ ...S.card, cursor: 'pointer', transition: 'border-color 0.15s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ padding: 8, borderRadius: 8, background: `${color}18`, display: 'inline-flex' }}>
            <Icon size={18} style={{ color }} />
          </div>
          <ArrowRight size={14} style={{ color: '#2a3040' }} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#f0f4ff', lineHeight: 1 }}>{value}</div>
        <div style={{ ...S.label, marginTop: 6 }}>{label}</div>
      </div>
    </Link>
  );
}

// ── Quick action button ───────────────────────────────────────────────────────
function QuickAction({ label, href, icon: Icon }: { label: string; href: string; icon: React.ElementType }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.15s' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={15} style={{ color: 'white' }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#dce4f0' }}>{label}</span>
        <ChevronRight size={14} style={{ color: '#2a3040', marginLeft: 'auto' }} />
      </div>
    </Link>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, lessonsData, quizzesData, vocabData, usersData] = await Promise.all([
          getStats(),
          getAllLessons(),
          getAllQuizzes(),
          getAllVocabulary(),
          getAllUsers(),
        ]);
        setStats(statsData);
        setLessons(lessonsData);
        setQuizzes(quizzesData);
        setVocabulary(vocabData);
        setUsers(usersData);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Lessons', value: stats?.totalLessons ?? lessons.length, icon: BookOpen, color: '#6ee7b7', href: '/admin/lessons' },
    { label: 'Vocabulary Words', value: stats?.totalVocabulary ?? vocabulary.length, icon: Type, color: '#7dd3fc', href: '/admin/vocabulary' },
    { label: 'Total Quizzes', value: stats?.totalQuizzes ?? quizzes.length, icon: HelpCircle, color: '#c4b5fd', href: '/admin/quizzes' },
    { label: 'Total Users', value: stats?.totalUsers ?? users.length, icon: Users, color: '#fbbf24', href: '/admin/users' },
  ];

  const quickActions = [
    { label: 'New Lesson', href: '/admin/lessons/new', icon: BookOpen },
    { label: 'Add Vocabulary', href: '/admin/vocabulary/new', icon: Type },
    { label: 'Create Quiz', href: '/admin/quizzes/new', icon: HelpCircle },
    { label: 'Manage Users', href: '/admin/users', icon: Users },
  ];

  const publishedLessons = lessons.filter(l => l.status === 'published').length;
  const draftLessons = lessons.filter(l => l.status !== 'published').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={S.h1}>مرحبا! Welcome back, {user?.displayName || 'Admin'} 👋</h1>
        <p style={{ ...S.muted, marginTop: 4 }}>Here's what's happening with your Darija platform.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Middle row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Lessons */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ ...S.h2, margin: 0 }}>Recent Lessons</h2>
            <Link href="/admin/lessons" style={{ fontSize: 12, color: '#6ee7b7', textDecoration: 'none' }}>View all →</Link>
          </div>
          {lessons.length === 0 ? (
            <p style={S.muted}>No lessons yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lessons.slice(0, 5).map(l => (
                <Link key={l.id} href={`/admin/lessons/${l.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: '#0f1117', borderRadius: 9, textDecoration: 'none', transition: 'background 0.15s' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.status === 'published' ? '#6ee7b7' : '#fbbf24', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: '#dce4f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                  <span style={{ fontSize: 11, color: '#3a4050', flexShrink: 0 }}>{l.difficulty}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quizzes */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ ...S.h2, margin: 0 }}>Recent Quizzes</h2>
            <Link href="/admin/quizzes" style={{ fontSize: 12, color: '#c4b5fd', textDecoration: 'none' }}>View all →</Link>
          </div>
          {quizzes.length === 0 ? (
            <p style={S.muted}>No quizzes yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quizzes.slice(0, 5).map(q => (
                <Link key={q.id} href={`/admin/quizzes/${q.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: '#0f1117', borderRadius: 9, textDecoration: 'none' }}>
                  <HelpCircle size={13} style={{ color: '#c4b5fd', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: '#dce4f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.title}</span>
                  <span style={{ fontSize: 11, color: '#3a4050', flexShrink: 0 }}>{q.xpReward || 10} XP</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Quick Actions */}
        <div style={S.card}>
          <h2 style={S.h2}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickActions.map(a => <QuickAction key={a.label} {...a} />)}
          </div>
        </div>

        {/* Content Overview */}
        <div style={S.card}>
          <h2 style={S.h2}>Content Overview</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Lessons breakdown */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#8b9cb8' }}>Lessons</span>
                <span style={{ fontSize: 12, color: '#5a6880' }}>{publishedLessons} published · {draftLessons} draft</span>
              </div>
              <div style={{ height: 6, background: '#1e2130', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: lessons.length ? `${(publishedLessons / lessons.length) * 100}%` : '0%', background: 'linear-gradient(90deg,#10b981,#059669)', borderRadius: 3 }} />
              </div>
            </div>
            {/* Vocab */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f1117', borderRadius: 9 }}>
              <span style={{ fontSize: 13, color: '#8b9cb8' }}>Vocabulary words</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#7dd3fc' }}>{vocabulary.length}</span>
            </div>
            {/* Users */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f1117', borderRadius: 9 }}>
              <span style={{ fontSize: 13, color: '#8b9cb8' }}>Registered users</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24' }}>{users.length}</span>
            </div>
            {/* Admins */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f1117', borderRadius: 9 }}>
              <span style={{ fontSize: 13, color: '#8b9cb8' }}>Admin users</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#6ee7b7' }}>{users.filter(u => u.isAdmin).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
