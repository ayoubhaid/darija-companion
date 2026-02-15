'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllVocabulary, deleteVocabulary, bulkCreateVocabulary } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { VocabularyItem } from '@/types';
import { Plus, Edit, Trash2, Search, Upload, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const categories = ['greetings', 'numbers', 'family', 'food', 'phrases', 'travel', 'shopping', 'time', 'weather', 'other'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

export default function AdminVocabularyPage() {
  const { user } = useAuth();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const data = await getAllVocabulary();
        setVocabulary(data);
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  const handleDelete = async (id: string, word: string) => {
    if (!confirm(`Delete "${word}"?`)) return;
    if (!user) return;

    setDeleting(id);
    try {
      await deleteVocabulary(id, word, user.uid, user.displayName || 'Admin');
      setVocabulary(vocabulary.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const handleBulkImport = async () => {
    if (!user || !bulkText.trim()) return;

    setImporting(true);
    try {
      const lines = bulkText.split('\n').filter(line => line.trim());
      const items: Omit<VocabularyItem, 'id'>[] = lines.map(line => {
        const [word, transliteration, translation, arabic, category] = line.split('\t');
        return {
          word: word?.trim() || '',
          transliteration: transliteration?.trim() || word?.trim() || '',
          translation: translation?.trim() || '',
          arabic: arabic?.trim() || '',
          category: category?.trim() || 'other',
          difficulty: 'beginner',
        };
      }).filter(item => item.word);

      const count = await bulkCreateVocabulary(items, user.uid, user.displayName || 'Admin');
      alert(`Successfully imported ${count} words!`);
      setShowBulkImport(false);
      setBulkText('');
      window.location.reload();
    } catch (error) {
      console.error('Error importing:', error);
      alert('Failed to import');
    } finally {
      setImporting(false);
    }
  };

  const filteredVocab = vocabulary.filter(v => {
    const matchesSearch = 
      v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.translation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Vocabulary</h1>
          <p className="text-gray-600">Manage vocabulary words</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => setShowBulkImport(true)}>
            <Upload className="w-5 h-5 mr-2" />
            Bulk Import
          </Button>
          <Link href="/admin/vocabulary/new">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Add Word
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <Card className="mb-6 border-2 border-primary-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Bulk Import</h2>
            <button onClick={() => setShowBulkImport(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Paste tab-separated values: word, transliteration, translation, arabic (optional), category
          </p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Salam	Hello	سلام	greetings&#10;Marhaba	Welcome	مرحبا	greetings"
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleBulkImport} loading={importing}>
              Import {bulkText.split('\n').filter(l => l.trim()).length} Words
            </Button>
          </div>
        </Card>
      )}

      {/* Vocabulary Table */}
      <Card>
        {filteredVocab.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No vocabulary found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Word</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Transliteration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Translation</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Arabic</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVocab.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.word}</td>
                    <td className="py-3 px-4 text-gray-600">{item.transliteration}</td>
                    <td className="py-3 px-4 text-gray-600">{item.translation}</td>
                    <td className="py-3 px-4 arabic-text" dir="rtl">{item.arabic}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{item.category}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/vocabulary/${item.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id, item.word)}
                          disabled={deleting === item.id}
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
