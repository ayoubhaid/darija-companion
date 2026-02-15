'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createLesson } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image'
];

export default function NewLessonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentHtml: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: 15,
    topic: '',
    tags: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const lessonData = {
        title: formData.title,
        description: formData.description,
        contentHtml: formData.contentHtml,
        difficulty: formData.difficulty,
        duration: formData.duration,
        topic: formData.topic,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        imageUrl: formData.imageUrl,
        content: {
          vocabulary: [],
          sentences: [],
          exercises: [],
        },
      };

      await createLesson(lessonData as any, user.uid, user.displayName || 'Admin');
      router.push('/admin/lessons');
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Failed to create lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/admin/lessons" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Lesson</h1>
          <p className="text-gray-600">Create a new lesson</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Lesson Content</h2>
              
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter lesson title"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter lesson description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (Rich Text)
                  </label>
                  <div className="quill-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={formData.contentHtml}
                      onChange={(value) => setFormData({ ...formData, contentHtml: value })}
                      modules={quillModules}
                      formats={quillFormats}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })}
                  min={1}
                />

                <Input
                  label="Topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., greetings"
                />

                <Input
                  label="Tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Comma-separated"
                />

                <Input
                  label="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </Card>

            <div className="flex space-x-3">
              <Link href="/admin/lessons" className="flex-1">
                <Button variant="outline" type="button" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" loading={saving} className="flex-1">
                <Save className="w-5 h-5 mr-2" />
                Create
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
