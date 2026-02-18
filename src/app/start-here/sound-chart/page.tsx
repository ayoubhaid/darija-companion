"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary config — set in .env.local:
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
//   NEXT_PUBLIC_CLOUDINARY_FOLDER=darija-sounds
//
// Audio files expected at: darija-sounds/bab.mp3, shno.mp3, 3yan.mp3 …
// ─────────────────────────────────────────────────────────────────────────────

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const CLOUD_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? "darija-sounds";

function audioUrl(slug: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${CLOUD_FOLDER}/${slug}.mp3`;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Sound {
  sound: string;
  name: string;
  example: string;
  meaning: string;
  category: "vowels" | "basic" | "emphatic" | "unique";
  tip: string;
  file: string;
}

interface CatStyle {
  bg: string;
  border: string;
  accent: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const SOUNDS: Sound[] = [
  { sound:"a",      name:"alif",  example:"ana",    meaning:"me",          category:"vowels",   tip:"Like 'a' in father — open and warm",            file:"ana"    },
  { sound:"b",      name:"ba",    example:"bab",    meaning:"door",         category:"basic",    tip:"Like English 'b'",                              file:"bab"    },
  { sound:"t",      name:"ta",    example:"tfa7",   meaning:"apple",        category:"basic",    tip:"Like English 't'",                              file:"tfa7"   },
  { sound:"th",     name:"tha",   example:"thlat",  meaning:"Tuesday",      category:"basic",    tip:"Like 'th' in three",                            file:"thlat"  },
  { sound:"j",      name:"jim",   example:"joj",    meaning:"two",          category:"basic",    tip:"Like 'zh' in measure — soft and buzzy",         file:"joj"    },
  { sound:"d",      name:"da",    example:"daba",   meaning:"now",          category:"basic",    tip:"Like English 'd'",                              file:"daba"   },
  { sound:"r",      name:"ra",    example:"rkhis",  meaning:"cheap",        category:"basic",    tip:"Rolled 'r' — tip of tongue trills lightly",     file:"rkhis"  },
  { sound:"z",      name:"zay",   example:"zwin",   meaning:"beautiful",    category:"basic",    tip:"Like English 'z'",                              file:"zwin"   },
  { sound:"s",      name:"sin",   example:"sir",    meaning:"go",           category:"basic",    tip:"Like English 's'",                              file:"sir"    },
  { sound:"sh",     name:"shin",  example:"shno",   meaning:"what",         category:"basic",    tip:"Like 'sh' in shoe",                             file:"shno"   },
  { sound:"f",      name:"fa",    example:"flous",  meaning:"money",        category:"basic",    tip:"Like English 'f'",                              file:"flous"  },
  { sound:"k",      name:"kaf",   example:"korsi",  meaning:"chair",        category:"basic",    tip:"Like English 'k'",                              file:"korsi"  },
  { sound:"l",      name:"lam",   example:"lil",    meaning:"night",        category:"basic",    tip:"Like English 'l'",                              file:"lil"    },
  { sound:"m",      name:"mim",   example:"mrid",   meaning:"sick",         category:"basic",    tip:"Like English 'm'",                              file:"mrid"   },
  { sound:"n",      name:"nun",   example:"nhar",   meaning:"day",          category:"basic",    tip:"Like English 'n'",                              file:"nhar"   },
  { sound:"w",      name:"waw",   example:"warda",  meaning:"flower",       category:"basic",    tip:"Like English 'w'",                              file:"warda"  },
  { sound:"y",      name:"ya",    example:"yallah", meaning:"let's go",     category:"basic",    tip:"Like English 'y' in yes",                       file:"yallah" },
  { sound:"S",      name:"Sad",   example:"Sbah",   meaning:"morning",      category:"emphatic", tip:"Heavy 's' — tongue pressed flat to the roof",   file:"sbah"   },
  { sound:"D",      name:"Dad",   example:"Dar",    meaning:"house",        category:"emphatic", tip:"Heavy 'd' — unique to Arabic, deeply resonant", file:"dar"    },
  { sound:"T",      name:"Ta",    example:"Tre9",   meaning:"road",         category:"emphatic", tip:"Heavy 't' — tongue back, lips slightly rounded", file:"tre9"   },
  { sound:"h (8)",  name:"ha",    example:"hna",    meaning:"here",         category:"unique",   tip:"Soft breathy 'h' from deep in the chest",       file:"hna"    },
  { sound:"kh (5)", name:"kha",   example:"khobz",  meaning:"bread",        category:"unique",   tip:"Like 'ch' in Bach — back of the throat",        file:"khobz"  },
  { sound:"3",      name:"3ayn",  example:"3yan",   meaning:"tired",        category:"unique",   tip:"Squeeze your throat — no English equivalent!",  file:"3yan"   },
  { sound:"gh (4)", name:"ghayn", example:"ghali",  meaning:"expensive",    category:"unique",   tip:"Like gargling softly — voiced guttural",        file:"ghali"  },
  { sound:"q (9)",  name:"9af",   example:"9rib",   meaning:"soon/close",   category:"unique",   tip:"A 'k' made way back in the throat — uvular",   file:"9rib"   },
  { sound:"7",      name:"7a",    example:"7lou",   meaning:"sweet",        category:"unique",   tip:"Like breathing on cold glass — from the throat", file:"7lou"  },
];

const CATEGORIES = [
  { id:"all",      label:"All Sounds",    color:"#c8a96e" },
  { id:"vowels",   label:"Vowels",        color:"#7eb8a4" },
  { id:"basic",    label:"Basic",         color:"#6b9bd2" },
  { id:"emphatic", label:"Emphatic",      color:"#d4845a" },
  { id:"unique",   label:"Unique Arabic", color:"#9b72b0" },
];

const CAT_COLORS: Record<string, CatStyle> = {
  vowels:   { bg:"rgba(126,184,164,0.12)", border:"#7eb8a4", accent:"#7eb8a4" },
  basic:    { bg:"rgba(107,155,210,0.12)", border:"#6b9bd2", accent:"#6b9bd2" },
  emphatic: { bg:"rgba(212,132,90,0.12)",  border:"#d4845a", accent:"#d4845a" },
  unique:   { bg:"rgba(155,114,176,0.12)", border:"#9b72b0", accent:"#9b72b0" },
};

// ── useAudio hook ─────────────────────────────────────────────────────────────
type PlayState = "idle" | "loading" | "playing";

function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [playState, setPlayState] = useState<PlayState>("idle");

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
    setActiveSlug(null);
    setPlayState("idle");
  }, []);

  const play = useCallback((slug: string) => {
    stop();
    setActiveSlug(slug);
    setPlayState("loading");

    const audio = new Audio(audioUrl(slug));
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => {
      setPlayState("playing");
      audio.play().catch(stop);
    }, { once: true });

    audio.addEventListener("ended", () => { setActiveSlug(null); setPlayState("idle"); audioRef.current = null; }, { once: true });
    audio.addEventListener("error",  () => { setActiveSlug(null); setPlayState("idle"); audioRef.current = null; }, { once: true });
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return { play, stop, activeSlug, playState };
}

// ── SpeakerButton ─────────────────────────────────────────────────────────────
function SpeakerButton({ slug, accent, play, activeSlug, playState }: {
  slug: string;
  accent: string;
  play: (s: string) => void;
  activeSlug: string | null;
  playState: PlayState;
}) {
  const isThis = activeSlug === slug;
  const isLoading = isThis && playState === "loading";
  const isPlaying = isThis && playState === "playing";

  return (
    <button
      onClick={e => { e.stopPropagation(); play(slug); }}
      title="Play audio"
      style={{
        position: "absolute", bottom: 8, right: 8,
        width: 30, height: 30, borderRadius: "50%",
        border: `1px solid ${accent}`, background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: 14, lineHeight: 1, color: accent,
        opacity: isPlaying ? 1 : isLoading ? 0.6 : 0.42,
        transform: isPlaying ? "scale(1.12)" : "scale(1)",
        transition: "opacity 0.2s, transform 0.2s",
        animation: isLoading ? "spkSpin 0.9s linear infinite" : isPlaying ? "spkPop 0.3s ease" : "none",
      }}
    >
      {isLoading ? "⟳" : "🔊"}
    </button>
  );
}

// ── SoundCard ─────────────────────────────────────────────────────────────────
function SoundCard({ s, index, play, activeSlug, playState }: {
  s: Sound;
  index: number;
  play: (slug: string) => void;
  activeSlug: string | null;
  playState: PlayState;
}) {
  const [flipped, setFlipped] = useState(false);
  const [ringing, setRinging] = useState(false);
  const c = CAT_COLORS[s.category];
  const isPlaying = activeSlug === s.file && playState === "playing";

  useEffect(() => {
    if (!isPlaying) return;
    setRinging(true);
    const t = setTimeout(() => setRinging(false), 750);
    return () => clearTimeout(t);
  }, [isPlaying]);

  const faceBase: React.CSSProperties = {
    position: "absolute", inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden" as React.CSSProperties["WebkitBackfaceVisibility"],
    borderRadius: 16,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 7, padding: "14px 12px",
    boxShadow: ringing
      ? "0 4px 24px rgba(0,0,0,0.3), 0 0 0 8px rgba(200,169,110,0.1), inset 0 1px 0 rgba(255,255,255,0.05)"
      : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
    transition: "box-shadow 0.15s",
  };

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{ perspective: 1000, cursor: "pointer", animation: `cardIn 0.4s cubic-bezier(0.4,0,0.2,1) ${index * 35}ms both` }}
    >
      <div style={{
        position: "relative", width: "100%", paddingBottom: "130%",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Front */}
        <div style={{ ...faceBase, background: c.bg, border: `1px solid ${c.border}` }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(24px,5vw,36px)", color:c.accent, letterSpacing:"-0.02em", lineHeight:1 }}>
            {s.sound}
          </div>
          <div style={{ width:28, height:1, background:c.border, opacity:0.45 }} />
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#b8a99a", letterSpacing:"0.12em", textTransform:"uppercase" }}>
            {s.name}
          </div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:14, color:"#e8ddd0", fontStyle:"italic", marginTop:2 }}>
            {s.example}
          </div>
          <div style={{ fontSize:11, color:"#7a6a5e", fontFamily:"'DM Mono',monospace" }}>
            "{s.meaning}"
          </div>
          <SpeakerButton slug={s.file} accent={c.accent} play={play} activeSlug={activeSlug} playState={playState} />
        </div>

        {/* Back */}
        <div style={{ ...faceBase, transform:"rotateY(180deg)", background:`linear-gradient(140deg,${c.bg},rgba(20,12,6,0.9))`, border:`1px solid ${c.border}` }}>
          <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", letterSpacing:"0.15em", textTransform:"uppercase", color:c.accent, marginBottom:4 }}>
            pronunciation tip
          </div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:13, color:"#e8ddd0", textAlign:"center", lineHeight:1.65 }}>
            {s.tip}
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"rgba(255,255,255,0.3)", marginTop:4, fontStyle:"italic", letterSpacing:"0.04em" }}>
            {s.example} · "{s.meaning}"
          </div>
          <div style={{ marginTop:10, padding:"5px 14px", borderRadius:100, background:c.accent, color:"#1a0f08", fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17 }}>
            {s.sound}
          </div>
          <SpeakerButton slug={s.file} accent={c.accent} play={play} activeSlug={activeSlug} playState={playState} />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DarijaSoundChart() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const { play, activeSlug, playState } = useAudio();

  useEffect(() => { setMounted(true); }, []);

  const filtered = SOUNDS.filter(s => {
    const cm = activeCategory === "all" || s.category === activeCategory;
    const sm = !search || [s.sound, s.name, s.example, s.meaning].some(x => x.toLowerCase().includes(search.toLowerCase()));
    return cm && sm;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lora:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0e0804;min-height:100vh}
        .darija-root{
          min-height:100vh;
          background:radial-gradient(ellipse at 20% 0%,#2a1505 0%,#0e0804 60%),
                      radial-gradient(ellipse at 80% 100%,#12060e 0%,transparent 50%);
          position:relative;overflow-x:hidden;
        }
        .darija-root::before{
          content:'';position:fixed;inset:0;
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(200,169,110,0.025) 60px,rgba(200,169,110,0.025) 61px),
            repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(200,169,110,0.025) 60px,rgba(200,169,110,0.025) 61px);
          pointer-events:none;z-index:0;
        }
        @keyframes cardIn{from{opacity:0;transform:translateY(14px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes spkPop{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
        @keyframes spkSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .sound-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:16px}
        @media(max-width:600px){.sound-grid{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px}}
      `}</style>

      <div className="darija-root">
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"clamp(24px,5vw,60px) clamp(16px,4vw,40px)", position:"relative", zIndex:1 }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:10 }}>
              <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,#7a5e32)", maxWidth:60 }} />
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:"0.3em", color:"#8a6a4a", textTransform:"uppercase" }}>Moroccan Darija</span>
              <div style={{ flex:1, height:1, background:"linear-gradient(to left,transparent,#7a5e32)", maxWidth:60 }} />
            </div>

            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(36px,7vw,72px)", fontWeight:900, color:"#f0e6d0", lineHeight:1, letterSpacing:"-0.03em", marginBottom:8 }}>
              Sound Chart
            </h1>
            <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:"clamp(14px,2.5vw,18px)", color:"#8a7a6e", marginBottom:24 }}>
              Tap a card to see the tip · tap 🔊 to hear it
            </p>

            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:36 }}>
              <div style={{ height:1, width:60, background:"linear-gradient(to right,transparent,#c8a96e)" }} />
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#c8a96e" }} />
              <div style={{ height:1, width:60, background:"linear-gradient(to left,transparent,#c8a96e)" }} />
            </div>

            {/* Search */}
            <div style={{ display:"flex", justifyContent:"center", marginBottom:28 }}>
              <input
                type="text"
                placeholder="Search sounds, names, words…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background:"rgba(255,255,255,0.04)", border:"1px solid rgba(200,169,110,0.2)",
                  color:"#e8ddd0", fontFamily:"'DM Mono',monospace", fontSize:14,
                  padding:"12px 20px", borderRadius:100, outline:"none", width:"100%", maxWidth:360,
                  transition:"border-color 0.2s",
                }}
              />
            </div>

            {/* Category filters */}
            <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding:"8px 20px", borderRadius:100, cursor:"pointer",
                    fontFamily:"'DM Mono',monospace", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase",
                    transition:"all 0.2s",
                    ...(activeCategory === cat.id
                      ? { background:cat.color, border:`1px solid ${cat.color}`, color:"#1a0f08", fontWeight:600 }
                      : { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#8a7a6e" })
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, justifyContent:"center", margin:"0 0 32px", padding:"16px 24px", background:"rgba(255,255,255,0.02)", borderRadius:12, border:"1px solid rgba(255,255,255,0.05)" }}>
            {CATEGORIES.filter(c => c.id !== "all").map(cat => (
              <div key={cat.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:cat.color }} />
                <span style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"#6a5a50", letterSpacing:"0.05em" }}>{cat.label}</span>
              </div>
            ))}
          </div>

          {/* Count */}
          <div style={{ textAlign:"center", marginBottom:24, fontSize:12, fontFamily:"'DM Mono',monospace", color:"#5a4a3e", letterSpacing:"0.1em" }}>
            {filtered.length} sound{filtered.length !== 1 ? "s" : ""}
          </div>

          {/* Grid */}
          {mounted && (
            <div className="sound-grid">
              {filtered.map((s, i) => (
                <SoundCard
                  key={s.sound + s.category}
                  s={s} index={i}
                  play={play}
                  activeSlug={activeSlug}
                  playState={playState}
                />
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:60, color:"#5a4a3e", fontFamily:"'Lora',serif", fontStyle:"italic" }}>
                  No sounds match your search.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
