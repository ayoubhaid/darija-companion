'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Card from '@/components/ui/Card';
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
  ClockIcon,
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
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in-up">
      <div className="text-6xl mb-4">{accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}</div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Session Complete!</h2>
      <p className="text-zinc-500 mb-8">You reviewed {total} cards</p>

      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-600">{known}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Known</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-600">{learning}</div>
          <div className="text-xs text-yellow-600 font-medium mt-1">Learning</div>
        </div>
        <div className="bg-primary/10 rounded-xl p-4">
          <div className="text-2xl font-bold text-primary">{accuracy}%</div>
          <div className="text-xs text-primary font-medium mt-1">Accuracy</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
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
    // Filter to only learning words - we'll just restart for now
  };

  const resetProgress = () => {
    const empty = new Set<string>();
    setKnownWords(empty);
    setLearningWords(empty);
    saveProgress(empty, empty);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (filteredVocab.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Vocabulary Flashcards</h1>
          </div>
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search vocabulary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="text-center py-20">
            <p className="text-zinc-500">No vocabulary found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">Vocabulary Flashcards</h1>
            <p className="text-zinc-500 text-sm">
              {knownWords.size} known · {learningWords.size} learning · {vocabulary.length - knownWords.size - learningWords.size} new
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('flashcard')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'flashcard' ? 'bg-primary text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                title="Flashcard view"
              >
                <ViewColumnsIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                title="Grid view"
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
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
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => { setCategoryFilter('all'); setCurrentIndex(0); setIsFlipped(false); setSessionDone(false); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              categoryFilter === 'all'
                ? 'bg-primary text-white shadow-glow-sm'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
            }`}
          >
            All ({vocabulary.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategoryFilter(cat); setCurrentIndex(0); setIsFlipped(false); setSessionDone(false); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                categoryFilter === cat
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({vocabulary.filter((v) => v.category === cat).length})
            </button>
          ))}
        </div>

        {/* ===== FLASHCARD VIEW ===== */}
        {viewMode === 'flashcard' && (
          <>
            {sessionDone ? (
              <Card padding="lg">
                <SessionSummary
                  total={sessionStats.total}
                  known={sessionStats.known}
                  learning={sessionStats.learning}
                  onRestart={handleRestart}
                  onReviewLearning={handleReviewLearning}
                />
              </Card>
            ) : (
              <>
                {/* Progress bar + controls */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-zinc-500">
                    {currentIndex + 1} / {filteredVocab.length}
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Auto-advance toggle */}
                    <button
                      onClick={() => setAutoAdvance((a) => !a)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        autoAdvance
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                      }`}
                      title="Auto-advance mode"
                    >
                      {autoAdvance ? <PauseIcon className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5" />}
                      Auto
                    </button>
                    <span className="text-xs text-zinc-400 hidden sm:block">
                      Space=flip · ←=learning · →=known
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / filteredVocab.length) * 100}%` }}
                  />
                </div>

                {/* Flashcard */}
                <div
                  ref={cardRef}
                  className="mb-6 cursor-pointer select-none"
                  onClick={() => setIsFlipped((f) => !f)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setIsFlipped((f) => !f)}
                >
                  <Card
                    variant="interactive"
                    className="min-h-[320px] flex flex-col items-center justify-center p-8 relative overflow-hidden"
                  >
                    {/* Known/Learning indicator */}
                    {currentCard && knownWords.has(currentCard.id) && (
                      <div className="absolute top-4 right-4">
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                          <CheckCircleIcon className="w-3.5 h-3.5" /> Known
                        </span>
                      </div>
                    )}
                    {currentCard && learningWords.has(currentCard.id) && (
                      <div className="absolute top-4 right-4">
                        <span className="flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                          <BookmarkIcon className="w-3.5 h-3.5" /> Learning
                        </span>
                      </div>
                    )}

                    {!isFlipped ? (
                      <div className="text-center animate-fade-in">
                        <Badge variant="primary" className="mb-4">{currentCard?.category}</Badge>
                        <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-3">
                          {currentCard?.word}
                        </h2>
                        <p className="text-lg text-zinc-500 mb-3">{currentCard?.transliteration}</p>
                        <p className="text-xl text-primary font-semibold">{currentCard?.translation}</p>
                        {currentCard?.arabic && (
                          <p className="text-2xl mt-4 arabic-text text-zinc-700 dark:text-zinc-300" dir="rtl">
                            {currentCard.arabic}
                          </p>
                        )}
                        {currentCard?.audioUrl && (
                          <div className="mt-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
                            <AudioPlayer audioUrl={currentCard.audioUrl} />
                          </div>
                        )}
                        <p className="text-xs text-zinc-400 mt-6">Click or press Space to flip</p>
                      </div>
                    ) : (
                      <div className="text-center w-full animate-fade-in">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                          {currentCard?.word}
                        </h2>
                        {currentCard?.example ? (
                          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mb-4 text-left">
                            <p className="text-sm font-medium text-zinc-500 mb-2">Example:</p>
                            <p className="text-zinc-700 dark:text-zinc-300 mb-2">{currentCard.example}</p>
                            {currentCard.exampleTranslation && (
                              <p className="text-sm text-zinc-500 italic">{currentCard.exampleTranslation}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-zinc-500 mb-4">No example available</p>
                        )}
                        <p className="text-xs text-zinc-400">Use buttons or ← → keys to mark</p>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Navigation + Action Buttons */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-3 rounded-xl bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-zinc-200 dark:border-zinc-700"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={handleLearning}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-all font-medium text-sm"
                    >
                      <BookmarkIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Still Learning</span>
                      <span className="sm:hidden">←</span>
                    </button>
                    <button
                      onClick={handleKnown}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all font-medium text-sm"
                    >
                      <CheckIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">I Know This</span>
                      <span className="sm:hidden">→</span>
                    </button>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentIndex === filteredVocab.length - 1}
                    className="p-3 rounded-xl bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-zinc-200 dark:border-zinc-700"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-6 text-sm">
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircleIcon className="w-4 h-4" />
                    {knownWords.size} known
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-600">|</span>
                  <span className="flex items-center gap-1.5 text-yellow-600">
                    <BookmarkIcon className="w-4 h-4" />
                    {learningWords.size} learning
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-600">|</span>
                  <button
                    onClick={resetProgress}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1 transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((item) => {
              const isKnown = knownWords.has(item.id);
              const isLearning = learningWords.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-zinc-900 rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${
                    isKnown
                      ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10'
                      : isLearning
                      ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/30 dark:bg-yellow-900/10'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="primary" className="text-xs">{item.category}</Badge>
                    {isKnown && (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircleIcon className="w-3.5 h-3.5" /> Known
                      </span>
                    )}
                    {isLearning && (
                      <span className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                        <BookmarkIcon className="w-3.5 h-3.5" /> Learning
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{item.word}</h3>
                  <p className="text-sm text-zinc-500 mb-1">{item.transliteration}</p>
                  <p className="text-primary font-semibold">{item.translation}</p>
                  {item.arabic && (
                    <p className="text-base arabic-text text-zinc-600 dark:text-zinc-400 mt-2" dir="rtl">
                      {item.arabic}
                    </p>
                  )}
                  {item.example && (
                    <p className="text-xs text-zinc-400 mt-2 italic line-clamp-2">{item.example}</p>
                  )}
                  <div className="flex gap-2 mt-3">
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
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isLearning
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-yellow-50 hover:text-yellow-600'
                      }`}
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
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isKnown
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                    >
                      {isKnown ? '✓ Known' : 'Mark Known'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
