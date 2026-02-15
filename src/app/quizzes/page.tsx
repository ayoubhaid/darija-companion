'use client';

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
} from '@heroicons/react/24/outline';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const filteredQuizzes = filter === 'all' 
    ? quizzes 
    : quizzes.filter(q => q.difficulty === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quizzes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your Darija knowledge with interactive quizzes
          </p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === level
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <QuestionMarkCircleIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No quizzes found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
                <Card variant="interactive" className="h-full">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={quiz.difficulty === 'beginner' ? 'success' : quiz.difficulty === 'intermediate' ? 'warning' : 'danger'}>
                      {quiz.difficulty}
                    </Badge>
                    <Badge variant="primary">
                      {quiz.xpReward || 10} XP
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm text-gray-500">
                      <FireIcon className="w-4 h-4 mr-1" />
                      {quiz.totalQuestions || quiz.questions?.length || 0} questions
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-primary-500" />
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
