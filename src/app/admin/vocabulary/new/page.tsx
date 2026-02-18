'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createVocabulary } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { uploadAudioFile } from '@/lib/audio';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['greetings', 'numbers', 'family', 'food', 'phrases', 'travel', 'shopping', 'time', 'weather', 'other'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const S = {
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6880', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 },
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%' } as React.CSSProperties,
  card: { background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 22px' } as React.CSSProperties,
};

export default function NewVocabularyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    word: '', transliteration: '', translation: '', arabic: '',
    category: 'greetings', difficulty: 'beginner',
    example: '', exampleTranslation: '', audioUrl: '',
  });

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Audio file must be less than 5MB'); return; }
    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));
  };

  const removeAudio = () => {
    setAudioFile(null); setAudioPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let audioUrl = form.audioUrl;
      if (audioFile) {
        setUploading(true);
        try { audioUrl = await uploadAudioFile(audioFile, user.uid) || ''; }
        catch (err) { alert(`Audio upload failed: ${err}`); setUploading(false); return; }
        setUploading(false);
      }
      await createVocabulary({ ...form, audioUrl }, user.uid, user.displayName || 'Admin');
      router.push('/admin/vocabulary');
    } catch { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/admin/vocabulary" style={{ display: 'flex', padding: 6, background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 8, color: '#5a6880', textDecoration: 'none' }}>
          <ArrowLeft size={16} />
        </Link>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>Add New Word</h1>
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

              {/* Audio Upload */}
              <div>
                <label style={S.label}>Audio Pronunciation (optional)</label>
                {audioPreview || form.audioUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9 }}>
                    <audio controls style={{ flex: 1, height: 36 }}>
                      <source src={audioPreview || form.audioUrl} />
                    </audio>
                    <button type="button" onClick={removeAudio} style={{ background: 'transparent', border: 'none', color: '#5a6880', cursor: 'pointer', display: 'flex' }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed #2a2d3a', borderRadius: 9, padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                    <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleAudioChange} style={{ display: 'none' }} />
                    <Upload size={24} style={{ color: '#3a4050', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 12, color: '#5a6880', margin: 0 }}>Click to upload audio (MP3, WAV, max 5MB)</p>
                  </div>
                )}
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
              <button type="submit" disabled={saving || uploading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 9, color: 'white', fontSize: 13, fontWeight: 700, cursor: (saving || uploading) ? 'not-allowed' : 'pointer', opacity: (saving || uploading) ? 0.7 : 1 }}>
                <Save size={14} /> {uploading ? 'Uploading…' : saving ? 'Saving…' : 'Save Word'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
