'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllQuizzes, deleteQuiz } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { Quiz } from '@/types';
import { Plus, Edit3, Trash2, Search } from 'lucide-react';

const S = {
  card: { background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, overflow: 'hidden' } as React.CSSProperties,
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '8px 12px', outline: 'none', width: '100%' } as React.CSSProperties,
  select: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '8px 12px', cursor: 'pointer', outline: 'none' } as React.CSSProperties,
  th: { padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#3a4050', textTransform: 'uppercase' as const, letterSpacing: '0.08em', textAlign: 'left' as const, borderBottom: '1px solid #1e2130' },
  td: { padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #0f1117', verticalAlign: 'middle' as const },
};

const diffBadge: Record<string, React.CSSProperties> = {
  beginner:     { background: '#064e3b', color: '#6ee7b7', border: '1px solid #10b981' },
  intermediate: { background: '#2d1b00', color: '#fbbf24', border: '1px solid #f59e0b' },
  advanced:     { background: '#450a0a', color: '#fca5a5', border: '1px solid #ef4444' },
};

export default function AdminQuizzesPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    getAllQuizzes().then(setQuizzes).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`) || !user) return;
    setDeleting(id);
    try {
      await deleteQuiz(id, title, user.uid, user.displayName || 'Admin');
      setQuizzes(prev => prev.filter(q => q.id !== id));
    } catch { alert('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const filtered = quizzes.filter(q => {
    const ms = q.title.toLowerCase().includes(search.toLowerCase());
    const md = diffFilter === 'all' || q.difficulty === diffFilter;
    return ms && md;
  });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>Quizzes</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#5a6880' }}>{filtered.length} of {quizzes.length} quizzes</p>
        </div>
        <Link href="/admin/quizzes/new" style={{ textDecoration: 'none' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            <Plus size={15} /> Create Quiz
          </button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#3a4050' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quizzes…" style={{ ...S.input, paddingLeft: 32 }} />
        </div>
        <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)} style={S.select}>
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div style={S.card}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#5a6880', fontSize: 14 }}>No quizzes found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Title</th>
                <th style={S.th}>Difficulty</th>
                <th style={S.th}>Questions</th>
                <th style={S.th}>XP Reward</th>
                <th style={S.th}>Type</th>
                <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(quiz => (
                <tr key={quiz.id}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0f1117')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: '#dce4f0' }}>{quiz.title}</div>
                    <div style={{ fontSize: 12, color: '#5a6880', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>{quiz.description}</div>
                  </td>
                  <td style={S.td}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, ...(diffBadge[quiz.difficulty] || diffBadge.beginner) }}>
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td style={{ ...S.td, color: '#5a6880' }}>{quiz.questions?.length || quiz.totalQuestions || 0}</td>
                  <td style={S.td}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#1a2535', color: '#c4b5fd', border: '1px solid #3a2a50' }}>{quiz.xpReward || 10} XP</span>
                  </td>
                  <td style={{ ...S.td, color: '#5a6880' }}>{quiz.type || 'mixed'}</td>
                  <td style={{ ...S.td, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <Link href={`/admin/quizzes/${quiz.id}`} style={{ textDecoration: 'none' }}>
                        <button style={{ padding: '5px 10px', background: '#1a2535', border: 'none', borderRadius: 7, color: '#7dd3fc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <Edit3 size={12} /> Edit
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(quiz.id, quiz.title)} disabled={deleting === quiz.id} style={{ padding: '5px 8px', background: 'transparent', border: '1px solid #2a2d3a', borderRadius: 7, color: '#4a5c70', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
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
