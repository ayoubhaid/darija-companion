"use client";

import { useState, useEffect } from "react";

const GOLD = "#c8a96e";
const BG   = "#0e0804";

interface DayItem {
  darija: string;
  short: string;
  english: string;
  jsDay: number;
  tip: string;
}

interface TimeItem {
  darija: string;
  english: string;
  icon: string;
  tip: string;
}

const DAYS: DayItem[] = [
  { darija:"nhar l-had",   short:"l-had",   english:"Sunday",    jsDay:0, tip:"Had means 'one' — the first day of the Islamic week" },
  { darija:"nhar tnayn",   short:"tnayn",   english:"Monday",    jsDay:1, tip:"Tnayn means 'two' — days are just numbers in Darija!" },
  { darija:"nhar tlata",   short:"tlata",   english:"Tuesday",   jsDay:2, tip:"Tlata means 'three' — third day of the week" },
  { darija:"nhar arba3",   short:"arba3",   english:"Wednesday", jsDay:3, tip:"Arba3 means 'four' — the 3 is a deep throat sound" },
  { darija:"nhar l-khmis", short:"l-khmis", english:"Thursday",  jsDay:4, tip:"Khmis from khamsa (five) — market day historically" },
  { darija:"nhar jm3a",    short:"jm3a",    english:"Friday",    jsDay:5, tip:"Jm3a means 'gathering' — the holy day of prayer" },
  { darija:"nhar s-sbt",   short:"s-sbt",   english:"Saturday",  jsDay:6, tip:"Sbt from Sabbath — borrowed from Aramaic/Hebrew" },
];

const TIME_EXPRS: TimeItem[] = [
  { darija:"daba",         english:"now",              icon:"⚡", tip:"Most useful word — 'daba!' means 'right now!' or 'come on!'" },
  { darija:"lyoum",        english:"today",            icon:"📅", tip:"Li + youm — 'the day that is [here]'" },
  { darija:"ghedda",       english:"tomorrow",         icon:"🌅", tip:"Often used loosely — Moroccan time is flexible!" },
  { darija:"lbareh",       english:"yesterday",        icon:"🌙", tip:"Lbareh also implies 'the other day' informally" },
  { darija:"dghiya",       english:"in a moment",      icon:"⏳", tip:"Say this instead of daba when you need a little time" },
  { darija:"men b3d",      english:"later / after",    icon:"🕐", tip:"Literally 'from after' — very common in daily speech" },
  { darija:"bkri",         english:"early / long ago", icon:"🐓", tip:"'Bkri bkri' = very long ago or very early in the morning" },
  { darija:"3la l-7it",    english:"immediately",      icon:"🏃", tip:"Literally 'on the wall' — fast as sticking to a wall!" },
  { darija:"s-sbah",       english:"morning",          icon:"🌄", tip:"'Sbah l-khir' = Good morning — a lovely greeting" },
  { darija:"d-dhor",       english:"noon",             icon:"☀️",  tip:"Dhor prayer time — historically noon was defined by prayer" },
  { darija:"l-3shiya",     english:"afternoon",        icon:"🌇", tip:"Also used for 'evening' — flexible in Moroccan usage" },
  { darija:"l-lil",        english:"night",            icon:"🌃", tip:"'Lila sa3ida' = goodnight — a warm farewell" },
];

// Morocco is UTC+1 (no DST adjustment needed for display purposes)
function getMoroccoTime(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000); // UTC+1
}

function getGreeting(hour: number): { darija: string; english: string; icon: string } {
  if (hour >= 5  && hour < 12) return { darija:"Sbah l-khir!", english:"Good morning!", icon:"🌄" };
  if (hour >= 12 && hour < 17) return { darija:"Nhar sa3id!", english:"Good afternoon!", icon:"☀️" };
  if (hour >= 17 && hour < 21) return { darija:"3shiya mbarka!", english:"Good evening!", icon:"🌇" };
  return { darija:"Lila sa3ida!", english:"Good night!", icon:"🌙" };
}

function LiveClock() {
  const [time, setTime] = useState(getMoroccoTime());

  useEffect(() => {
    const id = setInterval(() => setTime(getMoroccoTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = time.getHours();
  const m = String(time.getMinutes()).padStart(2,"0");
  const s = String(time.getSeconds()).padStart(2,"0");
  const todayName = DAYS.find(d => d.jsDay === time.getDay());
  const greeting = getGreeting(h);
  const h12 = h % 12 || 12;
  const ampm = h >= 12 ? "pm" : "am";

  // Clock hand angles
  const secAngle  = time.getSeconds() * 6;
  const minAngle  = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hourAngle = (h % 12) * 30 + time.getMinutes() * 0.5;

  return (
    <div style={{ textAlign:"center", marginBottom:48 }}>
      {/* Greeting */}
      <div style={{ fontSize:13, fontFamily:"monospace", letterSpacing:"0.18em", color:"#6a5a4e", textTransform:"uppercase", marginBottom:16 }}>
        {greeting.icon} Morocco Time · UTC +1
      </div>

      {/* Analog + Digital side by side */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:32, flexWrap:"wrap" }}>
        {/* Analog clock */}
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="56" fill="rgba(200,169,110,0.04)" stroke="rgba(200,169,110,0.2)" strokeWidth="1.5"/>
          {/* Hour ticks */}
          {Array.from({length:12},(_,i) => {
            const a = (i * 30 - 90) * Math.PI/180;
            const r1=46, r2=52;
            return <line key={i} x1={60+r1*Math.cos(a)} y1={60+r1*Math.sin(a)} x2={60+r2*Math.cos(a)} y2={60+r2*Math.sin(a)} stroke="rgba(200,169,110,0.4)" strokeWidth="1.5"/>;
          })}
          {/* Hour hand */}
          <line x1="60" y1="60"
            x2={60+26*Math.cos((hourAngle-90)*Math.PI/180)}
            y2={60+26*Math.sin((hourAngle-90)*Math.PI/180)}
            stroke={GOLD} strokeWidth="3" strokeLinecap="round"/>
          {/* Minute hand */}
          <line x1="60" y1="60"
            x2={60+36*Math.cos((minAngle-90)*Math.PI/180)}
            y2={60+36*Math.sin((minAngle-90)*Math.PI/180)}
            stroke="#e8ddd0" strokeWidth="2" strokeLinecap="round"/>
          {/* Second hand */}
          <line x1="60" y1="60"
            x2={60+40*Math.cos((secAngle-90)*Math.PI/180)}
            y2={60+40*Math.sin((secAngle-90)*Math.PI/180)}
            stroke="#e05555" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="60" cy="60" r="3" fill={GOLD}/>
        </svg>

        {/* Digital */}
        <div>
          <div style={{ fontFamily:"monospace", fontSize:"clamp(42px,10vw,72px)", fontWeight:700, color:GOLD, letterSpacing:"-0.02em", lineHeight:1, textShadow:`0 0 40px rgba(200,169,110,0.35)` }}>
            {h12}:{m}<span style={{ fontSize:"50%", color:"rgba(200,169,110,0.5)" }}>{s}</span>
            <span style={{ fontSize:"30%", marginLeft:4, color:"rgba(200,169,110,0.5)", letterSpacing:"0.1em" }}>{ampm}</span>
          </div>
          {todayName && (
            <div style={{ marginTop:8 }}>
              <span style={{ fontFamily:"Georgia,serif", fontSize:18, fontStyle:"italic", color:"#e8ddd0" }}>{todayName.short}</span>
              <span style={{ fontFamily:"monospace", fontSize:11, color:"#5a4a3e", marginLeft:8 }}>· {todayName.english}</span>
            </div>
          )}
        </div>
      </div>

      {/* Greeting */}
      <div style={{ marginTop:20, display:"inline-flex", alignItems:"center", gap:10, padding:"10px 24px", borderRadius:100, background:"rgba(200,169,110,0.07)", border:"1px solid rgba(200,169,110,0.18)" }}>
        <span style={{ fontFamily:"Georgia,serif", fontSize:16, fontStyle:"italic", color:GOLD }}>{greeting.darija}</span>
        <span style={{ fontFamily:"monospace", fontSize:11, color:"#5a4a3e" }}>{greeting.english}</span>
      </div>
    </div>
  );
}

function FlipCard({ item, index, isToday }: {
  item: DayItem | TimeItem;
  index: number;
  isToday: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const accentColor = isToday ? "#e8c87a" : GOLD;

  const faceBase: React.CSSProperties = {
    position:"absolute", inset:0, backfaceVisibility:"hidden",
    WebkitBackfaceVisibility:"hidden" as React.CSSProperties["WebkitBackfaceVisibility"],
    borderRadius:14,
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    gap:7, padding:"14px 10px",
    boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
  };

  const displayText = "short" in item ? item.short : item.darija;

  return (
    <div onClick={() => setFlipped(f => !f)}
      style={{ perspective:1000, cursor:"pointer",
        animation:`fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) ${index*35}ms both` }}>
      <div style={{
        position:"relative", width:"100%", paddingBottom:"122%",
        transformStyle:"preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
        transition:"transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Front */}
        <div style={{
          ...faceBase,
          background: isToday ? "rgba(200,169,110,0.12)" : "rgba(255,255,255,0.03)",
          border: isToday ? `1px solid rgba(200,169,110,0.5)` : "1px solid rgba(255,255,255,0.07)",
        }}>
          {isToday && <div style={{ position:"absolute", top:8, left:0, right:0, textAlign:"center", fontSize:9, fontFamily:"monospace", letterSpacing:"0.2em", color:GOLD, textTransform:"uppercase" }}>today</div>}
          {"icon" in item && item.icon && <div style={{ fontSize:22 }}>{item.icon}</div>}
          <div style={{ fontFamily:"Georgia,serif", fontSize:15, color:accentColor, fontStyle:"italic", fontWeight:600, textAlign:"center" }}>{displayText}</div>
          <div style={{ width:22, height:1, background:`rgba(200,169,110,0.3)` }} />
          <div style={{ fontFamily:"monospace", fontSize:10, color:"#6a5a4e", letterSpacing:"0.1em", textTransform:"uppercase", textAlign:"center" }}>{item.english}</div>
        </div>
        {/* Back */}
        <div style={{
          ...faceBase,
          transform:"rotateY(180deg)",
          background:"linear-gradient(140deg,rgba(200,169,110,0.07),rgba(10,6,3,0.96))",
          border:"1px solid rgba(200,169,110,0.18)",
        }}>
          <div style={{ fontSize:9, fontFamily:"monospace", letterSpacing:"0.18em", color:GOLD, textTransform:"uppercase", marginBottom:4 }}>tip</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:11.5, color:"#e8ddd0", textAlign:"center", lineHeight:1.65 }}>{item.tip}</div>
          <div style={{ marginTop:8, padding:"4px 12px", borderRadius:100, background:GOLD, color:"#1a0f08", fontFamily:"Georgia,serif", fontWeight:700, fontSize:13 }}>{displayText}</div>
        </div>
      </div>
    </div>
  );
}

export default function DaysTime() {
  const [section, setSection] = useState("days");
  const [now] = useState(getMoroccoTime());
  const todayIndex = now.getDay();

  const SECTIONS = [
    { id:"days",  label:"📅 Days of the Week" },
    { id:"time",  label:"⏰ Time Expressions" },
  ];

  return (
    <div style={{
      minHeight:"100vh", color:"#f0e6d0",
      backgroundImage:`radial-gradient(ellipse at 50% 0%,#1a1000 0%,transparent 50%),radial-gradient(ellipse at 0% 100%,#0a0014 0%,transparent 50%),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(200,169,110,0.02) 60px,rgba(200,169,110,0.02) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(200,169,110,0.02) 60px,rgba(200,169,110,0.02) 61px)`,
      background:BG,
    }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"clamp(80px,10vw,120px) clamp(16px,4vw,36px) 56px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:8 }}>
            <div style={{ flex:1, maxWidth:60, height:1, background:"linear-gradient(to right,transparent,#7a5e32)" }} />
            <span style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.3em", color:"#8a6a4a", textTransform:"uppercase" }}>Moroccan Darija</span>
            <div style={{ flex:1, maxWidth:60, height:1, background:"linear-gradient(to left,transparent,#7a5e32)" }} />
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(28px,6vw,54px)", fontWeight:900, color:"#f0e6d0", letterSpacing:"-0.02em", marginBottom:6, lineHeight:1 }}>
            Days & Time
          </h1>
          <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:15, color:"#8a7a6e", marginBottom:32 }}>
            Live Morocco time · tap cards to learn more
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:36 }}>
            <div style={{ height:1, width:56, background:"linear-gradient(to right,transparent,#c8a96e)" }} />
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#c8a96e" }} />
            <div style={{ height:1, width:56, background:"linear-gradient(to left,transparent,#c8a96e)" }} />
          </div>
        </div>

        {/* Live clock */}
        <LiveClock />

        {/* Section tabs */}
        <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:32 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              padding:"10px 24px", borderRadius:100, cursor:"pointer",
              fontFamily:"monospace", fontSize:12, letterSpacing:"0.08em",
              border:"1px solid", transition:"all 0.2s",
              ...(section === s.id
                ? { background:GOLD, borderColor:GOLD, color:"#1a0f08", fontWeight:700 }
                : { background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.08)", color:"#8a7a6e" })
            }}>{s.label}</button>
          ))}
        </div>

        {section === "days" ? (
          <>
            <div style={{ textAlign:"center", marginBottom:20, fontSize:11, fontFamily:"monospace", color:"#4a3a2e", letterSpacing:"0.1em" }}>
              In Darija, most days are just numbers — Monday = two, Tuesday = three…
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:14 }}>
              {DAYS.map((d,i) => (
                <FlipCard key={d.jsDay} item={d} index={i} isToday={d.jsDay === todayIndex} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign:"center", marginBottom:20, fontSize:11, fontFamily:"monospace", color:"#4a3a2e", letterSpacing:"0.1em" }}>
              Time flows differently in Morocco — learn to express it like a local
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:14 }}>
              {TIME_EXPRS.map((t,i) => (
                <FlipCard key={t.darija} item={t} index={i} isToday={false} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
