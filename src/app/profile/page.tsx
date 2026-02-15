'use client';

import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { 
  UserIcon,
  FireIcon,
  StarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const xpToNextLevel = (userProfile?.level || 1) * 100;
  const currentLevelXP = (userProfile?.xp || 0) % xpToNextLevel;
  const progressToNextLevel = (currentLevelXP / xpToNextLevel) * 100;

  const stats = [
    {
      label: 'Total XP',
      value: userProfile?.totalXP || userProfile?.xp || 0,
      icon: StarIcon,
      color: 'text-primary-500',
    },
    {
      label: 'Current Streak',
      value: `${userProfile?.streak || 0} days`,
      icon: FireIcon,
      color: 'text-accent-500',
    },
    {
      label: 'Lessons Completed',
      value: userProfile?.completedLessons?.length || 0,
      icon: BookOpenIcon,
      color: 'text-secondary-500',
    },
    {
      label: 'Quizzes Completed',
      value: userProfile?.completedQuizzes?.length || 0,
      icon: TrophyIcon,
      color: 'text-green-500',
    },
  ];

  const achievements = [
    { name: 'First Lesson', earned: (userProfile?.completedLessons?.length || 0) > 0 },
    { name: 'Quiz Master', earned: (userProfile?.completedQuizzes?.length || 0) >= 5 },
    { name: 'Week Streak', earned: (userProfile?.streak || 0) >= 7 },
    { name: '100 XP Club', earned: (userProfile?.totalXP || 0) >= 100 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user?.displayName || 'Learner'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {user?.email}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <Badge variant="primary" className="text-lg px-4 py-1">
                  Level {userProfile?.level || 1}
                </Badge>
                <Badge variant="secondary">
                  {userProfile?.xp || 0} XP
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progress to Level {((userProfile?.level || 1) + 1)}</span>
              <span className="text-gray-600 dark:text-gray-400">{currentLevelXP}/{xpToNextLevel} XP</span>
            </div>
            <Progress value={progressToNextLevel} />
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Achievements
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.name}
                className={`flex items-center p-3 rounded-lg ${
                  achievement.earned 
                    ? 'bg-primary-50 dark:bg-primary-900/30' 
                    : 'bg-gray-50 dark:bg-slate-700 opacity-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  achievement.earned ? 'bg-primary-500' : 'bg-gray-300 dark:bg-slate-600'
                }`}>
                  <StarIcon className={`w-5 h-5 ${achievement.earned ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <span className={`font-medium ${achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
