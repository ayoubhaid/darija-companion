'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useWordOfTheDay } from '@/hooks/useWordOfTheDay';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SpeakerWaveIcon,
  BookOpenIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function WordOfTheDayPage() {
  const { wotd, loading, markKnown } = useWordOfTheDay();
  const [revealed, setRevealed] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!wotd?.word) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="text-center">
          <p className="text-zinc-500">No word available today. Check back later!</p>
        </div>
      </div>
    );
  }

  const { word, known } = wotd;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <CalendarDaysIcon className="w-4 h-4" />
            {today}
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Word of the Day
          </h1>
          <p className="text-zinc-500">A new Darija word every day to build your vocabulary</p>
        </div>

        {/* Main Word Card */}
        <Card padding="lg" className="mb-6 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full -ml-12 -mb-12" />

          <div className="relative">
            <Badge variant="primary" className="mb-4">{word.category}</Badge>

            {/* Arabic script */}
            {word.arabic && (
              <p className="text-5xl arabic-text text-zinc-800 dark:text-zinc-200 mb-4 font-bold" dir="rtl">
                {word.arabic}
              </p>
            )}

            {/* Darija word */}
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">{word.word}</h2>

            {/* Transliteration */}
            <p className="text-lg text-zinc-500 italic mb-4">{word.transliteration}</p>

            {/* Translation */}
            <div className="inline-block px-6 py-3 bg-primary/10 rounded-2xl mb-6">
              <p className="text-xl font-semibold text-primary">{word.translation}</p>
            </div>

            {/* Known badge */}
            {known && (
              <div className="flex items-center justify-center gap-2 text-emerald-600 mb-4">
                <CheckCircleSolid className="w-5 h-5" />
                <span className="font-medium">You know this word!</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 justify-center">
              {!known ? (
                <button
                  onClick={markKnown}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  I Know This Word
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-semibold text-sm">
                  <CheckCircleSolid className="w-4 h-4" />
                  Marked as Known
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Example sentence */}
        {word.example && (
          <Card padding="lg" className="mb-6">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-primary" />
              Example Sentence
            </h3>
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
              <p className="text-zinc-800 dark:text-zinc-200 font-medium mb-1">{word.example}</p>
              {word.exampleTranslation && (
                <p className="text-sm text-zinc-500 italic">{word.exampleTranslation}</p>
              )}
            </div>
          </Card>
        )}

        {/* Reveal challenge */}
        <Card padding="lg" className="mb-6">
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-primary" />
            Quick Challenge
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm">
            Can you use <strong className="text-zinc-900 dark:text-white">{word.word}</strong> in a sentence?
            Think of one, then reveal the example.
          </p>
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-3 border-2 border-dashed border-primary/40 text-primary rounded-xl font-medium text-sm hover:bg-primary/5 transition-colors"
            >
              Reveal Example Sentence
            </button>
          ) : (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">
                {word.example || `${word.word} — ${word.translation}`}
              </p>
              {word.exampleTranslation && (
                <p className="text-sm text-zinc-500 mt-1 italic">{word.exampleTranslation}</p>
              )}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/vocabulary">
            <div className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-primary/40 transition-all group">
              <BookOpenIcon className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors">
                All Vocabulary
              </span>
            </div>
          </Link>
          <Link href="/practice">
            <div className="flex items-center justify-center gap-2 p-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all">
              <SparklesIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Practice Now</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
