'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ZelligeBackground from '@/components/ZelijBackground';
import VocabularyWave from '@/components/VocabularyWave';
import { getAllLessons, getAllVocabulary, getAllQuizzes } from '@/lib/firestore';
import { useWordOfTheDay } from '@/hooks/useWordOfTheDay';
import { Lesson, Quiz, VocabularyItem } from '@/types';
import {
  BookOpenIcon,
  AcademicCapIcon,
  FireIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon,
  StarIcon,
  TrophyIcon,
  BoltIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const features = [
  {
    title: 'Interactive Lessons',
    description: 'Structured lessons covering vocabulary, sentences, and practical exercises for all levels.',
    icon: BookOpenIcon,
    colSpan: 'md:col-span-2',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Smart Flashcards',
    description: 'Spaced repetition system for effective memorization and long-term retention.',
    icon: AcademicCapIcon,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Gamified Quizzes',
    description: 'Multiple quiz types with XP rewards and achievements to keep you motivated.',
    icon: FireIcon,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your journey with detailed stats, streaks, and personalized insights.',
    icon: ChartBarIcon,
    gradient: 'from-violet-500 to-purple-600',
  },
];

const stats = [
  { label: 'Lessons', value: '20+' },
  { label: 'Words', value: '500+' },
  { label: 'Learners', value: '1K+' },
  { label: 'Quizzes', value: '50+' },
];

const testimonials = [
  { name: 'Sarah M.', text: 'Finally learning Darija feels natural! The flashcards are genius.' },
  { name: 'Ahmed K.', text: 'Best app for Moroccan Arabic. Progressed faster than expected.' },
  { name: 'Lisa R.', text: 'Love the gamification. Makes learning feel like a game!' },
];

// ─── Streak Calendar (last 7 days) ───────────────────────────────────────────
function StreakCalendar({ streak }: { streak: number }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay(); // 0=Sun
  // Map to Mon-Sun index
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="flex items-center gap-1.5">
      {days.map((day, i) => {
        const isActive = streak > 0 && i <= todayIdx && i >= Math.max(0, todayIdx - streak + 1);
        const isToday = i === todayIdx;
        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                isActive
                  ? isToday
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-orange-200 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              }`}
            >
              {isActive ? '🔥' : '·'}
            </div>
            <span className={`text-[10px] ${isToday ? 'text-orange-500 font-semibold' : 'text-zinc-400'}`}>
              {day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Daily Goal Ring ──────────────────────────────────────────────────────────
function DailyGoalRing({
  current,
  goal,
  label,
  color = '#10B981',
}: {
  current: number;
  goal: number;
  label: string;
  color?: string;
}) {
  const pct = Math.min(100, (current / goal) * 100);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-zinc-200 dark:text-zinc-700" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-zinc-900 dark:text-white">{Math.round(pct)}%</span>
        </div>
      </div>
      <span className="text-xs text-zinc-500 text-center leading-tight">{label}</span>
      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {current}/{goal}
      </span>
    </div>
  );
}

function GuestLanding() {
  return (
    <div className="min-h-screen">
      <ZelligeBackground />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
              <SparklesIcon className="w-4 h-4" />
              Start your Darija journey today
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 mb-8 tracking-tight animate-fade-in-up">
              Master Moroccan Darija
              <span className="block mt-2 text-gradient">the Natural Way</span>
            </h1>

            <p
              className="text-xl md:text-2xl text-zinc-700 max-w-2xl mx-auto mb-12 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              Interactive lessons, smart flashcards, and engaging quizzes designed to make learning
              conversational Moroccan Arabic effortless.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Link href="/signup">
                <Button size="lg" variant="glow" className="w-full sm:w-auto">
                  Start Learning Free
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/lessons">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Browse Lessons
                </Button>
              </Link>
            </div>

            <div
              className="grid grid-cols-4 gap-8 mt-20 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-zinc-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 bg-white dark:bg-zinc-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              A complete platform built for modern language learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="interactive"
                className={feature.colSpan}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Loved by Learners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="default" className="relative">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="font-semibold text-zinc-900 dark:text-white">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-900 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Join thousands of learners mastering Moroccan Darija every day. It&apos;s free to start!
          </p>
          <Link href="/signup">
            <Button size="lg" variant="glow" className="px-10 py-4 text-lg">
              Create Free Account
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">د</span>
              </div>
              <span className="text-lg font-bold text-zinc-300">Darija Companion</span>
            </div>
            <p className="text-sm text-zinc-500">
              © 2024 Built for the Moroccan Arabic learning community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function UserDashboard({ userProfile }: { userProfile: any }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { wotd, loading: wotdLoading, markKnown } = useWordOfTheDay();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsData, quizzesData, vocabData] = await Promise.all([
          getAllLessons(),
          getAllQuizzes(),
          getAllVocabulary(),
        ]);
        setLessons(lessonsData);
        setQuizzes(quizzesData);
        setVocabulary(vocabData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const xp = userProfile?.xp || 0;
  const level = userProfile?.level || 1;
  const streak = userProfile?.streak || 0;
  const xpToNextLevel = level * 100;
  const xpProgress = ((xp % xpToNextLevel) / xpToNextLevel) * 100;

  const completedLessonIds = useMemo(
    () => new Set(userProfile?.completedLessons || []),
    [userProfile]
  );
  const completedQuizIds = useMemo(
    () => new Set(userProfile?.completedQuizzes || []),
    [userProfile]
  );

  // Recommended next lesson (first not completed)
  const nextLesson = useMemo(
    () => lessons.find((l) => !completedLessonIds.has(l.id)),
    [lessons, completedLessonIds]
  );

  // Daily goals
  const dailyGoals = [
    {
      label: 'Words\nPracticed',
      current: Math.min(10, userProfile?.vocabularyLearned || 0),
      goal: 10,
      color: '#10B981',
    },
    {
      label: 'Lessons\nRead',
      current: Math.min(2, completedLessonIds.size),
      goal: 2,
      color: '#06B6D4',
    },
    {
      label: 'Quizzes\nTaken',
      current: Math.min(1, completedQuizIds.size),
      goal: 1,
      color: '#8B5CF6',
    },
  ];

  const quickActions = [
    {
      title: 'Practice',
      description: 'Daily vocabulary',
      href: '/practice',
      icon: SparklesIcon,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Lessons',
      description: `${lessons.length} available`,
      href: '/lessons',
      icon: BookOpenIcon,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Vocabulary',
      description: `${vocabulary.length} words`,
      href: '/vocabulary',
      icon: AcademicCapIcon,
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Quizzes',
      description: `${quizzes.length} available`,
      href: '/quizzes',
      icon: FireIcon,
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-24 md:pb-12">
      <ZelligeBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-1">
            Welcome back, {userProfile?.displayName || 'Learner'}! 👋
          </h1>
          <p className="text-zinc-500">Continue your Darija learning journey</p>
        </div>

        {/* ── Row 1: Stats + Daily Goals ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* XP Card */}
          <Card variant="default" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-8 -mt-8" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BoltIcon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Total XP</span>
              </div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">{xp.toLocaleString()}</div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>Level {level}</span>
                  <span>{Math.round(xpProgress)}% to Lv {level + 1}</span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Streak Card with Calendar */}
          <Card variant="default" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-8 -mt-8" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <FireIcon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Day Streak</span>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{streak} days</div>
                  </div>
                </div>
              </div>
              <StreakCalendar streak={streak} />
            </div>
          </Card>

          {/* Daily Goals Card */}
          <Card variant="default">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDaysIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-zinc-900 dark:text-white">Today&apos;s Goals</span>
            </div>
            <div className="flex items-center justify-around">
              {dailyGoals.map((goal) => (
                <DailyGoalRing
                  key={goal.label}
                  current={goal.current}
                  goal={goal.goal}
                  label={goal.label}
                  color={goal.color}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* ── Row 2: Quick Actions ── */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card variant="interactive" className="h-full group">
                  <div className="flex flex-col items-center text-center gap-3 py-2">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-primary transition-colors text-sm">
                        {action.title}
                      </h3>
                      <p className="text-xs text-zinc-500">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Word of the Day Widget ── */}
        {!wotdLoading && wotd && (
          <div className="mb-6">
            <Link href="/word-of-the-day">
              <Card variant="interactive" className="group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full -mr-16 -mt-16 opacity-20" />
                <div className="relative flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-3xl">📖</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Word of the Day</span>
                      {wotd.known && <Badge variant="success" className="text-xs">Known</Badge>}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      {wotd.darija}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{wotd.meaning}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {!wotd.known && (
                      <Button size="sm" variant="secondary" onClick={(e) => { e.preventDefault(); markKnown(); }}>
                        I Know This
                      </Button>
                    )}
                    <ArrowRightIcon className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* ── Row 3: Learning Path + Featured Quiz ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personalized Learning Path */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-primary" />
              Your Learning Path
            </h2>
            <div className="space-y-3">
              {lessons.slice(0, 3).map((lesson, i) => {
                const isDone = completedLessonIds.has(lesson.id);
                const isNext = !isDone && lesson.id === nextLesson?.id;
                return (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                    <div
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                          : isNext
                          ? 'bg-white dark:bg-zinc-900 border-primary/40 shadow-glow-sm hover:shadow-glow-md'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? 'bg-emerald-500'
                            : isNext
                            ? 'bg-primary'
                            : 'bg-zinc-200 dark:bg-zinc-700'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircleSolid className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white font-bold text-sm">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold text-sm truncate ${
                              isDone
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-zinc-900 dark:text-white group-hover:text-primary'
                            }`}
                          >
                            {lesson.title}
                          </h3>
                          {isNext && (
                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                              Next
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={isDone ? 'success' : 'secondary'} className="text-xs">
                            {lesson.difficulty}
                          </Badge>
                          {lesson.duration && (
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {lesson.duration} min
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRightIcon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isDone ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-primary'
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}
              {lessons.length > 3 && (
                <Link href="/lessons">
                  <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-primary hover:border-primary/40 transition-all text-sm font-medium">
                    View all {lessons.length} lessons
                    <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Right column: Featured Quiz + Stats */}
          <div className="space-y-4">
            {/* Featured Quiz */}
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-violet-500" />
                Test Your Knowledge
              </h2>
              {quizzes.length > 0 ? (
                <Link href={`/quizzes/${quizzes[0].id}`}>
                  <Card variant="interactive" className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                        <FireIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="primary" className="mb-2">
                          {quizzes[0].xpReward || 10} XP
                        </Badge>
                        <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-primary transition-colors truncate">
                          {quizzes[0].title}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-2">{quizzes[0].description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card variant="default" className="text-center py-8">
                  <p className="text-zinc-500">No quizzes available yet</p>
                </Card>
              )}
            </div>

            {/* Progress Summary */}
            <Card variant="default">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-primary" />
                Progress Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400">Lessons</span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {completedLessonIds.size}/{lessons.length}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: lessons.length > 0 ? `${(completedLessonIds.size / lessons.length) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400">Quizzes</span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {completedQuizIds.size}/{quizzes.length}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all duration-500"
                      style={{
                        width: quizzes.length > 0 ? `${(completedQuizIds.size / quizzes.length) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400">Vocabulary</span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {userProfile?.vocabularyLearned || 0}/{vocabulary.length}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                      style={{
                        width:
                          vocabulary.length > 0
                            ? `${((userProfile?.vocabularyLearned || 0) / vocabulary.length) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex justify-center mt-8 pb-12">
          <VocabularyWave />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (user && userProfile) {
    return <UserDashboard userProfile={userProfile} />;
  }

  return <GuestLanding />;
}
