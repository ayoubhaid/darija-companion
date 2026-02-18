'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAllVocabulary, createVocabulary, updateVocabulary } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['greetings', 'numbers', 'family', 'food', 'phrases', 'travel', 'shopping', 'time', 'weather', 'other'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const S = {
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6880', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 },
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%' } as React.CSSProperties,
  card: { background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 22px' } as React.CSSProperties,
};

export default function VocabularyFormPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const isEditing = !!params.id;
  const vocabId = params.id as string;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    word: '', transliteration: '', translation: '', arabic: '',
    category: 'greetings', difficulty: 'beginner',
    example: '', exampleTranslation: '',
  });

  useEffect(() => {
    if (!isEditing) return;
    getAllVocabulary().then(all => {
      const v = all.find(x => x.id === vocabId);
      if (v) setForm({ word: v.word || '', transliteration: v.transliteration || '', translation: v.translation || '', arabic: v.arabic || '', category: v.category || 'greetings', difficulty: v.difficulty || 'beginner', example: v.example || '', exampleTranslation: v.exampleTranslation || '' });
    }).catch(console.error).finally(() => setLoading(false));
  }, [isEditing, vocabId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      if (isEditing) {
        await updateVocabulary(vocabId, form, user.uid, user.displayName || 'Admin');
      } else {
        await createVocabulary(form, user.uid, user.displayName || 'Admin');
      }
      router.push('/admin/vocabulary');
    } catch { alert('Failed to save'); }
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/admin/vocabulary" style={{ display: 'flex', padding: 6, background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 8, color: '#5a6880', textDecoration: 'none' }}>
          <ArrowLeft size={16} />
        </Link>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>{isEditing ? 'Edit Word' : 'Add New Word'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ maxWidth: 640 }}>
          <div style={S.card}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={S.label}>Word (Darija) *</label>
                  <input required value={form.word} onChange={e => setForm({ ...form, word: e.target.value })} placeholder="e.g., Salam" style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Arabic Script</label>
                  <input value={form.arabic} onChange={e => setForm({ ...form, arabic: e.target.value })} placeholder="e.g., سلام" dir="rtl" style={{ ...S.input, fontFamily: 'serif' }} />
                </div>
              </div>
              <div>
                <label style={S.label}>Transliteration</label>
                <input value={form.transliteration} onChange={e => setForm({ ...form, transliteration: e.target.value })} placeholder="Phonetic spelling" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Translation (English) *</label>
                <input required value={form.translation} onChange={e => setForm({ ...form, translation: e.target.value })} placeholder="e.g., Hello/Peace" style={S.input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={S.label}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...S.input, cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Difficulty</label>
                  <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} style={{ ...S.input, cursor: 'pointer' }}>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={S.label}>Example Sentence</label>
                <input value={form.example} onChange={e => setForm({ ...form, example: e.target.value })} placeholder="e.g., Salam, kif dayr?" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Example Translation</label>
                <input value={form.exampleTranslation} onChange={e => setForm({ ...form, exampleTranslation: e.target.value })} placeholder="e.g., Hello, how are you?" style={S.input} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <Link href="/admin/vocabulary" style={{ textDecoration: 'none' }}>
                <button type="button" style={{ padding: '9px 20px', background: 'transparent', border: '1px solid #2a2d3a', borderRadius: 9, color: '#5a6880', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </Link>
              <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 9, color: 'white', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                <Save size={14} /> {saving ? 'Saving…' : 'Save Word'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
