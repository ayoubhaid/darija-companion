'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getLessonById, createLesson, updateLesson } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const TipTapEditor = dynamic(() => import('@/components/editor/TipTapEditor'), { ssr: false });

const S = {
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6880', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 },
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%' } as React.CSSProperties,
  card: { background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 22px' } as React.CSSProperties,
};

export default function LessonFormPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const isEditing = !!params.id;
  const lessonId = params.id as string;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [initialDataLoaded, setInitialDataLoaded] = useState(!isEditing);
  const [form, setForm] = useState({
    title: '', description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    status: 'draft' as 'draft' | 'published',
    duration: 15, topic: '', tags: '', imageUrl: '',
  });

  useEffect(() => {
    if (!isEditing) return;
    getLessonById(lessonId).then(lesson => {
      if (lesson) {
        const html = lesson.contentHtml || (typeof lesson.contentJson === 'string' ? lesson.contentJson : '') || '';
        setEditorContent(html);
        setForm({
          title: lesson.title || '',
          description: lesson.description || '',
          difficulty: lesson.difficulty || 'beginner',
          status: (lesson.status as any) || 'draft',
          duration: lesson.duration || 15,
          topic: lesson.topic || '',
          tags: lesson.tags?.join(', ') || '',
          imageUrl: lesson.imageUrl || '',
        });
      }
    }).catch(console.error).finally(() => { setLoading(false); setInitialDataLoaded(true); });
  }, [isEditing, lessonId]);

  const handleEditorChange = useCallback((html: string) => setEditorContent(html), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const data = {
        title: form.title, description: form.description,
        contentJson: editorContent, contentHtml: editorContent,
        difficulty: form.difficulty, status: form.status,
        duration: form.duration, topic: form.topic,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        imageUrl: form.imageUrl,
        content: { vocabulary: [], sentences: [], exercises: [] },
      };
      if (isEditing) {
        await updateLesson(lessonId, data as any, user.uid, user.displayName || 'Admin');
      } else {
        await createLesson(data as any, user.uid, user.displayName || 'Admin');
      }
      router.push('/admin/lessons');
    } catch { alert('Failed to save lesson'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/admin/lessons" style={{ display: 'flex', padding: 6, background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 8, color: '#5a6880', textDecoration: 'none' }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>{isEditing ? 'Edit Lesson' : 'New Lesson'}</h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#5a6880' }}>{isEditing ? 'Update lesson content' : 'Create a new lesson'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={S.card}>
              <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>Lesson Content</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={S.label}>Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter lesson title" style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description" rows={3} style={{ ...S.input, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={S.label}>Content</label>
                  {initialDataLoaded ? (
                    <TipTapEditor
                      key={isEditing ? lessonId : 'new'}
                      content={editorContent}
                      onChange={handleEditorChange}
                      placeholder="Start writing your lesson content…"
                    />
                  ) : (
                    <div style={{ minHeight: 300, background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6880', fontSize: 13 }}>
                      Loading editor…
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                  <label style={S.label}>Image URL</label>
                  <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" style={S.input} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/admin/lessons" style={{ flex: 1, textDecoration: 'none' }}>
                <button type="button" style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #2a2d3a', borderRadius: 9, color: '#5a6880', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </Link>
              <button type="submit" disabled={saving} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 9, color: 'white', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                <Save size={14} /> {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
