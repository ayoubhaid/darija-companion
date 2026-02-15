'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVocabulary } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const categories = ['greetings', 'numbers', 'family', 'food', 'phrases', 'travel', 'shopping', 'time', 'weather', 'other'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

export default function NewVocabularyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    word: '',
    transliteration: '',
    translation: '',
    arabic: '',
    category: 'greetings',
    difficulty: 'beginner',
    example: '',
    exampleTranslation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await createVocabulary(formData, user.uid, user.displayName || 'Admin');
      router.push('/admin/vocabulary');
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/admin/vocabulary" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Word</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <Card>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Word (Darija)"
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  placeholder="e.g., Salam"
                  required
                />
                <Input
                  label="Arabic Script"
                  value={formData.arabic}
                  onChange={(e) => setFormData({ ...formData, arabic: e.target.value })}
                  placeholder="e.g., سلام"
                  className="arabic-text"
                  dir="rtl"
                />
              </div>

              <Input
                label="Transliteration"
                value={formData.transliteration}
                onChange={(e) => setFormData({ ...formData, transliteration: e.target.value })}
                placeholder="Phonetic spelling"
              />

              <Input
                label="Translation (English)"
                value={formData.translation}
                onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                placeholder="e.g., Hello/Peace"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Example Sentence"
                value={formData.example}
                onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                placeholder="e.g., Salam, kif dayr?"
              />

              <Input
                label="Example Translation"
                value={formData.exampleTranslation}
                onChange={(e) => setFormData({ ...formData, exampleTranslation: e.target.value })}
                placeholder="e.g., Hello, how are you?"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Link href="/admin/vocabulary">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" loading={saving}>
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : 'Save Word'}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
