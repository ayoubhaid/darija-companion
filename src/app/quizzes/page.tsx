'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Quiz } from '@/types';
import { getAllQuizzes } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import {
  FireIcon,
  ClockIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid';

const difficultyColors: Record<string, { bg: string; border: string; text: string }> = {
  beginner: { bg: 'rgba(107,155,210,0.10)', border: '#6b9bd244', text: '#6b9bd2' },
  intermediate: { bg: 'rgba(200,169,110,0.10)', border: '#c8a96e44', text: '#c8a96e' },
  advanced: { bg: 'rgba(212,132,90,0.10)', border: '#d4845a44', text: '#d4845a' },
};

const difficultyOrder: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

type SortOption = 'default' | 'difficulty-asc' | 'difficulty-desc' | 'xp-desc' | 'questions-asc';

function estimateTime(questionCount: number): string {
  const minutes = Math.max(1, Math.round(questionCount * 0.75));
  return `~${minutes} min`;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { userProfile } = useAuth();

  const completedQuizIds = useMemo(
    () => new Set(userProfile?.completedQuizzes || []),
    [userProfile]
  );

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const filteredAndSortedQuizzes = useMemo(() => {
    let result = filter === 'all' ? quizzes : quizzes.filter((q) => q.difficulty === filter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(q) ||
          quiz.description?.toLowerCase().includes(q) ||
          quiz.type?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'difficulty-asc':
        result = [...result].sort(
          (a, b) => (difficultyOrder[a.difficulty] ?? 0) - (difficultyOrder[b.difficulty] ?? 0)
        );
        break;
      case 'difficulty-desc':
        result = [...result].sort(
          (a, b) => (difficultyOrder[b.difficulty] ?? 0) - (difficultyOrder[a.difficulty] ?? 0)
        );
        break;
      case 'xp-desc':
        result = [...result].sort((a, b) => (b.xpReward || 0) - (a.xpReward || 0));
        break;
      case 'questions-asc':
        result = [...result].sort(
          (a, b) =>
            (a.totalQuestions || a.questions?.length || 0) -
            (b.totalQuestions || b.questions?.length || 0)
        );
        break;
    }

    return result;
  }, [quizzes, filter, searchQuery, sortBy]);

  const completedCount = useMemo(
    () => quizzes.filter((q) => completedQuizIds.has(q.id)).length,
    [quizzes, completedQuizIds]
  );

  const sortLabels: Record<SortOption, string> = {
    default: 'Default',
    'difficulty-asc': 'Easiest First',
    'difficulty-desc': 'Hardest First',
    'xp-desc': 'Most XP',
    'questions-asc': 'Fewest Questions',
  };

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
        .quiz-card{
          display:block;
          border-radius:18px;
          padding:24px;
          text-decoration:none;
          transition:transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s;
          animation:fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
          position:relative;
          overflow:hidden;
        }
        .quiz-card:hover{
          transform:translateY(-4px) scale(1.015);
          box-shadow:0 12px 40px rgba(0,0,0,0.45);
        }
        .sh-input{
          border-radius:14px;
          padding:14px 18px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(200,169,110,0.2);
          color:#f0e6d0;
          font-family:'Lora',serif;
          font-size:15px;
          outline:none;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .sh-input:focus{
          border-color:#c8a96e;
          box-shadow:0 0 0 3px rgba(200,169,110,0.15);
        }
        .sh-input::placeholder{color:#5a4a3e}
        .sh-btn{
          border-radius:14px;
          padding:14px 20px;
          font-family:'DM Mono',monospace;
          font-size:13px;
          letter-spacing:0.05em;
          cursor:pointer;
          transition:all 0.2s;
          border:1px solid rgba(200,169,110,0.3);
          background:rgba(200,169,110,0.1);
          color:#c8a96e;
        }
        .sh-btn:hover{
          background:rgba(200,169,110,0.2);
          border-color:#c8a96e;
        }
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
        .sh-sort-menu{
          position:absolute;right:0;top:calc(100%+8px);
          background:#1a120a;
          border:1px solid rgba(200,169,110,0.2);
          border-radius:14px;
          padding:8px;
          min-width:180px;
          z-index:50;
          box-shadow:0 20px 50px rgba(0,0,0,0.5);
        }
        .sh-sort-item{
          display:block;
          width:100%;
          text-align:left;
          padding:12px 16px;
          font-family:'Lora',serif;
          font-size:14px;
          color:#8a7a6e;
          background:none;
          border:none;
          border-radius:10px;
          cursor:pointer;
          transition:all 0.15s;
        }
        .sh-sort-item:hover{background:rgba(200,169,110,0.1);color:#c8a96e}
        .sh-sort-item.active{color:#c8a96e;background:rgba(200,169,110,0.15)}
        @media(max-width:600px){
          .sh-grid{grid-template-columns:1fr}
        }
      `}</style>

      <div className="sh-root">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(16px,4vw,40px) 60px', position: 'relative', zIndex: 1 }}>

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
              Quizzes
            </h1>
            <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: "clamp(15px,2.5vw,19px)", color: "#8a7a6e", maxWidth: 520, margin: "0 auto 28px" }}>
              Test your knowledge and earn XP
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to right,transparent,#c8a96e)' }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e" }} />
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to left,transparent,#c8a96e)' }} />
            </div>
          </div>

          {/* Search + Sort row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <MagnifyingGlassIcon style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, color: '#5a4a3e' }} />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sh-input"
                style={{ width: '100%', paddingLeft: 50 }}
              />
            </div>

            {/* Sort dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSortMenu((s) => !s)}
                className="sh-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span style={{ display: 'none' }}>{sortLabels[sortBy]}</span>
                <span style={{ display: 'inline' }}>{sortLabels[sortBy]}</span>
              </button>
              {showSortMenu && (
                <div className="sh-sort-menu">
                  {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSortBy(key); setShowSortMenu(false); }}
                      className={`sh-sort-item ${sortBy === key ? 'active' : ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Difficulty filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`sh-filter-btn ${filter === level ? 'active' : ''}`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
                {level !== 'all' && (
                  <span style={{ marginLeft: 8, opacity: 0.7, fontSize: 11 }}>
                    ({quizzes.filter((q) => q.difficulty === level).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredAndSortedQuizzes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: 80, height: 80, margin: '0 auto 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QuestionMarkCircleIcon style={{ width: 40, height: 40, color: '#5a4a3e' }} />
              </div>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 18, color: '#8a7a6e', marginBottom: 16 }}>No quizzes found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#c8a96e', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
              {filteredAndSortedQuizzes.map((quiz, index) => {
                const isCompleted = completedQuizIds.has(quiz.id);
                const questionCount = quiz.totalQuestions || quiz.questions?.length || 0;
                const timeEstimate = estimateTime(questionCount);
                const diffColors = difficultyColors[quiz.difficulty] || difficultyColors.beginner;

                return (
                  <Link key={quiz.id} href={`/quizzes/${quiz.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      className="quiz-card"
                      style={{
                        background: diffColors.bg,
                        border: `1px solid ${diffColors.border}`,
                        animationDelay: `${index * 60}ms`,
                      }}
                    >
                      {/* Glow blob */}
                      <div style={{
                        position: 'absolute', top: -30, right: -30,
                        width: 120, height: 120, borderRadius: '50%',
                        background: diffColors.text,
                        opacity: 0.06, filter: 'blur(30px)',
                        pointerEvents: 'none',
                      }} />

                      {/* Completed overlay badge */}
                      {isCompleted && (
                        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: '#7eb8a4', color: '#fff', fontSize: 11, fontWeight: 600, borderRadius: 100 }}>
                            <CheckBadgeSolid style={{ width: 14, height: 14 }} />
                            Done
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div
                          style={{
                            padding: '6px 14px',
                            borderRadius: 100,
                            background: `${diffColors.text}22`,
                            border: `1px solid ${diffColors.border}`,
                            color: diffColors.text,
                            fontFamily: "'DM Mono',monospace",
                            fontSize: 11,
                            fontWeight: 500,
                            textTransform: 'capitalize',
                          }}
                        >
                          {quiz.difficulty}
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          fontFamily: "'DM Mono',monospace", fontSize: 12,
                          color: '#c8a96e', padding: '6px 12px',
                          background: 'rgba(200,169,110,0.1)', borderRadius: 100,
                        }}>
                          <StarIcon style={{ width: 14, height: 14 }} />
                          {quiz.xpReward || 10} XP
                        </div>
                      </div>

                      <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: '#f0e6d0', marginBottom: 8, marginTop: 0 }}>
                        {quiz.title}
                      </h3>
                      <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', lineHeight: 1.6, margin: '0 0 20px' }}>
                        {quiz.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#6a5a4e' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FireIcon style={{ width: 16, height: 16 }} />
                            {questionCount} questions
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ClockIcon style={{ width: 16, height: 16 }} />
                            {timeEstimate}
                          </span>
                        </div>
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: 12,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isCompleted ? 'rgba(126,184,164,0.2)' : 'rgba(200,169,110,0.15)',
                            color: isCompleted ? '#7eb8a4' : '#c8a96e',
                            transition: 'all 0.2s',
                          }}
                        >
                          {isCompleted ? (
                            <CheckBadgeIcon style={{ width: 18, height: 18 }} />
                          ) : (
                            <ChevronRightIcon style={{ width: 18, height: 18 }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
