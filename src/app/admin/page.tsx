'use client';

import { useEffect, useState } from 'react';
import { getStats } from '@/lib/firestore';
import { 
  BookOpen, 
  Type, 
  HelpCircle, 
  Users,
  Plus,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Stats } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Lessons', value: stats?.totalLessons || 0, icon: BookOpen, color: 'bg-blue-500', href: '/admin/lessons' },
    { name: 'Vocabulary Words', value: stats?.totalVocabulary || 0, icon: Type, color: 'bg-green-500', href: '/admin/vocabulary' },
    { name: 'Total Quizzes', value: stats?.totalQuizzes || 0, icon: HelpCircle, color: 'bg-purple-500', href: '/admin/quizzes' },
    { name: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-orange-500', href: '/admin/users' },
  ];

  const quickActions = [
    { name: 'Add New Lesson', href: '/admin/lessons/new', icon: Plus },
    { name: 'Add Vocabulary', href: '/admin/vocabulary/new', icon: Plus },
    { name: 'Create Quiz', href: '/admin/quizzes/new', icon: Plus },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Darija Companion content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-primary-500">
                <div className="flex items-center justify-center py-4">
                  <action.icon className="w-5 h-5 text-primary-500 mr-2" />
                  <span className="font-medium text-gray-700">{action.name}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium">1</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Add Content</h3>
              <p className="text-sm text-gray-500">Create lessons, vocabulary words, and quizzes for your students.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium">2</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500">View users and grant admin access to help manage content.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium">3</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Monitor Activity</h3>
              <p className="text-sm text-gray-500">Track changes through the audit log and monitor user activity.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
