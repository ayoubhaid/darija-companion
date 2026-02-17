'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import VocabularyWave from '@/components/VocabularyWave';
import { Lesson } from '@/types';
import { getAllLessons } from '@/lib/firestore';
import { 
  BookOpenIcon, 
  ClockIcon, 
  ChevronRightIcon,
  FireIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const difficultyColors = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
} as const;

const difficultyGradients = {
  beginner: 'from-emerald-500 to-teal-600',
  intermediate: 'from-yellow-500 to-orange-500',
  advanced: 'from-red-500 to-rose-600',
} as const;

export default function LessonsPage() {
  const { user, loading: authLoading } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getAllLessons();
        setLessons(data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchLessons();
    }
  }, [authLoading]);

  const filteredLessons = useMemo(() => {
    let filtered = filter === 'all' 
      ? lessons 
      : lessons.filter(l => l.difficulty === filter);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.topic?.toLowerCase().includes(query) ||
        l.tags?.some(t => t.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [lessons, filter, searchQuery]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Lessons
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Master Moroccan Darija with our structured lessons
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
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

        {filteredLessons.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
              <BookOpenIcon className="w-10 h-10 text-zinc-400" />
            </div>
            <p className="text-zinc-500">No lessons found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLessons.map((lesson, index) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                <Card variant="interactive" className="h-full group" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficultyGradients[lesson.difficulty]} text-white text-xs font-medium shadow-md`}>
                      {lesson.difficulty}
                    </div>
                    <div className="flex items-center text-sm text-zinc-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {lesson.duration || lesson.estimatedDuration || 15} min
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                    {lesson.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center text-sm text-zinc-500">
                      <BookOpenIcon className="w-4 h-4 mr-1" />
                      {lesson.content?.vocabulary?.length || 0} words
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

      <div className="flex justify-center mt-12">
        <VocabularyWave />
      </div>
    </div>
  );
}
