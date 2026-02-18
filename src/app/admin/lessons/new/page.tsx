'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createLesson } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { ContentItem, serializeItems } from '@/components/editor/LessonBuilder';

const LessonBuilder = dynamic(() => import('@/components/editor/LessonBuilder'), { ssr: false });

const S = {
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6880', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 },
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%' } as React.CSSProperties,
  card: { background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 22px' } as React.CSSProperties,
};

export default function NewLessonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [form, setForm] = useState({
    title: '', description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    status: 'draft' as 'draft' | 'published',
    duration: 15, topic: '', tags: '', imageUrl: '',
  });

  const handleItemsChange = useCallback((it: ContentItem[]) => setItems(it), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const contentJson = serializeItems(items);
      const htmlSummary = items.map(it => {
        if (it.kind === 'text') return it.html || '';
        if (it.blockType === 'image' && it.src) return `<img src="${it.src}" alt="${it.alt || ''}" />`;
        if (it.blockType === 'callout') return `<blockquote><strong>${it.calloutTitle}</strong><p>${it.calloutText}</p></blockquote>`;
        return '';
      }).join('\n');

      await createLesson({
        title: form.title,
        description: form.description,
        contentJson: contentJson,
        contentHtml: htmlSummary,
        difficulty: form.difficulty,
        status: form.status,
        duration: form.duration,
        topic: form.topic,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        imageUrl: form.imageUrl,
        content: { vocabulary: [], sentences: [], exercises: [] },
      } as any, user.uid, user.displayName || 'Admin');
      router.push('/admin/lessons');
    } catch (err) {
      console.error(err);
      alert('Failed to create lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/admin/lessons" style={{ display: 'flex', padding: 6, background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 8, color: '#5a6880', textDecoration: 'none' }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>New Lesson</h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#5a6880' }}>Build your lesson with rich multimedia blocks</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Meta */}
            <div style={S.card}>
              <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>Lesson Info</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={S.label}>Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter lesson title" style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description shown in lesson list" rows={2} style={{ ...S.input, resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* Block builder */}
            <div style={S.card}>
              <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>Lesson Content</h2>
              <LessonBuilder onChange={handleItemsChange} autoSaveKey="lesson-new-draft" />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 }}>
            <div style={S.card}>
              <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={S.label}>Difficulty</label>
                  <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value as any })} style={{ ...S.input, cursor: 'pointer' }}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ ...S.input, cursor: 'pointer' }}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Duration (minutes)</label>
                  <input type="number" min={1} value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) || 15 })} style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Topic</label>
                  <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="e.g., greetings" style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Tags</label>
                  <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Comma-separated" style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Cover Image URL</label>
                  <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" style={S.input} />
                </div>
              </div>
            </div>

            {/* Block count summary */}
            <div style={{ ...S.card, padding: '14px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#5a6880', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Content Summary</div>
              <div style={{ fontSize: 13, color: '#8b9cb8' }}>{items.length} item{items.length !== 1 ? 's' : ''} total</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/admin/lessons" style={{ flex: 1, textDecoration: 'none' }}>
                <button type="button" style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #2a2d3a', borderRadius: 9, color: '#5a6880', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </Link>
              <button type="submit" disabled={saving} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 9, color: 'white', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                <Save size={14} /> {saving ? 'Saving…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
