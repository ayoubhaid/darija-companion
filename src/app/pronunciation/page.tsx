'use client';

import { useState } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

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

const difficultyColors: Record<string, { bg: string; border: string; text: string }> = {
  easy: { bg: 'rgba(126,184,164,0.10)', border: '#7eb8a444', text: '#7eb8a4' },
  medium: { bg: 'rgba(200,169,110,0.10)', border: '#c8a96e44', text: '#c8a96e' },
  hard: { bg: 'rgba(212,132,90,0.10)', border: '#d4845a44', text: '#d4845a' },
};

function SoundCard({ sound }: { sound: SoundEntry }) {
  const colors = difficultyColors[sound.difficulty] || difficultyColors.easy;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(200,169,110,0.1)',
      borderRadius: 18,
      padding: 24,
      marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 14,
          background: 'linear-gradient(135deg, #9b72b0 0%, #7eb8a4 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 8px 24px rgba(155,114,176,0.3)',
          fontSize: 32,
        }}>
          <span style={{ fontFamily: 'serif' }}>{sound.arabic}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: '#f0e6d0', margin: 0 }}>
              {sound.name}
            </h3>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100,
              background: `${colors.text}22`, color: colors.text, border: `1px solid ${colors.border}`,
            }}>
              {sound.difficulty}
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#6a5a4e', marginBottom: 6 }}>{sound.transliteration}</p>
          <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', lineHeight: 1.5 }}>{sound.description}</p>
        </div>
      </div>

      {/* Tips */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 14, color: '#f0e6d0', marginBottom: 10 }}>Tips:</h4>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {sound.tips.map((tip, index) => (
            <li key={index} style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', marginBottom: 6, lineHeight: 1.5 }}>
              <span style={{ color: '#c8a96e', marginRight: 6 }}>•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Examples */}
      <div>
        <h4 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 14, color: '#f0e6d0', marginBottom: 10 }}>Examples:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sound.examples.map((example, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
              <span style={{ fontFamily: 'serif', fontSize: 18, color: '#f0e6d0', textAlign: 'right', flex: 1 }}>{example.darija}</span>
              <span style={{ fontFamily: "'Lora',serif", fontSize: 13, color: '#6a5a4e', textAlign: 'right', flex: 1 }}>{example.english}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
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
        .sh-tab-btn{
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
        .sh-tab-btn:hover{background:rgba(255,255,255,0.08)}
        .sh-tab-btn.active{
          background:rgba(200,169,110,0.15);
          border-color:#c8a96e44;
          color:#c8a96e;
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
        .sh-ref-box{
          padding:10px 14px;
          border-radius:10px;
          background:rgba(255,255,255,0.03);
          font-size:13px;
          color:#8a7a6e;
        }
        .sh-ref-box span{
          font-family:'DM Mono',monospace;
          color:#c8a96e;
          font-weight:500;
        }
      `}</style>

      <div className="sh-root">
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(16px,4vw,40px) 60px', position: 'relative', zIndex: 1 }}>
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
              Pronunciation Guide
            </h1>
            <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: "clamp(15px,2.5vw,19px)", color: "#8a7a6e", maxWidth: 520, margin: "0 auto 28px" }}>
              Master the unique sounds of Moroccan Darija
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to right,transparent,#c8a96e)' }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e" }} />
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to left,transparent,#c8a96e)' }} />
            </div>
          </div>

          {/* Quick Reference */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(200,169,110,0.1)',
            borderRadius: 18,
            padding: 24,
            marginBottom: 32,
          }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: '#f0e6d0', marginBottom: 16 }}>Quick Reference - Transliteration Key</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
              <div className="sh-ref-box"><span>7</span> = ح (breathy h)</div>
              <div className="sh-ref-box"><span>3</span> = ع (glottal stop)</div>
              <div className="sh-ref-box"><span>kh</span> = خ (German ch)</div>
              <div className="sh-ref-box"><span>gh</span> = غ (guttural r)</div>
              <div className="sh-ref-box"><span>q</span> = ق (emphatic k)</div>
              <div className="sh-ref-box"><span>sh</span> = ش (sh sound)</div>
              <div className="sh-ref-box"><span>j</span> = ج (j sound)</div>
              <div className="sh-ref-box"><span>aa</span> = long a</div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {SOUND_CATEGORIES.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(index)}
                className={`sh-tab-btn ${activeCategory === index ? 'active' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ marginBottom: 32 }}>
            <input
              type="text"
              placeholder="Search sounds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sh-input"
            />
          </div>

          {/* Sounds List */}
          {(searchQuery ? filteredSounds : [SOUND_CATEGORIES[activeCategory]]).map((category) => (
            <div key={category.name}>
              {!searchQuery && (
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: '#f0e6d0', marginBottom: 8 }}>{category.name}</h2>
                  <p style={{ fontFamily: "'Lora',serif", fontSize: 15, color: '#8a7a6e' }}>{category.description}</p>
                </div>
              )}
              {category.sounds.map((sound) => (
                <SoundCard key={sound.transliteration} sound={sound} />
              ))}
            </div>
          ))}

          {!searchQuery && SOUND_CATEGORIES[activeCategory].sounds.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: '#8a7a6e' }}>No sounds in this category.</p>
            </div>
          )}

          {searchQuery && filteredSounds.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: '#8a7a6e' }}>No sounds found matching "{searchQuery}"</p>
            </div>
          )}

          {/* Practice Tip */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(155,114,176,0.1) 0%, rgba(126,184,164,0.1) 100%)',
            border: '1px solid rgba(155,114,176,0.2)',
            borderRadius: 18,
            padding: 24,
            marginTop: 32,
          }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: '#f0e6d0', marginBottom: 12 }}>Practice Tips</h3>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', marginBottom: 8, lineHeight: 1.5 }}>Listen to native speakers and try to mimic their pronunciation</li>
              <li style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', marginBottom: 8, lineHeight: 1.5 }}>Practice in front of a mirror to see your mouth position</li>
              <li style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', marginBottom: 8, lineHeight: 1.5 }}>Record yourself and compare with native audio</li>
              <li style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', marginBottom: 8, lineHeight: 1.5 }}>Focus on one sound at a time until comfortable</li>
              <li style={{ fontFamily: "'Lora',serif", fontSize: 14, color: '#8a7a6e', lineHeight: 1.5 }}>Practice daily - even 5 minutes makes a difference!</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
