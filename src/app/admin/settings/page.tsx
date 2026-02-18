'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { setUserAdminStatus } from '@/lib/firestore';
import { Save, Shield, Globe, Bell, Database } from 'lucide-react';

const S = {
  card: { background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 22px' } as React.CSSProperties,
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6880', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 },
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%' } as React.CSSProperties,
  section: { marginBottom: 28 } as React.CSSProperties,
  sectionTitle: { display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#dce4f0' } as React.CSSProperties,
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1e2130' } as React.CSSProperties,
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? '#10b981' : '#2a2d3a',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantMsg, setGrantMsg] = useState('');

  // Site settings (stored locally for now — extend to Firestore as needed)
  const [settings, setSettings] = useState({
    siteName: 'Darija Companion',
    siteDescription: 'Learn Moroccan Darija the natural way',
    maintenanceMode: false,
    allowSignups: true,
    showLeaderboard: true,
    xpMultiplier: 1,
    defaultLanguage: 'en',
  });

  const handleSave = () => {
    // In a real app, save to Firestore settings collection
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleGrantAdmin = async () => {
    if (!grantEmail.trim() || !user) return;
    setGrantLoading(true);
    setGrantMsg('');
    try {
      // Note: In production you'd look up the user by email first
      // For now we show a helpful message
      setGrantMsg(`To grant admin to ${grantEmail}: find their user ID in the Users page and use the "Make Admin" button there.`);
    } catch (err) {
      setGrantMsg('Error: ' + err);
    } finally {
      setGrantLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>Settings</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#5a6880' }}>Configure your Darija platform</p>
      </div>

      {/* Site Settings */}
      <div style={S.card}>
        <div style={S.sectionTitle}>
          <Globe size={16} style={{ color: '#7dd3fc' }} />
          Site Configuration
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={S.label}>Site Name</label>
            <input value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} style={S.input} />
          </div>
          <div>
            <label style={S.label}>Site Description</label>
            <input value={settings.siteDescription} onChange={e => setSettings({ ...settings, siteDescription: e.target.value })} style={S.input} />
          </div>
          <div>
            <label style={S.label}>XP Multiplier</label>
            <input type="number" min={0.5} max={5} step={0.5} value={settings.xpMultiplier} onChange={e => setSettings({ ...settings, xpMultiplier: parseFloat(e.target.value) || 1 })} style={{ ...S.input, maxWidth: 120 }} />
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div style={S.card}>
        <div style={S.sectionTitle}>
          <Bell size={16} style={{ color: '#c4b5fd' }} />
          Feature Toggles
        </div>

        {[
          { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable the site for non-admins' },
          { key: 'allowSignups', label: 'Allow New Signups', desc: 'Let new users create accounts' },
          { key: 'showLeaderboard', label: 'Show Leaderboard', desc: 'Display the XP leaderboard to users' },
        ].map(item => (
          <div key={item.key} style={S.row}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#dce4f0' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#5a6880', marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle
              checked={settings[item.key as keyof typeof settings] as boolean}
              onChange={v => setSettings({ ...settings, [item.key]: v })}
            />
          </div>
        ))}
      </div>

      {/* Admin Management */}
      <div style={S.card}>
        <div style={S.sectionTitle}>
          <Shield size={16} style={{ color: '#6ee7b7' }} />
          Admin Management
        </div>
        <p style={{ fontSize: 13, color: '#5a6880', marginBottom: 14 }}>
          To grant or revoke admin access, go to the <a href="/admin/users" style={{ color: '#6ee7b7', textDecoration: 'none' }}>Users page</a> and use the "Make Admin" / "Remove Admin" buttons next to each user.
        </p>
        <div style={{ padding: '12px 16px', background: '#0f1117', borderRadius: 9, border: '1px solid #2a2d3a' }}>
          <div style={{ fontSize: 12, color: '#5a6880', marginBottom: 8 }}>Current admin</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6ee7b7,#7dd3fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#0a0c14' }}>
              {(user?.displayName || user?.email || 'A')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#dce4f0' }}>{user?.displayName || 'Admin'}</div>
              <div style={{ fontSize: 11, color: '#5a6880' }}>{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Info */}
      <div style={S.card}>
        <div style={S.sectionTitle}>
          <Database size={16} style={{ color: '#fbbf24' }} />
          Database
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Firebase Project', value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not configured' },
            { label: 'Cloudinary Cloud', value: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not configured' },
            { label: 'Mock Data Mode', value: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' ? 'Enabled' : 'Disabled' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f1117', borderRadius: 9 }}>
              <span style={{ fontSize: 13, color: '#8b9cb8' }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#dce4f0', fontFamily: 'monospace' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: saved ? '#064e3b' : 'linear-gradient(135deg,#10b981,#059669)', border: saved ? '1px solid #10b981' : 'none', borderRadius: 10, color: saved ? '#6ee7b7' : 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
          <Save size={14} /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
