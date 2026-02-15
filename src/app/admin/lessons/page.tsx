'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllLessons, deleteLesson } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { Lesson } from '@/types';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

export default function AdminLessonsPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);

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

    fetchLessons();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    setDeleting(id);
    try {
      await deleteLesson(id, title, user?.uid || '', user?.displayName || 'Admin');
      setLessons(lessons.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Failed to delete lesson');
    } finally {
      setDeleting(null);
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || lesson.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const difficultyColors: Record<string, string> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
          <p className="text-gray-600">Manage your lessons</p>
        </div>
        <Link href="/admin/lessons/new" className="mt-4 md:mt-0">
          <Button className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Lesson
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </Card>

      {/* Lessons Table */}
      <Card>
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No lessons found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Difficulty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Topic</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons.map((lesson) => (
                  <tr key={lesson.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{lesson.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={difficultyColors[lesson.difficulty] as 'success' | 'warning' | 'danger'}>
                        {lesson.difficulty}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {lesson.duration || lesson.estimatedDuration || 15} min
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {lesson.topic || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/lessons/${lesson.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(lesson.id, lesson.title)}
                          disabled={deleting === lesson.id}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
