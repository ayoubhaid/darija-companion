'use client';

import { useState, useMemo } from 'react';
import { PHRASEBOOK_SCENARIOS, PHRASEBOOK_CATEGORIES, Scenario } from '@/data/phrasebook';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const difficultyColors: Record<string, { bg: string; border: string; text: string }> = {
  beginner: { bg: 'rgba(126,184,164,0.10)', border: '#7eb8a444', text: '#7eb8a4' },
  intermediate: { bg: 'rgba(200,169,110,0.10)', border: '#c8a96e44', text: '#c8a96e' },
  advanced: { bg: 'rgba(212,132,90,0.10)', border: '#d4845a44', text: '#d4845a' },
};

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
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: '#f0e6d0', marginBottom: 8 }}>Practice Complete!</h3>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 15, color: '#8a7a6e', marginBottom: 24 }}>
          {score}/{questions.length} correct ({pct}%)
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => { setCurrentIdx(0); setUserInput(''); setSubmitted(false); setScore(0); setDone(false); }}
            style={{ padding: '12px 20px', borderRadius: 12, background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)', color: '#c8a96e', fontFamily: "'DM Mono',monospace", fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            style={{ padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#8a7a6e', fontFamily: "'DM Mono',monospace", fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Back to Dialogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: '#f0e6d0' }}>
          Practice Key Phrases
        </h3>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#6a5a4e' }}>{currentIdx + 1}/{questions.length}</span>
      </div>

      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, marginBottom: 24, overflow: 'hidden' }}>
        <div
          style={{ height: '100%', background: '#c8a96e', borderRadius: 100, transition: 'all 0.3s', width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: '#6a5a4e', marginBottom: 6 }}>Translate to Darija:</p>
        <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: '#f0e6d0' }}>{current.prompt}</p>
      </div>

      <input
        type="text"
        value={userInput}
        onChange={(e) => !submitted && setUserInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
        placeholder="Type in Darija..."
        style={{
          width: '100%',
          padding: '16px 18px',
          borderRadius: 14,
          border: `2px solid ${submitted ? (isCorrect ? '#7eb8a4' : '#d4845a') : 'rgba(200,169,110,0.2)'}`,
          background: submitted ? (isCorrect ? 'rgba(126,184,164,0.1)' : 'rgba(212,132,90,0.1)') : 'rgba(255,255,255,0.04)',
          color: '#f0e6d0',
          fontFamily: "'Lora',serif",
          fontSize: 15,
          outline: 'none',
          marginBottom: 16,
          transition: 'all 0.2s',
        }}
        disabled={submitted}
        autoFocus
      />

      {submitted && (
        <div style={{
          padding: 14,
          borderRadius: 14,
          marginBottom: 16,
          background: isCorrect ? 'rgba(126,184,164,0.1)' : 'rgba(212,132,90,0.1)',
          border: `1px solid ${isCorrect ? '#7eb8a444' : '#d4845a44'}`,
        }}>
          {isCorrect ? (
            <p style={{ color: '#7eb8a4', fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 500 }}>✓ Correct!</p>
          ) : (
            <>
              <p style={{ color: '#d4845a', fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>✗ Not quite</p>
              <p style={{ color: '#8a7a6e', fontFamily: "'Lora',serif", fontSize: 14 }}>
                Answer: <span style={{ fontWeight: 600, color: '#f0e6d0' }}>{current.answer}</span>
                {current.transliteration !== current.answer && (
                  <span style={{ color: '#6a5a4e' }}> ({current.transliteration})</span>
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
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            background: userInput.trim() ? '#c8a96e' : 'rgba(200,169,110,0.2)',
            border: 'none',
            color: userInput.trim() ? '#0e0804' : '#8a7a6e',
            fontFamily: "'DM Mono',monospace",
            fontSize: 14,
            fontWeight: 500,
            cursor: userInput.trim() ? 'pointer' : 'not-allowed',
            opacity: userInput.trim() ? 1 : 0.5,
            transition: 'all 0.2s',
          }}
        >
          Check Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            background: '#c8a96e',
            border: 'none',
            color: '#0e0804',
            fontFamily: "'DM Mono',monospace",
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
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
  const diffColors = difficultyColors[scenario.difficulty] || difficultyColors.beginner;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(200,169,110,0.1)',
      borderRadius: 18,
      overflow: 'hidden',
      marginBottom: 16,
    }}>
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: 20, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
      >
        <div style={{ fontSize: 32, flexShrink: 0 }}>{scenario.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: '#f0e6d0', margin: 0 }}>{scenario.title}</h3>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100,
              background: `${diffColors.text}22`, color: diffColors.text, border: `1px solid ${diffColors.border}`,
            }}>
              {scenario.difficulty}
            </span>
          </div>
          <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#6a5a4e', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scenario.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#5a4a3e', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 100 }}>
              {scenario.category}
            </span>
            <span style={{ fontSize: 11, color: '#5a4a3e' }}>
              {scenario.dialogue.length} lines · {scenario.keyPhrases.length} key phrases
            </span>
          </div>
        </div>
        <div style={{ color: '#5a4a3e', flexShrink: 0 }}>
          {expanded ? <ChevronUpIcon style={{ width: 24, height: 24 }} /> : <ChevronDownIcon style={{ width: 24, height: 24 }} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
            {(['dialogue', 'phrases', 'practice'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 12,
                  letterSpacing: '0.05em',
                  textAlign: 'center',
                  background: activeTab === tab ? 'rgba(200,169,110,0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #c8a96e' : '2px solid transparent',
                  color: activeTab === tab ? '#c8a96e' : '#6a5a4e',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab === 'dialogue' && '💬 Dialogue'}
                {tab === 'phrases' && '📝 Key Phrases'}
                {tab === 'practice' && '🎯 Practice'}
              </button>
            ))}
          </div>

          <div style={{ padding: 20 }}>
            {/* Dialogue Tab */}
            {activeTab === 'dialogue' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {scenario.dialogue.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 12,
                      flexDirection: line.speaker === 'B' ? 'row-reverse' : 'row',
                    }}
                  >
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
                        background: line.speaker === 'A' ? '#c8a96e' : '#9b72b0',
                      }}
                    >
                      {line.speaker}
                    </div>
                    <div
                      style={{
                        maxWidth: '80%',
                        borderRadius: 16,
                        padding: '14px 18px',
                        background: line.speaker === 'A' ? 'rgba(255,255,255,0.04)' : 'rgba(200,169,110,0.1)',
                        border: '1px solid rgba(200,169,110,0.1)',
                      }}
                    >
                      <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: '#f0e6d0', marginBottom: 4 }}>
                        {line.darija}
                      </p>
                      <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: '#6a5a4e', fontStyle: 'italic', marginBottom: 2 }}>{line.transliteration}</p>
                      <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: '#8a7a6e' }}>{line.english}</p>
                    </div>
                  </div>
                ))}

                {/* Cultural Note */}
                {scenario.culturalNote && (
                  <div style={{ marginTop: 16, padding: 16, background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <LightBulbIcon style={{ width: 20, height: 20, color: '#c8a96e', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#c8a96e', fontWeight: 500, marginBottom: 4 }}>
                          Cultural Note
                        </p>
                        <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', lineHeight: 1.5 }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {scenario.keyPhrases.map((phrase, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}
                  >
                    <div>
                      <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: '#f0e6d0', marginBottom: 2 }}>{phrase.darija}</p>
                      <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: '#6a5a4e', fontStyle: 'italic' }}>{phrase.transliteration}</p>
                    </div>
                    <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#c8a96e', textAlign: 'right' }}>{phrase.english}</p>
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
    </div>
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lora:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        .sh-root{
          min-height:100vh;
          background:radial-gradient(ellipse at 20% 0%,#2a1505 0%,#0e0804 60%),
                      radial-gradient(ellipse at 80% 100%,#12060e 0%,transparent 50%);
          position:relative;overflow-x:hidden;
        }
        .sh-root::before{
          content:'';position:fixed;inset:0;
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(200,169,110,0.025) 60px,rgba(200,169,110,0.025) 61px),
            repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(200,169,110,0.025) 60px,rgba(200,169,110,0.025) 61px);
          pointer-events:none;z-index:0;
        }
        .sh-filter-btn{
          padding:8px 16px;
          border-radius:12px;
          font-family:'DM Mono',monospace;
          font-size:11px;
          letter-spacing:0.05em;
          cursor:pointer;
          transition:all 0.2s;
          border:1px solid;
        }
        .sh-filter-btn.active{
          background:rgba(200,169,110,0.2);
          border-color:#c8a96e;
          color:#c8a96e;
        }
        .sh-filter-btn.inactive{
          background:rgba(255,255,255,0.04);
          border-color:rgba(255,255,255,0.1);
          color:#6a5a4e;
        }
        .sh-filter-btn.inactive:hover{
          background:rgba(255,255,255,0.08);
        }
        .sh-input{
          border-radius:14px;
          padding:16px 20px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(200,169,110,0.2);
          color:#f0e6d0;
          font-family:'Lora',serif;
          font-size:15px;
          outline:none;
          transition:border-color 0.2s,box-shadow 0.2s;
          width:100%;
        }
        .sh-input:focus{
          border-color:#c8a96e;
          box-shadow:0 0 0 3px rgba(200,169,110,0.15);
        }
        .sh-input::placeholder{color:#5a4a3e}
        .sh-stat-box{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(200,169,110,0.1);
          border-radius:14px;
          padding:16px;
          text-align:center;
        }
      `}</style>

      <div className="sh-root">
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(16px,4vw,40px) 60px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #c8a96e 0%, #9b72b0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(200,169,110,0.3)' }}>
                <ChatBubbleLeftRightIcon style={{ width: 28, height: 28, color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 36, color: '#f0e6d0', marginBottom: 4 }}>Phrasebook</h1>
                <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#6a5a4e' }}>Real conversations for real situations</p>
              </div>
            </div>
            <p style={{ fontFamily: "'Lora',serif", fontSize: 15, color: '#8a7a6e', lineHeight: 1.6 }}>
              Learn Darija through authentic dialogues. Each scenario includes a full conversation,
              key phrases to memorize, and a practice quiz to test yourself.
            </p>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32 }}>
            <div className="sh-stat-box">
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: '#c8a96e', marginBottom: 4 }}>{PHRASEBOOK_SCENARIOS.length}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#6a5a4e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scenarios</div>
            </div>
            <div className="sh-stat-box">
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: '#9b72b0', marginBottom: 4 }}>
                {PHRASEBOOK_SCENARIOS.reduce((a, s) => a + s.keyPhrases.length, 0)}
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#6a5a4e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Key Phrases</div>
            </div>
            <div className="sh-stat-box">
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: '#7eb8a4', marginBottom: 4 }}>{PHRASEBOOK_CATEGORIES.length}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#6a5a4e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Categories</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <MagnifyingGlassIcon style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, color: '#5a4a3e' }} />
            <input
              type="text"
              placeholder="Search scenarios or phrases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sh-input"
              style={{ paddingLeft: 50 }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`sh-filter-btn ${categoryFilter === 'all' ? 'active' : 'inactive'}`}
              >
                All Topics
              </button>
              {PHRASEBOOK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`sh-filter-btn ${categoryFilter === cat ? 'active' : 'inactive'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty filter */}
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
              {['all', 'beginner', 'intermediate', 'advanced'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`sh-filter-btn ${difficultyFilter === d ? 'active' : 'inactive'}`}
                >
                  {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Scenarios */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <ChatBubbleLeftRightIcon style={{ width: 48, height: 48, color: '#5a4a3e', margin: '0 auto 16px' }} />
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: '#8a7a6e', marginBottom: 12 }}>No scenarios found</p>
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setDifficultyFilter('all'); }}
                style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#c8a96e', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filtered.map((scenario) => (
                <ScenarioCard key={scenario.id} scenario={scenario} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
