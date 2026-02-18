'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Lesson, VocabularyItem } from '@/types';
import { getLessonById, updateUserProgress } from '@/lib/firestore';
import {
  ArrowLeftIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { ContentItem, deserializeItems } from '@/components/editor/LessonBuilder';

// ── Inline block renderers for the student view ───────────────────────────────

function getYoutubeId(url: string) { return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] ?? null; }
function getVimeoId(url: string)   { return url.match(/vimeo\.com\/(\d+)/)?.[1] ?? null; }

const CALLOUT_STYLES: Record<string, { bg: string; border: string; accent: string; icon: string }> = {
  info:    { bg: '#eff6ff', border: '#3b82f6', accent: '#1d4ed8', icon: 'ℹ️' },
  tip:     { bg: '#f0fdf4', border: '#22c55e', accent: '#15803d', icon: '💡' },
  warning: { bg: '#fffbeb', border: '#f59e0b', accent: '#b45309', icon: '⚠️' },
  danger:  { bg: '#fef2f2', border: '#ef4444', accent: '#b91c1c', icon: '🚨' },
};

function StudentBlock({ item }: { item: ContentItem }) {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  if (item.kind === 'text') {
    return (
      <div
        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: item.html || '' }}
      />
    );
  }

  switch (item.blockType) {
    case 'image':
      return item.src ? (
        <figure className="my-0">
          <img src={item.src} alt={item.alt || ''} className="max-w-full rounded-xl" />
          {item.caption && <figcaption className="text-center text-sm text-zinc-500 mt-2 italic">{item.caption}</figcaption>}
        </figure>
      ) : null;

    case 'video': {
      const ytId = item.videoUrl ? getYoutubeId(item.videoUrl) : null;
      const vmId = item.videoUrl ? getVimeoId(item.videoUrl) : null;
      if (ytId) return <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}><iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full border-0" allowFullScreen /></div>;
      if (vmId) return <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}><iframe src={`https://player.vimeo.com/video/${vmId}`} className="w-full h-full border-0" allowFullScreen /></div>;
      if (item.videoUrl) return <video controls src={item.videoUrl} className="w-full rounded-xl" />;
      return null;
    }

    case 'audio':
      return item.audioUrl ? (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3 mb-3">
            <SpeakerWaveIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-zinc-900 dark:text-white">{item.audioTitle || 'Audio'}</span>
          </div>
          <audio controls className="w-full"><source src={item.audioUrl} /></audio>
        </div>
      ) : null;

    case 'quiz': {
      const questions = item.questions || [];
      if (!questions.length) return null;
      const score = quizSubmitted ? questions.reduce((a, q) => a + (quizAnswers[q.id] === q.correctAnswer ? q.points : 0), 0) : 0;
      const total = questions.reduce((a, q) => a + q.points, 0);
      const passed = score / total >= (item.passingScore || 70) / 100;
      return (
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <h3 className="font-bold text-zinc-900 dark:text-white text-lg">{item.quizTitle || 'Quiz'}</h3>
          </div>
          <div className="p-6 space-y-6">
            {quizSubmitted && (
              <div className={`p-4 rounded-xl text-center ${passed ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'}`}>
                <div className={`text-2xl font-bold ${passed ? 'text-emerald-600' : 'text-red-600'}`}>{score} / {total} points</div>
                <div className="text-sm text-zinc-500 mt-1">{passed ? '✓ Passed!' : '✗ Try again'}</div>
              </div>
            )}
            {questions.map((q, qi) => {
              const answered = quizAnswers[q.id];
              const isCorrect = answered === q.correctAnswer;
              return (
                <div key={q.id} className="space-y-3">
                  <p className="font-semibold text-zinc-900 dark:text-white">Q{qi + 1}. {q.question}</p>
                  {(q.type === 'multipleChoice' || q.type === 'trueFalse') && (
                    <div className="space-y-2">
                      {(q.options || []).map((opt, oi) => {
                        const isSel = answered === opt;
                        const showOk = quizSubmitted && opt === q.correctAnswer;
                        const showBad = quizSubmitted && isSel && !isCorrect;
                        return (
                          <button key={oi} type="button" onClick={() => !quizSubmitted && setQuizAnswers(a => ({ ...a, [q.id]: opt }))} className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${showOk ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : showBad ? 'bg-red-50 border-red-400 text-red-700 dark:bg-red-900/20 dark:text-red-400' : isSel ? 'bg-primary/5 border-primary text-primary' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-primary/50'}`} disabled={quizSubmitted}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {q.type === 'fillInBlank' && (
                    <input value={quizAnswers[q.id] || ''} onChange={e => !quizSubmitted && setQuizAnswers(a => ({ ...a, [q.id]: e.target.value }))} placeholder="Your answer…" disabled={quizSubmitted} className={`w-full px-4 py-3 rounded-xl border-2 text-sm ${quizSubmitted ? (isCorrect ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50') : 'border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800'} focus:outline-none`} />
                  )}
                  {quizSubmitted && q.explanation && (
                    <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
            {!quizSubmitted
              ? <button type="button" onClick={() => setQuizSubmitted(true)} className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">Submit Quiz</button>
              : <button type="button" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }} className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl font-semibold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Try Again</button>}
          </div>
        </div>
      );
    }

    case 'flashcard': {
      const cards = item.cards || [];
      if (!cards.length) return null;
      const card = cards[cardIdx];
      return (
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <h3 className="font-bold text-zinc-900 dark:text-white">{item.flashcardTitle || 'Flashcards'}</h3>
            <span className="text-sm text-zinc-500">{cardIdx + 1} / {cards.length}</span>
          </div>
          <div className="p-6">
            <div onClick={() => setCardFlipped(f => !f)} className="cursor-pointer" style={{ perspective: 1000 }}>
              <div style={{ position: 'relative', paddingBottom: '50%', transformStyle: 'preserve-3d', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.5s' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/5 border-2 border-primary/20 rounded-xl p-6" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="text-xs font-semibold text-primary uppercase tracking-widest">Darija</div>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white text-center" style={{ fontFamily: 'serif' }}>{card.front}</div>
                  <div className="text-xs text-zinc-400">tap to flip</div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl p-6" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">English</div>
                  <div className="text-2xl font-semibold text-zinc-900 dark:text-white text-center">{card.back}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => { setCardIdx(i => Math.max(0, i - 1)); setCardFlipped(false); }} disabled={cardIdx === 0} className="flex-1 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-sm font-medium disabled:opacity-40">← Prev</button>
              <button type="button" onClick={() => setCardFlipped(f => !f)} className="flex-1 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold">Flip</button>
              <button type="button" onClick={() => { setCardIdx(i => Math.min(cards.length - 1, i + 1)); setCardFlipped(false); }} disabled={cardIdx === cards.length - 1} className="flex-1 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-sm font-medium disabled:opacity-40">Next →</button>
            </div>
          </div>
        </div>
      );
    }

    case 'accordion': {
      const items2 = item.items || [];
      return (
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-700">
          {items2.map(it => (
            <div key={it.id}>
              <button type="button" onClick={() => setOpenAccordion(openAccordion === it.id ? null : it.id)} className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <span className="font-semibold text-zinc-900 dark:text-white">{it.title}</span>
                <span className="text-zinc-400">{openAccordion === it.id ? '▲' : '▼'}</span>
              </button>
              {openAccordion === it.id && <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{it.content}</div>}
            </div>
          ))}
        </div>
      );
    }

    case 'callout': {
      const cs = CALLOUT_STYLES[item.calloutType || 'info'];
      return (
        <div style={{ padding: '14px 18px', background: cs.bg, border: `1px solid ${cs.border}`, borderRadius: 12, borderLeft: `4px solid ${cs.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><span>{cs.icon}</span><span style={{ fontSize: 14, fontWeight: 700, color: cs.accent }}>{item.calloutTitle}</span></div>
          <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.65 }}>{item.calloutText}</p>
        </div>
      );
    }

    case 'divider':
      return <hr className="border-zinc-200 dark:border-zinc-700" />;

    case 'file':
      return item.fileUrl ? (
        <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
            <BookOpenIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-zinc-900 dark:text-white">{item.fileName || 'File'}</div>
            {item.fileSize && <div className="text-sm text-zinc-500">{item.fileSize}</div>}
          </div>
          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg text-sm font-semibold hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors">
            Download
          </a>
        </div>
      ) : null;

    default: return null;
  }
}

// ── Main lesson player ────────────────────────────────────────────────────────

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  const lessonId = params.id as string;

  useEffect(() => {
    getLessonById(lessonId).then(data => {
      setLesson(data);
      if (data) {
        // Parse content items
        if (data.contentJson && typeof data.contentJson === 'string') {
          const items = deserializeItems(data.contentJson);
          setContentItems(items);
        } else if (data.contentHtml) {
          // Legacy HTML
          setContentItems([{ id: 'legacy', kind: 'text', html: data.contentHtml }]);
        }
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [lessonId]);

  const handleComplete = async () => {
    if (!user || !lesson) return;
    try {
      await updateUserProgress(user.uid, lessonId, undefined, 20);
      router.push('/lessons');
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) new Audio(audioUrl).play();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Lesson not found</h2>
          <Link href="/lessons"><Button variant="outline">Back to Lessons</Button></Link>
        </div>
      </div>
    );
  }

  const vocabulary = lesson.content?.vocabulary || [];
  const sentences = lesson.content?.sentences || [];
  const isCompleted = userProfile?.completedLessons?.includes(lessonId);
  const hasContent = contentItems.length > 0 || vocabulary.length > 0 || sentences.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <div className="mb-6">
          <Link href="/lessons" className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Lessons
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant={lesson.difficulty === 'beginner' ? 'success' : lesson.difficulty === 'intermediate' ? 'warning' : 'danger'}>
              {lesson.difficulty}
            </Badge>
            {isCompleted && (
              <Badge variant="success" className="flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{lesson.title}</h1>
          <p className="text-zinc-600 dark:text-zinc-400">{lesson.description}</p>
        </div>

        {/* Content stream */}
        <div className="space-y-6">
          {contentItems.map(item => (
            <StudentBlock key={item.id} item={item} />
          ))}

          {/* Legacy vocabulary section */}
          {vocabulary.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center">
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  Vocabulary
                </h2>
                <span className="text-sm text-zinc-500">{vocabulary.length} words</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {vocabulary.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">{item.word}</div>
                      <div className="text-sm text-zinc-500">{item.transliteration}</div>
                      <div className="text-sm text-primary">{item.translation}</div>
                      {item.arabic && <div className="text-lg text-zinc-700 dark:text-zinc-300" dir="rtl">{item.arabic}</div>}
                    </div>
                    {item.audioUrl && (
                      <button onClick={() => playAudio(item.audioUrl)} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                        <SpeakerWaveIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy sentences */}
          {sentences.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Sentences</h2>
              <div className="space-y-3">
                {sentences.map((sentence, index) => (
                  <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-white">{sentence}</div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!hasContent && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-12 text-center">
              <BookOpenIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-zinc-500">No content available for this lesson yet.</p>
              <p className="text-sm text-zinc-400 mt-2">The admin is still working on this lesson.</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {!isCompleted ? (
              <Button onClick={handleComplete} className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Mark as Complete (+20 XP)
              </Button>
            ) : (
              <Button onClick={() => router.push('/lessons')} variant="outline" className="flex items-center justify-center">
                Back to Lessons
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
