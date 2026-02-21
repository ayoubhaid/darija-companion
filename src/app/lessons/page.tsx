'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import FloatingCards from '@/components/FloatingCards';
import { Lesson } from '@/types';
import { getAllLessons } from '@/lib/firestore';
import { 
  BookOpenIcon, 
  ClockIcon, 
  ChevronRightIcon,
  FireIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const difficultyColors: Record<string, { bg: string; border: string; text: string }> = {
  beginner: { bg: 'rgba(126,184,164,0.10)', border: '#7eb8a444', text: '#7eb8a4' },
  intermediate: { bg: 'rgba(200,169,110,0.10)', border: '#c8a96e44', text: '#c8a96e' },
  advanced: { bg: 'rgba(212,132,90,0.10)', border: '#d4845a44', text: '#d4845a' },
};

export default function LessonsPage() {
  const { user, loading: authLoading } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

    if (!authLoading) {
      fetchLessons();
    }
  }, [authLoading]);

  const filteredLessons = useMemo(() => {
    let filtered = filter === 'all' 
      ? lessons 
      : lessons.filter(l => l.difficulty === filter);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.topic?.toLowerCase().includes(query) ||
        l.tags?.some(t => t.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [lessons, filter, searchQuery]);

  if (authLoading || loading) {
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
        .lesson-card{
          display:block;
          border-radius:18px;
          padding:24px;
          text-decoration:none;
          transition:transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s;
          animation:fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
          position:relative;
          overflow:hidden;
        }
        .lesson-card:hover{
          transform:translateY(-4px) scale(1.015);
          box-shadow:0 12px 40px rgba(0,0,0,0.45);
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
        .sh-filter-btn:hover{background:rgba(255,255,255,0.08)}
        .sh-filter-btn.active{
          background:rgba(200,169,110,0.15);
          border-color:#c8a96e44;
          color:#c8a96e;
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
              Lessons
            </h1>
            <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: "clamp(15px,2.5vw,19px)", color: "#8a7a6e", maxWidth: 520, margin: "0 auto 28px" }}>
              Master Moroccan Darija with our structured lessons
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to right,transparent,#c8a96e)' }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e" }} />
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to left,transparent,#c8a96e)' }} />
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 32 }}>
            <MagnifyingGlassIcon style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, color: '#5a4a3e' }} />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sh-input"
              style={{ paddingLeft: 50 }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`sh-filter-btn ${filter === level ? 'active' : ''}`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {filteredLessons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: 80, height: 80, margin: '0 auto 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpenIcon style={{ width: 40, height: 40, color: '#5a4a3e' }} />
              </div>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 18, color: '#8a7a6e' }}>No lessons found</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
              {filteredLessons.map((lesson, index) => {
                const diffColors = difficultyColors[lesson.difficulty] || difficultyColors.beginner;
                const duration = lesson.duration || lesson.estimatedDuration || 15;
                const wordCount = lesson.content?.vocabulary?.length || 0;

                return (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      className="lesson-card"
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
                          {lesson.difficulty}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6a5a4e' }}>
                          <ClockIcon style={{ width: 14, height: 14 }} />
                          {duration} min
                        </div>
                      </div>

                      <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: '#f0e6d0', marginBottom: 8, marginTop: 0 }}>
                        {lesson.title}
                      </h3>
                      <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', lineHeight: 1.6, margin: '0 0 20px' }}>
                        {lesson.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6a5a4e' }}>
                          <BookOpenIcon style={{ width: 16, height: 16 }} />
                          {wordCount} words
                        </div>
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: 12,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(200,169,110,0.15)',
                            color: '#c8a96e',
                            transition: 'all 0.2s',
                          }}
                        >
                          <ChevronRightIcon style={{ width: 18, height: 18 }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
            <FloatingCards />
          </div>
        </div>
      </div>
    </>
  );
}
