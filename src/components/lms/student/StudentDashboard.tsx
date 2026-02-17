'use client';

import { useState, useEffect } from 'react';
import { Course, Enrollment, CourseProgress, UserProfile } from '@/types/lms';
import { 
  BookOpen, 
  Award, 
  Zap, 
  Clock, 
  TrendingUp,
  Play,
  ChevronRight,
  Target,
  Flame,
  Trophy,
  Star,
  Lock,
  CheckCircle
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface StudentDashboardProps {
  user: UserProfile;
  enrollments: Enrollment[];
  courses: Course[];
  courseProgress: Record<string, CourseProgress>;
}

/**
 * Student Dashboard - Overview of student's learning progress
 */
export function StudentDashboard({
  user,
  enrollments,
  courses,
  courseProgress,
}: StudentDashboardProps) {
  // Calculate stats
  const activeCourses = enrollments.filter(e => e.status === 'active');
  const completedCourses = enrollments.filter(e => e.status === 'completed');
  
  // Get enrolled courses with progress
  const enrolledCourses = activeCourses.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const progress = courseProgress[enrollment.courseId];
    return { course, enrollment, progress };
  }).filter(item => item.course);

  // Calculate level progress
  const currentLevel = Math.floor(Math.sqrt(user.totalXP / 100)) + 1;
  const xpForCurrentLevel = (currentLevel - 1) * (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * currentLevel * 100;
  const levelProgress = ((user.totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user.displayName}! 👋
        </h1>
        <p className="text-blue-100">
          Continue your learning journey
        </p>
        
        {/* Level Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Level {currentLevel}
            </span>
            <span className="text-blue-200">
              {user.totalXP.toLocaleString()} XP
            </span>
          </div>
          <div className="h-3 bg-blue-800/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/90 transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <p className="text-xs text-blue-200 mt-1">
            {xpForNextLevel - user.totalXP} XP to Level {currentLevel + 1}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Enrolled Courses"
          value={activeCourses.length}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={completedCourses.length}
          color="green"
        />
        <StatCard
          icon={Zap}
          label="Total XP"
          value={user.totalXP.toLocaleString()}
          color="amber"
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${user.streak} days`}
          color="red"
        />
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <BookOpen className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
            <h3 className="font-semibold mb-2">No courses yet</h3>
            <p className="text-zinc-500 mb-4">Start your learning journey today!</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {enrolledCourses.map(({ course, enrollment, progress }) => (
              <Link
                key={course!.id}
                href={`/courses/${course!.slug}`}
                className="block bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Course Image */}
                  <div className="w-24 h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                    {course!.coverImage ? (
                      <img 
                        src={course!.coverImage} 
                        alt={course!.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 truncate">
                      {course!.title}
                    </h3>
                    <p className="text-sm text-zinc-500 mb-3">
                      {course!.category} • {course!.difficulty}
                    </p>
                    
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-zinc-500">Progress</span>
                        <span className="font-medium">{enrollment.progress}%</span>
                      </div>
                      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Play Button */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Achievements Preview */}
      {user.achievements && user.achievements.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Achievements</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {user.achievements.slice(0, 5).map((achievement, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-20 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs font-medium truncate">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'amber' | 'red';
}) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-3', colors[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}

export default StudentDashboard;
