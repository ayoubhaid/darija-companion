'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { STORIES } from '@/data/stories';
import { BookOpenIcon, ClockIcon, ArrowRightIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

function StoryCard({ story, onRead }: { story: typeof STORIES[0]; onRead: () => void }) {
  const levelColors = {
    Beginner: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    Intermediate: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    Advanced: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };

  return (
    <Card variant="interactive" className="group">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
          <BookOpenIcon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{story.title}</h3>
            <span className="text-sm text-zinc-500">({story.titleDarija})</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Badge className={levelColors[story.level]}>{story.level}</Badge>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              {story.duration} min
            </span>
            <span className="text-xs text-zinc-500">
              {story.content.length} paragraphs
            </span>
          </div>
          <Button size="sm" onClick={onRead} className="w-full">
            Read Story
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function StoryReader({ story, onClose }: { story: typeof STORIES[0]; onClose: () => void }) {
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showVocab, setShowVocab] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const [question, options, correctIndex] = story.comprehensionQuestions;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{story.title}</h1>
            <p className="text-zinc-500">{story.titleDarija}</p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={showTranslation ? 'primary' : 'secondary'} 
            size="sm" 
            onClick={() => setShowTranslation(true)}
          >
            With Translation
          </Button>
          <Button 
            variant={!showTranslation ? 'primary' : 'secondary'} 
            size="sm" 
            onClick={() => setShowTranslation(false)}
          >
            Darija Only
          </Button>
          <Button 
            variant={showVocab ? 'primary' : 'secondary'} 
            size="sm" 
            onClick={() => setShowVocab(!showVocab)}
          >
            Vocabulary ({story.vocabulary.length})
          </Button>
        </div>

        {/* Story Content */}
        <Card padding="lg" className="mb-6">
          <div className="space-y-6">
            {story.content.map((paragraph, index) => (
              <div key={index} className="border-b border-zinc-200 dark:border-zinc-700 pb-4 last:border-0">
                <p className="text-xl font-medium text-zinc-900 dark:text-white mb-2" dir="rtl">
                  {paragraph.darija}
                </p>
                {showTranslation && (
                  <p className="text-zinc-600 dark:text-zinc-400">{paragraph.english}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Vocabulary Section */}
        {showVocab && (
          <Card padding="lg" className="mb-6">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Vocabulary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {story.vocabulary.map((vocab, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900 dark:text-white">{vocab.word}</p>
                    <p className="text-sm text-zinc-500">{vocab.transliteration}</p>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{vocab.meaning}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Comprehension Quiz */}
        <Card padding="lg">
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Comprehension Quiz</h3>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-4">{question}</p>
          <div className="space-y-3">
            {options.map((option, index) => {
              let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ';
              
              if (showResult) {
                if (index === correctIndex) {
                  buttonClass += 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300';
                } else if (index === selectedAnswer && index !== correctIndex) {
                  buttonClass += 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300';
                } else {
                  buttonClass += 'border-zinc-200 dark:border-zinc-700 text-zinc-400';
                }
              } else {
                buttonClass += 'border-zinc-200 dark:border-zinc-700 hover:border-primary hover:bg-primary/5';
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <span className="font-medium">{option}</span>
                  {showResult && index === correctIndex && (
                    <CheckIcon className="w-5 h-5 inline ml-2" />
                  )}
                  {showResult && index === selectedAnswer && index !== correctIndex && (
                    <XMarkIcon className="w-5 h-5 inline ml-2" />
                  )}
                </button>
              );
            })}
          </div>
          {showResult && (
            <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
              {selectedAnswer === correctIndex ? (
                <p className="text-green-600 font-medium">Correct! Well done! 🎉</p>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">
                  The correct answer is: <span className="font-semibold">{options[correctIndex]}</span>
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function StoriesPage() {
  const { user, loading } = useAuth();
  const [selectedStory, setSelectedStory] = useState<typeof STORIES[0] | null>(null);
  const [filter, setFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filteredStories = filter === 'All' 
    ? STORIES 
    : STORIES.filter(s => s.level === filter);

  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="text-center">
          <BookOpenIcon className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Sign in to read stories</h2>
          <p className="text-zinc-500 mb-4">Create an account to access reading comprehension stories</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (selectedStory) {
    return <StoryReader story={selectedStory} onClose={() => setSelectedStory(null)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl shadow-glow-md mb-6">
            <BookOpenIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Reading Comprehension</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Practice your Darija reading skills with short stories. Each story includes vocabulary, 
            translation, and a comprehension quiz.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
            <Button
              key={level}
              variant={filter === level ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter(level)}
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onRead={() => setSelectedStory(story)}
            />
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No stories found for this level.</p>
          </div>
        )}
      </div>
    </div>
  );
}
