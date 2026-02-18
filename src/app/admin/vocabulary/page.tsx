'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllVocabulary, deleteVocabulary, bulkCreateVocabulary } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { VocabularyItem } from '@/types';
import { Plus, Edit3, Trash2, Search, Upload, X } from 'lucide-react';

const S = {
  card: { background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, overflow: 'hidden' } as React.CSSProperties,
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '8px 12px', outline: 'none', width: '100%' } as React.CSSProperties,
  select: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '8px 12px', cursor: 'pointer', outline: 'none' } as React.CSSProperties,
  th: { padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#3a4050', textTransform: 'uppercase' as const, letterSpacing: '0.08em', textAlign: 'left' as const, borderBottom: '1px solid #1e2130' },
  td: { padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #0f1117', verticalAlign: 'middle' as const },
};

const CATEGORIES = ['greetings', 'numbers', 'family', 'food', 'phrases', 'travel', 'shopping', 'time', 'weather', 'other'];

export default function AdminVocabularyPage() {
  const { user } = useAuth();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    getAllVocabulary().then(setVocabulary).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, word: string) => {
    if (!confirm(`Delete "${word}"?`) || !user) return;
    setDeleting(id);
    try {
      await deleteVocabulary(id, word, user.uid, user.displayName || 'Admin');
      setVocabulary(prev => prev.filter(v => v.id !== id));
    } catch { alert('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const handleBulkImport = async () => {
    if (!user || !bulkText.trim()) return;
    setImporting(true);
    try {
      const lines = bulkText.split('\n').filter(l => l.trim());
      const items: Omit<VocabularyItem, 'id'>[] = lines.map(line => {
        const [word, transliteration, translation, arabic, category] = line.split('\t');
        return { word: word?.trim() || '', transliteration: transliteration?.trim() || word?.trim() || '', translation: translation?.trim() || '', arabic: arabic?.trim() || '', category: category?.trim() || 'other', difficulty: 'beginner' };
      }).filter(i => i.word);
      const count = await bulkCreateVocabulary(items, user.uid, user.displayName || 'Admin');
      alert(`Imported ${count} words!`);
      setShowBulk(false); setBulkText('');
      window.location.reload();
    } catch { alert('Import failed'); }
    finally { setImporting(false); }
  };

  const filtered = vocabulary.filter(v => {
    const ms = v.word.toLowerCase().includes(search.toLowerCase()) || v.translation?.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === 'all' || v.category === catFilter;
    return ms && mc;
  });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>Vocabulary</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#5a6880' }}>{filtered.length} of {vocabulary.length} words</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowBulk(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10, color: '#7dd3fc', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            <Upload size={14} /> Bulk Import
          </button>
          <Link href="/admin/vocabulary/new" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              <Plus size={15} /> Add Word
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#3a4050' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vocabulary…" style={{ ...S.input, paddingLeft: 32 }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={S.select}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {/* Bulk Import Panel */}
      {showBulk && (
        <div style={{ background: '#0c0e16', border: '1px solid #6ee7b7', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>Bulk Import</h3>
            <button onClick={() => setShowBulk(false)} style={{ background: 'transparent', border: 'none', color: '#5a6880', cursor: 'pointer' }}><X size={16} /></button>
          </div>
          <p style={{ fontSize: 12, color: '#5a6880', marginBottom: 10 }}>Tab-separated: word, transliteration, translation, arabic (optional), category</p>
          <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={6} placeholder={"Salam\tHello\tسلام\tgreetings"} style={{ ...S.input, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={handleBulkImport} disabled={importing} style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 9, color: 'white', fontWeight: 600, fontSize: 13, cursor: importing ? 'not-allowed' : 'pointer', opacity: importing ? 0.6 : 1 }}>
              {importing ? 'Importing…' : `Import ${bulkText.split('\n').filter(l => l.trim()).length} Words`}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={S.card}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#5a6880', fontSize: 14 }}>No vocabulary found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Word</th>
                <th style={S.th}>Transliteration</th>
                <th style={S.th}>Translation</th>
                <th style={S.th}>Arabic</th>
                <th style={S.th}>Category</th>
                <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0f1117')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ ...S.td, fontWeight: 600, color: '#dce4f0' }}>{item.word}</td>
                  <td style={{ ...S.td, color: '#8b9cb8' }}>{item.transliteration}</td>
                  <td style={{ ...S.td, color: '#8b9cb8' }}>{item.translation}</td>
                  <td style={{ ...S.td, color: '#8b9cb8', direction: 'rtl', fontFamily: 'serif' }}>{item.arabic}</td>
                  <td style={S.td}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#1a2535', color: '#7dd3fc', border: '1px solid #2a3a50' }}>{item.category}</span>
                  </td>
                  <td style={{ ...S.td, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <Link href={`/admin/vocabulary/${item.id}`} style={{ textDecoration: 'none' }}>
                        <button style={{ padding: '5px 10px', background: '#1a2535', border: 'none', borderRadius: 7, color: '#7dd3fc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <Edit3 size={12} /> Edit
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(item.id, item.word)} disabled={deleting === item.id} style={{ padding: '5px 8px', background: 'transparent', border: '1px solid #2a2d3a', borderRadius: 7, color: '#4a5c70', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
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
