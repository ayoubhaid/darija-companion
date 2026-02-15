'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Vocabulary } from '@/types';
import { getAllVocabulary } from '@/lib/firestore';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  SpeakerWaveIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  const categories = [...new Set(vocabulary.map(v => v.category))];
  
  const filteredVocab = categoryFilter === 'all' 
    ? vocabulary 
    : vocabulary.filter(v => v.category === categoryFilter);

  const currentCard = filteredVocab[currentIndex];

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

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
      setKnownWords(new Set([...knownWords, currentCard.id]));
      handleNext();
    }
  };

  const handleUnknown = () => {
    handleNext();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (filteredVocab.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No vocabulary found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vocabulary Flashcards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Learn and review Darija vocabulary with spaced repetition
          </p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => { setCategoryFilter('all'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              categoryFilter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            All ({vocabulary.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategoryFilter(cat); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({vocabulary.filter(v => v.category === cat).length})
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Card {currentIndex + 1} of {filteredVocab.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-500">
              {knownWords.size} known
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">
              {filteredVocab.length - knownWords.size} remaining
            </span>
          </div>
        </div>

        <div className="mb-6">
          <Card 
            className="min-h-[300px] flex flex-col items-center justify-center p-8 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {!isFlipped ? (
              <div className="text-center">
                <Badge className="mb-4">{currentCard?.category}</Badge>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentCard?.word}
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                  {currentCard?.transliteration}
                </p>
                <p className="text-xl text-primary-500 font-semibold">
                  {currentCard?.translation}
                </p>
                {currentCard?.arabic && (
                  <p className="text-2xl mt-4 arabic-text text-gray-700 dark:text-gray-300" dir="rtl">
                    {currentCard.arabic}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentCard?.word}
                </h2>
                {currentCard?.example && (
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {currentCard.example}
                    </p>
                    {currentCard.exampleTranslation && (
                      <p className="text-sm text-gray-500">
                        {currentCard.exampleTranslation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-3 rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Click card to flip
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredVocab.length - 1}
            className="p-3 rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="danger"
            onClick={handleUnknown}
            className="flex items-center"
          >
            <XMarkIcon className="w-5 h-5 mr-2" />
            Still Learning
          </Button>
          <Button
            variant="success"
            onClick={handleKnown}
            className="flex items-center bg-green-500 hover:bg-green-600"
          >
            <CheckIcon className="w-5 h-5 mr-2" />
            I Know This
          </Button>
        </div>
      </div>
    </div>
  );
}
