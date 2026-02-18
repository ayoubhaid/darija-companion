'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, setUserAdminStatus } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types';
import { Search, Shield, ShieldCheck, Users } from 'lucide-react';

const S = {
  card: { background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, overflow: 'hidden' } as React.CSSProperties,
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '8px 12px', outline: 'none', width: '100%' } as React.CSSProperties,
  th: { padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#3a4050', textTransform: 'uppercase' as const, letterSpacing: '0.08em', textAlign: 'left' as const, borderBottom: '1px solid #1e2130' },
  td: { padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #0f1117', verticalAlign: 'middle' as const },
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleToggleAdmin = async (userId: string, current: boolean) => {
    if (!user) return;
    if (userId === user.uid) { alert("You cannot remove your own admin status!"); return; }
    setUpdating(userId);
    try {
      await setUserAdminStatus(userId, !current, user.uid, user.displayName || 'Admin');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isAdmin: !current } : u));
    } catch { alert('Failed to update user'); }
    finally { setUpdating(null); }
  };

  const filtered = users.filter(u =>
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>Users</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#5a6880' }}>Manage users and admin access</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ padding: '12px 18px', background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={16} style={{ color: '#fbbf24' }} />
          <span style={{ fontSize: 13, color: '#8b9cb8' }}>{users.length} Total Users</span>
        </div>
        <div style={{ padding: '12px 18px', background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={16} style={{ color: '#6ee7b7' }} />
          <span style={{ fontSize: 13, color: '#8b9cb8' }}>{users.filter(u => u.isAdmin).length} Admins</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#3a4050' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" style={{ ...S.input, paddingLeft: 32 }} />
      </div>

      {/* Table */}
      <div style={S.card}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#5a6880', fontSize: 14 }}>No users found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>User</th>
                <th style={S.th}>Email</th>
                <th style={S.th}>Level</th>
                <th style={S.th}>XP</th>
                <th style={{ ...S.th, textAlign: 'center' }}>Admin</th>
                <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0f1117')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#6ee7b7,#7dd3fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0a0c14', flexShrink: 0 }}>
                        {(u.displayName || u.email || 'U')[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: '#dce4f0' }}>{u.displayName || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td style={{ ...S.td, color: '#8b9cb8' }}>{u.email}</td>
                  <td style={S.td}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#1a2535', color: '#7dd3fc', border: '1px solid #2a3a50' }}>Level {u.level || 1}</span>
                  </td>
                  <td style={{ ...S.td, color: '#5a6880' }}>{u.xp || 0} XP</td>
                  <td style={{ ...S.td, textAlign: 'center' }}>
                    {u.isAdmin
                      ? <ShieldCheck size={16} style={{ color: '#6ee7b7', margin: '0 auto' }} />
                      : <Shield size={16} style={{ color: '#3a4050', margin: '0 auto' }} />}
                  </td>
                  <td style={{ ...S.td, textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleAdmin(u.id, u.isAdmin || false)}
                      disabled={updating === u.id || u.id === user?.uid}
                      style={{
                        padding: '5px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: (updating === u.id || u.id === user?.uid) ? 'not-allowed' : 'pointer',
                        opacity: (updating === u.id || u.id === user?.uid) ? 0.5 : 1,
                        ...(u.isAdmin
                          ? { background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#fca5a5' }
                          : { background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#6ee7b7' })
                      }}
                    >
                      {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
