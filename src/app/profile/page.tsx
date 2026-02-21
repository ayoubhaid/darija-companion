'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { getAchievementsForUser, ACHIEVEMENTS } from '@/lib/achievements';
import {
  UserIcon,
  FireIcon,
  StarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({
  value,
  max,
  label,
  sublabel,
  color = '#10B981',
  size = 80,
}: {
  value: number;
  max: number;
  label: string;
  sublabel?: string;
  color?: string;
  size?: number;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-zinc-200 dark:text-zinc-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-zinc-900 dark:text-white">{Math.round(pct)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{label}</p>
        {sublabel && <p className="text-xs text-zinc-500">{sublabel}</p>}
      </div>
    </div>
  );
}

// ─── 7-Day Activity Chart (CSS bars) ─────────────────────────────────────────
function ActivityChart({ streak }: { streak: number }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  // Simulate activity data based on streak
  const activityData = days.map((_, i) => {
    if (i > todayIdx) return 0;
    const daysAgo = todayIdx - i;
    if (daysAgo < streak) {
      // Active days get random-ish values based on position
      return 40 + ((i * 17 + 30) % 60);
    }
    return 0;
  });

  const maxVal = Math.max(...activityData, 1);

  return (
    <div>
      <div className="flex items-end gap-2 h-24">
        {activityData.map((val, i) => {
          const height = val > 0 ? Math.max(8, (val / maxVal) * 100) : 4;
          const isToday = i === todayIdx;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-md transition-all duration-500 ${
                  val > 0
                    ? isToday
                      ? 'bg-primary'
                      : 'bg-primary/40 dark:bg-primary/30'
                    : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-2">
        {days.map((day, i) => (
          <div key={day} className="flex-1 text-center">
            <span
              className={`text-[10px] font-medium ${
                i === todayIdx ? 'text-primary' : 'text-zinc-400'
              }`}
            >
              {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 30-Day Heatmap ───────────────────────────────────────────────────────────
function StreakHeatmap({ streak }: { streak: number }) {
  const cells = Array.from({ length: 30 }, (_, i) => {
    const daysAgo = 29 - i;
    const isActive = daysAgo < streak;
    const intensity = isActive ? Math.min(1, (streak - daysAgo) / streak) : 0;
    return { daysAgo, isActive, intensity };
  });

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {cells.map((cell, i) => (
          <div
            key={i}
            title={cell.isActive ? `${cell.daysAgo} days ago — active` : `${cell.daysAgo} days ago`}
            className={`w-5 h-5 rounded-sm transition-all ${
              cell.isActive
                ? cell.daysAgo === 0
                  ? 'bg-orange-500'
                  : 'bg-orange-300 dark:bg-orange-700'
                : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-400 mt-2">Last 30 days activity</p>
    </div>
  );
}

type AchievementTab = 'all' | 'earned' | 'available';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const [achievementTab, setAchievementTab] = useState<AchievementTab>('all');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const userStats = {
    lessonsCompleted: userProfile?.lessonsCompleted || userProfile?.completedLessons?.length || 0,
    quizzesCompleted: userProfile?.quizzesCompleted || userProfile?.completedQuizzes?.length || 0,
    vocabularyLearned: userProfile?.vocabularyLearned || 0,
    streak: userProfile?.streak || 0,
    level: userProfile?.level || 1,
  };

  const { earned, available } = getAchievementsForUser(userStats);
  const nextAchievement = available[0];

  const xpToNextLevel = userStats.level * 100;
  const currentLevelXP = (userProfile?.xp || 0) % xpToNextLevel;
  const progressToNextLevel = (currentLevelXP / xpToNextLevel) * 100;

  const stats = [
    {
      label: 'Total XP',
      value: userProfile?.totalXP || userProfile?.xp || 0,
      icon: StarIcon,
      color: 'text-primary',
    },
    {
      label: 'Current Streak',
      value: `${userStats.streak} days`,
      icon: FireIcon,
      color: 'text-orange-500',
    },
    {
      label: 'Lessons',
      value: userStats.lessonsCompleted,
      icon: BookOpenIcon,
      color: 'text-emerald-500',
    },
    {
      label: 'Quizzes',
      value: userStats.quizzesCompleted,
      icon: TrophyIcon,
      color: 'text-violet-500',
    },
  ];

  // Recent activity (simulated from profile data)
  const recentActivity = useMemo(() => {
    const items: { icon: React.ElementType; text: string; time: string; color: string }[] = [];
    if (userStats.quizzesCompleted > 0) {
      items.push({ icon: TrophyIcon, text: `Completed ${userStats.quizzesCompleted} quiz${userStats.quizzesCompleted > 1 ? 'zes' : ''}`, time: 'Recently', color: 'text-violet-500' });
    }
    if (userStats.lessonsCompleted > 0) {
      items.push({ icon: BookOpenIcon, text: `Finished ${userStats.lessonsCompleted} lesson${userStats.lessonsCompleted > 1 ? 's' : ''}`, time: 'Recently', color: 'text-emerald-500' });
    }
    if (userStats.vocabularyLearned > 0) {
      items.push({ icon: AcademicCapIcon, text: `Learned ${userStats.vocabularyLearned} vocabulary words`, time: 'Recently', color: 'text-cyan-500' });
    }
    if (userStats.streak > 0) {
      items.push({ icon: FireIcon, text: `${userStats.streak}-day learning streak`, time: 'Ongoing', color: 'text-orange-500' });
    }
    if (earned.length > 0) {
      items.push({ icon: SparklesIcon, text: `Earned "${earned[earned.length - 1]?.name}" achievement`, time: 'Recently', color: 'text-primary' });
    }
    return items.slice(0, 5);
  }, [userStats, earned]);

  const filteredAchievements = useMemo(() => {
    if (achievementTab === 'earned') return earned;
    if (achievementTab === 'available') return available;
    return [...earned, ...available];
  }, [achievementTab, earned, available]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card padding="lg" className="mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-glow-md">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                {user?.displayName || 'Learner'}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">{user?.email}</p>

              <div className="flex items-center justify-center md:justify-start gap-3">
                <Badge variant="primary" className="text-lg px-4 py-1">
                  Level {userStats.level}
                </Badge>
                <Badge variant="secondary">{userProfile?.xp || 0} XP</Badge>
                {userStats.streak > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FireIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-orange-500">{userStats.streak} day streak</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-600 dark:text-zinc-400">
                Progress to Level {userStats.level + 1}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {currentLevelXP}/{xpToNextLevel} XP
              </span>
            </div>
            <Progress value={progressToNextLevel} />
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* ── Activity + Heatmap ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 7-Day Activity Chart */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-primary" />
              7-Day Activity
            </h2>
            <ActivityChart streak={userStats.streak} />
          </Card>

          {/* 30-Day Heatmap */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-orange-500" />
              Streak Calendar
            </h2>
            <StreakHeatmap streak={userStats.streak} />
          </Card>
        </div>

        {/* ── Progress Rings ── */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-primary" />
            Learning Coverage
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <ProgressRing
              value={userStats.vocabularyLearned}
              max={500}
              label="Vocabulary"
              sublabel={`${userStats.vocabularyLearned}/500 words`}
              color="#10B981"
              size={90}
            />
            <ProgressRing
              value={userStats.lessonsCompleted}
              max={20}
              label="Lessons"
              sublabel={`${userStats.lessonsCompleted}/20 done`}
              color="#06B6D4"
              size={90}
            />
            <ProgressRing
              value={userStats.quizzesCompleted}
              max={50}
              label="Quizzes"
              sublabel={`${userStats.quizzesCompleted}/50 done`}
              color="#8B5CF6"
              size={90}
            />
          </div>
        </Card>

        {/* ── Recent Activity Feed ── */}
        {recentActivity.length > 0 && (
          <Card padding="lg" className="mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-zinc-500" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div className={`w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{item.text}</p>
                  </div>
                  <span className="text-xs text-zinc-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Achievements with Tabs ── */}
        <Card padding="lg" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Achievements</h2>
            <Badge variant="primary">
              {earned.length}/{ACHIEVEMENTS.length}
            </Badge>
          </div>

          {/* Achievement Tabs */}
          <div className="flex gap-1 mb-6 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            {(['all', 'earned', 'available'] as AchievementTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setAchievementTab(tab)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  achievementTab === tab
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'earned' && earned.length > 0 && (
                  <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {earned.length}
                  </span>
                )}
                {tab === 'available' && available.length > 0 && (
                  <span className="ml-1.5 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-500 px-1.5 py-0.5 rounded-full">
                    {available.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Next Achievement Progress */}
          {nextAchievement && achievementTab !== 'earned' && (
            <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <SparklesIcon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Next Achievement
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{nextAchievement.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{nextAchievement.name}</h3>
                  <p className="text-sm text-zinc-500">{nextAchievement.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Achievement Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredAchievements.map((achievement) => {
              const isEarned = earned.some((e) => e.id === achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isEarned
                      ? 'bg-primary/5 border border-primary/20'
                      : 'bg-zinc-50 dark:bg-zinc-800 opacity-50'
                  }`}
                >
                  <span className={`text-2xl ${!isEarned ? 'grayscale' : ''}`}>
                    {achievement.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                      {achievement.name}
                    </div>
                    {isEarned ? (
                      <div className="text-xs text-primary flex items-center gap-1">
                        <CheckCircleSolid className="w-3 h-3" />
                        +{achievement.xpReward} XP
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-500 truncate">{achievement.description}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              {achievementTab === 'earned'
                ? 'No achievements earned yet. Keep learning!'
                : 'All achievements unlocked! 🎉'}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
