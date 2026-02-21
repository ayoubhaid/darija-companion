'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWordOfTheDay } from '@/hooks/useWordOfTheDay';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function WordOfTheDayPage() {
  const { wotd, loading, markKnown } = useWordOfTheDay();
  const [revealed, setRevealed] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="sh-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          border: '2px solid #c8a96e', 
          borderTopColor: 'transparent', 
          borderRadius: '50%', 
          animation: 'spin 0.8s linear infinite' 
        }}></div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!wotd?.word) {
    return (
      <div className="sh-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'Lora',serif", fontSize: 18, color: '#8a7a6e' }}>No word available today. Check back later!</p>
        </div>
      </div>
    );
  }

  const { word, known } = wotd;

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
        .sh-card{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(200,169,110,0.1);
          border-radius:20px;
          padding:28px;
          position:relative;
          overflow:hidden;
        }
        .sh-btn-primary{
          padding:14px 24px;
          border-radius:14px;
          background:#c8a96e;
          border:none;
          color:#0e0804;
          font-family:'DM Mono',monospace;
          font-size:14px;
          font-weight:500;
          cursor:pointer;
          transition:all 0.2s;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
        }
        .sh-btn-primary:hover{
          background:#d4b87a;
          transform:translateY(-2px);
        }
        .sh-btn-secondary{
          padding:14px 24px;
          border-radius:14px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(200,169,110,0.2);
          color:#c8a96e;
          font-family:'DM Mono',monospace;
          font-size:14px;
          font-weight:500;
          cursor:pointer;
          transition:all 0.2s;
        }
        .sh-btn-secondary:hover{
          background:rgba(200,169,110,0.15);
        }
        .sh-nav-card{
          padding:16px;
          border-radius:14px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(200,169,110,0.1);
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          transition:all 0.2s;
          cursor:pointer;
          text-decoration:none;
        }
        .sh-nav-card:hover{
          border-color:#c8a96e;
          background:rgba(200,169,110,0.1);
        }
        .sh-nav-card.primary{
          background:#c8a96e;
          border-color:#c8a96e;
        }
        .sh-nav-card.primary:hover{
          background:#d4b87a;
        }
      `}</style>

      <div className="sh-root">
        <div style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(16px,4vw,40px) 60px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 100, background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e', fontFamily: "'DM Mono',monospace", fontSize: 12, marginBottom: 16 }}>
              <CalendarDaysIcon style={{ width: 16, height: 16 }} />
              {today}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 36, color: '#f0e6d0', marginBottom: 8 }}>
              Word of the Day
            </h1>
            <p style={{ fontFamily: "'Lora',serif", fontSize: 15, color: '#8a7a6e' }}>
              A new Darija word every day to build your vocabulary
            </p>
          </div>

          {/* Main Word Card */}
          <div className="sh-card" style={{ textAlign: 'center', marginBottom: 24 }}>
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,110,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,114,176,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />

            <div style={{ position: 'relative' }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '6px 16px', 
                borderRadius: 100, 
                background: 'rgba(200,169,110,0.15)', 
                border: '1px solid rgba(200,169,110,0.2)', 
                color: '#c8a96e', 
                fontFamily: "'DM Mono',monospace", 
                fontSize: 11, 
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 20 
              }}>
                {word.category}
              </div>

              {/* Arabic script */}
              {word.arabic && (
                <p style={{ fontSize: 48, fontFamily: 'serif', color: '#f0e6d0', marginBottom: 16, fontWeight: 700, direction: 'rtl' }}>
                  {word.arabic}
                </p>
              )}

              {/* Darija word */}
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 42, color: '#f0e6d0', marginBottom: 8 }}>
                {word.word}
              </h2>

              {/* Transliteration */}
              <p style={{ fontFamily: "'Lora',serif", fontSize: 18, color: '#6a5a4e', fontStyle: 'italic', marginBottom: 20 }}>
                {word.transliteration}
              </p>

              {/* Translation */}
              <div style={{ display: 'inline-block', padding: '16px 32px', background: 'rgba(200,169,110,0.15)', borderRadius: 16, marginBottom: 24 }}>
                <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: '#c8a96e' }}>
                  {word.translation}
                </p>
              </div>

              {/* Known badge */}
              {known && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#7eb8a4', marginBottom: 20, fontFamily: "'DM Mono',monospace", fontSize: 13 }}>
                  <CheckCircleSolid style={{ width: 20, height: 20 }} />
                  <span style={{ fontWeight: 500 }}>You know this word!</span>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                {!known ? (
                  <button
                    onClick={markKnown}
                    className="sh-btn-primary"
                  >
                    <CheckCircleIcon style={{ width: 18, height: 18 }} />
                    I Know This Word
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 14, background: 'rgba(126,184,164,0.15)', border: '1px solid rgba(126,184,164,0.2)', color: '#7eb8a4', fontFamily: "'DM Mono',monospace", fontSize: 14 }}>
                    <CheckCircleSolid style={{ width: 18, height: 18 }} />
                    Marked as Known
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Example sentence */}
          {word.example && (
            <div className="sh-card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: '#f0e6d0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <BookOpenIcon style={{ width: 20, height: 20, color: '#c8a96e' }} />
                Example Sentence
              </h3>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 18 }}>
                <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: 16, color: '#f0e6d0', marginBottom: 6 }}>{word.example}</p>
                {word.exampleTranslation && (
                  <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#6a5a4e', fontStyle: 'italic' }}>{word.exampleTranslation}</p>
                )}
              </div>
            </div>
          )}

          {/* Reveal challenge */}
          <div className="sh-card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: '#f0e6d0', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <SparklesIcon style={{ width: 20, height: 20, color: '#c8a96e' }} />
              Quick Challenge
            </h3>
            <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', marginBottom: 16 }}>
              Can you use <strong style={{ color: '#f0e6d0' }}>{word.word}</strong> in a sentence?
              Think of one, then reveal the example.
            </p>
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                style={{ width: '100%', padding: '16px', borderRadius: 14, border: '2px dashed rgba(200,169,110,0.3)', background: 'transparent', color: '#c8a96e', fontFamily: "'DM Mono',monospace", fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Reveal Example Sentence
              </button>
            ) : (
              <div style={{ padding: 18, background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: 14 }}>
                <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: 16, color: '#f0e6d0' }}>
                  {word.example || `${word.word} — ${word.translation}`}
                </p>
                {word.exampleTranslation && (
                  <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#6a5a4e', marginTop: 6, fontStyle: 'italic' }}>{word.exampleTranslation}</p>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Link href="/vocabulary" style={{ textDecoration: 'none' }}>
              <div className="sh-nav-card">
                <BookOpenIcon style={{ width: 20, height: 20, color: '#8a7a6e' }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#8a7a6e' }}>All Vocabulary</span>
              </div>
            </Link>
            <Link href="/practice" style={{ textDecoration: 'none' }}>
              <div className="sh-nav-card primary">
                <SparklesIcon style={{ width: 20, height: 20, color: '#0e0804' }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#0e0804', fontWeight: 500 }}>Practice Now</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
