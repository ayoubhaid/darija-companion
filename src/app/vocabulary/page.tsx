'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import AudioPlayer from '@/components/ui/AudioPlayer';
import { VocabularyItem } from '@/types';
import { getAllVocabulary } from '@/lib/firestore';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const STORAGE_KEY = 'darija_vocab_progress';

function loadProgress(): { known: string[]; learning: string[] } {
  if (typeof window === 'undefined') return { known: [], learning: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { known: [], learning: [] };
  } catch {
    return { known: [], learning: [] };
  }
}

function saveProgress(known: Set<string>, learning: Set<string>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ known: Array.from(known), learning: Array.from(learning) })
  );
}

type ViewMode = 'flashcard' | 'grid';

interface SessionSummaryProps {
  total: number;
  known: number;
  learning: number;
  onRestart: () => void;
  onReviewLearning: () => void;
}

function SessionSummary({ total, known, learning, onRestart, onReviewLearning }: SessionSummaryProps) {
  const accuracy = total > 0 ? Math.round((known / total) * 100) : 0;
  return (
    <div style={{
      background: 'rgba(26,21,8,0.6)',
      border: '1px solid rgba(200,169,110,0.2)',
      borderRadius: 18,
      padding: 40,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>{accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#f0e6d0', marginBottom: 8 }}>Session Complete!</h2>
      <p style={{ color: '#8a7a6e', marginBottom: 32 }}>You reviewed {total} cards</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32, maxWidth: 320, margin: '0 auto 32px' }}>
        <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 12, padding: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{known}</div>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 500, marginTop: 4 }}>Known</div>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.1)', borderRadius: 12, padding: 16, border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{learning}</div>
          <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 500, marginTop: 4 }}>Learning</div>
        </div>
        <div style={{ background: 'rgba(200,169,110,0.1)', borderRadius: 12, padding: 16, border: '1px solid rgba(200,169,110,0.2)' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#c8a96e' }}>{accuracy}%</div>
          <div style={{ fontSize: 12, color: '#c8a96e', fontWeight: 500, marginTop: 4 }}>Accuracy</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
        {learning > 0 && (
          <Button variant="outline" onClick={onReviewLearning} className="flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4" />
            Review {learning} Learning
          </Button>
        )}
        <Button onClick={onRestart} className="flex items-center gap-2">
          <PlayIcon className="w-4 h-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [learningWords, setLearningWords] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('flashcard');
  const [sessionDone, setSessionDone] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [sessionStats, setSessionStats] = useState({ known: 0, learning: 0, total: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Load persisted progress
  useEffect(() => {
    const { known, learning } = loadProgress();
    setKnownWords(new Set(known));
    setLearningWords(new Set(learning));
  }, []);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const data = await getAllVocabulary();
        setVocabulary(data);
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVocabulary();
  }, []);

  const categories = useMemo(() => Array.from(new Set(vocabulary.map((v) => v.category))), [vocabulary]);

  const filteredVocab = useMemo(() => {
    let filtered =
      categoryFilter === 'all' ? vocabulary : vocabulary.filter((v) => v.category === categoryFilter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.word.toLowerCase().includes(query) ||
          v.translation.toLowerCase().includes(query) ||
          (v.transliteration && v.transliteration.toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [vocabulary, categoryFilter, searchQuery]);

  const currentCard = filteredVocab[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < filteredVocab.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      // End of deck
      setSessionStats({
        known: knownWords.size,
        learning: learningWords.size,
        total: filteredVocab.length,
      });
      setSessionDone(true);
    }
  }, [currentIndex, filteredVocab.length, knownWords.size, learningWords.size]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleKnown = useCallback(() => {
    if (!currentCard) return;
    const newKnown = new Set(knownWords);
    newKnown.add(currentCard.id);
    const newLearning = new Set(learningWords);
    newLearning.delete(currentCard.id);
    setKnownWords(newKnown);
    setLearningWords(newLearning);
    saveProgress(newKnown, newLearning);
    handleNext();
  }, [currentCard, knownWords, learningWords, handleNext]);

  const handleLearning = useCallback(() => {
    if (!currentCard) return;
    const newLearning = new Set(learningWords);
    newLearning.add(currentCard.id);
    const newKnown = new Set(knownWords);
    newKnown.delete(currentCard.id);
    setKnownWords(newKnown);
    setLearningWords(newLearning);
    saveProgress(newKnown, newLearning);
    handleNext();
  }, [currentCard, knownWords, learningWords, handleNext]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (viewMode !== 'flashcard' || sessionDone) return;
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ':
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          setIsFlipped((f) => !f);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleKnown();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleLearning();
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewMode, sessionDone, handleKnown, handleLearning]);

  // Auto-advance
  useEffect(() => {
    if (autoAdvance && !isFlipped && !sessionDone && viewMode === 'flashcard') {
      const t = setTimeout(() => {
        setIsFlipped(true);
      }, 2000);
      setAutoAdvanceTimer(t);
      return () => clearTimeout(t);
    }
    if (autoAdvance && isFlipped && !sessionDone && viewMode === 'flashcard') {
      const t = setTimeout(() => {
        handleNext();
      }, 2000);
      setAutoAdvanceTimer(t);
      return () => clearTimeout(t);
    }
  }, [autoAdvance, isFlipped, currentIndex, sessionDone, viewMode, handleNext]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionDone(false);
  };

  const handleReviewLearning = () => {
    setCategoryFilter('all');
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionDone(false);
  };

  const resetProgress = () => {
    const empty = new Set<string>();
    setKnownWords(empty);
    setLearningWords(empty);
    saveProgress(empty, empty);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0e0804' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-2" style={{ borderColor: '#c8a96e', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  // Page container wrapper
  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(ellipse at 20% 0%, #2a1505 0%, #0e0804 60%), radial-gradient(ellipse at 80% 100%, #12060e 0%, transparent 50%)',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(200,169,110,0.025) 60px, rgba(200,169,110,0.025) 61px),
          repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(200,169,110,0.025) 60px, rgba(200,169,110,0.025) 61px)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(16px,4vw,40px) 60px', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );

  if (filteredVocab.length === 0 && !loading) {
    return (
      <PageWrapper>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,6vw,48px)', fontWeight: 700, color: '#f0e6d0', marginBottom: 8 }}>Vocabulary Flashcards</h1>
          <p style={{ color: '#8a7a6e' }}>Master Moroccan Darija one card at a time</p>
        </div>
        
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5a4a3e' }} />
          <input
            type="text"
            placeholder="Search vocabulary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: 48 }}
          />
        </div>
        
        <div style={{ textAlign: 'center', padding: 80 }}>
          <p style={{ color: '#8a7a6e' }}>No vocabulary found</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,6vw,48px)', fontWeight: 700, color: '#f0e6d0', marginBottom: 4 }}>Vocabulary Flashcards</h1>
          <p style={{ color: '#8a7a6e', fontSize: 14 }}>
            {knownWords.size} known · {learningWords.size} learning · {vocabulary.length - knownWords.size - learningWords.size} new
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View toggle */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'rgba(26,21,8,0.6)', 
            border: '1px solid rgba(200,169,110,0.2)', 
            borderRadius: 12, 
            padding: 4 
          }}>
            <button
              onClick={() => setViewMode('flashcard')}
              style={{
                padding: 8,
                borderRadius: 8,
                background: viewMode === 'flashcard' ? 'rgba(200,169,110,0.2)' : 'transparent',
                color: viewMode === 'flashcard' ? '#c8a96e' : '#8a7a6e',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Flashcard view"
            >
              <ViewColumnsIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: 8,
                borderRadius: 8,
                background: viewMode === 'grid' ? 'rgba(200,169,110,0.2)' : 'transparent',
                color: viewMode === 'grid' ? '#c8a96e' : '#8a7a6e',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Grid view"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5a4a3e' }} />
        <input
          type="text"
          placeholder="Search vocabulary..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentIndex(0);
            setIsFlipped(false);
            setSessionDone(false);
          }}
          className="input"
          style={{ paddingLeft: 48 }}
        />
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
        <button
          onClick={() => { setCategoryFilter('all'); setCurrentIndex(0); setIsFlipped(false); setSessionDone(false); }}
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            background: categoryFilter === 'all' ? 'rgba(200,169,110,0.15)' : 'rgba(26,21,8,0.6)',
            color: categoryFilter === 'all' ? '#c8a96e' : '#8a7a6e',
            border: `1px solid ${categoryFilter === 'all' ? 'rgba(200,169,110,0.4)' : 'rgba(200,169,110,0.15)'}`,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          All ({vocabulary.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategoryFilter(cat); setCurrentIndex(0); setIsFlipped(false); setSessionDone(false); }}
            style={{
              padding: '8px 16px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              background: categoryFilter === cat ? 'rgba(200,169,110,0.15)' : 'rgba(26,21,8,0.6)',
              color: categoryFilter === cat ? '#c8a96e' : '#8a7a6e',
              border: `1px solid ${categoryFilter === cat ? 'rgba(200,169,110,0.4)' : 'rgba(200,169,110,0.15)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)} ({vocabulary.filter((v) => v.category === cat).length})
          </button>
        ))}
      </div>

      {/* ===== FLASHCARD VIEW ===== */}
      {viewMode === 'flashcard' && (
        <>
          {sessionDone ? (
            <SessionSummary
              total={sessionStats.total}
              known={sessionStats.known}
              learning={sessionStats.learning}
              onRestart={handleRestart}
              onReviewLearning={handleReviewLearning}
            />
          ) : (
            <>
              {/* Progress bar + controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: '#8a7a6e' }}>
                  {currentIndex + 1} / {filteredVocab.length}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Auto-advance toggle */}
                  <button
                    onClick={() => setAutoAdvance((a) => !a)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      background: autoAdvance ? 'rgba(200,169,110,0.1)' : 'rgba(26,21,8,0.6)',
                      color: autoAdvance ? '#c8a96e' : '#8a7a6e',
                      border: `1px solid ${autoAdvance ? 'rgba(200,169,110,0.3)' : 'rgba(200,169,110,0.15)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    title="Auto-advance mode"
                  >
                    {autoAdvance ? <PauseIcon className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5" />}
                    Auto
                  </button>
                  <span style={{ fontSize: 12, color: '#5a4a3e' }} className="hidden sm:block">
                    Space=flip · ←=learning · →=known
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 100, marginBottom: 24, overflow: 'hidden' }}>
                <div
                  style={{ 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #c8a96e, #d4845a)', 
                    borderRadius: 100, 
                    transition: 'width 0.3s',
                    width: `${((currentIndex + 1) / filteredVocab.length) * 100}%`
                  }}
                />
              </div>

              {/* Flashcard */}
              <div
                ref={cardRef}
                style={{ marginBottom: 24, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setIsFlipped((f) => !f)}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsFlipped((f) => !f)}
              >
                <div
                  style={{
                    background: 'rgba(26,21,8,0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(200,169,110,0.2)',
                    borderRadius: 18,
                    padding: 32,
                    minHeight: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Glow */}
                  <div style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: '#c8a96e',
                    opacity: 0.08,
                    filter: 'blur(30px)'
                  }} />

                  {/* Known/Learning indicator */}
                  {currentCard && knownWords.has(currentCard.id) && (
                    <div style={{ position: 'absolute', top: 16, right: 16 }}>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4, 
                        fontSize: 12, 
                        fontWeight: 500, 
                        color: '#10b981', 
                        background: 'rgba(16,185,129,0.1)', 
                        padding: '4px 8px', 
                        borderRadius: 100,
                        border: '1px solid rgba(16,185,129,0.2)'
                      }}>
                        <CheckCircleIcon className="w-3.5 h-3.5" /> Known
                      </span>
                    </div>
                  )}
                  {currentCard && learningWords.has(currentCard.id) && !knownWords.has(currentCard.id) && (
                    <div style={{ position: 'absolute', top: 16, right: 16 }}>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4, 
                        fontSize: 12, 
                        fontWeight: 500, 
                        color: '#f59e0b', 
                        background: 'rgba(245,158,11,0.1)', 
                        padding: '4px 8px', 
                        borderRadius: 100,
                        border: '1px solid rgba(245,158,11,0.2)'
                      }}>
                        <BookmarkIcon className="w-3.5 h-3.5" /> Learning
                      </span>
                    </div>
                  )}

                  {!isFlipped ? (
                    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                      <Badge variant="default" className="mb-4">{currentCard?.category}</Badge>
                      <h2 style={{ fontSize: 40, fontWeight: 700, color: '#f0e6d0', marginBottom: 12 }}>
                        {currentCard?.word}
                      </h2>
                      <p style={{ fontSize: 18, color: '#8a7a6e', marginBottom: 12 }}>{currentCard?.transliteration}</p>
                      <p style={{ fontSize: 20, fontWeight: 600, color: '#c8a96e' }}>{currentCard?.translation}</p>
                      {currentCard?.arabic && (
                        <p style={{ fontSize: 24, marginTop: 16, color: '#f0e6d0', direction: 'rtl', fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                          {currentCard.arabic}
                        </p>
                      )}
                      {currentCard?.audioUrl && (
                        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <AudioPlayer audioUrl={currentCard.audioUrl} />
                        </div>
                      )}
                      <p style={{ fontSize: 12, color: '#5a4a3e', marginTop: 24 }}>Click or press Space to flip</p>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
                      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0e6d0', marginBottom: 16 }}>
                        {currentCard?.word}
                      </h2>
                      {currentCard?.example ? (
                        <div style={{ 
                          background: 'rgba(26,16,8,0.6)', 
                          borderRadius: 12, 
                          padding: 16, 
                          marginBottom: 16, 
                          textAlign: 'left',
                          border: '1px solid rgba(200,169,110,0.1)'
                        }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: '#8a7a6e', marginBottom: 8 }}>Example:</p>
                          <p style={{ color: '#f0e6d0', marginBottom: 8 }}>{currentCard.example}</p>
                          {currentCard.exampleTranslation && (
                            <p style={{ fontSize: 13, color: '#8a7a6e', fontStyle: 'italic' }}>{currentCard.exampleTranslation}</p>
                          )}
                        </div>
                      ) : (
                        <p style={{ color: '#8a7a6e', marginBottom: 16 }}>No example available</p>
                      )}
                      <p style={{ fontSize: 12, color: '#5a4a3e' }}>Use buttons or ← → keys to mark</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation + Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(26,21,8,0.6)',
                    color: currentIndex === 0 ? '#5a4a3e' : '#f0e6d0',
                    border: '1px solid rgba(200,169,110,0.15)',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentIndex === 0 ? 0.4 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={handleLearning}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 20px',
                      borderRadius: 12,
                      background: 'rgba(245,158,11,0.1)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245,158,11,0.2)',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    <BookmarkIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Still Learning</span>
                    <span className="sm:hidden">←</span>
                  </button>
                  <button
                    onClick={handleKnown}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 20px',
                      borderRadius: 12,
                      background: 'rgba(16,185,129,0.1)',
                      color: '#10b981',
                      border: '1px solid rgba(16,185,129,0.2)',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">I Know This</span>
                    <span className="sm:hidden">→</span>
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === filteredVocab.length - 1}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(26,21,8,0.6)',
                    color: currentIndex === filteredVocab.length - 1 ? '#5a4a3e' : '#f0e6d0',
                    border: '1px solid rgba(200,169,110,0.15)',
                    cursor: currentIndex === filteredVocab.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentIndex === filteredVocab.length - 1 ? 0.4 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontSize: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981' }}>
                  <CheckCircleIcon className="w-4 h-4" />
                  {knownWords.size} known
                </span>
                <span style={{ color: '#5a4a3e' }}>|</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b' }}>
                  <BookmarkIcon className="w-4 h-4" />
                  {learningWords.size} learning
                </span>
                <span style={{ color: '#5a4a3e' }}>|</span>
                <button
                  onClick={resetProgress}
                  style={{
                    color: '#5a4a3e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    transition: 'color 0.2s'
                  }}
                  title="Reset all progress"
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* ===== GRID VIEW ===== */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredVocab.map((item) => {
            const isKnown = knownWords.has(item.id);
            const isLearning = learningWords.has(item.id);
            return (
              <div
                key={item.id}
                style={{
                  background: 'rgba(26,21,8,0.6)',
                  borderRadius: 18,
                  border: '1px solid',
                  borderColor: isKnown 
                    ? 'rgba(16,185,129,0.3)' 
                    : isLearning 
                    ? 'rgba(245,158,11,0.3)' 
                    : 'rgba(200,169,110,0.15)',
                  padding: 16,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Badge variant="default" className="text-xs">{item.category}</Badge>
                  {isKnown && (
                    <span style={{ fontSize: 12, color: '#10b981', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircleIcon className="w-3.5 h-3.5" /> Known
                    </span>
                  )}
                  {isLearning && !isKnown && (
                    <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BookmarkIcon className="w-3.5 h-3.5" /> Learning
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0e6d0', marginBottom: 4 }}>{item.word}</h3>
                <p style={{ fontSize: 14, color: '#8a7a6e', marginBottom: 4 }}>{item.transliteration}</p>
                <p style={{ fontWeight: 600, color: '#c8a96e' }}>{item.translation}</p>
                {item.arabic && (
                  <p style={{ fontSize: 16, color: '#f0e6d0', marginTop: 8, direction: 'rtl', fontFamily: 'Noto Sans Arabic, sans-serif' }} dir="rtl">
                    {item.arabic}
                  </p>
                )}
                {item.example && (
                  <p style={{ fontSize: 12, color: '#5a4a3e', marginTop: 8, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2 }}>{item.example}</p>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => {
                      const newLearning = new Set(learningWords);
                      const newKnown = new Set(knownWords);
                      if (isLearning) {
                        newLearning.delete(item.id);
                      } else {
                        newLearning.add(item.id);
                        newKnown.delete(item.id);
                      }
                      setLearningWords(newLearning);
                      setKnownWords(newKnown);
                      saveProgress(newKnown, newLearning);
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      background: isLearning ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                      color: isLearning ? '#f59e0b' : '#8a7a6e',
                      border: `1px solid ${isLearning ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isLearning ? '★ Learning' : 'Mark Learning'}
                  </button>
                  <button
                    onClick={() => {
                      const newKnown = new Set(knownWords);
                      const newLearning = new Set(learningWords);
                      if (isKnown) {
                        newKnown.delete(item.id);
                      } else {
                        newKnown.add(item.id);
                        newLearning.delete(item.id);
                      }
                      setKnownWords(newKnown);
                      setLearningWords(newLearning);
                      saveProgress(newKnown, newLearning);
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      background: isKnown ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                      color: isKnown ? '#10b981' : '#8a7a6e',
                      border: `1px solid ${isKnown ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isKnown ? '✓ Known' : 'Mark Known'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
