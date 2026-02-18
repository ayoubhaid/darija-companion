"use client";

import { useState, useEffect, useCallback } from "react";

const ACCENT = "#c8a96e";
const BG = "#0e0804";

interface NumberItem {
  num: number;
  darija: string;
  english: string;
  tip: string;
  category: "basic" | "teens" | "tens" | "big";
}

const NUMBERS: NumberItem[] = [
  { num:0,    darija:"sifr",        english:"zero",     tip:"Same root as 'cipher' in English!",     category:"basic" },
  { num:1,    darija:"wahed",       english:"one",      tip:"Also used to say 'someone' — wahed",    category:"basic" },
  { num:2,    darija:"jouj",        english:"two",      tip:"Jouj also means 'a couple of'",         category:"basic" },
  { num:3,    darija:"tlata",       english:"three",    tip:"Same root as tuluth (triangle)",        category:"basic" },
  { num:4,    darija:"arba",        english:"four",     tip:"Same root as arba3a in Modern Arabic",  category:"basic" },
  { num:5,    darija:"khamsa",      english:"five",     tip:"Hand gestures — khamsa = the hand!",   category:"basic" },
  { num:6,    darija:"stta",        english:"six",      tip:"Drops a syllable from Fusha sitta",    category:"basic" },
  { num:7,    darija:"sba3",        english:"seven",    tip:"The 3 is the 'ain sound — throat!",    category:"basic" },
  { num:8,    darija:"tmania",      english:"eight",    tip:"Root: thaman — related to 'price'",    category:"basic" },
  { num:9,    darija:"ts3oud",      english:"nine",     tip:"Sounds like 'tis-OOD' — stress the oo",category:"basic" },
  { num:10,   darija:"3achra",      english:"ten",      tip:"The 3 at start is the deep 'ain",       category:"basic" },
  { num:11,   darija:"hdach",       english:"eleven",   tip:"Compressed from wahed + 3achra",       category:"teens" },
  { num:12,   darija:"tnach",       english:"twelve",   tip:"Compressed from jouj + 3achra",         category:"teens" },
  { num:13,   darija:"tlettach",    english:"thirteen", tip:"tlata + 3achra fused together",        category:"teens" },
  { num:14,   darija:"arba3tach",   english:"fourteen", tip:"arba + 3achra run together fast",      category:"teens" },
  { num:15,   darija:"khemstach",   english:"fifteen",  tip:"khamsa + 3achra — the 5+10",          category:"teens" },
  { num:16,   darija:"sttach",      english:"sixteen",  tip:"stta + 3achra contracted",              category:"teens" },
  { num:17,   darija:"sba3tach",    english:"seventeen",tip:"sba3 (7) + 3achra (10)",               category:"teens" },
  { num:18,   darija:"tmantach",    english:"eighteen", tip:"tmania + 3achra merged",               category:"teens" },
  { num:19,   darija:"ts3udtach",   english:"nineteen", tip:"ts3oud + 3achra — the 9+10",          category:"teens" },
  { num:20,   darija:"3chrin",      english:"twenty",   tip:"Root: same as Modern Arabic ishrin",   category:"tens"  },
  { num:30,   darija:"tlatin",      english:"thirty",   tip:"From tlata — notice the pattern!",     category:"tens"  },
  { num:40,   darija:"arb3in",      english:"forty",    tip:"From arba — just add -in suffix",      category:"tens"  },
  { num:50,   darija:"khamsin",     english:"fifty",    tip:"Same in many Arabic dialects!",        category:"tens"  },
  { num:60,   darija:"sittin",      english:"sixty",    tip:"From stta — the -in makes it tens",   category:"tens"  },
  { num:70,   darija:"sba3in",      english:"seventy",  tip:"sba3 (7) + -in = the tens pattern",   category:"tens"  },
  { num:80,   darija:"tmanin",      english:"eighty",   tip:"tmania → tmanin — drop the a",        category:"tens"  },
  { num:90,   darija:"ts3in",       english:"ninety",   tip:"ts3oud shortened + -in suffix",        category:"tens"  },
  { num:100,  darija:"mya",         english:"hundred",  tip:"Say 200 as 'myatayn', 300 as 'tlat mya'", category:"big" },
  { num:1000, darija:"alf",         english:"thousand", tip:"'Alf layla w layla' — 1001 Nights!",  category:"big"  },
];

const CATS = [
  { id:"all",    label:"All",        color: ACCENT   },
  { id:"basic",  label:"1 – 10",    color:"#7eb8a4" },
  { id:"teens",  label:"11 – 19",   color:"#9b72b0" },
  { id:"tens",   label:"20 – 90",   color:"#6b9bd2" },
  { id:"big",    label:"100+",      color:"#d4845a" },
];

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }

function TenFrame({ num }: { num: number }) {
  if (num < 1 || num > 10) return null;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:3, margin:"8px auto 0", width:66 }}>
      {Array.from({ length:10 }, (_,i) => (
        <div key={i} style={{
          width:11, height:11, borderRadius:"50%",
          background: i < num ? ACCENT : "rgba(255,255,255,0.07)",
          boxShadow: i < num ? `0 0 5px rgba(200,169,110,0.5)` : "none",
          transition:"background 0.3s",
        }}/>
      ))}
    </div>
  );
}

function NumberCard({ item, index }: { item: NumberItem; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const isLarge = item.num >= 100;

  return (
    <div onClick={() => setFlipped(f => !f)}
      style={{ perspective:1000, cursor:"pointer",
        animation:`fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) ${index*30}ms both` }}>
      <div style={{
        position:"relative", width:"100%", paddingBottom:"118%",
        transformStyle:"preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
        transition:"transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Front */}
        <div style={{
          position:"absolute", inset:0, backfaceVisibility:"hidden",
          WebkitBackfaceVisibility:"hidden" as React.CSSProperties["WebkitBackfaceVisibility"],
          background:"rgba(200,169,110,0.06)",
          border:"1px solid rgba(200,169,110,0.18)",
          borderRadius:14, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:4, padding:"12px 8px",
          boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
        }}>
          <div style={{
            fontFamily:"Georgia,serif", fontWeight:900,
            fontSize: isLarge ? "clamp(28px,5vw,44px)" : "clamp(36px,7vw,58px)",
            color: ACCENT, lineHeight:1, letterSpacing:"-0.02em",
            textShadow:`0 0 30px rgba(200,169,110,0.4)`,
          }}>{item.num}</div>
          <TenFrame num={item.num} />
          <div style={{ width:24, height:1, background:"rgba(200,169,110,0.3)", margin:"2px 0" }} />
          <div style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#e8ddd0", fontStyle:"italic", letterSpacing:"0.01em" }}>
            {item.darija}
          </div>
          <div style={{ fontFamily:"monospace", fontSize:10, color:"#6a5a4e", letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {item.english}
          </div>
          <div style={{ position:"absolute", bottom:7, right:9, fontSize:9, fontFamily:"monospace", color:"rgba(200,169,110,0.3)", letterSpacing:"0.05em" }}>tap ›</div>
        </div>
        {/* Back */}
        <div style={{
          position:"absolute", inset:0, backfaceVisibility:"hidden",
          WebkitBackfaceVisibility:"hidden" as React.CSSProperties["WebkitBackfaceVisibility"],
          transform:"rotateY(180deg)",
          background:"linear-gradient(140deg,rgba(200,169,110,0.08),rgba(18,10,5,0.95))",
          border:"1px solid rgba(200,169,110,0.2)",
          borderRadius:14, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:8, padding:14,
          boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontSize:9, fontFamily:"monospace", letterSpacing:"0.18em", color:ACCENT, textTransform:"uppercase", marginBottom:2 }}>did you know?</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:12, color:"#e8ddd0", textAlign:"center", lineHeight:1.65 }}>{item.tip}</div>
          <div style={{ marginTop:6, padding:"4px 14px", borderRadius:100, background:ACCENT, color:"#1a0f08", fontFamily:"Georgia,serif", fontWeight:700, fontSize:16 }}>
            {item.darija}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizMode({ onExit }: { onExit: () => void }) {
  const pool = NUMBERS.filter(n => n.num <= 20);
  const [q, setQ] = useState<NumberItem | null>(null);
  const [opts, setOpts] = useState<NumberItem[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);

  const next = useCallback(() => {
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const wrongs = shuffle(pool.filter(n => n.darija !== correct.darija)).slice(0,3);
    setQ(correct);
    setOpts(shuffle([correct, ...wrongs]));
    setChosen(null);
  }, []);

  useEffect(() => { next(); }, []);

  const pick = (opt: NumberItem) => {
    if (chosen || !q) return;
    setChosen(opt.darija);
    setTotal(t => t+1);
    if (opt.darija === q.darija) {
      setScore(s => s+1);
      setStreak(s => s+1);
      setTimeout(next, 900);
    } else {
      setStreak(0);
      setTimeout(next, 1400);
    }
  };

  if (!q) return null;

  return (
    <div style={{ maxWidth:440, margin:"0 auto", padding:"0 0 40px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, padding:"12px 20px", background:"rgba(200,169,110,0.06)", borderRadius:12, border:"1px solid rgba(200,169,110,0.15)" }}>
        <div style={{ fontFamily:"monospace", fontSize:11, color:"#6a5a4e", letterSpacing:"0.1em" }}>SCORE <span style={{ color:ACCENT, fontSize:18, fontFamily:"Georgia,serif", fontWeight:700 }}>{score}</span> / {total}</div>
        {streak >= 2 && <div style={{ fontSize:11, fontFamily:"monospace", color:"#ff8c42" }}>🔥 {streak} streak</div>}
        <button onClick={onExit} style={{ fontFamily:"monospace", fontSize:11, color:"#5a4a3e", background:"none", border:"none", cursor:"pointer", letterSpacing:"0.08em" }}>← exit quiz</button>
      </div>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontFamily:"monospace", fontSize:11, color:"#6a5a4e", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:12 }}>What is this number in Darija?</div>
        <div style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:"clamp(64px,18vw,110px)", color:ACCENT, lineHeight:1, textShadow:"0 0 60px rgba(200,169,110,0.35)" }}>
          {q.num}
        </div>
        <TenFrame num={q.num} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {opts.map(opt => {
          const isCorrect = opt.darija === q.darija;
          const isPicked  = chosen === opt.darija;
          return (
            <button key={opt.darija} onClick={() => pick(opt)} style={{
              padding:"16px 12px", borderRadius:12, cursor: chosen ? "default" : "pointer",
              fontFamily:"Georgia,serif", fontSize:15, fontStyle:"italic",
              border:"1.5px solid",
              transition:"all 0.2s",
              ...(chosen
                ? isCorrect
                  ? { background:"rgba(76,175,125,0.18)", borderColor:"#4caf7d", color:"#4caf7d" }
                  : isPicked
                    ? { background:"rgba(224,85,85,0.15)", borderColor:"#e05555", color:"#e05555" }
                    : { background:"rgba(255,255,255,0.02)", borderColor:"rgba(255,255,255,0.06)", color:"#4a3a2e" }
                : { background:"rgba(255,255,255,0.03)", borderColor:"rgba(200,169,110,0.15)", color:"#e8ddd0" })
            }}>
              {opt.darija}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Numbers() {
  const [cat, setCat] = useState("all");
  const [quiz, setQuiz] = useState(false);

  const filtered = NUMBERS.filter(n => cat === "all" || n.category === cat);

  return (
    <div style={{
      minHeight:"100vh", color:"#f0e6d0",
      background:`radial-gradient(ellipse at 10% 0%,#1e0e00 0%,transparent 50%), radial-gradient(ellipse at 90% 100%,#0a0014 0%,transparent 50%), ${BG}`,
      backgroundImage:`radial-gradient(ellipse at 10% 0%,#1e0e00,transparent 50%),radial-gradient(ellipse at 90% 100%,#0a0014,transparent 50%),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(200,169,110,0.02) 60px,rgba(200,169,110,0.02) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(200,169,110,0.02) 60px,rgba(200,169,110,0.02) 61px)`,
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        button:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"clamp(80px,10vw,120px) clamp(16px,4vw,36px) 56px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ fontFamily:"monospace", fontSize:"clamp(48px,15vw,96px)", fontWeight:900, color:ACCENT, lineHeight:0.9, letterSpacing:"-0.04em", textShadow:"0 0 80px rgba(200,169,110,0.25)", marginBottom:8 }}>
            1 2 3
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, margin:"16px 0 8px" }}>
            <div style={{ flex:1, maxWidth:60, height:1, background:`linear-gradient(to right,transparent,${ACCENT})` }} />
            <span style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.3em", color:"#8a6a4a", textTransform:"uppercase" }}>Moroccan Darija</span>
            <div style={{ flex:1, maxWidth:60, height:1, background:`linear-gradient(to left,transparent,${ACCENT})` }} />
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(28px,6vw,52px)", fontWeight:900, color:"#f0e6d0", lineHeight:1, letterSpacing:"-0.02em", marginBottom:6 }}>Numbers</h1>
          <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:15, color:"#8a7a6e", marginBottom:28 }}>
            Tap to flip · dots show the count · try quiz mode
          </p>

          {/* Quiz toggle */}
          <button onClick={() => setQuiz(q => !q)} style={{
            marginBottom:28,
            padding:"11px 28px", borderRadius:100,
            background: quiz ? ACCENT : "rgba(200,169,110,0.08)",
            color: quiz ? "#1a0f08" : ACCENT,
            border:`1px solid ${ACCENT}`,
            fontFamily:"monospace", fontSize:12, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase",
            cursor:"pointer", transition:"all 0.2s",
          }}>
            {quiz ? "✕ Exit Quiz" : "⚡ Quiz Mode"}
          </button>

          {!quiz && (
            <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8 }}>
              {CATS.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)} style={{
                  padding:"7px 18px", borderRadius:100, cursor:"pointer",
                  fontFamily:"monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase",
                  border:"1px solid", transition:"all 0.2s",
                  ...(cat === c.id
                    ? { background:c.color, borderColor:c.color, color:"#1a0f08", fontWeight:700 }
                    : { background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.08)", color:"#8a7a6e" })
                }}>{c.label}</button>
              ))}
            </div>
          )}
        </div>

        {quiz
          ? <QuizMode onExit={() => setQuiz(false)} />
          : (
            <>
              <div style={{ textAlign:"center", marginBottom:20, fontSize:11, fontFamily:"monospace", color:"#5a4a3e", letterSpacing:"0.1em" }}>
                {filtered.length} numbers
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:14 }}>
                {filtered.map((n,i) => <NumberCard key={n.num} item={n} index={i} />)}
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}
