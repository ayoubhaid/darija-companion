'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Quiz } from '@/types';
import { getAllQuizzes } from '@/lib/firestore';
import { 
  FireIcon, 
  ClockIcon, 
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const difficultyGradients: Record<string, string> = {
  beginner: 'from-emerald-500 to-teal-600',
  intermediate: 'from-yellow-500 to-orange-500',
  advanced: 'from-red-500 to-rose-600',
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const filteredQuizzes = filter === 'all' 
    ? quizzes 
    : quizzes.filter(q => q.difficulty === filter);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Quizzes
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Test your Darija knowledge with interactive quizzes
          </p>
        </div>

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
            </button>
          ))}
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
              <QuestionMarkCircleIcon className="w-10 h-10 text-zinc-400" />
            </div>
            <p className="text-zinc-500">No quizzes found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredQuizzes.map((quiz, index) => (
              <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
                <Card variant="interactive" className="h-full group" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficultyGradients[quiz.difficulty]} text-white text-xs font-medium shadow-md`}>
                      {quiz.difficulty}
                    </div>
                    <Badge variant="primary" className="flex items-center gap-1">
                      <StarIcon className="w-3 h-3" />
                      {quiz.xpReward || 10} XP
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center text-sm text-zinc-500">
                      <FireIcon className="w-4 h-4 mr-1" />
                      {quiz.totalQuestions || quiz.questions?.length || 0} questions
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                      <ChevronRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
