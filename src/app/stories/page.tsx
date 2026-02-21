'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { STORIES } from '@/data/stories';
import { BookOpenIcon, ClockIcon, ArrowRightIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const levelColors: Record<string, { bg: string; border: string; text: string }> = {
  Beginner: { bg: 'rgba(107,155,210,0.10)', border: '#6b9bd244', text: '#6b9bd2' },
  Intermediate: { bg: 'rgba(200,169,110,0.10)', border: '#c8a96e44', text: '#c8a96e' },
  Advanced: { bg: 'rgba(212,132,90,0.10)', border: '#d4845a44', text: '#d4845a' },
};

function StoryCard({ story, onRead }: { story: typeof STORIES[0]; onRead: () => void }) {
  const colors = levelColors[story.level] || levelColors.Beginner;

  return (
    <div
      onClick={onRead}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 24,
        cursor: 'pointer',
        transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s',
      }}
      className="story-card"
    >
      <style>{`
        .story-card:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow: 0 12px 40px rgba(0,0,0,0.45);
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'linear-gradient(135deg, #9b72b0 0%, #7eb8a4 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 8px 24px rgba(155,114,176,0.3)',
        }}>
          <BookOpenIcon style={{ width: 28, height: 28, color: '#fff' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: '#f0e6d0', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {story.title}
            </h3>
            <span style={{ fontSize: 14, color: '#6a5a4e' }}>({story.titleDarija})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100,
              background: `${colors.text}22`, color: colors.text, border: `1px solid ${colors.border}`,
            }}>
              {story.level}
            </span>
            <span style={{ fontSize: 12, color: '#6a5a4e', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ClockIcon style={{ width: 14, height: 14 }} />
              {story.duration} min
            </span>
            <span style={{ fontSize: 12, color: '#6a5a4e' }}>
              {story.content.length} paragraphs
            </span>
          </div>
          <div style={{
            width: '100%', padding: '12px 20px', borderRadius: 12,
            background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)',
            color: '#c8a96e', fontFamily: "'DM Mono',monospace", fontSize: 13, letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            Read Story
            <ArrowRightIcon style={{ width: 16, height: 16 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryReader({ story, onClose }: { story: typeof STORIES[0]; onClose: () => void }) {
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showVocab, setShowVocab] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const [question, options, correctIndex] = story.comprehensionQuestions;

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
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .sh-btn{
          border-radius:12px;
          padding:12px 20px;
          font-family:'DM Mono',monospace;
          font-size:13px;
          letter-spacing:0.05em;
          cursor:pointer;
          transition:all 0.2s;
          border:1px solid;
        }
        .sh-btn-primary{
          background:rgba(200,169,110,0.2);
          border-color:#c8a96e;
          color:#c8a96e;
        }
        .sh-btn-primary:hover{background:rgba(200,169,110,0.3)}
        .sh-btn-secondary{
          background:rgba(255,255,255,0.04);
          border-color:rgba(200,169,110,0.2);
          color:#8a7a6e;
        }
        .sh-btn-secondary:hover{background:rgba(255,255,255,0.08)}
        .sh-card{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(200,169,110,0.1);
          border-radius:18px;
          padding:28px;
        }
        .quiz-option{
          width:100%;
          padding:18px;
          border-radius:14px;
          text-align:left;
          font-family:'Lora',serif;
          font-size:15px;
          transition:all 0.2s;
          border:1px solid rgba(200,169,110,0.2);
          background:rgba(255,255,255,0.03);
          color:#8a7a6e;
        }
        .quiz-option:hover:not(:disabled){
          border-color:#c8a96e;
          background:rgba(200,169,110,0.1);
          color:#f0e6d0;
        }
        .quiz-option.correct{
          border-color:#7eb8a4;
          background:rgba(126,184,164,0.15);
          color:#7eb8a4;
        }
        .quiz-option.incorrect{
          border-color:#d4845a;
          background:rgba(212,132,90,0.15);
          color:#d4845a;
        }
        .quiz-option.disabled{
          opacity:0.4;
          cursor:default;
        }
      `}</style>

      <div className="sh-root">
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(16px,4vw,40px) 60px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 32, color: '#f0e6d0', marginBottom: 4 }}>{story.title}</h1>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: '#8a7a6e' }}>{story.titleDarija}</p>
            </div>
            <button onClick={onClose} className="sh-btn sh-btn-secondary">
              Close
            </button>
          </div>

          {/* Toggle Buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowTranslation(true)}
              className={`sh-btn ${showTranslation ? 'sh-btn-primary' : 'sh-btn-secondary'}`}
            >
              With Translation
            </button>
            <button 
              onClick={() => setShowTranslation(false)}
              className={`sh-btn ${!showTranslation ? 'sh-btn-primary' : 'sh-btn-secondary'}`}
            >
              Darija Only
            </button>
            <button 
              onClick={() => setShowVocab(!showVocab)}
              className={`sh-btn ${showVocab ? 'sh-btn-primary' : 'sh-btn-secondary'}`}
            >
              Vocabulary ({story.vocabulary.length})
            </button>
          </div>

          {/* Story Content */}
          <div className="sh-card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {story.content.map((paragraph, index) => (
                <div key={index} style={{ borderBottom: index < story.content.length - 1 ? '1px solid rgba(200,169,110,0.1)' : 'none', paddingBottom: index < story.content.length - 1 ? 20 : 0 }}>
                  <p style={{ fontSize: 20, fontWeight: 500, color: '#f0e6d0', marginBottom: 10, fontFamily: "'Lora',serif", textAlign: 'right', direction: 'rtl' }}>
                    {paragraph.darija}
                  </p>
                  {showTranslation && (
                    <p style={{ fontFamily: "'Lora',serif", fontSize: 15, color: '#8a7a6e', lineHeight: 1.6 }}>{paragraph.english}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Vocabulary Section */}
          {showVocab && (
            <div className="sh-card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: '#f0e6d0', marginBottom: 20 }}>Vocabulary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                {story.vocabulary.map((vocab, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: '#f0e6d0', margin: 0 }}>{vocab.word}</p>
                      <p style={{ fontSize: 13, color: '#6a5a4e', margin: '4px 0 0' }}>{vocab.transliteration}</p>
                    </div>
                    <p style={{ fontSize: 14, color: '#8a7a6e', textAlign: 'right' }}>{vocab.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comprehension Quiz */}
          <div className="sh-card">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: '#f0e6d0', marginBottom: 16 }}>Comprehension Quiz</h3>
            <p style={{ fontSize: 17, color: '#c8a96e', marginBottom: 16, fontFamily: "'Lora',serif" }}>{question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {options.map((option, index) => {
                let btnClass = 'quiz-option';
                if (showResult) {
                  if (index === correctIndex) btnClass += ' correct';
                  else if (index === selectedAnswer) btnClass += ' incorrect';
                  else btnClass += ' disabled';
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={btnClass}
                  >
                    <span style={{ fontWeight: 500 }}>{option}</span>
                    {showResult && index === correctIndex && (
                      <CheckIcon style={{ width: 20, height: 20, marginLeft: 8, display: 'inline' }} />
                    )}
                    {showResult && index === selectedAnswer && index !== correctIndex && (
                      <XMarkIcon style={{ width: 20, height: 20, marginLeft: 8, display: 'inline' }} />
                    )}
                  </button>
                );
              })}
            </div>
            {showResult && (
              <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,169,110,0.1)' }}>
                {selectedAnswer === correctIndex ? (
                  <p style={{ color: '#7eb8a4', fontFamily: "'DM Mono',monospace", fontSize: 14 }}>Correct! Well done! 🎉</p>
                ) : (
                  <p style={{ color: '#8a7a6e', fontFamily: "'Lora',serif", fontSize: 14 }}>
                    The correct answer is: <span style={{ fontWeight: 600, color: '#c8a96e' }}>{options[correctIndex]}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function StoriesPage() {
  const { user, loading } = useAuth();
  const [selectedStory, setSelectedStory] = useState<typeof STORIES[0] | null>(null);
  const [filter, setFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filteredStories = filter === 'All' 
    ? STORIES 
    : STORIES.filter(s => s.level === filter);

  if (!loading && !user) {
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
          .sh-btn{
            border-radius:14px;
            padding:14px 28px;
            font-family:'DM Mono',monospace;
            font-size:14px;
            letter-spacing:0.05em;
            cursor:pointer;
            transition:all 0.2s;
            border:1px solid #c8a96e;
            background:rgba(200,169,110,0.15);
            color:#c8a96e;
          }
          .sh-btn:hover{
            background:rgba(200,169,110,0.25);
            transform:translateY(-2px);
          }
        `}</style>
        <div className="sh-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 80, height: 80, margin: '0 auto 20px', background: 'linear-gradient(135deg, #9b72b0 0%, #7eb8a4 100%)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(155,114,176,0.3)' }}>
              <BookOpenIcon style={{ width: 40, height: 40, color: '#fff' }} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: '#f0e6d0', marginBottom: 8 }}>Sign in to read stories</h2>
            <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: '#8a7a6e', marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>Create an account to access reading comprehension stories</p>
            <Link href="/login">
              <button className="sh-btn">Sign In</button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (selectedStory) {
    return <StoryReader story={selectedStory} onClose={() => setSelectedStory(null)} />;
  }

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
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .sh-filter-btn{
          border-radius:100px;
          padding:10px 20px;
          font-family:'DM Mono',monospace;
          font-size:12px;
          letter-spacing:0.08em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all 0.2s;
          border:1px solid transparent;
          background:rgba(255,255,255,0.04);
          color:#8a7a6e;
        }
        .sh-filter-btn:hover{
          background:rgba(255,255,255,0.08);
        }
        .sh-filter-btn.active{
          background:rgba(200,169,110,0.15);
          border-color:#c8a96e44;
          color:#c8a96e;
        }
      `}</style>

      <div className="sh-root">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(16px,4vw,40px) 60px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,transparent,#7a5e32)', maxWidth: 60 }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: "0.3em", color: "#8a6a4a", textTransform: "uppercase" }}>
                Moroccan Darija
              </span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left,transparent,#7a5e32)', maxWidth: 60 }} />
            </div>

            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,7vw,68px)", fontWeight: 900, color: "#f0e6d0", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 14 }}>
              Reading Comprehension
            </h1>
            <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: "clamp(15px,2.5vw,19px)", color: "#8a7a6e", maxWidth: 520, margin: "0 auto 28px" }}>
              Practice your Darija reading skills with short stories
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to right,transparent,#c8a96e)' }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e" }} />
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to left,transparent,#c8a96e)' }} />
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`sh-filter-btn ${filter === level ? 'active' : ''}`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Stories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: 20 }}>
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onRead={() => setSelectedStory(story)}
              />
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: '#8a7a6e' }}>No stories found for this level.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
