'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ZelligeBackground from '@/components/ZelligeBackground';
import { getAllLessons, getAllVocabulary, getAllQuizzes } from '@/lib/firestore';
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
  PlayIcon
} from '@heroicons/react/24/outline';

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
            
            <p className="text-xl md:text-2xl text-zinc-700 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Interactive lessons, smart flashcards, and engaging quizzes designed to make learning conversational Moroccan Arabic effortless.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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

            <div className="grid grid-cols-4 gap-8 mt-20 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsData, quizzesData, vocabData] = await Promise.all([
          getAllLessons(),
          getAllQuizzes(),
          getAllVocabulary()
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
  const xpProgress = (xp % xpToNextLevel) / xpToNextLevel * 100;

  const quickActions = [
    { 
      title: 'Practice', 
      description: 'Daily vocabulary',
      href: '/practice', 
      icon: SparklesIcon,
      gradient: 'from-violet-500 to-purple-600'
    },
    { 
      title: 'Lessons', 
      description: `${lessons.length} available`,
      href: '/lessons', 
      icon: BookOpenIcon,
      gradient: 'from-emerald-500 to-teal-600'
    },
    { 
      title: 'Vocabulary', 
      description: `${vocabulary.length} words`,
      href: '/vocabulary', 
      icon: AcademicCapIcon,
      gradient: 'from-cyan-500 to-blue-600'
    },
    { 
      title: 'Quizzes', 
      description: `${quizzes.length} available`,
      href: '/quizzes', 
      icon: FireIcon,
      gradient: 'from-orange-500 to-red-500'
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <ZelligeBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Welcome back, {userProfile?.displayName || 'Learner'}!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Continue your Darija learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  <span>{Math.round(xpProgress)}%</span>
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

          {/* Streak Card */}
          <Card variant="default" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-8 -mt-8" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <FireIcon className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Day Streak</span>
              </div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">{streak} days</div>
              <p className="text-sm text-zinc-500 mt-3">Keep learning daily!</p>
            </div>
          </Card>

          {/* Quizzes Completed Card */}
          <Card variant="default" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full -mr-8 -mt-8" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <TrophyIcon className="w-5 h-5 text-violet-500" />
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Completed</span>
              </div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                {userProfile?.quizzesCompleted || 0} Quizzes
              </div>
              <p className="text-sm text-zinc-500 mt-3">
                {userProfile?.lessonsCompleted || 0} Lessons completed
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card variant="interactive" className="h-full group">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-zinc-500">{action.description}</p>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-zinc-400 ml-auto group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Lesson */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Featured Lesson</h2>
            {lessons.length > 0 ? (
              <Link href={`/lessons/${lessons[0].id}`}>
                <Card variant="interactive" className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <BookOpenIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="success" className="mb-2">{lessons[0].difficulty}</Badge>
                      <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                        {lessons[0].title}
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2">{lessons[0].description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : (
              <Card variant="default" className="text-center py-8">
                <p className="text-zinc-500">No lessons available yet</p>
              </Card>
            )}
          </div>

          {/* Featured Quiz */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Test Your Knowledge</h2>
            {quizzes.length > 0 ? (
              <Link href={`/quizzes/${quizzes[0].id}`}>
                <Card variant="interactive" className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <FireIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="primary" className="mb-2">{quizzes[0].xpReward || 10} XP</Badge>
                      <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
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
