'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
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
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const features = [
  {
    title: 'Interactive Lessons',
    description: 'Structured lessons covering vocabulary, sentences, and practical exercises for all levels.',
    icon: BookOpenIcon,
    colSpan: 'md:col-span-2',
    accentColor: '#c8a96e',
  },
  {
    title: 'Smart Flashcards',
    description: 'Spaced repetition system for effective memorization and long-term retention.',
    icon: AcademicCapIcon,
    accentColor: '#6b9bd2',
  },
  {
    title: 'Gamified Quizzes',
    description: 'Multiple quiz types with XP rewards and achievements to keep you motivated.',
    icon: FireIcon,
    accentColor: '#d4845a',
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your journey with detailed stats, streaks, and personalized insights.',
    icon: ChartBarIcon,
    accentColor: '#9b72b0',
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
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all"
              style={{
                background: isActive 
                  ? (isToday ? '#c8a96e' : 'rgba(200,169,110,0.2)')
                  : 'rgba(255,255,255,0.05)',
                color: isActive
                  ? (isToday ? '#0e0804' : '#c8a96e')
                  : '#5a4a3e',
                boxShadow: isToday ? '0 4px 12px rgba(200,169,110,0.3)' : 'none'
              }}
            >
              {isActive ? '🔥' : '·'}
            </div>
            <span 
              className="text-[10px]" 
              style={{ 
                color: isToday ? '#c8a96e' : '#5a4a3e',
                fontWeight: isToday ? 600 : 400 
              }}
            >
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
  color = '#c8a96e',
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
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
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
          <span className="text-xs font-bold" style={{ color: '#f0e6d0' }}>{Math.round(pct)}%</span>
        </div>
      </div>
      <span className="text-xs text-center leading-tight" style={{ color: '#8a7a6e' }}>{label}</span>
      <span className="text-xs font-medium" style={{ color: '#f0e6d0' }}>
        {current}/{goal}
      </span>
    </div>
  );
}

function GuestLanding() {
  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(ellipse at 20% 0%, #2a1505 0%, #0e0804 60%), radial-gradient(ellipse at 80% 100%, #12060e 0%, transparent 50%)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Grid pattern */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(200,169,110,0.025) 60px, rgba(200,169,110,0.025) 61px),
          repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(200,169,110,0.025) 60px, rgba(200,169,110,0.025) 61px)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto" style={{ animation: 'fadeUp 0.6s ease-out' }}>
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ 
                background: 'rgba(200,169,110,0.1)', 
                border: '1px solid rgba(200,169,110,0.2)',
                color: '#c8a96e'
              }}
            >
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Start your Darija journey today</span>
            </div>

            <h1 
              className="mb-8" 
              style={{ 
                fontFamily: 'Playfair Display, serif', 
                fontSize: 'clamp(42px, 8vw, 72px)', 
                fontWeight: 900, 
                color: '#f0e6d0',
                lineHeight: 1.05,
                letterSpacing: '-0.03em'
              }}
            >
              Master Moroccan Darija
              <span className="block mt-2" style={{ color: '#c8a96e' }}>the Natural Way</span>
            </h1>

            <p
              className="text-xl md:text-2xl mb-12 mx-auto"
              style={{ 
                color: '#8a7a6e', 
                maxWidth: '600px',
                fontFamily: 'Lora, serif'
              }}
            >
              Interactive lessons, smart flashcards, and engaging quizzes designed to make learning
              conversational Moroccan Arabic effortless.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              className="grid grid-cols-4 gap-8 mt-20 max-w-2xl mx-auto"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, color: '#f0e6d0', marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 14, color: '#8a7a6e' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, #0e0804, transparent)' }} />
      </section>

      {/* Features Bento Grid */}
      <section style={{ padding: '96px 0', background: 'rgba(14,8,4,0.5)', position: 'relative', zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: 'clamp(28px, 5vw, 40px)', 
              fontWeight: 700, 
              color: '#f0e6d0',
              marginBottom: 16 
            }}>
              Everything You Need to Learn
            </h2>
            <p style={{ fontSize: 18, color: '#8a7a6e', maxWidth: '600px', margin: '0 auto' }}>
              A complete platform built for modern language learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="relative overflow-hidden"
                style={{
                  background: 'rgba(26,21,8,0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(200,169,110,0.2)',
                  borderRadius: 18,
                  padding: 28,
                  transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                  gridColumn: feature.colSpan === 'md:col-span-2' ? 'span 2' : 'auto',
                  animation: `fadeUp 0.4s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                  e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = 'rgba(200,169,110,0.2)';
                }}
              >
                {/* Glow */}
                <div style={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: feature.accentColor,
                  opacity: 0.08,
                  filter: 'blur(30px)',
                }} />
                
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${feature.accentColor}33, ${feature.accentColor}11)`,
                    border: `1px solid ${feature.accentColor}44`
                  }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.accentColor }} />
                </div>
                <h3 style={{ 
                  fontFamily: 'Playfair Display, serif', 
                  fontSize: 20, 
                  fontWeight: 700, 
                  color: '#f0e6d0',
                  marginBottom: 8 
                }}>{feature.title}</h3>
                <p style={{ color: '#8a7a6e', lineHeight: 1.6 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '96px 0', background: 'rgba(26,16,8,0.3)', position: 'relative', zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: 'clamp(28px, 5vw, 40px)', 
              fontWeight: 700, 
              color: '#f0e6d0' 
            }}>
              Loved by Learners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(26,21,8,0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(200,169,110,0.15)',
                  borderRadius: 18,
                  padding: 28,
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5" style={{ color: '#c8a96e', fill: '#c8a96e' }} />
                  ))}
                </div>
                <p style={{ color: '#8a7a6e', marginBottom: 16, fontStyle: 'italic' }}>&ldquo;{testimonial.text}&rdquo;</p>
                <p style={{ fontWeight: 600, color: '#f0e6d0' }}>{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '96px 0', background: 'linear-gradient(180deg, #1a1508 0%, #0e0804 100%)', position: 'relative', zIndex: 1 }}>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontSize: 'clamp(32px, 6vw, 48px)', 
            fontWeight: 700, 
            color: '#f0e6d0',
            marginBottom: 24 
          }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ fontSize: 20, color: '#8a7a6e', marginBottom: 40, maxWidth: '500px', margin: '0 auto 40px' }}>
            Join thousands of learners mastering Moroccan Darija every day. It's free to start!
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
      <footer style={{ padding: '32px 0', borderTop: '1px solid rgba(200,169,110,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c8a96e, #a88050)' }}>
                <span className="text-white font-bold text-sm">د</span>
              </div>
              <span style={{ fontWeight: 600, color: '#8a7a6e' }}>Darija Companion</span>
            </div>
            <p style={{ fontSize: 14, color: '#5a4a3e' }}>
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
      color: '#c8a96e',
    },
    {
      label: 'Lessons\nRead',
      current: Math.min(2, completedLessonIds.size),
      goal: 2,
      color: '#6b9bd2',
    },
    {
      label: 'Quizzes\nTaken',
      current: Math.min(1, completedQuizIds.size),
      goal: 1,
      color: '#9b72b0',
    },
  ];

  const quickActions = [
    {
      title: 'Practice',
      description: 'Daily vocabulary',
      href: '/practice',
      icon: SparklesIcon,
      accentColor: '#9b72b0',
    },
    {
      title: 'Lessons',
      description: `${lessons.length} available`,
      href: '/lessons',
      icon: BookOpenIcon,
      accentColor: '#c8a96e',
    },
    {
      title: 'Vocabulary',
      description: `${vocabulary.length} words`,
      href: '/vocabulary',
      icon: AcademicCapIcon,
      accentColor: '#6b9bd2',
    },
    {
      title: 'Quizzes',
      description: `${quizzes.length} available`,
      href: '/quizzes',
      icon: FireIcon,
      accentColor: '#d4845a',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0e0804' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-2" style={{ borderColor: '#c8a96e', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(ellipse at 20% 0%, #2a1505 0%, #0e0804 60%), radial-gradient(ellipse at 80% 100%, #12060e 0%, transparent 50%)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Grid pattern */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(200,169,110,0.025) 60px, rgba(200,169,110,0.025) 61px),
          repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(200,169,110,0.025) 60px, rgba(200,169,110,0.025) 61px)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 96 }}>
        {/* Welcome Section */}
        <div className="mb-8 pt-4">
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontSize: 'clamp(28px,5vw,40px)', 
            fontWeight: 700, 
            color: '#f0e6d0',
            marginBottom: 4 
          }}>
            Welcome back, {userProfile?.displayName || 'Learner'}! 👋
          </h1>
          <p style={{ color: '#8a7a6e' }}>Continue your Darija learning journey</p>
        </div>

        {/* ── Row 1: Stats + Daily Goals ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* XP Card */}
          <div
            className="relative overflow-hidden"
            style={{
              background: 'rgba(26,21,8,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(200,169,110,0.2)',
              borderRadius: 18,
              padding: 24
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: 96, height: 96, borderRadius: '50%', background: '#c8a96e', opacity: 0.1, filter: 'blur(20px)', margin: -32 }} />
            <div style={{ position: 'relative' }}>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(200,169,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BoltIcon className="w-5 h-5" style={{ color: '#c8a96e' }} />
                </div>
                <span style={{ fontSize: 14, color: '#8a7a6e' }}>Total XP</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#f0e6d0' }}>{xp.toLocaleString()}</div>
              <div style={{ marginTop: 12 }}>
                <div className="flex justify-between text-xs mb-1" style={{ color: '#8a7a6e' }}>
                  <span>Level {level}</span>
                  <span>{Math.round(xpProgress)}% to Lv {level + 1}</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                  <div
                    style={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #c8a96e, #d4845a)', 
                      borderRadius: 100, 
                      transition: 'width 0.5s',
                      width: `${xpProgress}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Streak Card with Calendar */}
          <div
            className="relative overflow-hidden"
            style={{
              background: 'rgba(26,21,8,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(200,169,110,0.2)',
              borderRadius: 18,
              padding: 24
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: 96, height: 96, borderRadius: '50%', background: '#d4845a', opacity: 0.1, filter: 'blur(20px)', margin: -32 }} />
            <div style={{ position: 'relative' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(212,132,90,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FireIcon className="w-5 h-5" style={{ color: '#d4845a' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 14, color: '#8a7a6e' }}>Day Streak</span>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#f0e6d0' }}>{streak} days</div>
                  </div>
                </div>
              </div>
              <StreakCalendar streak={streak} />
            </div>
          </div>

          {/* Daily Goals Card */}
          <div
            style={{
              background: 'rgba(26,21,8,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(200,169,110,0.2)',
              borderRadius: 18,
              padding: 24
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CalendarDaysIcon className="w-5 h-5" style={{ color: '#c8a96e' }} />
              <span style={{ fontWeight: 600, color: '#f0e6d0' }}>Today's Goals</span>
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
          </div>
        </div>

        {/* ── Row 2: Quick Actions ── */}
        <div className="mb-6">
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: '#f0e6d0', marginBottom: 16 }}>Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div
                  className="h-full group cursor-pointer"
                  style={{
                    background: 'rgba(26,21,8,0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(200,169,110,0.2)',
                    borderRadius: 18,
                    padding: 24,
                    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 12
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                    e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.borderColor = 'rgba(200,169,110,0.2)';
                  }}
                >
                  <div
                    className="group-hover:scale-110 transition-transform"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: `linear-gradient(135deg, ${action.accentColor}33, ${action.accentColor}11)`,
                      border: `1px solid ${action.accentColor}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <action.icon className="w-7 h-7" style={{ color: action.accentColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors" style={{ fontSize: 14, color: '#f0e6d0' }}>
                      {action.title}
                    </h3>
                    <p style={{ fontSize: 12, color: '#8a7a6e' }}>{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Word of the Day Widget ── */}
        {!wotdLoading && wotd && (
          <div className="mb-6">
            <Link href="/word-of-the-day">
              <div
                className="group cursor-pointer relative overflow-hidden"
                style={{
                  background: 'rgba(26,21,8,0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(200,169,110,0.2)',
                  borderRadius: 18,
                  padding: 24,
                  transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(200,169,110,0.2)';
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 128, height: 128, borderRadius: '50%', background: 'linear-gradient(135deg, #d4845a, #c8a96e)', opacity: 0.15, filter: 'blur(30px)', margin: -32 }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #d4845a, #c8a96e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(200,169,110,0.2)'
                    }}
                  >
                    <span style={{ fontSize: 28 }}>📖</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#d4845a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Word of the Day</span>
                      {wotd.known && <Badge variant="success" className="text-xs">Known</Badge>}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f0e6d0', marginBottom: 4 }}>
                      {wotd.word?.word}
                    </h3>
                    <p style={{ fontSize: 14, color: '#8a7a6e' }}>{wotd.word?.translation}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    {!wotd.known && (
                      <Button size="sm" variant="secondary" onClick={(e) => { e.preventDefault(); markKnown(); }}>
                        I Know This
                      </Button>
                    )}
                    <ArrowRightIcon className="w-5 h-5" style={{ color: '#8a7a6e' }} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ── Row 3: Learning Path + Featured Quiz ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personalized Learning Path */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: '#f0e6d0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <SparklesIcon className="w-5 h-5" style={{ color: '#c8a96e' }} />
              Your Learning Path
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {lessons.slice(0, 3).map((lesson, i) => {
                const isDone = completedLessonIds.has(lesson.id);
                const isNext = !isDone && lesson.id === nextLesson?.id;
                return (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: 16,
                        borderRadius: 16,
                        border: '1px solid',
                        borderColor: isDone 
                          ? 'rgba(16,185,129,0.3)' 
                          : isNext 
                          ? 'rgba(200,169,110,0.4)'
                          : 'rgba(200,169,110,0.15)',
                        background: isDone 
                          ? 'rgba(16,185,129,0.05)' 
                          : 'rgba(26,21,8,0.4)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          background: isDone 
                            ? '#10b981' 
                            : isNext 
                            ? '#c8a96e'
                            : 'rgba(255,255,255,0.1)'
                        }}
                      >
                        {isDone ? (
                          <CheckCircleSolid className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white font-bold text-sm">{i + 1}</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <h3
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: isDone ? '#10b981' : '#f0e6d0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {lesson.title}
                          </h3>
                          {isNext && (
                            <span style={{ fontSize: 10, background: '#c8a96e', color: '#0e0804', padding: '2px 8px', borderRadius: 100, fontWeight: 600, flexShrink: 0 }}>
                              Next
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <Badge variant={isDone ? 'success' : 'default'} className="text-xs">
                            {lesson.difficulty}
                          </Badge>
                          {lesson.duration && (
                            <span style={{ fontSize: 12, color: '#5a4a3e', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <ClockIcon className="w-3 h-3" />
                              {lesson.duration} min
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRightIcon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: isDone ? '#10b981' : '#8a7a6e' }}
                      />
                    </div>
                  </Link>
                );
              })}
              {lessons.length > 3 && (
                <Link href="/lessons">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: 12,
                    borderRadius: 12,
                    border: '1px dashed rgba(200,169,110,0.3)',
                    color: '#8a7a6e',
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}>
                    View all {lessons.length} lessons
                    <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Right column: Featured Quiz + Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Featured Quiz */}
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: '#f0e6d0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrophyIcon className="w-5 h-5" style={{ color: '#9b72b0' }} />
                Test Your Knowledge
              </h2>
              {quizzes.length > 0 ? (
                <Link href={`/quizzes/${quizzes[0].id}`}>
                  <div
                    className="group cursor-pointer"
                    style={{
                      background: 'rgba(26,21,8,0.6)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(200,169,110,0.2)',
                      borderRadius: 18,
                      padding: 20,
                      transition: 'all 0.22s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 14,
                          background: 'linear-gradient(135deg, #d4845a, #c8a96e)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 8px 24px rgba(200,169,110,0.2)'
                        }}
                      >
                        <FireIcon className="w-8 h-8 text-white" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Badge variant="default" className="mb-2">
                          {quizzes[0].xpReward || 10} XP
                        </Badge>
                        <h3 style={{ fontWeight: 600, color: '#f0e6d0', marginBottom: 4 }}>{quizzes[0].title}</h3>
                        <p style={{ fontSize: 14, color: '#8a7a6e', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2 }}>{quizzes[0].description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div style={{
                  background: 'rgba(26,21,8,0.6)',
                  border: '1px solid rgba(200,169,110,0.15)',
                  borderRadius: 18,
                  padding: 32,
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#8a7a6e' }}>No quizzes available yet</p>
                </div>
              )}
            </div>

            {/* Progress Summary */}
            <div
              style={{
                background: 'rgba(26,21,8,0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(200,169,110,0.2)',
                borderRadius: 18,
                padding: 20
              }}
            >
              <h3 style={{ fontWeight: 600, color: '#f0e6d0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ChartBarIcon className="w-5 h-5" style={{ color: '#c8a96e' }} />
                Progress Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: '#8a7a6e' }}>Lessons</span>
                    <span style={{ fontWeight: 500, color: '#f0e6d0' }}>
                      {completedLessonIds.size}/{lessons.length}
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: '#10b981',
                        borderRadius: 100,
                        width: lessons.length > 0 ? `${(completedLessonIds.size / lessons.length) * 100}%` : '0%'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: '#8a7a6e' }}>Quizzes</span>
                    <span style={{ fontWeight: 500, color: '#f0e6d0' }}>
                      {completedQuizIds.size}/{quizzes.length}
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: '#9b72b0',
                        borderRadius: 100,
                        width: quizzes.length > 0 ? `${(completedQuizIds.size / quizzes.length) * 100}%` : '0%'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: '#8a7a6e' }}>Vocabulary</span>
                    <span style={{ fontWeight: 500, color: '#f0e6d0' }}>
                      {userProfile?.vocabularyLearned || 0}/{vocabulary.length}
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: '#6b9bd2',
                        borderRadius: 100,
                        width: vocabulary.length > 0 ? `${((userProfile?.vocabularyLearned || 0) / vocabulary.length) * 100}%` : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0e0804' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-2" style={{ borderColor: '#c8a96e', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (user && userProfile) {
    return <UserDashboard userProfile={userProfile} />;
  }

  return <GuestLanding />;
}
