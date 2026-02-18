'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Plus, Trash2, GripVertical, Copy, ChevronDown, ChevronUp,
  Type, Image as ImageIcon, Video, Music, HelpCircle, Layers,
  ChevronRight, AlertCircle, Minus, Paperclip, Eye, EyeOff,
  Check, X, ArrowUp, ArrowDown, Play, Pause, Volume2,
  FileText, Zap, RotateCw, RefreshCw, Star, BookOpen,
} from 'lucide-react';

const TipTapEditor = dynamic(() => import('./TipTapEditor'), { ssr: false });

// ── Types ─────────────────────────────────────────────────────────────────────
export type BlockType =
  | 'text' | 'image' | 'video' | 'audio' | 'quiz'
  | 'flashcard' | 'accordion' | 'callout' | 'divider' | 'file';

export interface QuizQuestion {
  id: string;
  type: 'multipleChoice' | 'trueFalse' | 'fillInBlank' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  matchPairs?: { left: string; right: string }[];
}

export interface FlashCard {
  id: string;
  front: string;
  back: string;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface Block {
  id: string;
  type: BlockType;
  // text
  html?: string;
  // image
  src?: string;
  caption?: string;
  alt?: string;
  // video
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'upload';
  // audio
  audioUrl?: string;
  audioTitle?: string;
  // quiz
  quizTitle?: string;
  questions?: QuizQuestion[];
  passingScore?: number;
  // flashcard
  flashcardTitle?: string;
  cards?: FlashCard[];
  // accordion
  accordionTitle?: string;
  items?: AccordionItem[];
  // callout
  calloutType?: 'info' | 'tip' | 'warning' | 'danger';
  calloutTitle?: string;
  calloutText?: string;
  // file
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 10); }

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

// ── Block type catalog ────────────────────────────────────────────────────────
const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ElementType; color: string; desc: string }[] = [
  { type: 'text',      label: 'Rich Text',   icon: Type,        color: '#6b9bd2', desc: 'Formatted text with headings, lists, links' },
  { type: 'image',     label: 'Image',       icon: ImageIcon,   color: '#7eb8a4', desc: 'Upload or embed an image with caption' },
  { type: 'video',     label: 'Video',       icon: Video,       color: '#d4845a', desc: 'YouTube, Vimeo, or uploaded video' },
  { type: 'audio',     label: 'Audio',       icon: Music,       color: '#9b72b0', desc: 'Audio file with playback controls' },
  { type: 'quiz',      label: 'Quiz',        icon: HelpCircle,  color: '#c8a96e', desc: 'Interactive quiz with multiple question types' },
  { type: 'flashcard', label: 'Flashcards',  icon: Layers,      color: '#6ee7b7', desc: 'Flip-card deck for vocabulary practice' },
  { type: 'accordion', label: 'Accordion',   icon: ChevronRight,color: '#7dd3fc', desc: 'Expandable sections for organized content' },
  { type: 'callout',   label: 'Callout',     icon: AlertCircle, color: '#fbbf24', desc: 'Highlighted tip, info, warning, or danger box' },
  { type: 'divider',   label: 'Divider',     icon: Minus,       color: '#5a6880', desc: 'Visual separator between sections' },
  { type: 'file',      label: 'File',        icon: Paperclip,   color: '#c4b5fd', desc: 'Downloadable resource attachment' },
];

function defaultBlock(type: BlockType): Block {
  const id = uid();
  switch (type) {
    case 'text':      return { id, type, html: '' };
    case 'image':     return { id, type, src: '', caption: '', alt: '' };
    case 'video':     return { id, type, videoUrl: '', videoType: 'youtube' };
    case 'audio':     return { id, type, audioUrl: '', audioTitle: 'Audio' };
    case 'quiz':      return { id, type, quizTitle: 'Quiz', questions: [], passingScore: 70 };
    case 'flashcard': return { id, type, flashcardTitle: 'Flashcards', cards: [{ id: uid(), front: '', back: '' }] };
    case 'accordion': return { id, type, accordionTitle: 'Accordion', items: [{ id: uid(), title: 'Section 1', content: '' }] };
    case 'callout':   return { id, type, calloutType: 'info', calloutTitle: 'Note', calloutText: '' };
    case 'divider':   return { id, type };
    case 'file':      return { id, type, fileName: '', fileUrl: '', fileSize: '' };
    default:          return { id, type };
  }
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const DS = {
  input: { background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 8, color: '#dce4f0', fontSize: 13, padding: '8px 11px', outline: 'none', width: '100%' } as React.CSSProperties,
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#5a6880', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 5 },
  row: { display: 'flex', flexDirection: 'column' as const, gap: 8 },
  btn: (color = '#10b981') => ({ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 7, color, fontSize: 12, fontWeight: 600, cursor: 'pointer' } as React.CSSProperties),
};

// ── CALLOUT COLORS ────────────────────────────────────────────────────────────
const CALLOUT_STYLES: Record<string, { bg: string; border: string; accent: string; icon: string }> = {
  info:    { bg: 'rgba(107,155,210,0.1)', border: '#6b9bd2', accent: '#7dd3fc', icon: 'ℹ️' },
  tip:     { bg: 'rgba(16,185,129,0.1)',  border: '#10b981', accent: '#6ee7b7', icon: '💡' },
  warning: { bg: 'rgba(251,191,36,0.1)',  border: '#fbbf24', accent: '#fbbf24', icon: '⚠️' },
  danger:  { bg: 'rgba(239,68,68,0.1)',   border: '#ef4444', accent: '#fca5a5', icon: '🚨' },
};

// ── Block Editors ─────────────────────────────────────────────────────────────

function TextBlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  return (
    <div style={{ border: '1px solid #2a2d3a', borderRadius: 10, overflow: 'hidden' }}>
      <TipTapEditor
        content={block.html || ''}
        onChange={(html) => onChange({ ...block, html })}
        placeholder="Write your lesson content here…"
      />
    </div>
  );
}

function ImageBlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  return (
    <div style={DS.row}>
      <div>
        <label style={DS.label}>Image URL</label>
        <input value={block.src || ''} onChange={e => onChange({ ...block, src: e.target.value })} placeholder="https://example.com/image.jpg" style={DS.input} />
      </div>
      {block.src && (
        <div style={{ borderRadius: 10, overflow: 'hidden', background: '#0f1117', border: '1px solid #2a2d3a', textAlign: 'center', padding: 8 }}>
          <img src={block.src} alt={block.alt || ''} style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={DS.label}>Caption</label>
          <input value={block.caption || ''} onChange={e => onChange({ ...block, caption: e.target.value })} placeholder="Image caption…" style={DS.input} />
        </div>
        <div>
          <label style={DS.label}>Alt Text (accessibility)</label>
          <input value={block.alt || ''} onChange={e => onChange({ ...block, alt: e.target.value })} placeholder="Describe the image…" style={DS.input} />
        </div>
      </div>
    </div>
  );
}

function VideoBlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const ytId = block.videoUrl ? getYoutubeId(block.videoUrl) : null;
  const vmId = block.videoUrl ? getVimeoId(block.videoUrl) : null;

  return (
    <div style={DS.row}>
      <div>
        <label style={DS.label}>Video Type</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['youtube', 'vimeo', 'upload'] as const).map(t => (
            <button key={t} type="button" onClick={() => onChange({ ...block, videoType: t })} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: block.videoType === t ? '#6b9bd2' : '#0f1117', border: `1px solid ${block.videoType === t ? '#6b9bd2' : '#2a2d3a'}`, color: block.videoType === t ? '#0a0c14' : '#8b9cb8' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={DS.label}>{block.videoType === 'upload' ? 'Video URL' : `${block.videoType === 'youtube' ? 'YouTube' : 'Vimeo'} URL`}</label>
        <input value={block.videoUrl || ''} onChange={e => onChange({ ...block, videoUrl: e.target.value })} placeholder={block.videoType === 'youtube' ? 'https://youtube.com/watch?v=...' : block.videoType === 'vimeo' ? 'https://vimeo.com/...' : 'https://...'} style={DS.input} />
      </div>
      {ytId && (
        <div style={{ borderRadius: 10, overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
          <iframe src={`https://www.youtube.com/embed/${ytId}`} style={{ width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}
      {vmId && (
        <div style={{ borderRadius: 10, overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
          <iframe src={`https://player.vimeo.com/video/${vmId}`} style={{ width: '100%', height: '100%', border: 'none' }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        </div>
      )}
    </div>
  );
}

function AudioBlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  return (
    <div style={DS.row}>
      <div>
        <label style={DS.label}>Audio Title</label>
        <input value={block.audioTitle || ''} onChange={e => onChange({ ...block, audioTitle: e.target.value })} placeholder="e.g., Pronunciation example" style={DS.input} />
      </div>
      <div>
        <label style={DS.label}>Audio URL (MP3, WAV, OGG)</label>
        <input value={block.audioUrl || ''} onChange={e => onChange({ ...block, audioUrl: e.target.value })} placeholder="https://example.com/audio.mp3" style={DS.input} />
      </div>
      {block.audioUrl && (
        <div style={{ padding: '12px 16px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#dce4f0', marginBottom: 8 }}>{block.audioTitle || 'Audio'}</div>
          <audio controls style={{ width: '100%' }}>
            <source src={block.audioUrl} />
          </audio>
        </div>
      )}
    </div>
  );
}

function QuizBlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const questions = block.questions || [];

  const addQuestion = (type: QuizQuestion['type']) => {
    const q: QuizQuestion = { id: uid(), type, question: '', options: type === 'multipleChoice' ? ['', '', '', ''] : type === 'trueFalse' ? ['True', 'False'] : [], correctAnswer: '', explanation: '', points: 10, matchPairs: type === 'matching' ? [{ left: '', right: '' }] : undefined };
    onChange({ ...block, questions: [...questions, q] });
  };

  const updateQ = (i: number, updates: Partial<QuizQuestion>) => {
    const qs = [...questions]; qs[i] = { ...qs[i], ...updates };
    onChange({ ...block, questions: qs });
  };

  const removeQ = (i: number) => onChange({ ...block, questions: questions.filter((_, idx) => idx !== i) });

  const updateOption = (qi: number, oi: number, val: string) => {
    const qs = [...questions]; if (qs[qi].options) qs[qi].options![oi] = val;
    onChange({ ...block, questions: qs });
  };

  const addMatchPair = (qi: number) => {
    const qs = [...questions]; qs[qi].matchPairs = [...(qs[qi].matchPairs || []), { left: '', right: '' }];
    onChange({ ...block, questions: qs });
  };

  const updateMatchPair = (qi: number, pi: number, side: 'left' | 'right', val: string) => {
    const qs = [...questions]; if (qs[qi].matchPairs) qs[qi].matchPairs![pi][side] = val;
    onChange({ ...block, questions: qs });
  };

  return (
    <div style={DS.row}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10 }}>
        <div>
          <label style={DS.label}>Quiz Title</label>
          <input value={block.quizTitle || ''} onChange={e => onChange({ ...block, quizTitle: e.target.value })} placeholder="Quiz title" style={DS.input} />
        </div>
        <div>
          <label style={DS.label}>Passing Score %</label>
          <input type="number" min={0} max={100} value={block.passingScore || 70} onChange={e => onChange({ ...block, passingScore: parseInt(e.target.value) || 70 })} style={DS.input} />
        </div>
      </div>

      {/* Add question buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(['multipleChoice', 'trueFalse', 'fillInBlank', 'matching'] as const).map(t => (
          <button key={t} type="button" onClick={() => addQuestion(t)} style={DS.btn('#c8a96e')}>
            <Plus size={12} /> {t === 'multipleChoice' ? 'Multiple Choice' : t === 'trueFalse' ? 'True/False' : t === 'fillInBlank' ? 'Fill in Blank' : 'Matching'}
          </button>
        ))}
      </div>

      {questions.map((q, qi) => (
        <div key={q.id} style={{ background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#c8a96e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Q{qi + 1} · {q.type === 'multipleChoice' ? 'Multiple Choice' : q.type === 'trueFalse' ? 'True/False' : q.type === 'fillInBlank' ? 'Fill in Blank' : 'Matching'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="number" value={q.points} onChange={e => updateQ(qi, { points: parseInt(e.target.value) || 10 })} style={{ ...DS.input, width: 60, padding: '4px 8px', fontSize: 12 }} title="Points" />
              <button type="button" onClick={() => removeQ(qi)} style={{ background: 'transparent', border: 'none', color: '#4a5c70', cursor: 'pointer', display: 'flex' }}><Trash2 size={14} /></button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input value={q.question} onChange={e => updateQ(qi, { question: e.target.value })} placeholder="Question text…" style={DS.input} />

            {(q.type === 'multipleChoice' || q.type === 'trueFalse') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={DS.label}>Options (click radio to mark correct)</label>
                {(q.options || []).map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="radio" name={`q-${q.id}`} checked={q.correctAnswer === opt} onChange={() => updateQ(qi, { correctAnswer: opt })} style={{ cursor: 'pointer', accentColor: '#10b981' }} />
                    <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} disabled={q.type === 'trueFalse'} placeholder={`Option ${oi + 1}`} style={{ ...DS.input, opacity: q.type === 'trueFalse' ? 0.7 : 1 }} />
                  </div>
                ))}
                {q.type === 'multipleChoice' && (
                  <button type="button" onClick={() => updateQ(qi, { options: [...(q.options || []), ''] })} style={DS.btn('#6b9bd2')}>
                    <Plus size={11} /> Add Option
                  </button>
                )}
              </div>
            )}

            {q.type === 'fillInBlank' && (
              <div>
                <label style={DS.label}>Correct Answer</label>
                <input value={q.correctAnswer} onChange={e => updateQ(qi, { correctAnswer: e.target.value })} placeholder="The correct answer" style={DS.input} />
              </div>
            )}

            {q.type === 'matching' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={DS.label}>Matching Pairs</label>
                {(q.matchPairs || []).map((pair, pi) => (
                  <div key={pi} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center' }}>
                    <input value={pair.left} onChange={e => updateMatchPair(qi, pi, 'left', e.target.value)} placeholder="Left item" style={DS.input} />
                    <span style={{ color: '#5a6880', fontSize: 16 }}>↔</span>
                    <input value={pair.right} onChange={e => updateMatchPair(qi, pi, 'right', e.target.value)} placeholder="Right item" style={DS.input} />
                  </div>
                ))}
                <button type="button" onClick={() => addMatchPair(qi)} style={DS.btn('#9b72b0')}>
                  <Plus size={11} /> Add Pair
                </button>
              </div>
            )}

            <div>
              <label style={DS.label}>Explanation (shown after answer)</label>
              <input value={q.explanation || ''} onChange={e => updateQ(qi, { explanation: e.target.value })} placeholder="Explain the correct answer…" style={DS.input} />
            </div>
          </div>
        </div>
      ))}

      {questions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px', color: '#5a6880', fontSize: 13, border: '2px dashed #2a2d3a', borderRadius: 10 }}>
          Add questions using the buttons above
        </div>
      )}
    </div>
  );
}

function FlashcardBlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const cards = block.cards || [];

  const addCard = () => onChange({ ...block, cards: [...cards, { id: uid(), front: '', back: '' }] });
  const removeCard = (i: number) => onChange({ ...block, cards: cards.filter((_, idx) => idx !== i) });
  const updateCard = (i: number, field: 'front' | 'back', val: string) => {
    const c = [...cards]; c[i] = { ...c[i], [field]: val };
    onChange({ ...block, cards: c });
  };

  return (
    <div style={DS.row}>
      <div>
        <label style={DS.label}>Deck Title</label>
        <input value={block.flashcardTitle || ''} onChange={e => onChange({ ...block, flashcardTitle: e.target.value })} placeholder="Flashcard deck title" style={DS.input} />
      </div>
      {cards.map((card, i) => (
        <div key={card.id} style={{ background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Card {i + 1}</span>
            <button type="button" onClick={() => removeCard(i)} style={{ background: 'transparent', border: 'none', color: '#4a5c70', cursor: 'pointer', display: 'flex' }}><Trash2 size={13} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={DS.label}>Front (Darija)</label>
              <input value={card.front} onChange={e => updateCard(i, 'front', e.target.value)} placeholder="Darija word/phrase" style={{ ...DS.input, fontFamily: 'serif', fontSize: 15 }} />
            </div>
            <div>
              <label style={DS.label}>Back (English)</label>
              <input value={card.back} onChange={e => updateCard(i, 'back', e.target.value)} placeholder="English translation" style={DS.input} />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={addCard} style={DS.btn('#6ee7b7')}>
        <Plus size={12} /> Add Card
      </button>
    </div>
  );
}

function AccordionBlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const items = block.items || [];

  const addItem = () => onChange({ ...block, items: [...items, { id: uid(), title: `Section ${items.length + 1}`, content: '' }] });
  const removeItem = (i: number) => onChange({ ...block, items: items.filter((_, idx) => idx !== i) });
  const updateItem = (i: number, field: 'title' | 'content', val: string) => {
    const it = [...items]; it[i] = { ...it[i], [field]: val };
    onChange({ ...block, items: it });
  };

  return (
    <div style={DS.row}>
      <div>
        <label style={DS.label}>Accordion Title</label>
        <input value={block.accordionTitle || ''} onChange={e => onChange({ ...block, accordionTitle: e.target.value })} placeholder="Accordion title" style={DS.input} />
      </div>
      {items.map((item, i) => (
        <div key={item.id} style={{ background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} placeholder="Section title" style={{ ...DS.input, flex: 1 }} />
            <button type="button" onClick={() => removeItem(i)} style={{ background: 'transparent', border: 'none', color: '#4a5c70', cursor: 'pointer', display: 'flex', flexShrink: 0 }}><Trash2 size={13} /></button>
          </div>
          <textarea value={item.content} onChange={e => updateItem(i, 'content', e.target.value)} placeholder="Section content…" rows={3} style={{ ...DS.input, resize: 'vertical' }} />
        </div>
      ))}
      <button type="button" onClick={addItem} style={DS.btn('#7dd3fc')}>
        <Plus size={12} /> Add Section
      </button>
    </div>
  );
}

function CalloutBlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const cs = CALLOUT_STYLES[block.calloutType || 'info'];
  return (
    <div style={DS.row}>
      <div>
        <label style={DS.label}>Callout Type</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['info', 'tip', 'warning', 'danger'] as const).map(t => {
            const s = CALLOUT_STYLES[t];
            return (
              <button key={t} type="button" onClick={() => onChange({ ...block, calloutType: t })} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: block.calloutType === t ? s.bg : '#0f1117', border: `1px solid ${block.calloutType === t ? s.border : '#2a2d3a'}`, color: block.calloutType === t ? s.accent : '#8b9cb8' }}>
                {CALLOUT_STYLES[t].icon} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label style={DS.label}>Title</label>
        <input value={block.calloutTitle || ''} onChange={e => onChange({ ...block, calloutTitle: e.target.value })} placeholder="Callout title" style={DS.input} />
      </div>
      <div>
        <label style={DS.label}>Content</label>
        <textarea value={block.calloutText || ''} onChange={e => onChange({ ...block, calloutText: e.target.value })} placeholder="Callout content…" rows={3} style={{ ...DS.input, resize: 'vertical' }} />
      </div>
      {/* Preview */}
      {(block.calloutTitle || block.calloutText) && (
        <div style={{ padding: '14px 16px', background: cs.bg, border: `1px solid ${cs.border}`, borderRadius: 10, borderLeft: `4px solid ${cs.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span>{cs.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: cs.accent }}>{block.calloutTitle}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#dce4f0', lineHeight: 1.6 }}>{block.calloutText}</p>
        </div>
      )}
    </div>
  );
}

function FileBlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  return (
    <div style={DS.row}>
      <div>
        <label style={DS.label}>File Name</label>
        <input value={block.fileName || ''} onChange={e => onChange({ ...block, fileName: e.target.value })} placeholder="e.g., Lesson Notes.pdf" style={DS.input} />
      </div>
      <div>
        <label style={DS.label}>File URL</label>
        <input value={block.fileUrl || ''} onChange={e => onChange({ ...block, fileUrl: e.target.value })} placeholder="https://example.com/file.pdf" style={DS.input} />
      </div>
      <div>
        <label style={DS.label}>File Size (optional)</label>
        <input value={block.fileSize || ''} onChange={e => onChange({ ...block, fileSize: e.target.value })} placeholder="e.g., 2.4 MB" style={DS.input} />
      </div>
      {block.fileUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10 }}>
          <Paperclip size={18} style={{ color: '#c4b5fd', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#dce4f0' }}>{block.fileName || 'File'}</div>
            {block.fileSize && <div style={{ fontSize: 11, color: '#5a6880' }}>{block.fileSize}</div>}
          </div>
          <a href={block.fileUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', background: '#c4b5fd22', border: '1px solid #c4b5fd44', borderRadius: 7, color: '#c4b5fd', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            Download
          </a>
        </div>
      )}
    </div>
  );
}

// ── Preview renderers ─────────────────────────────────────────────────────────
function BlockPreview({ block }: { block: Block }) {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  switch (block.type) {
    case 'text':
      return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: block.html || '' }} style={{ color: '#dce4f0', lineHeight: 1.8 }} />;

    case 'image':
      return block.src ? (
        <figure style={{ margin: 0 }}>
          <img src={block.src} alt={block.alt || ''} style={{ maxWidth: '100%', borderRadius: 10, display: 'block' }} />
          {block.caption && <figcaption style={{ textAlign: 'center', fontSize: 12, color: '#5a6880', marginTop: 8, fontStyle: 'italic' }}>{block.caption}</figcaption>}
        </figure>
      ) : <div style={{ padding: 24, textAlign: 'center', color: '#5a6880', border: '2px dashed #2a2d3a', borderRadius: 10 }}>No image URL set</div>;

    case 'video': {
      const ytId = block.videoUrl ? getYoutubeId(block.videoUrl) : null;
      const vmId = block.videoUrl ? getVimeoId(block.videoUrl) : null;
      if (ytId) return <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9' }}><iframe src={`https://www.youtube.com/embed/${ytId}`} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen /></div>;
      if (vmId) return <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9' }}><iframe src={`https://player.vimeo.com/video/${vmId}`} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen /></div>;
      if (block.videoUrl) return <video controls src={block.videoUrl} style={{ width: '100%', borderRadius: 10 }} />;
      return <div style={{ padding: 24, textAlign: 'center', color: '#5a6880', border: '2px dashed #2a2d3a', borderRadius: 10 }}>No video URL set</div>;
    }

    case 'audio':
      return block.audioUrl ? (
        <div style={{ padding: '14px 18px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Volume2 size={16} style={{ color: '#9b72b0' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>{block.audioTitle || 'Audio'}</span>
          </div>
          <audio controls style={{ width: '100%' }}><source src={block.audioUrl} /></audio>
        </div>
      ) : <div style={{ padding: 24, textAlign: 'center', color: '#5a6880', border: '2px dashed #2a2d3a', borderRadius: 10 }}>No audio URL set</div>;

    case 'quiz': {
      const questions = block.questions || [];
      if (questions.length === 0) return <div style={{ padding: 24, textAlign: 'center', color: '#5a6880', border: '2px dashed #2a2d3a', borderRadius: 10 }}>No questions added</div>;
      const score = quizSubmitted ? questions.reduce((acc, q) => acc + (quizAnswers[q.id] === q.correctAnswer ? q.points : 0), 0) : 0;
      const total = questions.reduce((acc, q) => acc + q.points, 0);
      return (
        <div style={{ background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#f0f4ff' }}>{block.quizTitle || 'Quiz'}</h3>
          {quizSubmitted && (
            <div style={{ padding: '12px 16px', background: score / total >= (block.passingScore || 70) / 100 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${score / total >= (block.passingScore || 70) / 100 ? '#10b981' : '#ef4444'}`, borderRadius: 10, marginBottom: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: score / total >= (block.passingScore || 70) / 100 ? '#6ee7b7' : '#fca5a5' }}>{score} / {total} points</div>
              <div style={{ fontSize: 13, color: '#8b9cb8', marginTop: 4 }}>{score / total >= (block.passingScore || 70) / 100 ? '✓ Passed!' : '✗ Try again'}</div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {questions.map((q, qi) => {
              const answered = quizAnswers[q.id];
              const isCorrect = answered === q.correctAnswer;
              return (
                <div key={q.id} style={{ background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#dce4f0', marginBottom: 10 }}>Q{qi + 1}. {q.question}</div>
                  {(q.type === 'multipleChoice' || q.type === 'trueFalse') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(q.options || []).map((opt, oi) => {
                        const isSelected = answered === opt;
                        const showCorrect = quizSubmitted && opt === q.correctAnswer;
                        const showWrong = quizSubmitted && isSelected && !isCorrect;
                        return (
                          <button key={oi} type="button" onClick={() => !quizSubmitted && setQuizAnswers(a => ({ ...a, [q.id]: opt }))} style={{ padding: '10px 14px', borderRadius: 8, textAlign: 'left', cursor: quizSubmitted ? 'default' : 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s', background: showCorrect ? 'rgba(16,185,129,0.15)' : showWrong ? 'rgba(239,68,68,0.12)' : isSelected ? 'rgba(107,155,210,0.15)' : '#0c0e16', border: `1.5px solid ${showCorrect ? '#10b981' : showWrong ? '#ef4444' : isSelected ? '#6b9bd2' : '#2a2d3a'}`, color: showCorrect ? '#6ee7b7' : showWrong ? '#fca5a5' : isSelected ? '#7dd3fc' : '#dce4f0' }}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {q.type === 'fillInBlank' && (
                    <input value={quizAnswers[q.id] || ''} onChange={e => !quizSubmitted && setQuizAnswers(a => ({ ...a, [q.id]: e.target.value }))} placeholder="Your answer…" disabled={quizSubmitted} style={{ ...DS.input, borderColor: quizSubmitted ? (isCorrect ? '#10b981' : '#ef4444') : '#2a2d3a' }} />
                  )}
                  {quizSubmitted && q.explanation && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: 8, fontSize: 12, color: '#c8a96e' }}>
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {!quizSubmitted ? (
            <button type="button" onClick={() => setQuizSubmitted(true)} style={{ marginTop: 16, width: '100%', padding: '11px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Submit Quiz
            </button>
          ) : (
            <button type="button" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }} style={{ marginTop: 16, width: '100%', padding: '11px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10, color: '#8b9cb8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              <RefreshCw size={14} style={{ display: 'inline', marginRight: 6 }} /> Try Again
            </button>
          )}
        </div>
      );
    }

    case 'flashcard': {
      const cards = block.cards || [];
      if (cards.length === 0) return <div style={{ padding: 24, textAlign: 'center', color: '#5a6880', border: '2px dashed #2a2d3a', borderRadius: 10 }}>No cards added</div>;
      const card = cards[cardIndex];
      return (
        <div style={{ background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f0f4ff' }}>{block.flashcardTitle || 'Flashcards'}</h3>
            <span style={{ fontSize: 12, color: '#5a6880' }}>{cardIndex + 1} / {cards.length}</span>
          </div>
          <div onClick={() => setCardFlipped(f => !f)} style={{ cursor: 'pointer', perspective: 1000 }}>
            <div style={{ position: 'relative', paddingBottom: '60%', transformStyle: 'preserve-3d', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.5s' }}>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.25)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, padding: 20 }}>
                <div style={{ fontSize: 11, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Darija</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff', textAlign: 'center', fontFamily: 'serif' }}>{card.front}</div>
                <div style={{ fontSize: 11, color: '#5a6880' }}>tap to flip</div>
              </div>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'rgba(107,155,210,0.08)', border: '1px solid rgba(107,155,210,0.25)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, padding: 20 }}>
                <div style={{ fontSize: 11, color: '#7dd3fc', textTransform: 'uppercase', letterSpacing: '0.15em' }}>English</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#f0f4ff', textAlign: 'center' }}>{card.back}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => { setCardIndex(i => Math.max(0, i - 1)); setCardFlipped(false); }} disabled={cardIndex === 0} style={{ flex: 1, padding: '9px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#8b9cb8', cursor: cardIndex === 0 ? 'not-allowed' : 'pointer', opacity: cardIndex === 0 ? 0.4 : 1, fontSize: 13 }}>← Prev</button>
            <button type="button" onClick={() => setCardFlipped(f => !f)} style={{ flex: 1, padding: '9px', background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.3)', borderRadius: 9, color: '#6ee7b7', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Flip</button>
            <button type="button" onClick={() => { setCardIndex(i => Math.min(cards.length - 1, i + 1)); setCardFlipped(false); }} disabled={cardIndex === cards.length - 1} style={{ flex: 1, padding: '9px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 9, color: '#8b9cb8', cursor: cardIndex === cards.length - 1 ? 'not-allowed' : 'pointer', opacity: cardIndex === cards.length - 1 ? 0.4 : 1, fontSize: 13 }}>Next →</button>
          </div>
        </div>
      );
    }

    case 'accordion': {
      const items = block.items || [];
      return (
        <div style={{ border: '1px solid #1e2130', borderRadius: 12, overflow: 'hidden' }}>
          {items.map((item, i) => (
            <div key={item.id} style={{ borderBottom: i < items.length - 1 ? '1px solid #1e2130' : 'none' }}>
              <button type="button" onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: openAccordion === item.id ? 'rgba(125,211,252,0.06)' : '#0c0e16', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>{item.title}</span>
                {openAccordion === item.id ? <ChevronUp size={16} style={{ color: '#7dd3fc' }} /> : <ChevronDown size={16} style={{ color: '#5a6880' }} />}
              </button>
              {openAccordion === item.id && (
                <div style={{ padding: '14px 18px', background: '#0f1117', fontSize: 14, color: '#8b9cb8', lineHeight: 1.7 }}>
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    case 'callout': {
      const cs = CALLOUT_STYLES[block.calloutType || 'info'];
      return (
        <div style={{ padding: '14px 18px', background: cs.bg, border: `1px solid ${cs.border}`, borderRadius: 10, borderLeft: `4px solid ${cs.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span>{cs.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: cs.accent }}>{block.calloutTitle}</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#dce4f0', lineHeight: 1.65 }}>{block.calloutText}</p>
        </div>
      );
    }

    case 'divider':
      return <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #2a2d3a, transparent)', margin: '8px 0' }} />;

    case 'file':
      return block.fileUrl ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(196,181,253,0.12)', border: '1px solid rgba(196,181,253,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={18} style={{ color: '#c4b5fd' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#dce4f0' }}>{block.fileName || 'File'}</div>
            {block.fileSize && <div style={{ fontSize: 12, color: '#5a6880' }}>{block.fileSize}</div>}
          </div>
          <a href={block.fileUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '7px 16px', background: 'rgba(196,181,253,0.1)', border: '1px solid rgba(196,181,253,0.3)', borderRadius: 8, color: '#c4b5fd', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Download
          </a>
        </div>
      ) : <div style={{ padding: 24, textAlign: 'center', color: '#5a6880', border: '2px dashed #2a2d3a', borderRadius: 10 }}>No file URL set</div>;

    default:
      return null;
  }
}

// ── Single Block Wrapper ──────────────────────────────────────────────────────
function BlockWrapper({ block, index, total, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, previewMode }: {
  block: Block;
  index: number;
  total: number;
  onChange: (b: Block) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  previewMode: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const meta = BLOCK_TYPES.find(t => t.type === block.type)!;

  if (previewMode) {
    return (
      <div style={{ marginBottom: 20 }}>
        <BlockPreview block={block} />
      </div>
    );
  }

  return (
    <div style={{ background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
      {/* Block header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#0a0c14', borderBottom: collapsed ? 'none' : '1px solid #1e2130', cursor: 'pointer' }} onClick={() => setCollapsed(c => !c)}>
        <GripVertical size={14} style={{ color: '#3a4050', flexShrink: 0 }} />
        <div style={{ width: 26, height: 26, borderRadius: 7, background: `${meta.color}18`, border: `1px solid ${meta.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <meta.icon size={13} style={{ color: meta.color }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#dce4f0', flex: 1 }}>{meta.label}</span>
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button type="button" onClick={onMoveUp} disabled={index === 0} title="Move up" style={{ padding: 4, background: 'transparent', border: 'none', color: index === 0 ? '#2a2d3a' : '#5a6880', cursor: index === 0 ? 'not-allowed' : 'pointer', display: 'flex' }}><ArrowUp size={13} /></button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} title="Move down" style={{ padding: 4, background: 'transparent', border: 'none', color: index === total - 1 ? '#2a2d3a' : '#5a6880', cursor: index === total - 1 ? 'not-allowed' : 'pointer', display: 'flex' }}><ArrowDown size={13} /></button>
          <button type="button" onClick={onDuplicate} title="Duplicate" style={{ padding: 4, background: 'transparent', border: 'none', color: '#5a6880', cursor: 'pointer', display: 'flex' }}><Copy size={13} /></button>
          <button type="button" onClick={onDelete} title="Delete" style={{ padding: 4, background: 'transparent', border: 'none', color: '#4a5c70', cursor: 'pointer', display: 'flex' }}><Trash2 size={13} /></button>
          <button type="button" style={{ padding: 4, background: 'transparent', border: 'none', color: '#5a6880', cursor: 'pointer', display: 'flex' }}>
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {/* Block editor */}
      {!collapsed && (
        <div style={{ padding: '16px 18px' }}>
          {block.type === 'text'      && <TextBlockEditor      block={block} onChange={onChange} />}
          {block.type === 'image'     && <ImageBlockEditor     block={block} onChange={onChange} />}
          {block.type === 'video'     && <VideoBlockEditor     block={block} onChange={onChange} />}
          {block.type === 'audio'     && <AudioBlockEditor     block={block} onChange={onChange} />}
          {block.type === 'quiz'      && <QuizBlockEditor      block={block} onChange={onChange} />}
          {block.type === 'flashcard' && <FlashcardBlockEditor block={block} onChange={onChange} />}
          {block.type === 'accordion' && <AccordionBlockEditor block={block} onChange={onChange} />}
          {block.type === 'callout'   && <CalloutBlockEditor   block={block} onChange={onChange} />}
          {block.type === 'divider'   && <div style={{ textAlign: 'center', color: '#5a6880', fontSize: 12, padding: '8px 0' }}>— Divider —</div>}
          {block.type === 'file'      && <FileBlockEditor      block={block} onChange={onChange} />}
        </div>
      )}
    </div>
  );
}

// ── Add Block Panel ───────────────────────────────────────────────────────────
function AddBlockPanel({ onAdd, onClose }: { onAdd: (type: BlockType) => void; onClose: () => void }) {
  return (
    <div style={{ background: '#0c0e16', border: '1px solid #1e2130', borderRadius: 14, padding: '16px 18px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#dce4f0' }}>Add Block</span>
        <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#5a6880', cursor: 'pointer', display: 'flex' }}><X size={15} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
        {BLOCK_TYPES.map(bt => (
          <button key={bt.type} type="button" onClick={() => { onAdd(bt.type); onClose(); }} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: '#0f1117', border: `1px solid ${bt.color}22`, borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `${bt.color}18`, border: `1px solid ${bt.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <bt.icon size={14} style={{ color: bt.color }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#dce4f0' }}>{bt.label}</div>
              <div style={{ fontSize: 10, color: '#5a6880', marginTop: 2, lineHeight: 1.4 }}>{bt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main LessonBuilder ────────────────────────────────────────────────────────
export interface LessonBuilderProps {
  initialBlocks?: Block[];
  onChange?: (blocks: Block[]) => void;
}

export default function LessonBuilder({ initialBlocks = [], onChange }: LessonBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks.length > 0 ? initialBlocks : [defaultBlock('text')]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [insertAfter, setInsertAfter] = useState<number | null>(null);

  const updateBlocks = useCallback((newBlocks: Block[]) => {
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  }, [onChange]);

  const addBlock = useCallback((type: BlockType, afterIndex?: number) => {
    const nb = defaultBlock(type);
    setBlocks(prev => {
      const idx = afterIndex !== undefined ? afterIndex + 1 : prev.length;
      const next = [...prev.slice(0, idx), nb, ...prev.slice(idx)];
      onChange?.(next);
      return next;
    });
    setInsertAfter(null);
  }, [onChange]);

  const updateBlock = useCallback((id: string, updated: Block) => {
    setBlocks(prev => {
      const next = prev.map(b => b.id === id ? updated : b);
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const next = prev.filter(b => b.id !== id);
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const duplicateBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx === -1) return prev;
      const copy = { ...JSON.parse(JSON.stringify(prev[idx])), id: uid() };
      const next = [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const moveBlock = useCallback((id: string, dir: 'up' | 'down') => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx === -1) return prev;
      const newIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: '#5a6880' }}>{blocks.length} block{blocks.length !== 1 ? 's' : ''}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setPreviewMode(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: previewMode ? 'rgba(107,155,210,0.15)' : '#0f1117', border: `1px solid ${previewMode ? '#6b9bd2' : '#2a2d3a'}`, borderRadius: 8, color: previewMode ? '#7dd3fc' : '#8b9cb8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {previewMode ? <EyeOff size={13} /> : <Eye size={13} />}
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Blocks */}
      {blocks.map((block, i) => (
        <div key={block.id}>
          <BlockWrapper
            block={block}
            index={i}
            total={blocks.length}
            onChange={updated => updateBlock(block.id, updated)}
            onDelete={() => deleteBlock(block.id)}
            onDuplicate={() => duplicateBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
            previewMode={previewMode}
          />
          {/* Insert between blocks */}
          {!previewMode && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4, marginTop: -4 }}>
              <button type="button" onClick={() => { setInsertAfter(i); setShowAddPanel(true); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'transparent', border: '1px dashed #2a2d3a', borderRadius: 20, color: '#3a4050', fontSize: 11, cursor: 'pointer', transition: 'all 0.15s' }}>
                <Plus size={10} /> insert
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add block panel */}
      {!previewMode && showAddPanel && (
        <AddBlockPanel onAdd={type => addBlock(type, insertAfter ?? undefined)} onClose={() => { setShowAddPanel(false); setInsertAfter(null); }} />
      )}

      {/* Add block button */}
      {!previewMode && !showAddPanel && (
        <button type="button" onClick={() => { setInsertAfter(null); setShowAddPanel(true); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'transparent', border: '2px dashed #2a2d3a', borderRadius: 12, color: '#5a6880', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
          <Plus size={16} /> Add Block
        </button>
      )}
    </div>
  );
}

// Export serializer
export function serializeBlocks(blocks: Block[]): string {
  return JSON.stringify(blocks);
}

export function deserializeBlocks(json: string): Block[] {
  try { return JSON.parse(json); } catch { return []; }
}
