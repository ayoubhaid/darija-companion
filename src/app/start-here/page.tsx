"use client";

import Link from "next/link";

interface StarterLesson {
  title: string;
  description: string;
  href: string;
  emoji: string;
  available: boolean;
  color: string;
  accentColor: string;
}

const STARTER_LESSONS: StarterLesson[] = [
  {
    title: "Sound Chart",
    description: "Master every Darija sound with flip cards, pronunciation tips, and audio examples.",
    href: "/start-here/sound-chart",
    emoji: "🔊",
    available: true,
    color: "rgba(200,169,110,0.10)",
    accentColor: "#c8a96e",
  },
  {
    title: "Greetings",
    description: "Learn how to say hello, goodbye, and common polite phrases used every day.",
    href: "/start-here/greetings",
    emoji: "👋",
    available: false,
    color: "rgba(126,184,164,0.10)",
    accentColor: "#7eb8a4",
  },
  {
    title: "Numbers",
    description: "Count from 1 to 100, learn ordinals, and use numbers in real sentences.",
    href: "/start-here/numbers",
    emoji: "🔢",
    available: true,
    color: "rgba(107,155,210,0.10)",
    accentColor: "#6b9bd2",
  },
  {
    title: "Colors",
    description: "Discover all the colors in Darija with vivid examples and memory tricks.",
    href: "/start-here/colors",
    emoji: "🎨",
    available: true,
    color: "rgba(212,132,90,0.10)",
    accentColor: "#d4845a",
  },
  {
    title: "Days & Time",
    description: "Tell the time, name the days of the week, and talk about your schedule.",
    href: "/start-here/days-time",
    emoji: "📅",
    available: true,
    color: "rgba(155,114,176,0.10)",
    accentColor: "#9b72b0",
  },
  {
    title: "Family",
    description: "Talk about your family members and relationships in Moroccan Darija.",
    href: "/start-here/family",
    emoji: "👨‍👩‍👧",
    available: true,
    color: "rgba(200,169,110,0.10)",
    accentColor: "#c8a96e",
  },
];

export default function StartHerePage() {
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
        .sh-card{
          display:block;
          border-radius:18px;
          padding:28px 24px;
          text-decoration:none;
          transition:transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s;
          animation:fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
          position:relative;
          overflow:hidden;
        }
        .sh-card.available:hover{
          transform:translateY(-4px) scale(1.015);
          box-shadow:0 12px 40px rgba(0,0,0,0.45);
        }
        .sh-card.locked{
          cursor:default;
          opacity:0.55;
        }
        .sh-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
          gap:20px;
        }
        @media(max-width:600px){
          .sh-grid{grid-template-columns:1fr;}
        }
      `}</style>

      <div className="sh-root">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(80px,10vw,120px) clamp(16px,4vw,40px) 60px", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,#7a5e32)", maxWidth: 60 }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: "0.3em", color: "#8a6a4a", textTransform: "uppercase" }}>
                Moroccan Darija
              </span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to left,transparent,#7a5e32)", maxWidth: 60 }} />
            </div>

            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,7vw,68px)", fontWeight: 900, color: "#f0e6d0", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 14 }}>
              Start Here
            </h1>
            <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: "clamp(15px,2.5vw,19px)", color: "#8a7a6e", maxWidth: 520, margin: "0 auto 28px" }}>
              Your first steps into Moroccan Darija — pick a topic and begin learning today.
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ height: 1, width: 60, background: "linear-gradient(to right,transparent,#c8a96e)" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e" }} />
              <div style={{ height: 1, width: 60, background: "linear-gradient(to left,transparent,#c8a96e)" }} />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="sh-grid">
            {STARTER_LESSONS.map((lesson, i) => {
              const cardContent = (
                <>
                  {/* Glow blob */}
                  <div style={{
                    position: "absolute", top: -30, right: -30,
                    width: 120, height: 120, borderRadius: "50%",
                    background: lesson.accentColor,
                    opacity: 0.06, filter: "blur(30px)",
                    pointerEvents: "none",
                  }} />

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
                    {/* Emoji badge */}
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: `${lesson.accentColor}22`,
                      border: `1px solid ${lesson.accentColor}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26,
                    }}>
                      {lesson.emoji}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: "#f0e6d0", margin: 0 }}>
                          {lesson.title}
                        </h2>
                        {lesson.available ? (
                          <span style={{
                            fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.12em",
                            textTransform: "uppercase", padding: "3px 8px", borderRadius: 100,
                            background: `${lesson.accentColor}33`, color: lesson.accentColor,
                            border: `1px solid ${lesson.accentColor}55`,
                          }}>
                            Available
                          </span>
                        ) : (
                          <span style={{
                            fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.12em",
                            textTransform: "uppercase", padding: "3px 8px", borderRadius: 100,
                            background: "rgba(255,255,255,0.04)", color: "#5a4a3e",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}>
                            Coming soon
                          </span>
                        )}
                      </div>
                      <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: "#8a7a6e", lineHeight: 1.6, margin: 0 }}>
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow for available */}
                  {lesson.available && (
                    <div style={{
                      position: "absolute", bottom: 20, right: 22,
                      fontFamily: "'DM Mono',monospace", fontSize: 18,
                      color: lesson.accentColor, opacity: 0.7,
                    }}>
                      →
                    </div>
                  )}
                </>
              );

              return lesson.available ? (
                <Link
                  key={lesson.href}
                  href={lesson.href}
                  className="sh-card available"
                  style={{
                    background: lesson.color,
                    border: `1px solid ${lesson.accentColor}33`,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={lesson.href}
                  className="sh-card locked"
                  style={{
                    background: lesson.color,
                    border: `1px solid rgba(255,255,255,0.06)`,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div style={{ textAlign: "center", marginTop: 52 }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#4a3a30", letterSpacing: "0.08em" }}>
              More lessons are on the way — check back soon.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
