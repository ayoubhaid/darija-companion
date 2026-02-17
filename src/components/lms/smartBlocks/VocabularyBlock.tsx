'use client';

import { useState, useCallback } from 'react';
import { VocabularyWord } from '@/types/lms';
import { Volume2, RotateCcw, Shuffle, Eye, BookOpen, Table } from 'lucide-react';
import clsx from 'clsx';

interface VocabularyBlockProps {
  id: string;
  title?: string;
  words: VocabularyWord[];
  displayMode?: 'list' | 'flashcard' | 'table';
  showTransliteration?: boolean;
  showTranslation?: boolean;
  enableAudio?: boolean;
}

export function VocabularyBlock({
  id,
  title = 'Vocabulary',
  words = [],
  displayMode = 'list',
  showTransliteration = true,
  showTranslation = true,
  enableAudio = true,
}: VocabularyBlockProps) {
  const [mode, setMode] = useState<'list' | 'flashcard' | 'table'>(displayMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<VocabularyWord[]>(words);

  const handleShuffle = useCallback(() => {
    if (isShuffled) {
      setShuffledWords([...words]);
      setIsShuffled(false);
    } else {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setIsShuffled(true);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [words, isShuffled]);

  const playAudio = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.play().catch(console.error);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < shuffledWords.length - 1 ? prev + 1 : 0));
    setIsFlipped(false);
  }, [shuffledWords.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : shuffledWords.length - 1));
    setIsFlipped(false);
  }, [shuffledWords.length]);

  const currentWord = shuffledWords[currentIndex];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <span className="text-purple-200 text-sm">{words.length} words</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setMode('list')}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
            mode === 'list'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          )}
        >
          <Eye className="w-4 h-4" />
          List
        </button>
        <button
          onClick={() => setMode('flashcard')}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
            mode === 'flashcard'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          )}
        >
          <BookOpen className="w-4 h-4" />
          Flashcards
        </button>
        <button
          onClick={() => setMode('table')}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
            mode === 'table'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          )}
        >
          <Table className="w-4 h-4" />
          Table
        </button>
        <div className="flex-1" />
        <button
          onClick={handleShuffle}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
            isShuffled
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          )}
        >
          <Shuffle className="w-4 h-4" />
          {isShuffled ? 'Reset' : 'Shuffle'}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {mode === 'list' && (
          <div className="space-y-2">
            {shuffledWords.map((word, index) => (
              <div
                key={word.id || index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-lg">{word.word}</p>
                    {showTransliteration && word.transliteration && (
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">{word.transliteration}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {showTranslation && (
                    <span className="text-zinc-600 dark:text-zinc-300">{word.translation}</span>
                  )}
                  {enableAudio && word.audioUrl && (
                    <button
                      onClick={() => playAudio(word.audioUrl!)}
                      className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {mode === 'flashcard' && (
          <div className="flex flex-col items-center">
            {/* Flashcard */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-md h-64 cursor-pointer perspective-1000"
            >
              <div
                className={clsx(
                  'relative w-full h-full transition-transform duration-500 transform-style-3d',
                  isFlipped && 'rotate-y-180'
                )}
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
              >
                {/* Front */}
                <div
                  className="absolute w-full h-full bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800 flex flex-col items-center justify-center p-6"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                    {currentWord?.word}
                  </p>
                  {currentWord?.arabic && (
                    <p className="text-2xl text-purple-700 dark:text-purple-300 mb-2" dir="rtl">
                      {currentWord.arabic}
                    </p>
                  )}
                  {showTransliteration && currentWord?.transliteration && (
                    <p className="text-lg text-purple-600 dark:text-purple-400">{currentWord.transliteration}</p>
                  )}
                  <p className="text-sm text-purple-400 mt-4">Click to flip</p>
                </div>

                {/* Back */}
                <div
                  className="absolute w-full h-full bg-white dark:bg-zinc-800 rounded-xl border border-purple-200 dark:border-purple-800 flex flex-col items-center justify-center p-6"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    {currentWord?.translation}
                  </p>
                  {currentWord?.example && (
                    <div className="text-center">
                      <p className="text-zinc-500 dark:text-zinc-400 italic mb-1">"{currentWord.example}"</p>
                      {currentWord.exampleTranslation && (
                        <p className="text-sm text-zinc-400">"{currentWord.exampleTranslation}"</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Previous
              </button>
              <span className="text-zinc-500">
                {currentIndex + 1} / {shuffledWords.length}
              </span>
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Next
              </button>
            </div>

            {/* Audio */}
            {enableAudio && currentWord?.audioUrl && (
              <button
                onClick={() => playAudio(currentWord.audioUrl!)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
                Play Audio
              </button>
            )}
          </div>
        )}

        {mode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">Word</th>
                  {showTransliteration && (
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">Transliteration</th>
                  )}
                  <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">Translation</th>
                  {enableAudio && <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">Audio</th>}
                </tr>
              </thead>
              <tbody>
                {shuffledWords.map((word, index) => (
                  <tr
                    key={word.id || index}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium">{word.word}</p>
                      {word.arabic && <p className="text-sm text-zinc-500" dir="rtl">{word.arabic}</p>}
                    </td>
                    {showTransliteration && (
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{word.transliteration}</td>
                    )}
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{word.translation}</td>
                    {enableAudio && (
                      <td className="py-3 px-4">
                        {word.audioUrl && (
                          <button
                            onClick={() => playAudio(word.audioUrl!)}
                            className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
