"use client";

import { useState } from "react";

const GOLD = "#c8a96e";
const BG = "#080604";

// ── Data ──────────────────────────────────────────────────────────────────────
interface Member {
  id: string;
  darija: string;
  english: string;
  side: "core" | "extended" | "inlaw" | "maternal" | "paternal";
  gen: number;
  gender: "f" | "m" | "n";
  tip: string;
  phrase: string;
  phraseEn: string;
}

const MEMBERS: Member[] = [
  // Grandparents
  { id:"jdda-m",    darija:"jdda",       english:"grandmother",  side:"maternal", gen:0, gender:"f", tip:"Jdda is incredibly warm — the heart of every Moroccan home", phrase:"jdda dyal-i", phraseEn:"my grandmother" },
  { id:"jdd-m",     darija:"jdd",        english:"grandfather",  side:"maternal", gen:0, gender:"m", tip:"Elders are deeply respected — always greet jdd first", phrase:"jdd dyal-i",  phraseEn:"my grandfather" },
  { id:"jdda-p",    darija:"jdda",       english:"grandmother",  side:"paternal", gen:0, gender:"f", tip:"Both grandmothers share the same word — context tells you which", phrase:"jdda l-kbira", phraseEn:"the elder grandmother" },
  { id:"jdd-p",     darija:"jdd",        english:"grandfather",  side:"paternal", gen:0, gender:"m", tip:"A man earns deep respect as jdd — 'si jdd' is a title of honor", phrase:"jdd s-sghir", phraseEn:"the younger grandfather" },

  // Parents
  { id:"mma",       darija:"mma",        english:"mother",       side:"core",     gen:1, gender:"f", tip:"Mma is intimate — more formal is umm. Mma = mama at heart", phrase:"mma ana kantbghik", phraseEn:"mom I love you" },
  { id:"bba",       darija:"bba",        english:"father",       side:"core",     gen:1, gender:"m", tip:"Bba or baba — the b doubles from the Arabic 'ab'. Warm and close", phrase:"bba wesh katbghi atay?", phraseEn:"dad do you want tea?" },

  // Siblings
  { id:"kht",       darija:"kht",        english:"sister",       side:"core",     gen:2, gender:"f", tip:"Kht is direct — 'khti' means my sister. Very commonly used", phrase:"khti zwina",  phraseEn:"my sister is pretty" },
  { id:"kho",       darija:"kho",        english:"brother",      side:"core",     gen:2, gender:"m", tip:"Kho can also mean close friend — like saying 'bro' in English!", phrase:"khoya 3la l-khedma", phraseEn:"my brother is at work" },

  // Self
  { id:"ana",       darija:"ana",        english:"me / I",       side:"core",     gen:2, gender:"n", tip:"Ana is 'I' and 'me' — you are the center of your family tree!", phrase:"ana men l-maghrib", phraseEn:"I am from Morocco" },

  // Spouse
  { id:"mr9",       darija:"mr9a / rajl",english:"wife / husband",side:"core",   gen:2, gender:"n", tip:"Mr9a = wife, rajl = husband. Both words carry deep respect", phrase:"rajl-i kayn daba", phraseEn:"my husband is home" },

  // Children
  { id:"bnt",       darija:"bnt",        english:"daughter",     side:"core",     gen:3, gender:"f", tip:"Bnt means girl too — 'bnt-i' is my daughter or my little girl", phrase:"bnt-i katqra mezyan", phraseEn:"my daughter studies well" },
  { id:"wld",       darija:"wld",        english:"son",          side:"core",     gen:3, gender:"m", tip:"Wld also means boy. 'Wlad' (plural) means children or boys", phrase:"wlad dyal-i telt", phraseEn:"I have three children" },

  // Aunts/Uncles
  { id:"3mma",      darija:"3mma",       english:"aunt (paternal)",side:"extended",gen:1, gender:"f", tip:"3mma = your father's sister. The 3 is the 'ain — throat sound", phrase:"3mmt-i fi ddar",  phraseEn:"my aunt is at home" },
  { id:"3mm",       darija:"3mm",        english:"uncle (paternal)",side:"extended",gen:1, gender:"m",tip:"3mm = your father's brother. Very important in Moroccan culture", phrase:"3mm-i jayy ghedd", phraseEn:"my uncle comes tomorrow" },
  { id:"khala",     darija:"khala",      english:"aunt (maternal)", side:"extended",gen:1, gender:"f", tip:"Khala = your mother's sister. Always treated like a second mother", phrase:"khalt-i 9alb d-dehb", phraseEn:"my aunt has a heart of gold" },
  { id:"khal",      darija:"khal",       english:"uncle (maternal)", side:"extended",gen:1, gender:"m",tip:"Khal = your mother's brother. Notice m/f pairs: khala/khal", phrase:"khal dyal-i sakn fi Rbat", phraseEn:"my uncle lives in Rabat" },

  // Cousins
  { id:"bnt-3mm",   darija:"bnt 3mm",    english:"cousin (f, pat.)",side:"extended",gen:2, gender:"f", tip:"Literally 'daughter of uncle' — Darija describes relationships, not just names", phrase:"bnt 3mm-i mzyana bzzaf", phraseEn:"my cousin is very nice" },
  { id:"wld-khal",  darija:"wld khal",   english:"cousin (m, mat.)",side:"extended",gen:2, gender:"m", tip:"Literally 'son of maternal uncle' — Moroccan kinship is beautifully specific", phrase:"wld khal-i kaytqra f Paris", phraseEn:"my cousin studies in Paris" },

  // In-laws
  { id:"hmah",      darija:"7mah",       english:"mother-in-law", side:"inlaw",   gen:1, gender:"f", tip:"7mah relationship is famously complex everywhere — same in Morocco!", phrase:"7maht-i zwina",  phraseEn:"my mother-in-law is kind" },
  { id:"7m",        darija:"7m",         english:"father-in-law", side:"inlaw",   gen:1, gender:"m", tip:"7m — the 7 is the forced 'h' from deep in the throat", phrase:"7m dyal-i 3jbni", phraseEn:"I like my father-in-law" },
];

const SIDES = [
  { id:"all",      label:"Everyone",   color: GOLD },
  { id:"core",     label:"Core",       color:"#7eb8a4" },
  { id:"extended", label:"Extended",   color:"#9b72b0" },
  { id:"inlaw",    label:"In-Laws",    color:"#d4845a" },
];

interface CatStyle {
  bg: string;
  border: string;
  accent: string;
}

const SIDE_COLORS: Record<string, CatStyle> = {
  core:     { bg:"rgba(126,184,164,0.1)",  border:"#7eb8a4", accent:"#7eb8a4" },
  extended: { bg:"rgba(155,114,176,0.1)",  border:"#9b72b0", accent:"#9b72b0" },
  inlaw:    { bg:"rgba(212,132,90,0.1)",   border:"#d4845a", accent:"#d4845a" },
  maternal: { bg:"rgba(107,155,210,0.08)", border:"#6b9bd2", accent:"#6b9bd2" },
  paternal: { bg:"rgba(200,169,110,0.08)", border:GOLD,       accent:GOLD       },
};

const GENDER_ICON: Record<string, string> = { m:"♂", f:"♀", n:"◎" };
const GEN_LABEL: Record<number, string>   = { 0:"grandparents", 1:"parents / aunts & uncles", 2:"your generation", 3:"children" };

// ── Tree View ─────────────────────────────────────────────────────────────────
function TreeNode({ m, onClick, selected }: {
  m: Member;
  onClick: (m: Member) => void;
  selected: Member | null;
}) {
  const c = SIDE_COLORS[m.side] || SIDE_COLORS.core;
  const isSel = selected?.id === m.id;

  return (
    <div onClick={() => onClick(m)} style={{
      cursor:"pointer", textAlign:"center", padding:"10px 6px",
      borderRadius:12, border:`1.5px solid ${isSel ? c.accent : "rgba(255,255,255,0.07)"}`,
      background: isSel ? c.bg : "rgba(255,255,255,0.02)",
      transition:"all 0.2s", minWidth:90,
      boxShadow: isSel ? `0 0 16px rgba(200,169,110,0.2)` : "none",
    }}>
      <div style={{ fontSize:18, marginBottom:3 }}>
        {m.gender === "f" ? "👩" : m.gender === "m" ? "👨" : "🧑"}
      </div>
      <div style={{ fontFamily:"Georgia,serif", fontSize:12, fontStyle:"italic", color: isSel ? c.accent : "#e8ddd0", lineHeight:1.2 }}>
        {m.darija}
      </div>
      <div style={{ fontFamily:"monospace", fontSize:9, color:"#5a4a3e", letterSpacing:"0.08em", marginTop:2, textTransform:"uppercase" }}>
        {m.english.split(" ")[0]}
      </div>
    </div>
  );
}

function DetailPanel({ m, onClose }: { m: Member | null; onClose: () => void }) {
  if (!m) return (
    <div style={{ textAlign:"center", padding:"40px 20px", color:"#4a3a2e", fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:14 }}>
      Tap any family member to explore
    </div>
  );

  const c = SIDE_COLORS[m.side] || SIDE_COLORS.core;

  return (
    <div style={{
      background:`linear-gradient(135deg,${c.bg},rgba(8,6,4,0.95))`,
      border:`1px solid ${c.border}`,
      borderRadius:18, padding:"24px 20px",
      animation:"fadeUp 0.3s ease",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:28, fontStyle:"italic", fontWeight:700, color:c.accent, lineHeight:1 }}>
            {m.darija}
          </div>
          <div style={{ fontFamily:"monospace", fontSize:11, color:"#6a5a4e", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:3 }}>
            {m.english}
          </div>
        </div>
        <div style={{ fontSize:36 }}>
          {m.gender === "f" ? "👩" : m.gender === "m" ? "👨" : "🧑"}
        </div>
      </div>

      <div style={{ width:"100%", height:1, background:`rgba(${c.accent === GOLD ? "200,169,110" : "255,255,255"},0.12)`, marginBottom:16 }} />

      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:9, fontFamily:"monospace", letterSpacing:"0.18em", color:c.accent, textTransform:"uppercase", marginBottom:6 }}>
          💬 example phrase
        </div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:15, fontStyle:"italic", color:"#e8ddd0", marginBottom:3 }}>
          "{m.phrase}"
        </div>
        <div style={{ fontFamily:"monospace", fontSize:11, color:"#5a4a3e" }}>
          {m.phraseEn}
        </div>
      </div>

      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:9, fontFamily:"monospace", letterSpacing:"0.18em", color:c.accent, textTransform:"uppercase", marginBottom:6 }}>
          🔍 cultural note
        </div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#c8b8a8", lineHeight:1.65 }}>
          {m.tip}
        </div>
      </div>

      <div style={{ display:"flex", gap:8 }}>
        <div style={{ padding:"4px 12px", borderRadius:100, background:`rgba(${c.accent === GOLD ? "200,169,110" : "255,255,255"},0.08)`, border:`1px solid ${c.border}`, fontFamily:"monospace", fontSize:10, color:c.accent }}>
          {GENDER_ICON[m.gender]} {m.gender === "f" ? "feminine" : m.gender === "m" ? "masculine" : "neutral"}
        </div>
        <div style={{ padding:"4px 12px", borderRadius:100, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", fontFamily:"monospace", fontSize:10, color:"#6a5a4e" }}>
          {GEN_LABEL[m.gen]}
        </div>
      </div>

      <button onClick={onClose} style={{ marginTop:16, width:"100%", padding:"8px", borderRadius:8, background:"transparent", border:"1px solid rgba(255,255,255,0.07)", color:"#4a3a2e", fontFamily:"monospace", fontSize:11, cursor:"pointer", letterSpacing:"0.08em" }}>
        ← back
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Family() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered = MEMBERS.filter(m => filter === "all" || m.side === filter);

  // Group by generation
  const byGen: Record<number, Member[]> = {};
  filtered.forEach(m => {
    if (!byGen[m.gen]) byGen[m.gen] = [];
    byGen[m.gen].push(m);
  });
  const gens = Object.keys(byGen).map(Number).sort((a,b) => a-b);

  return (
    <div style={{
      minHeight:"100vh", color:"#f0e6d0",
      background:BG,
      backgroundImage:`radial-gradient(ellipse at 30% 0%,#1a0a0e 0%,transparent 50%),radial-gradient(ellipse at 70% 100%,#0a1400 0%,transparent 50%),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(200,169,110,0.02) 60px,rgba(200,169,110,0.02) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(200,169,110,0.02) 60px,rgba(200,169,110,0.02) 61px)`,
    }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes heartbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
      `}</style>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"clamp(80px,10vw,120px) clamp(16px,4vw,36px) 56px" }}>

        {/* ── Header ── */}
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ fontSize:"clamp(48px,12vw,80px)", marginBottom:12, animation:"heartbeat 2.5s ease infinite" }}>👨‍👩‍👧</div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:8 }}>
            <div style={{ flex:1, maxWidth:60, height:1, background:"linear-gradient(to right,transparent,#7a5e32)" }} />
            <span style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.3em", color:"#8a6a4a", textTransform:"uppercase" }}>Moroccan Darija</span>
            <div style={{ flex:1, maxWidth:60, height:1, background:"linear-gradient(to left,transparent,#7a5e32)" }} />
          </div>

          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(30px,7vw,58px)", fontWeight:900, color:"#f0e6d0", letterSpacing:"-0.02em", marginBottom:6, lineHeight:1 }}>
            Family
          </h1>
          <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:15, color:"#8a7a6e", marginBottom:28 }}>
            Family is everything in Morocco · tap to explore each relationship
          </p>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:32 }}>
            <div style={{ height:1, width:56, background:"linear-gradient(to right,transparent,#c8a96e)" }} />
            <div style={{ width:6, height:6, borderRadius:"50%", background:GOLD }} />
            <div style={{ height:1, width:56, background:"linear-gradient(to left,transparent,#c8a96e)" }} />
          </div>

          {/* Filters */}
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8 }}>
            {SIDES.map(s => (
              <button key={s.id} onClick={() => { setFilter(s.id); setSelected(null); }} style={{
                padding:"7px 18px", borderRadius:100, cursor:"pointer",
                fontFamily:"monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase",
                border:"1px solid", transition:"all 0.2s",
                ...(filter === s.id
                  ? { background:s.color, borderColor:s.color, color:"#1a0f08", fontWeight:700 }
                  : { background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.08)", color:"#8a7a6e" })
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* ── Layout: tree left, detail right ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr min(320px,35%)", gap:24, alignItems:"start" }}>

          {/* Tree */}
          <div>
            {gens.map(gen => (
              <div key={gen} style={{ marginBottom:28 }}>
                {/* Gen label with connector line */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <div style={{ height:1, flex:1, background:"rgba(200,169,110,0.1)" }} />
                  <span style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.2em", color:"#5a4a3e", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                    {GEN_LABEL[gen]}
                  </span>
                  <div style={{ height:1, flex:1, background:"rgba(200,169,110,0.1)" }} />
                </div>

                {/* Nodes row */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:byGen[gen].length <= 3 ? "center" : "flex-start" }}>
                  {byGen[gen].map((m,i) => (
                    <div key={m.id} style={{ animation:`fadeUp 0.35s ease ${i*40}ms both`, flex:"0 0 auto" }}>
                      <TreeNode m={m} onClick={setSelected} selected={selected} />
                    </div>
                  ))}
                </div>

                {/* Connector line down (not for last gen) */}
                {gen < Math.max(...gens) && (
                  <div style={{ display:"flex", justifyContent:"center", marginTop:4 }}>
                    <div style={{ width:1, height:18, background:"rgba(200,169,110,0.15)" }} />
                  </div>
                )}
              </div>
            ))}

            {/* Legend */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:8, padding:"14px 16px", background:"rgba(255,255,255,0.02)", borderRadius:10, border:"1px solid rgba(255,255,255,0.04)" }}>
              {Object.entries(SIDE_COLORS).map(([k,v]) => (
                <div key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:v.accent }} />
                  <span style={{ fontFamily:"monospace", fontSize:9, color:"#5a4a3e", letterSpacing:"0.08em", textTransform:"uppercase" }}>{k}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div style={{ position:"sticky", top:24 }}>
            <DetailPanel m={selected} onClose={() => setSelected(null)} />
          </div>
        </div>

        {/* ── Bottom phrases section ── */}
        <div style={{ marginTop:52 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ height:1, flex:1, background:"rgba(200,169,110,0.1)" }} />
            <span style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.25em", color:"#6a5a4e", textTransform:"uppercase" }}>essential family phrases</span>
            <div style={{ height:1, flex:1, background:"rgba(200,169,110,0.1)" }} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
            {[
              { d:"3ndi kbira d-3a2ila",    e:"I have a big family" },
              { d:"weyn mma dyalk?",          e:"Where is your mother?" },
              { d:"wld-i 3ndo sba3 snin",     e:"My son is 7 years old" },
              { d:"khoya kaytkhdem f-Rabat",  e:"My brother works in Rabat" },
              { d:"jdda dyal-i 3ndha 80 3am", e:"My grandmother is 80 years old" },
              { d:"n-nas dyal-i mzyanin",     e:"My family are good people" },
              { d:"3a2ila kbira = sa3ada kbira", e:"A big family = great happiness" },
              { d:"bba ana kantbghik bzzaf",  e:"Dad, I love you very much" },
            ].map((p,i) => (
              <div key={i} style={{
                padding:"14px 16px", borderRadius:12,
                background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)",
                animation:`fadeUp 0.4s ease ${i*45}ms both`,
              }}>
                <div style={{ fontFamily:"Georgia,serif", fontSize:13, fontStyle:"italic", color:GOLD, marginBottom:5, lineHeight:1.4 }}>
                  {p.d}
                </div>
                <div style={{ fontFamily:"monospace", fontSize:10, color:"#5a4a3e", letterSpacing:"0.06em" }}>
                  {p.e}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
