'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import AudioPlayer from '@/components/ui/AudioPlayer';
import VocabularyWave from '@/components/VocabularyWave';
import { VocabularyItem } from '@/types';
import { getAllVocabulary } from '@/lib/firestore';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  SpeakerWaveIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [learningWords, setLearningWords] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const categories = useMemo(() => Array.from(new Set(vocabulary.map(v => v.category))), [vocabulary]);
  
  const filteredVocab = useMemo(() => {
    let filtered = categoryFilter === 'all' 
      ? vocabulary 
      : vocabulary.filter(v => v.category === categoryFilter);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.word.toLowerCase().includes(query) ||
        v.translation.toLowerCase().includes(query) ||
        (v.transliteration && v.transliteration.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [vocabulary, categoryFilter, searchQuery]);

  const currentCard = filteredVocab[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredVocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnown = () => {
    if (currentCard) {
      setKnownWords(new Set(Array.from(knownWords).concat(currentCard.id)));
      handleNext();
    }
  };

  const handleLearning = () => {
    if (currentCard) {
      setLearningWords(new Set(Array.from(learningWords).concat(currentCard.id)));
      handleNext();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (filteredVocab.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            No vocabulary found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Vocabulary Flashcards
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Learn and review Darija vocabulary
          </p>
        </div>

        {/* Search */}
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

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => { setCategoryFilter('all'); setCurrentIndex(0); setIsFlipped(false); }}
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
              onClick={() => { setCategoryFilter(cat); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                categoryFilter === cat
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({vocabulary.filter(v => v.category === cat).length})
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            Card {currentIndex + 1} of {filteredVocab.length}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-emerald-600 font-medium">
              {knownWords.size} known
            </span>
            <span className="text-zinc-300">|</span>
            <span className="text-sm text-yellow-600 font-medium">
              {learningWords.size} learning
            </span>
            <span className="text-zinc-300">|</span>
            <span className="text-sm text-zinc-500">
              {filteredVocab.length - knownWords.size - learningWords.size} new
            </span>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-6">
          <Card 
            variant="interactive"
            className="min-h-[320px] flex flex-col items-center justify-center p-8 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {!isFlipped ? (
              <div className="text-center">
                <Badge variant="primary" className="mb-4">{currentCard?.category}</Badge>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                  {currentCard?.word}
                </h2>
                <p className="text-lg text-zinc-500 mb-4">
                  {currentCard?.transliteration}
                </p>
                <p className="text-xl text-primary font-semibold">
                  {currentCard?.translation}
                </p>
                {currentCard?.arabic && (
                  <p className="text-2xl mt-4 arabic-text text-zinc-700 dark:text-zinc-300" dir="rtl">
                    {currentCard.arabic}
                  </p>
                )}
                {currentCard?.audioUrl && (
                  <div className="mt-4 flex justify-center">
                    <AudioPlayer audioUrl={currentCard.audioUrl} />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                  {currentCard?.word}
                </h2>
                {currentCard?.example && (
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mb-4">
                    <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                      {currentCard.example}
                    </p>
                    {currentCard.exampleTranslation && (
                      <p className="text-sm text-zinc-500">
                        {currentCard.exampleTranslation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-3 rounded-xl bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <span className="text-sm text-zinc-500">
            Click card to flip
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredVocab.length - 1}
            className="p-3 rounded-xl bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleLearning}
            className="flex items-center"
          >
            <BookmarkIcon className="w-5 h-5 mr-2" />
            Still Learning
          </Button>
          <Button
            onClick={handleKnown}
            className="flex items-center bg-emerald-500 hover:bg-emerald-600"
          >
            <CheckIcon className="w-5 h-5 mr-2" />
            I Know This
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <VocabularyWave />
      </div>
    </div>
  );
}
