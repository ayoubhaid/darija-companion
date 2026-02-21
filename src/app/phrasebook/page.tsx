'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PHRASEBOOK_SCENARIOS, PHRASEBOOK_CATEGORIES, Scenario } from '@/data/phrasebook';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LightBulbIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const difficultyColors = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
} as const;

// ─── Practice Quiz for a scenario ────────────────────────────────────────────
function PracticeQuiz({ scenario, onClose }: { scenario: Scenario; onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const questions = scenario.keyPhrases.map((p) => ({
    prompt: p.english,
    answer: p.darija,
    transliteration: p.transliteration,
  }));

  const current = questions[currentIdx];

  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/[?!.,]/g, '');

  const isCorrect = normalize(userInput) === normalize(current.answer) ||
    normalize(userInput) === normalize(current.transliteration);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    setSubmitted(true);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setUserInput('');
      setSubmitted(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Practice Complete!</h3>
        <p className="text-zinc-500 mb-6">
          {score}/{questions.length} correct ({pct}%)
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setCurrentIdx(0); setUserInput(''); setSubmitted(false); setScore(0); setDone(false); }}
            className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium text-sm hover:bg-primary/20 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl font-medium text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Back to Dialogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-zinc-900 dark:text-white">
          Practice Key Phrases
        </h3>
        <span className="text-sm text-zinc-500">{currentIdx + 1}/{questions.length}</span>
      </div>

      <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mb-4">
        <p className="text-sm text-zinc-500 mb-1">Translate to Darija:</p>
        <p className="text-lg font-semibold text-zinc-900 dark:text-white">{current.prompt}</p>
      </div>

      <input
        type="text"
        value={userInput}
        onChange={(e) => !submitted && setUserInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
        placeholder="Type in Darija..."
        className={clsx(
          'w-full px-4 py-3 rounded-xl border-2 text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 focus:outline-none transition-all mb-3',
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-zinc-200 dark:border-zinc-700 focus:border-primary'
        )}
        disabled={submitted}
        autoFocus
      />

      {submitted && (
        <div className={clsx(
          'p-3 rounded-xl mb-4 text-sm',
          isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        )}>
          {isCorrect ? (
            <p className="text-emerald-700 dark:text-emerald-400 font-medium">✓ Correct!</p>
          ) : (
            <>
              <p className="text-red-700 dark:text-red-400 font-medium">✗ Not quite</p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Answer: <span className="font-semibold">{current.answer}</span>
                {current.transliteration !== current.answer && (
                  <span className="text-zinc-400"> ({current.transliteration})</span>
                )}
              </p>
            </>
          )}
        </div>
      )}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!userInput.trim()}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          {currentIdx < questions.length - 1 ? 'Next Phrase →' : 'See Results 🎉'}
        </button>
      )}
    </div>
  );
}

// ─── Scenario Card ────────────────────────────────────────────────────────────
function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'dialogue' | 'phrases' | 'practice'>('dialogue');

  return (
    <Card variant="default" className="overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div className="text-3xl flex-shrink-0">{scenario.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-zinc-900 dark:text-white">{scenario.title}</h3>
            <Badge variant={difficultyColors[scenario.difficulty]} size="sm">
              {scenario.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 truncate">{scenario.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              {scenario.category}
            </span>
            <span className="text-xs text-zinc-400">
              {scenario.dialogue.length} lines · {scenario.keyPhrases.length} key phrases
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-zinc-400">
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-700">
          {/* Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-700">
            {(['dialogue', 'phrases', 'practice'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'flex-1 py-3 text-sm font-medium transition-colors',
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                )}
              >
                {tab === 'dialogue' && '💬 Dialogue'}
                {tab === 'phrases' && '📝 Key Phrases'}
                {tab === 'practice' && '🎯 Practice'}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* Dialogue Tab */}
            {activeTab === 'dialogue' && (
              <div className="space-y-3">
                {scenario.dialogue.map((line, i) => (
                  <div
                    key={i}
                    className={clsx(
                      'flex gap-3',
                      line.speaker === 'B' && 'flex-row-reverse'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                        line.speaker === 'A'
                          ? 'bg-primary'
                          : 'bg-accent'
                      )}
                    >
                      {line.speaker}
                    </div>
                    <div
                      className={clsx(
                        'max-w-[80%] rounded-2xl px-4 py-3',
                        line.speaker === 'A'
                          ? 'bg-zinc-100 dark:bg-zinc-800 rounded-tl-sm'
                          : 'bg-primary/10 dark:bg-primary/20 rounded-tr-sm'
                      )}
                    >
                      <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                        {line.darija}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5 italic">{line.transliteration}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{line.english}</p>
                    </div>
                  </div>
                ))}

                {/* Cultural Note */}
                {scenario.culturalNote && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <div className="flex items-start gap-2">
                      <LightBulbIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">
                          Cultural Note
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {scenario.culturalNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Key Phrases Tab */}
            {activeTab === 'phrases' && (
              <div className="space-y-2">
                {scenario.keyPhrases.map((phrase, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white">{phrase.darija}</p>
                      <p className="text-xs text-zinc-500 italic">{phrase.transliteration}</p>
                    </div>
                    <p className="text-sm text-primary font-medium text-right">{phrase.english}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Practice Tab */}
            {activeTab === 'practice' && (
              <PracticeQuiz scenario={scenario} onClose={() => setActiveTab('dialogue')} />
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PhrasebookPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = PHRASEBOOK_SCENARIOS;
    if (categoryFilter !== 'all') {
      result = result.filter((s) => s.category === categoryFilter);
    }
    if (difficultyFilter !== 'all') {
      result = result.filter((s) => s.difficulty === difficultyFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.keyPhrases.some(
            (p) =>
              p.darija.toLowerCase().includes(q) ||
              p.english.toLowerCase().includes(q)
          )
      );
    }
    return result;
  }, [searchQuery, categoryFilter, difficultyFilter]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-sm">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Phrasebook</h1>
              <p className="text-zinc-500 text-sm">Real conversations for real situations</p>
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Learn Darija through authentic dialogues. Each scenario includes a full conversation,
            key phrases to memorize, and a practice quiz to test yourself.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center border border-zinc-200 dark:border-zinc-800">
            <div className="text-2xl font-bold text-primary">{PHRASEBOOK_SCENARIOS.length}</div>
            <div className="text-xs text-zinc-500">Scenarios</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center border border-zinc-200 dark:border-zinc-800">
            <div className="text-2xl font-bold text-accent">
              {PHRASEBOOK_SCENARIOS.reduce((a, s) => a + s.keyPhrases.length, 0)}
            </div>
            <div className="text-xs text-zinc-500">Key Phrases</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center border border-zinc-200 dark:border-zinc-800">
            <div className="text-2xl font-bold text-violet-500">{PHRASEBOOK_CATEGORIES.length}</div>
            <div className="text-xs text-zinc-500">Categories</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search scenarios or phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-white placeholder-zinc-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoryFilter('all')}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                categoryFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
              )}
            >
              All Topics
            </button>
            {PHRASEBOOK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                  categoryFilter === cat
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-1.5 ml-auto">
            {['all', 'beginner', 'intermediate', 'advanced'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                  difficultyFilter === d
                    ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                )}
              >
                {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Scenarios */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500">No scenarios found</p>
            <button
              onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setDifficultyFilter('all'); }}
              className="mt-2 text-primary text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
