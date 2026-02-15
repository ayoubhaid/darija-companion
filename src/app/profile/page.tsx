'use client';

export const dynamic = 'force-dynamic';

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
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                {user?.email}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Badge variant="primary" className="text-lg px-4 py-1">
                  Level {userStats.level}
                </Badge>
                <Badge variant="secondary">
                  {userProfile?.xp || 0} XP
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-600 dark:text-zinc-400">Progress to Level {userStats.level + 1}</span>
              <span className="text-zinc-600 dark:text-zinc-400">{currentLevelXP}/{xpToNextLevel} XP</span>
            </div>
            <Progress value={progressToNextLevel} />
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Achievements Section */}
        <Card padding="lg" className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Achievements
            </h2>
            <Badge variant="primary">
              {earned.length}/{ACHIEVEMENTS.length}
            </Badge>
          </div>

          {/* Next Achievement Progress */}
          {nextAchievement && (
            <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <SparklesIcon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Next Achievement</span>
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

          {/* Earned Achievements */}
          {earned.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Earned</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {earned.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white text-sm">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-zinc-500">+{achievement.xpReward} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Achievements */}
          {available.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Available</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {available.slice(0, 6).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl opacity-50"
                  >
                    <span className="text-2xl grayscale">{achievement.icon}</span>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-white text-sm">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-zinc-500">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
