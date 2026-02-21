'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Quiz } from '@/types';
import { getAllQuizzes } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import {
  FireIcon,
  ClockIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  FunnelIcon,
  BarsArrowDownIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid';

const difficultyGradients: Record<string, string> = {
  beginner: 'from-emerald-500 to-teal-600',
  intermediate: 'from-yellow-500 to-orange-500',
  advanced: 'from-red-500 to-rose-600',
};

const difficultyOrder: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

type SortOption = 'default' | 'difficulty-asc' | 'difficulty-desc' | 'xp-desc' | 'questions-asc';

function estimateTime(questionCount: number): string {
  const minutes = Math.max(1, Math.round(questionCount * 0.75));
  return `~${minutes} min`;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { userProfile } = useAuth();

  const completedQuizIds = useMemo(
    () => new Set(userProfile?.completedQuizzes || []),
    [userProfile]
  );

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const filteredAndSortedQuizzes = useMemo(() => {
    let result = filter === 'all' ? quizzes : quizzes.filter((q) => q.difficulty === filter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(q) ||
          quiz.description?.toLowerCase().includes(q) ||
          quiz.type?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'difficulty-asc':
        result = [...result].sort(
          (a, b) => (difficultyOrder[a.difficulty] ?? 0) - (difficultyOrder[b.difficulty] ?? 0)
        );
        break;
      case 'difficulty-desc':
        result = [...result].sort(
          (a, b) => (difficultyOrder[b.difficulty] ?? 0) - (difficultyOrder[a.difficulty] ?? 0)
        );
        break;
      case 'xp-desc':
        result = [...result].sort((a, b) => (b.xpReward || 0) - (a.xpReward || 0));
        break;
      case 'questions-asc':
        result = [...result].sort(
          (a, b) =>
            (a.totalQuestions || a.questions?.length || 0) -
            (b.totalQuestions || b.questions?.length || 0)
        );
        break;
    }

    return result;
  }, [quizzes, filter, searchQuery, sortBy]);

  const completedCount = useMemo(
    () => quizzes.filter((q) => completedQuizIds.has(q.id)).length,
    [quizzes, completedQuizIds]
  );

  const sortLabels: Record<SortOption, string> = {
    default: 'Default',
    'difficulty-asc': 'Easiest First',
    'difficulty-desc': 'Hardest First',
    'xp-desc': 'Most XP',
    'questions-asc': 'Fewest Questions',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">Quizzes</h1>
            <p className="text-zinc-500 text-sm">
              {quizzes.length} quizzes available
              {completedCount > 0 && (
                <span className="ml-2 text-emerald-600 font-medium">· {completedCount} completed</span>
              )}
            </p>
          </div>
        </div>

        {/* Search + Sort row */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-white placeholder-zinc-400"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu((s) => !s)}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
            >
              <BarsArrowDownIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
            </button>
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-20 py-1 animate-fade-in-down">
                {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSortBy(key); setShowSortMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortBy === key
                        ? 'text-primary bg-primary/5 font-medium'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Difficulty filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filter === level
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
              {level !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({quizzes.filter((q) => q.difficulty === level).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filteredAndSortedQuizzes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
              <QuestionMarkCircleIcon className="w-10 h-10 text-zinc-400" />
            </div>
            <p className="text-zinc-500 font-medium">No quizzes found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-primary text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSortedQuizzes.map((quiz, index) => {
              const isCompleted = completedQuizIds.has(quiz.id);
              const questionCount = quiz.totalQuestions || quiz.questions?.length || 0;
              const timeEstimate = estimateTime(questionCount);

              return (
                <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
                  <Card
                    variant="interactive"
                    className={`h-full group relative ${isCompleted ? 'ring-1 ring-emerald-200 dark:ring-emerald-800' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Completed overlay badge */}
                    {isCompleted && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-sm">
                          <CheckBadgeSolid className="w-3.5 h-3.5" />
                          Done
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficultyGradients[quiz.difficulty] || 'from-zinc-400 to-zinc-500'} text-white text-xs font-medium shadow-md`}
                      >
                        {quiz.difficulty}
                      </div>
                      <Badge variant="primary" className="flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        {quiz.xpReward || 10} XP
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-primary transition-colors pr-16">
                      {quiz.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                      {quiz.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <FireIcon className="w-4 h-4" />
                          {questionCount} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {timeEstimate}
                        </span>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckBadgeIcon className="w-4 h-4" />
                        ) : (
                          <ChevronRightIcon className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
