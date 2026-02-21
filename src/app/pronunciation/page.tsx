'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { SpeakerWaveIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface SoundEntry {
  arabic: string;
  transliteration: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
  examples: { darija: string; english: string }[];
}

const SOUND_CATEGORIES: { name: string; description: string; sounds: SoundEntry[] }[] = [
  {
    name: 'Emphatic Consonants',
    description: 'These consonants are pronounced with emphasis in the back of the throat',
    sounds: [
      {
        arabic: 'ق',
        transliteration: 'Q / Qaf',
        name: 'Emphatic K',
        description: 'A deep guttural sound from the back of the throat, like saying "k" but further back',
        difficulty: 'hard',
        tips: [
          'Imagine gargling while speaking',
          'The sound comes from the uvula (tiny hangy thing)',
          'Practice saying "k" and then push it further back',
        ],
        examples: [
          { darija: 'قق', english: 'qahwa (coffee)' },
          { darija: 'وقت', english: 'waqt (time)' },
          { darija: 'حق', english: 'haq (truth)' },
        ],
      },
      {
        arabic: 'ع',
        transliteration: '3 / Ayn',
        name: 'Hamza',
        description: 'A glottal stop - the sound in the middle of "uh-oh"',
        difficulty: 'medium',
        tips: [
          'It\'s like the pause between "uh" and "oh"',
          'Don\'t confuse with "aa" vowel',
          'Practice saying "uh-oh" without the "h"',
        ],
        examples: [
          { darija: 'سماء', english: 'sama (sky)' },
          { darija: 'كتاب', english: 'kitab (book)' },
          { darija: 'شعبان', english: 'sha3ban (March)' },
        ],
      },
      {
        arabic: 'ح',
        transliteration: '7 / Hha',
        name: 'Breathy H',
        description: 'An aspirated "h" - like breathing out heavily',
        difficulty: 'medium',
        tips: [
          'Imagine fogging up a mirror',
          'It\'s like saying "h" but with more breath',
          'Similar to the "h" in "holiday"',
        ],
        examples: [
          { darija: 'حال', english: 'hal (state/mood)' },
          { darija: 'حمد', english: 'hamd (praise)' },
          { darija: 'حديد', english: 'hadid (iron)' },
        ],
      },
    ],
  },
  {
    name: 'Unique Darija Sounds',
    description: 'Sounds that don\'t exist in English',
    sounds: [
      {
        arabic: 'ش',
        transliteration: 'sh',
        name: 'Sh sound',
        description: 'Same as English "sh" in "ship"',
        difficulty: 'easy',
        tips: [
          'Same as English "sh"',
          'Put your teeth on your lips and blow',
        ],
        examples: [
          { darija: 'شكر', english: 'shukran (thank you)' },
          { darija: 'شراب', english: 'sharab (drink)' },
          { darija: 'شمس', english: 'shams (sun)' },
        ],
      },
      {
        arabic: 'ج',
        transliteration: 'j / Dj',
        name: 'J sound',
        description: 'Like "j" in "jump" but more resonant',
        difficulty: 'easy',
        tips: [
          'Similar to English "j"',
          'In some regions, sounds like "zh"',
          'Practice with "jam" sounds',
        ],
        examples: [
          { darija: 'جمل', english: 'jmel (camel)' },
          { darija: 'جمال', english: 'jmal (beauty)' },
          { darija: 'جيد', english: 'jid (neck)' },
        ],
      },
      {
        arabic: 'خ',
        transliteration: 'kh / Khha',
        name: 'Kh sound',
        description: 'Like the "ch" in Scottish "loch" or German "Bach"',
        difficulty: 'hard',
        tips: [
          'Imagine saying "k" but with friction',
          'It\'s like clearing your throat softly',
          'Practice "kh" without the following vowel',
        ],
        examples: [
          { darija: 'خيل', english: 'khil (horses)' },
          { darija: 'خالد', english: 'khalid (eternal)' },
          { darija: 'خوخ', english: 'khokh (plum)' },
        ],
      },
      {
        arabic: 'غ',
        transliteration: 'gh / Ghain',
        name: 'Guttural R',
        description: 'Like a French "r" - a gargling sound from the back',
        difficulty: 'hard',
        tips: [
          'Imagine a cat purring deeply',
          'Roll the sound from your throat',
          'It\'s different from regular "r"',
        ],
        examples: [
          { darija: 'غزال', english: 'ghazal (gazelle)' },
          { darija: 'سلام', english: 'slaam (peace - with gh)' },
          { darija: 'طرف', english: 'tarf (edge)' },
        ],
      },
    ],
  },
  {
    name: 'Vowels',
    description: 'Short and long vowel sounds in Darija',
    sounds: [
      {
        arabic: 'ـَ',
        transliteration: 'a',
        name: 'Short A',
        description: 'Like "a" in "cat" - short and quick',
        difficulty: 'easy',
        tips: [
          'Short and crisp',
          'Don\'t elongate it',
          'Like saying "uh" quickly',
        ],
        examples: [
          { darija: 'باب', english: 'bab (door)' },
          { darija: 'كتاب', english: 'kitab (book)' },
          { darija: 'سلام', english: 'salam (peace)' },
        ],
      },
      {
        arabic: 'ـُ',
        transliteration: 'u',
        name: 'Short U',
        description: 'Like "u" in "put" - short and rounded',
        difficulty: 'easy',
        tips: [
          'Pucker your lips slightly',
          'Short and quick sound',
          'Don\'t make it a long "oo"',
        ],
        examples: [
          { darija: 'بور', english: 'bur (pure)' },
          { darija: 'دور', english: 'dur (turn)' },
          { darija: 'صول', english: 'sul (return)' },
        ],
      },
      {
        arabic: 'ـِ',
        transliteration: 'i',
        name: 'Short I',
        description: 'Like "i" in "sit" - short and quick',
        difficulty: 'easy',
        tips: [
          'Short and crisp like "i" in "bit"',
          'Keep it brief',
          'Don\'t stretch it to "ee"',
        ],
        examples: [
          { darija: 'كتب', english: 'ktab (he wrote)' },
          { darija: 'جلس', english: 'jlas (he sat)' },
          { darija: 'مكث', english: 'mkas (he stayed)' },
        ],
      },
      {
        arabic: 'ـَا',
        transliteration: 'aa',
        name: 'Long A',
        description: 'Like "a" in "father" - held longer',
        difficulty: 'easy',
        tips: [
          'Hold the sound longer than short "a"',
          'Like "aa" in "haunted"',
          'Practice stretching "a" sound',
        ],
        examples: [
          { darija: 'باب', english: 'baab (door)' },
          { darija: 'كلام', english: 'klaam (words)' },
          { darija: 'سلام', english: 'slaam (hello)' },
        ],
      },
    ],
  },
];

function SoundCard({ sound }: { sound: SoundEntry }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const difficultyColors = {
    easy: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };

  return (
    <Card variant="default" className="mb-4">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <span className="text-3xl arabic-text" dir="rtl">{sound.arabic}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-zinc-900 dark:text-white">{sound.name}</h3>
            <Badge className={difficultyColors[sound.difficulty]}>{sound.difficulty}</Badge>
          </div>
          <p className="text-sm text-zinc-500 mb-1">{sound.transliteration}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{sound.description}</p>
        </div>
      </div>

      {/* Tips */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Tips:</h4>
        <ul className="space-y-1">
          {sound.tips.map((tip, index) => (
            <li key={index} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
              <span className="text-primary">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Examples */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Examples:</h4>
        <div className="space-y-2">
          {sound.examples.map((example, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
              <span className="arabic-text text-lg" dir="rtl">{example.darija}</span>
              <span className="text-sm text-zinc-500">{example.english}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function PronunciationPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSounds = searchQuery
    ? SOUND_CATEGORIES.map(cat => ({
        ...cat,
        sounds: cat.sounds.filter(
          s => 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.arabic.includes(searchQuery)
        ),
      })).filter(cat => cat.sounds.length > 0)
    : SOUND_CATEGORIES;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl shadow-glow-md mb-6">
            <AcademicCapIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Pronunciation Guide</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Master the unique sounds of Moroccan Darija. Each sound includes tips, examples, and practice words.
          </p>
        </div>

        {/* Quick Reference */}
        <Card padding="lg" className="mb-8">
          <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Quick Reference - Transliteration Key</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800">
              <span className="font-mono text-primary">7</span> = ح (breathy h)
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800">
              <span className="font-mono text-primary">3</span> = ع (glottal stop)
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800">
              <span className="font-mono text-primary">kh</span> = خ (German ch)
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800">
              <span className="font-mono text-primary">gh</span> = غ (guttural r)
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800">
              <span className="font-mono text-primary">q</span> = ق (emphatic k)
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800">
              <span className="font-mono text-primary">sh</span> = ش (sh sound)
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800">
              <span className="font-mono text-primary">j</span> = ج (j sound)
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800">
              <span className="font-mono text-primary">aa</span> = long a
            </div>
          </div>
        </Card>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SOUND_CATEGORIES.map((category, index) => (
            <Button
              key={category.name}
              variant={activeCategory === index ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveCategory(index)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Sounds List */}
        {(searchQuery ? filteredSounds : [SOUND_CATEGORIES[activeCategory]]).map((category) => (
          <div key={category.name}>
            {!searchQuery && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{category.name}</h2>
                <p className="text-zinc-600 dark:text-zinc-400">{category.description}</p>
              </div>
            )}
            {category.sounds.map((sound) => (
              <SoundCard key={sound.transliteration} sound={sound} />
            ))}
          </div>
        ))}

        {!searchQuery && SOUND_CATEGORIES[activeCategory].sounds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No sounds in this category.</p>
          </div>
        )}

        {searchQuery && filteredSounds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No sounds found matching "{searchQuery}"</p>
          </div>
        )}

        {/* Practice Tip */}
        <Card padding="lg" className="mt-8 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20">
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Practice Tips</h3>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• Listen to native speakers and try to mimic their pronunciation</li>
            <li>• Practice in front of a mirror to see your mouth position</li>
            <li>• Record yourself and compare with native audio</li>
            <li>• Focus on one sound at a time until comfortable</li>
            <li>• Practice daily - even 5 minutes makes a difference!</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
