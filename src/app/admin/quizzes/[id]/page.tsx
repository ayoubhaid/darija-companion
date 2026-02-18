'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getQuizById, createQuiz, updateQuiz } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { Question } from '@/types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const Q_TYPES = ['multipleChoice', 'fillInTheBlank', 'trueFalse', 'matching'];
const Q_TYPE_LABELS: Record<string, string> = { multipleChoice: 'Multiple Choice', fillInTheBlank: 'Fill in Blank', trueFalse: 'True / False', matching: 'Matching' };

const S = {
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6880', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 },
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#dce4f0', fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%' } as React.CSSProperties,
  card: { background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 22px' } as React.CSSProperties,
  qCard: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 12, padding: '16px 18px' } as React.CSSProperties,
};

export default function QuizFormPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const isEditing = !!params.id;
  const quizId = params.id as string;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'beginner', xpReward: 20, passingScore: 70, questions: [] as Question[] });

  useEffect(() => {
    if (!isEditing) return;
    getQuizById(quizId).then(quiz => {
      if (quiz) setForm({ title: quiz.title || '', description: quiz.description || '', difficulty: quiz.difficulty || 'beginner', xpReward: quiz.xpReward || 20, passingScore: quiz.passingScore || 70, questions: quiz.questions || [] });
    }).catch(console.error).finally(() => setLoading(false));
  }, [isEditing, quizId]);

  const addQuestion = () => setForm(f => ({ ...f, questions: [...f.questions, { question: '', type: 'multipleChoice', options: ['', '', '', ''], correctAnswer: '', points: 10, explanation: '' }] }));
  const removeQuestion = (i: number) => setForm(f => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }));
  const updateQ = (i: number, field: keyof Question, val: any) => setForm(f => { const qs = [...f.questions]; qs[i] = { ...qs[i], [field]: val }; return { ...f, questions: qs }; });
  const updateOpt = (qi: number, oi: number, val: string) => setForm(f => { const qs = [...f.questions]; if (qs[qi].options) qs[qi].options![oi] = val; return { ...f, questions: qs }; });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const data = { ...form, type: 'mixed' as const, timeLimit: 300, isAdaptive: false, totalQuestions: form.questions.length };
      if (isEditing) { await updateQuiz(quizId, data as any, user.uid, user.displayName || 'Admin'); }
      else { await createQuiz(data as any, user.uid, user.displayName || 'Admin'); }
      router.push('/admin/quizzes');
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
        <Link href="/admin/quizzes" style={{ display: 'flex', padding: 6, background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 8, color: '#5a6880', textDecoration: 'none' }}>
          <ArrowLeft size={16} />
        </Link>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>{isEditing ? 'Edit Quiz' : 'Create Quiz'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={S.card}>
              <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>Quiz Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={S.label}>Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Greetings Quiz" style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Quiz description" rows={2} style={{ ...S.input, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={S.label}>Difficulty</label>
                    <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} style={{ ...S.input, cursor: 'pointer' }}>
                      {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>XP Reward</label>
                    <input type="number" value={form.xpReward} onChange={e => setForm({ ...form, xpReward: parseInt(e.target.value) || 20 })} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Passing Score %</label>
                    <input type="number" value={form.passingScore} onChange={e => setForm({ ...form, passingScore: parseInt(e.target.value) || 70 })} style={S.input} />
                  </div>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>Questions ({form.questions.length})</h2>
                <button type="button" onClick={addQuestion} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: 8, color: '#6ee7b7', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <Plus size={13} /> Add Question
                </button>
              </div>
              {form.questions.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#5a6880', fontSize: 13, padding: '32px 0' }}>No questions yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {form.questions.map((q, qi) => (
                    <div key={qi} style={S.qCard}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#5a6880' }}>Question {qi + 1}</span>
                        <button type="button" onClick={() => removeQuestion(qi)} style={{ background: 'transparent', border: 'none', color: '#4a5c70', cursor: 'pointer', display: 'flex' }}><Trash2 size={14} /></button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                          <label style={S.label}>Question Text</label>
                          <input required value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} placeholder="Enter question" style={S.input} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 10 }}>
                          <div>
                            <label style={S.label}>Type</label>
                            <select value={q.type} onChange={e => updateQ(qi, 'type', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                              {Q_TYPES.map(t => <option key={t} value={t}>{Q_TYPE_LABELS[t]}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={S.label}>Points</label>
                            <input type="number" value={q.points} onChange={e => updateQ(qi, 'points', parseInt(e.target.value) || 10)} style={S.input} />
                          </div>
                        </div>
                        {(q.type === 'multipleChoice' || q.type === 'trueFalse') && (
                          <div>
                            <label style={S.label}>Options (select correct)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {(q.type === 'trueFalse' ? ['True', 'False'] : (q.options || ['', '', '', ''])).map((opt, oi) => (
                                <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === opt} onChange={() => updateQ(qi, 'correctAnswer', opt)} style={{ cursor: 'pointer', accentColor: '#10b981' }} />
                                  <input type="text" value={opt} onChange={e => q.type !== 'trueFalse' && updateOpt(qi, oi, e.target.value)} placeholder={q.type === 'trueFalse' ? opt : `Option ${oi + 1}`} disabled={q.type === 'trueFalse'} style={{ ...S.input, opacity: q.type === 'trueFalse' ? 0.6 : 1 }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {q.type === 'fillInTheBlank' && (
                          <div>
                            <label style={S.label}>Correct Answer</label>
                            <input value={q.correctAnswer} onChange={e => updateQ(qi, 'correctAnswer', e.target.value)} placeholder="The correct answer" style={S.input} />
                          </div>
                        )}
                        <div>
                          <label style={S.label}>Explanation</label>
                          <input value={q.explanation} onChange={e => updateQ(qi, 'explanation', e.target.value)} placeholder="Explain the correct answer" style={S.input} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={S.card}>
            <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/admin/quizzes" style={{ textDecoration: 'none' }}>
                <button type="button" style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #2a2d3a', borderRadius: 9, color: '#5a6880', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </Link>
              <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 9, color: 'white', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                <Save size={14} /> {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Quiz'}
              </button>
            </div>
            <div style={{ marginTop: 16, padding: '12px', background: '#0f1117', borderRadius: 9, fontSize: 12, color: '#5a6880' }}>
              <div style={{ marginBottom: 6 }}>Questions: <span style={{ color: '#dce4f0', fontWeight: 600 }}>{form.questions.length}</span></div>
              <div style={{ marginBottom: 6 }}>XP Reward: <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{form.xpReward}</span></div>
              <div>Passing: <span style={{ color: '#6ee7b7', fontWeight: 600 }}>{form.passingScore}%</span></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
