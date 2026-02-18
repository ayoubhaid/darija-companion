"use client";

import { useState } from "react";

const BG = "#080604";

const COLORS = [
  { darija:"l-7mer",      english:"red",      hex:"#c0392b", dark:"#3d0a08", example:"tuffah l-7mer",    exEnglish:"red apple",         tip:"Also used in idioms — 'wesekh 7mer' means deep red" },
  { darija:"l-khdhar",    english:"green",    hex:"#27ae60", dark:"#062e14", example:"atay b-l-n3na3",   exEnglish:"mint green tea",    tip:"l-khdhar also implies freshness and nature" },
  { darija:"z-zraq",      english:"blue",     hex:"#2980b9", dark:"#071d30", example:"s-sma z-zraq",     exEnglish:"blue sky",          tip:"z-zraq can describe both blue and green in some dialects" },
  { darija:"l-asfar",     english:"yellow",   hex:"#d4a017", dark:"#2e1f00", example:"l-limon l-asfar",  exEnglish:"yellow lemon",      tip:"Saffron — z-za3fran — is Morocco's most prized yellow" },
  { darija:"l-byed",      english:"white",    hex:"#e8e0d0", dark:"#1e1a14", example:"s-sukkar l-byed",  exEnglish:"white sugar",       tip:"Byed also means blank or empty in Darija" },
  { darija:"l-khal",      english:"black",    hex:"#2a2240", dark:"#0a0814", example:"l-qahwa l-khla",   exEnglish:"black coffee",      tip:"Khal comes from kohl — the ancient eye liner!" },
  { darija:"l-borto9ali", english:"orange",   hex:"#d4570c", dark:"#2e1000", example:"3sir l-borto9al",  exEnglish:"orange juice",      tip:"The fruit name and the color are literally the same word" },
  { darija:"l-bnafsaji",  english:"purple",   hex:"#7b2d8b", dark:"#1a0720", example:"l-ward l-bnafsaji",exEnglish:"purple flower",     tip:"From banafsaj — the Persian violet flower" },
  { darija:"l-wrdi",      english:"pink",     hex:"#d63384", dark:"#300818", example:"l-fustan l-wrdi",  exEnglish:"pink dress",        tip:"From ward — the word for rose" },
  { darija:"l-kahwi",     english:"brown",    hex:"#7b4a2d", dark:"#1e0e06", example:"l-khbz l-kahwi",   exEnglish:"brown bread",       tip:"Shares its root with kahwa — coffee!" },
  { darija:"l-rmadi",     english:"grey",     hex:"#607d8b", dark:"#101820", example:"s-sma l-rmadi",    exEnglish:"grey sky",          tip:"From rmad — ash. Grey like ash." },
  { darija:"l-dhebi",     english:"golden",   hex:"#c8a96e", dark:"#1e1400", example:"tserwal l-dhebi",  exEnglish:"golden trousers",   tip:"dheb means gold — the metal and the color" },
];

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

interface ColorItem {
  darija: string;
  english: string;
  hex: string;
  dark: string;
  example: string;
  exEnglish: string;
  tip: string;
}

function ColorCard({ c, index, onHover, onLeave }: {
  c: ColorItem;
  index: number;
  onHover: (hex: string) => void;
  onLeave: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  const faceBase: React.CSSProperties = {
    position:"absolute", inset:0, backfaceVisibility:"hidden",
    WebkitBackfaceVisibility:"hidden" as React.CSSProperties["WebkitBackfaceVisibility"],
    borderRadius:16,
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    gap:8, padding:"14px 10px",
    boxShadow:`0 4px 28px rgba(0,0,0,0.4), 0 0 0 1px rgba(${hexToRgb(c.hex)},0.25), inset 0 1px 0 rgba(255,255,255,0.05)`,
  };

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      onMouseEnter={() => onHover(c.hex)}
      onMouseLeave={onLeave}
      style={{ perspective:1000, cursor:"pointer",
        animation:`fadeUp 0.45s cubic-bezier(0.4,0,0.2,1) ${index*40}ms both` }}
    >
      <div style={{
        position:"relative", width:"100%", paddingBottom:"138%",
        transformStyle:"preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
        transition:"transform 0.55s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Front */}
        <div style={{
          ...faceBase,
          background:`linear-gradient(160deg, ${c.dark} 0%, rgba(8,6,4,0.95) 100%)`,
          border:`1px solid rgba(${hexToRgb(c.hex)},0.3)`,
        }}>
          {/* Color swatch */}
          <div style={{
            width:54, height:54, borderRadius:12,
            background: c.hex,
            boxShadow:`0 0 24px rgba(${hexToRgb(c.hex)},0.5), 0 0 48px rgba(${hexToRgb(c.hex)},0.2)`,
            border:`2px solid rgba(${hexToRgb(c.hex)},0.4)`,
            flexShrink:0,
          }} />
          <div style={{ width:28, height:1, background:`rgba(${hexToRgb(c.hex)},0.35)` }} />
          <div style={{ fontFamily:"Georgia,serif", fontSize:14, color:`rgba(${hexToRgb(c.hex)},1)`, fontStyle:"italic", fontWeight:600, textAlign:"center", letterSpacing:"0.02em" }}>
            {c.darija}
          </div>
          <div style={{ fontFamily:"monospace", fontSize:10, color:"#6a5a4e", letterSpacing:"0.12em", textTransform:"uppercase" }}>
            {c.english}
          </div>
          <div style={{ position:"absolute", bottom:7, right:10, fontSize:9, color:`rgba(${hexToRgb(c.hex)},0.35)`, fontFamily:"monospace" }}>tap ›</div>
        </div>

        {/* Back */}
        <div style={{
          ...faceBase,
          transform:"rotateY(180deg)",
          background:`linear-gradient(140deg, ${c.dark}, rgba(6,4,2,0.97))`,
          border:`1px solid rgba(${hexToRgb(c.hex)},0.25)`,
        }}>
          <div style={{ fontSize:9, fontFamily:"monospace", letterSpacing:"0.18em", color:`rgba(${hexToRgb(c.hex)},0.8)`, textTransform:"uppercase", marginBottom:2 }}>example</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#e8ddd0", fontStyle:"italic", textAlign:"center" }}>
            {c.example}
          </div>
          <div style={{ fontSize:10, color:"#5a4a3e", fontFamily:"monospace" }}>"{c.exEnglish}"</div>
          <div style={{ width:24, height:1, background:`rgba(${hexToRgb(c.hex)},0.25)`, margin:"4px 0" }} />
          <div style={{ fontSize:10, fontFamily:"monospace", letterSpacing:"0.12em", color:`rgba(${hexToRgb(c.hex)},0.6)`, textTransform:"uppercase", marginBottom:2 }}>fun fact</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:11, color:"#c8b8a8", textAlign:"center", lineHeight:1.6 }}>
            {c.tip}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Colors() {
  const [glowColor, setGlowColor] = useState<string | null>(null);

  const bgStyle: React.CSSProperties = {
    minHeight:"100vh", color:"#f0e6d0",
    position:"relative", overflow:"hidden",
    transition:"background 0.6s ease",
    background: glowColor
      ? `radial-gradient(ellipse at 50% 30%, rgba(${hexToRgb(glowColor)},0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(${hexToRgb(glowColor)},0.06) 0%, transparent 50%), ${BG}`
      : `radial-gradient(ellipse at 20% 0%,#1e0e00 0%,transparent 55%), ${BG}`,
    backgroundImage: glowColor
      ? `radial-gradient(ellipse at 50% 30%,rgba(${hexToRgb(glowColor)},0.12),transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(${hexToRgb(glowColor)},0.06),transparent 50%),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(200,169,110,0.02) 60px,rgba(200,169,110,0.02) 61px)`
      : `radial-gradient(ellipse at 20% 0%,#1e0e00,transparent 55%),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(200,169,110,0.02) 60px,rgba(200,169,110,0.02) 61px)`,
  };

  return (
    <div style={bgStyle}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes shimmer { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"clamp(80px,10vw,120px) clamp(16px,4vw,36px) 56px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          {/* Palette row */}
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20, flexWrap:"wrap" }}>
            {COLORS.map(c => (
              <div key={c.hex} style={{
                width:18, height:18, borderRadius:"50%",
                background:c.hex,
                boxShadow:`0 0 8px rgba(${hexToRgb(c.hex)},0.5)`,
              }}/>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:8 }}>
            <div style={{ flex:1, maxWidth:60, height:1, background:"linear-gradient(to right,transparent,#7a5e32)" }} />
            <span style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.3em", color:"#8a6a4a", textTransform:"uppercase" }}>Moroccan Darija</span>
            <div style={{ flex:1, maxWidth:60, height:1, background:"linear-gradient(to left,transparent,#7a5e32)" }} />
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(32px,7vw,60px)", fontWeight:900, color:"#f0e6d0", letterSpacing:"-0.02em", marginBottom:6, lineHeight:1 }}>
            Colors
          </h1>
          <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:15, color:"#8a7a6e", marginBottom:0 }}>
            Hover to feel the color · tap to flip for examples
          </p>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, margin:"24px 0 0" }}>
            <div style={{ height:1, width:56, background:"linear-gradient(to right,transparent,#c8a96e)" }} />
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#c8a96e" }} />
            <div style={{ height:1, width:56, background:"linear-gradient(to left,transparent,#c8a96e)" }} />
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(152px,1fr))", gap:16 }}>
          {COLORS.map((c,i) => (
            <ColorCard
              key={c.darija} c={c} index={i}
              onHover={setGlowColor}
              onLeave={() => setGlowColor(null)}
            />
          ))}
        </div>

        {/* Color strip at bottom */}
        <div style={{ marginTop:52, height:3, borderRadius:100, overflow:"hidden", display:"flex" }}>
          {COLORS.map(c => (
            <div key={c.hex} style={{ flex:1, background:c.hex, opacity:0.6 }}/>
          ))}
        </div>
      </div>
    </div>
  );
}
