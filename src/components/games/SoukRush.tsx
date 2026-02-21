'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { VocabularyItem } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// ─── Canvas & game constants ──────────────────────────────────────────────────
const W = 460, H = 700;
const PW = 126, PH = 22, PLAYER_Y = H - 74;
const LW = 112, LH = 46;
const GRAVITY = 0.112;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Five palette variants for lanterns (no correlation to correct/wrong — fair game)
const PAL = [
  { border: "#c8a96e", glow: "200,169,110", text: "#f5ead8" },
  { border: "#7eb8a4", glow: "126,184,164", text: "#d8f2ec" },
  { border: "#9b72b0", glow: "155,114,176", text: "#ead8f4" },
  { border: "#6b9bd2", glow: "107,155,210", text: "#d8ecf8" },
  { border: "#d4845a", glow: "212,132,90", text: "#f5e2d5" },
];

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Lantern {
  id: number;
  pal: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotV: number;
  darija: string;
  english: string;
  isCorrect: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  r: number;
  hue: number;
  sat: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  spd: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  len: number;
}

interface GameState {
  player: { x: number };
  lanterns: Lantern[];
  particles: Particle[];
  stars: Star[];
  shootingStars: ShootingStar[];
  vocab: VocabularyItem[];
  vocabIdx: number;
  target: { d: string; e: string };
  score: number;
  lives: number;
  level: number;
  combo: number;
  frame: number;
  shakeX: number;
  shakeY: number;
  flashFrames: number;
  flashColor: string;
  flashAlpha: number;
}

// ─── Game object factories ───────────────────────────────────────────────────
function mkLantern(darija: string, english: string, isCorrect: boolean, level: number): Lantern {
  return {
    id: Math.random(),
    pal: Math.floor(Math.random() * 5),
    x: rnd(LW / 2 + 18, W - LW / 2 - 18),
    y: -LH - rnd(0, 220),
    vx: rnd(-0.55, 0.55) * (1 + level * 0.07),
    vy: rnd(0.72, 1.52) * (1 + level * 0.065),
    rot: rnd(-0.045, 0.045),
    rotV: rnd(-0.0055, 0.0055),
    darija,
    english,
    isCorrect,
  };
}

function mkParticle(x: number, y: number): Particle {
  const angle = rnd(0, Math.PI * 2), speed = rnd(2.8, 8.2);
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 3,
    life: 1,
    decay: rnd(0.017, 0.04),
    r: rnd(2.2, 5.8),
    hue: rnd(30, 55),
    sat: rnd(55, 78),
  };
}

function mkStars(): Star[] {
  return Array.from({ length: 90 }, () => ({
    x: rnd(0, W), y: rnd(0, H * 0.58),
    r: rnd(0.35, 1.9),
    phase: rnd(0, Math.PI * 2),
    spd: rnd(0.009, 0.038),
  }));
}

function mkShootingStar(): ShootingStar {
  return {
    x: rnd(60, W - 60), y: rnd(20, H * 0.3),
    vx: rnd(3, 8) * (Math.random() > .5 ? 1 : -1),
    vy: rnd(1.5, 4),
    life: 1, len: rnd(30, 80),
  };
}

function buildRound(vocab: VocabularyItem[], idx: number, level: number): { target: { d: string; e: string }; lanterns: Lantern[] } {
  const target = vocab[idx % vocab.length];
  const wrongCount = clamp(2 + Math.floor(level / 2), 2, 5);
  const wrongs = vocab
    .filter((_, i) => i !== idx % vocab.length)
    .sort(() => Math.random() - 0.5)
    .slice(0, wrongCount);
  return {
    target: { d: target.word, e: target.translation },
    lanterns: [
      mkLantern(target.word, target.translation, true, level),
      ...wrongs.map(w => mkLantern(w.word, w.translation, false, level)),
    ],
  };
}

// ─── Canvas draw functions ───────────────────────────────────────────────────
function drawBackground(ctx: CanvasRenderingContext2D, stars: Star[], shootingStars: ShootingStar[], frame: number) {
  // Deep space base
  ctx.fillStyle = "#05040e";
  ctx.fillRect(0, 0, W, H);

  // Purple atmospheric glow top-center
  const ag = ctx.createRadialGradient(W / 2, 80, 0, W / 2, 140, W * 0.95);
  ag.addColorStop(0, "rgba(42, 10, 78, 0.6)");
  ag.addColorStop(1, "rgba(5, 4, 14, 0)");
  ctx.fillStyle = ag; ctx.fillRect(0, 0, W, H);

  // Warm golden glow bottom (player area)
  const bg = ctx.createLinearGradient(0, H - 150, 0, H);
  bg.addColorStop(0, "rgba(200,169,110,0)");
  bg.addColorStop(1, "rgba(200,169,110,0.055)");
  ctx.fillStyle = bg; ctx.fillRect(0, H - 150, W, 150);

  // Subtle horizon line
  ctx.strokeStyle = "rgba(200,169,110,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(22, PLAYER_Y + 30); ctx.lineTo(W - 22, PLAYER_Y + 30);
  ctx.stroke();

  // Stars
  stars.forEach(s => {
    s.phase += s.spd;
    const a = 0.28 + 0.72 * Math.abs(Math.sin(s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,252,240,${a.toFixed(2)})`;
    ctx.fill();
  });

  // Shooting stars (rare, magical)
  shootingStars.forEach((ss) => {
    ctx.save();
    ctx.globalAlpha = ss.life * 0.85;
    const grad = ctx.createLinearGradient(
      ss.x, ss.y,
      ss.x - ss.vx * (ss.len / 8), ss.y - ss.vy * (ss.len / 8)
    );
    grad.addColorStop(0, "rgba(255,252,240,0.9)");
    grad.addColorStop(1, "rgba(255,252,240,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(ss.x - ss.vx * (ss.len / 8), ss.y - ss.vy * (ss.len / 8));
    ctx.stroke();
    ctx.restore();
  });
}

function drawFrame(ctx: CanvasRenderingContext2D, frame: number) {
  // Main border
  ctx.strokeStyle = "rgba(200,169,110,0.14)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(11, 11, W - 22, H - 22);

  // Diamond motifs on left and right edges
  for (let yy = 38; yy < H - 18; yy += 28) {
    const a = 0.065 + 0.045 * Math.sin(frame * 0.023 + yy * 0.088);
    ctx.strokeStyle = `rgba(200,169,110,${a.toFixed(3)})`;
    ctx.lineWidth = 0.85;
    [11, W - 11].forEach(cx => {
      ctx.beginPath();
      ctx.moveTo(cx, yy - 6); ctx.lineTo(cx + 4.5, yy);
      ctx.lineTo(cx, yy + 6); ctx.lineTo(cx - 4.5, yy);
      ctx.closePath(); ctx.stroke();
    });
  }

  // Top center ornament
  const ox = W / 2;
  ctx.strokeStyle = "rgba(200,169,110,0.2)";
  ctx.lineWidth = 1;
  [[ox - 42, ox - 13], [ox + 13, ox + 42]].forEach(([x1, x2]) => {
    ctx.beginPath(); ctx.moveTo(x1, 11); ctx.lineTo(x2, 11); ctx.stroke();
  });
  ctx.beginPath(); ctx.arc(ox, 11, 5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(200,169,110,0.24)"; ctx.fill();

  // Bottom corners
  const bx = 22, by = H - 22, cs = 14;
  [[-1, 1], [1, 1]].forEach(([sx, sy]) => {
    const bpx = sx < 0 ? bx : W - bx;
    ctx.beginPath();
    ctx.moveTo(bpx - sx * cs, by); ctx.lineTo(bpx, by);
    ctx.lineTo(bpx, by - sy * cs);
    ctx.strokeStyle = "rgba(200,169,110,0.15)";
    ctx.lineWidth = 1; ctx.stroke();
  });
}

function drawHUD(ctx: CanvasRenderingContext2D, score: number, lives: number, level: number, combo: number, frame: number) {
  const y = 38;
  // Score
  ctx.textAlign = "left";
  const sa = 0.55 + 0.22 * Math.sin(frame * 0.038);
  ctx.fillStyle = `rgba(200,169,110,${sa.toFixed(2)})`;
  ctx.font = "bold 21px Georgia";
  ctx.fillText(String(score).padStart(5, "0"), 28, y);
  ctx.fillStyle = "rgba(200,169,110,0.3)";
  ctx.font = "8px monospace";
  ctx.fillText("S C O R E", 28, y + 13);

  // Level
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(200,169,110,0.55)";
  ctx.font = "bold 21px Georgia";
  ctx.fillText(String(level), W - 28, y);
  ctx.fillStyle = "rgba(200,169,110,0.3)";
  ctx.font = "8px monospace";
  ctx.fillText("L E V E L", W - 28, y + 13);

  // Hearts (3 max)
  ctx.textAlign = "center";
  for (let i = 0; i < 3; i++) {
    ctx.font = "15px Arial";
    ctx.globalAlpha = i < lives ? 1 : 0.15;
    ctx.fillStyle = i < lives ? "#e04060" : "#4a2030";
    ctx.fillText("♥", W / 2 - 17 + i * 17, y + 4);
  }
  ctx.globalAlpha = 1;

  // Combo burst
  if (combo >= 2) {
    const cp = 0.75 + 0.25 * Math.sin(frame * 0.2);
    const comboSize = Math.min(10 + combo, 18);
    ctx.fillStyle = `rgba(255,148,40,${cp.toFixed(2)})`;
    ctx.font = `bold ${comboSize}px Georgia`;
    ctx.textAlign = "center";
    ctx.fillText(`🔥 ${combo}×`, W / 2, y + 22);
  }

  // Thin divider
  ctx.strokeStyle = "rgba(200,169,110,0.07)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(22, y + 20); ctx.lineTo(W - 22, y + 20); ctx.stroke();
}

function drawArch(ctx: CanvasRenderingContext2D, englishWord: string, frame: number) {
  const cx = W / 2, ty = 124, aw = 106, ah = 64;
  const pulse = 0.2 + 0.1 * Math.sin(frame * 0.042);

  // Glow behind arch
  ctx.shadowColor = "rgba(200,169,110,0.18)"; ctx.shadowBlur = 28;

  // Horseshoe arch silhouette
  ctx.beginPath();
  ctx.moveTo(cx - aw, ty + 24);
  ctx.lineTo(cx - aw, ty - 8);
  ctx.bezierCurveTo(cx - aw, ty - 38, cx - 52, ty - ah, cx, ty - ah);
  ctx.bezierCurveTo(cx + 52, ty - ah, cx + aw, ty - 38, cx + aw, ty - 8);
  ctx.lineTo(cx + aw, ty + 24);
  ctx.closePath();

  ctx.fillStyle = "rgba(12, 7, 26, 0.78)";
  ctx.fill();
  ctx.strokeStyle = `rgba(200,169,110,${(pulse + 0.15).toFixed(2)})`;
  ctx.lineWidth = 1.6; ctx.stroke();
  ctx.shadowBlur = 0;

  // Decorative dots along arch curve
  for (let i = 0; i < 7; i++) {
    const t = (i / 6) * Math.PI;
    const dx = Math.cos(Math.PI - t) * aw * 0.76;
    const dy = -ah + 15 + Math.sin(t) * ah * 0.44;
    const da = 0.24 + 0.2 * Math.sin(frame * 0.046 + i * 0.72);
    ctx.beginPath(); ctx.arc(cx + dx, ty + dy, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,169,110,${da.toFixed(2)})`; ctx.fill();
  }

  // Arch side pillars (subtle)
  ctx.strokeStyle = "rgba(200,169,110,0.08)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - aw, ty + 24); ctx.lineTo(cx - aw, ty - 6);
  ctx.moveTo(cx + aw, ty + 24); ctx.lineTo(cx + aw, ty - 6);
  ctx.stroke();

  // "CATCH THIS" eyebrow
  ctx.fillStyle = "rgba(200,169,110,0.4)";
  ctx.font = "700 8.5px monospace";
  ctx.textAlign = "center";
  ctx.fillText("C A T C H   T H I S", cx, ty - 38);

  // Small diamonds flanking label
  [-70, 70].forEach(dx => {
    ctx.beginPath();
    ctx.moveTo(cx + dx, ty - 42); ctx.lineTo(cx + dx + 4, ty - 38);
    ctx.lineTo(cx + dx, ty - 34); ctx.lineTo(cx + dx - 4, ty - 38);
    ctx.closePath();
    ctx.fillStyle = "rgba(200,169,110,0.22)"; ctx.fill();
  });

  // English word — main target
  const fs = englishWord.length > 8 ? 18 : englishWord.length > 6 ? 21 : 25;
  ctx.fillStyle = "#f8eedc";
  ctx.font = `bold italic ${fs}px Georgia`;
  ctx.shadowColor = "rgba(200,169,110,0.5)"; ctx.shadowBlur = 14;
  ctx.fillText(englishWord.toUpperCase(), cx, ty + 12);
  ctx.shadowBlur = 0;

  // Flanking accent lines
  const tw = ctx.measureText(englishWord.toUpperCase()).width / 2 + 10;
  ctx.strokeStyle = "rgba(200,169,110,0.18)"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - tw - 10, ty + 2); ctx.lineTo(cx - tw, ty + 2);
  ctx.moveTo(cx + tw, ty + 2);     ctx.lineTo(cx + tw + 10, ty + 2);
  ctx.stroke();
}

function drawLantern(ctx: CanvasRenderingContext2D, l: Lantern, frame: number) {
  const p = PAL[l.pal];
  ctx.save();
  ctx.translate(l.x, l.y);
  ctx.rotate(l.rot);

  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.072 + l.id * 7.1);
  const hw = LW / 2, hh = LH / 2, r = 12;

  // Outer halo glow
  const halo = ctx.createRadialGradient(0, 0, 5, 0, 0, 56);
  halo.addColorStop(0, `rgba(${p.glow},0.18)`);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.ellipse(0, 0, 56, 42, 0, 0, Math.PI * 2); ctx.fill();

  // Rounded rect path (reusable)
  const bodyPath = () => {
    ctx.beginPath();
    ctx.moveTo(-hw + r, -hh); ctx.lineTo(hw - r, -hh);
    ctx.quadraticCurveTo(hw, -hh, hw, -hh + r);
    ctx.lineTo(hw, hh - r); ctx.quadraticCurveTo(hw, hh, hw - r, hh);
    ctx.lineTo(-hw + r, hh); ctx.quadraticCurveTo(-hw, hh, -hw, hh - r);
    ctx.lineTo(-hw, -hh + r); ctx.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
    ctx.closePath();
  };

  // Body fill — same dark for all lanterns, player must read the text
  bodyPath();
  const fill = ctx.createLinearGradient(0, -hh, 0, hh);
  fill.addColorStop(0, "rgba(20,13,7,0.95)");
  fill.addColorStop(1, "rgba(11,7,3,0.95)");
  ctx.fillStyle = fill; ctx.fill();

  // Outer border with pulse
  bodyPath();
  ctx.strokeStyle = `rgba(${p.glow},${(0.38 + 0.36 * pulse).toFixed(2)})`;
  ctx.lineWidth = 1.9; ctx.stroke();

  // Inner inset border (decorative)
  ctx.save(); ctx.scale(0.84, 0.78); bodyPath();
  ctx.strokeStyle = `rgba(${p.glow},0.09)`; ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();

  // Top horizontal accent lines
  ctx.strokeStyle = `rgba(${p.glow},0.12)`; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-hw + 10, -hh + 7); ctx.lineTo(hw - 10, -hh + 7);
  ctx.moveTo(-hw + 10, hh - 7);  ctx.lineTo(hw - 10, hh - 7);
  ctx.stroke();

  // Hanging thread + top knob
  ctx.strokeStyle = `rgba(${p.glow},0.34)`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, -hh); ctx.lineTo(0, -hh - 15); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -hh - 15, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${p.glow},0.7)`; ctx.fill();

  // Tiny bottom ornament
  ctx.beginPath(); ctx.arc(0, hh + 5, 2, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${p.glow},0.22)`; ctx.fill();

  // Darija text — the star of the show
  const fs = l.darija.length > 7 ? 12 : l.darija.length > 5 ? 13.5 : 15.5;
  ctx.font = `italic ${fs}px Georgia`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillStyle = p.text;
  ctx.shadowColor = `rgba(${p.glow},0.75)`; ctx.shadowBlur = 9;
  ctx.fillText(l.darija, 0, 2);
  ctx.shadowBlur = 0;

  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, px: number, frame: number) {
  const py = PLAYER_Y;
  const pulse = 0.62 + 0.38 * Math.sin(frame * 0.052);

  // Ground glow pool
  const pool = ctx.createRadialGradient(px, py, 0, px, py, 76);
  pool.addColorStop(0, "rgba(200,169,110,0.16)");
  pool.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = pool;
  ctx.beginPath(); ctx.ellipse(px, py, 76, 20, 0, 0, Math.PI * 2); ctx.fill();

  ctx.save(); ctx.translate(px, py);
  const hw = PW / 2, hh = PH / 2, r = 9;

  // Tray body (rounded rect)
  ctx.beginPath();
  ctx.moveTo(-hw + r, -hh); ctx.lineTo(hw - r, -hh);
  ctx.quadraticCurveTo(hw, -hh, hw, -hh + r);
  ctx.lineTo(hw, hh - r); ctx.quadraticCurveTo(hw, hh, hw - r, hh);
  ctx.lineTo(-hw + r, hh); ctx.quadraticCurveTo(-hw, hh, -hw, hh - r);
  ctx.lineTo(-hw, -hh + r); ctx.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  ctx.closePath();

  const tg = ctx.createLinearGradient(0, -hh, 0, hh);
  tg.addColorStop(0, `rgba(200,169,110,${(0.32 * pulse).toFixed(2)})`);
  tg.addColorStop(0.5, `rgba(200,169,110,${(0.15 * pulse).toFixed(2)})`);
  tg.addColorStop(1, `rgba(200,169,110,${(0.26 * pulse).toFixed(2)})`);
  ctx.fillStyle = tg; ctx.fill();

  ctx.strokeStyle = `rgba(200,169,110,${(0.72 * pulse).toFixed(2)})`;
  ctx.lineWidth = 2.2; ctx.stroke();

  // Zellige diamond motifs along tray
  ctx.strokeStyle = `rgba(200,169,110,${(0.22 * pulse).toFixed(2)})`;
  ctx.lineWidth = 0.9;
  for (let dx = -48; dx <= 48; dx += 16) {
    const ds = 5;
    ctx.beginPath();
    ctx.moveTo(dx, -ds); ctx.lineTo(dx + ds, 0);
    ctx.lineTo(dx, ds); ctx.lineTo(dx - ds, 0);
    ctx.closePath(); ctx.stroke();
  }

  // Center jewel
  ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2);
  const jg = ctx.createRadialGradient(0, 0, 0, 0, 0, 4);
  jg.addColorStop(0, `rgba(255,240,180,${(0.8 * pulse).toFixed(2)})`);
  jg.addColorStop(1, `rgba(200,169,110,${(0.4 * pulse).toFixed(2)})`);
  ctx.fillStyle = jg; ctx.fill();

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach(p => {
    ctx.globalAlpha = p.life * 0.9;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${p.hue},${p.sat}%,65%)`;
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

// ─── Component ────────────────────────────────────────────────────────────────
interface SoukRushProps {
  vocabulary: VocabularyItem[];
  onComplete: (score: number, xpEarned: number) => void;
  onExit: () => void;
}

export default function SoukRush({ vocabulary, onComplete, onExit }: SoukRushProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gRef = useRef<GameState | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseXRef = useRef<number | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const shootingTimerRef = useRef(0);

  const [screen, setScreen] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [finalScore, setFinalScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const { user } = useAuth();

  // Load best score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('soukRushBest');
      if (saved) setBestScore(parseInt(saved) || 0);
    } catch { /* ignore */ }
  }, []);

  const startGame = useCallback(() => {
    if (vocabulary.length === 0) return;
    
    // Shuffle vocabulary and ensure we have enough words
    const vocab = [...vocabulary].sort(() => Math.random() - 0.5);
    const { target, lanterns } = buildRound(vocab, 0, 1);
    
    gRef.current = {
      player: { x: W / 2 },
      lanterns,
      particles: [],
      stars: mkStars(),
      shootingStars: [],
      vocab,
      vocabIdx: 0,
      target,
      score: 0,
      lives: 3,
      level: 1,
      combo: 0,
      frame: 0,
      shakeX: 0,
      shakeY: 0,
      flashFrames: 0,
      flashColor: '200,169,110',
      flashAlpha: 0,
    };
    shootingTimerRef.current = 0;
    setScreen('playing');
  }, [vocabulary]);

  useEffect(() => {
    if (screen !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Input listeners ──
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseXRef.current = (e.clientX - r.left) * (W / r.width);
    };
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      mouseXRef.current = (e.touches[0].clientX - r.left) * (W / r.width);
    };
    const onKey = (e: KeyboardEvent) => { keysRef.current[e.key] = e.type === 'keydown'; };

    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('touchmove', onTouch, { passive: false });
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    // ── Main game loop ──
    const loop = () => {
      const g = gRef.current;
      if (!g) return;
      g.frame++;

      // ── Player movement ──
      if (mouseXRef.current !== null)
        g.player.x += (mouseXRef.current - g.player.x) * 0.16;
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) g.player.x -= 7;
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) g.player.x += 7;
      g.player.x = clamp(g.player.x, PW / 2, W - PW / 2);

      // ── Decay effects ──
      g.shakeX *= 0.66; g.shakeY *= 0.66;
      if (g.flashFrames > 0) {
        g.flashFrames--;
        g.flashAlpha = (g.flashFrames / 16) * 0.27;
      }

      // ── Shooting stars (rare, atmospheric) ──
      shootingTimerRef.current++;
      if (shootingTimerRef.current > 300 && Math.random() < 0.004) {
        g.shootingStars.push(mkShootingStar());
        shootingTimerRef.current = 0;
      }
      g.shootingStars = g.shootingStars.filter(ss => {
        ss.x += ss.vx; ss.y += ss.vy; ss.life -= 0.03;
        return ss.life > 0;
      });

      // ── Update lanterns ──
      const toRemove: number[] = [];
      const toAdd: { replace: string; darija?: string; english?: string }[] = [];
      let correctCaught = false;

      for (const l of g.lanterns) {
        if (toRemove.includes(l.id)) continue;

        // Physics
        l.vy = Math.min(l.vy + GRAVITY, 4.8 + g.level * 0.24);
        l.x += l.vx; l.y += l.vy; l.rot += l.rotV;

        // Wall bounce with slight energy loss
        if (l.x < LW / 2 + 16) { l.x = LW / 2 + 16; l.vx = Math.abs(l.vx) * 0.88; }
        if (l.x > W - LW / 2 - 16) { l.x = W - LW / 2 - 16; l.vx = -Math.abs(l.vx) * 0.88; }

        // Collision with player tray
        const hitX = Math.abs(l.x - g.player.x) < (PW / 2 + LW / 2 - 22);
        const hitY = l.y + LH / 2 > PLAYER_Y - PH / 2 - 4 && l.y - LH / 2 < PLAYER_Y + PH / 2 + 5;

        if (!correctCaught && hitX && hitY) {
          toRemove.push(l.id);
          if (l.isCorrect) {
            correctCaught = true;
            const bonus = g.combo >= 5 ? 3 : g.combo >= 2 ? 2 : 1;
            g.score += 10 * bonus;
            g.combo++;
            if (g.score >= g.level * 110) g.level++;
            // Particle burst at catch point
            for (let i = 0; i < 24; i++) g.particles.push(mkParticle(l.x, l.y));
            // Green flash
            g.flashFrames = 16; g.flashColor = '90,200,140';
          } else {
            g.lives--;
            g.combo = 0;
            g.shakeX = 9; g.shakeY = 7;
            g.flashFrames = 18; g.flashColor = '210,48,48';
            toAdd.push({ replace: 'wrong' });
          }
        }

        // Fell off bottom — respawn same role
        if (!toRemove.includes(l.id) && l.y > H + 95) {
          toRemove.push(l.id);
          toAdd.push({ replace: l.isCorrect ? 'correct' : 'wrong', darija: l.darija, english: l.english });
        }
      }

      // ── Apply game state changes ──
      if (g.lives <= 0) {
        let best = 0;
        try { best = parseInt(localStorage.getItem('soukRushBest') || '0') || 0; } catch { /* ignore */ }
        const newBest = Math.max(best, g.score);
        try { localStorage.setItem('soukRushBest', String(newBest)); } catch { /* ignore */ }
        setBestScore(newBest);
        setFinalScore(g.score);
        
        // Calculate XP earned (10 XP per 100 points)
        const xpEarned = Math.floor(g.score / 10);
        onComplete(g.score, xpEarned);
        
        setScreen('gameover');
        return; // halt loop
      }

      if (correctCaught) {
        // Full round rebuild
        g.vocabIdx++;
        const { target, lanterns } = buildRound(g.vocab, g.vocabIdx, g.level);
        g.target = target; g.lanterns = lanterns;
      } else {
        g.lanterns = g.lanterns.filter(l => !toRemove.includes(l.id));
        toAdd.forEach(item => {
          if (item.replace === 'correct' && item.darija && item.english) {
            g.lanterns.push(mkLantern(item.darija, item.english, true, g.level));
          } else {
            // Pick a wrong word not currently on screen
            const used = new Set([g.target.d, ...g.lanterns.map(l => l.darija)]);
            const pool = g.vocab.filter(v => !used.has(v.word));
            if (pool.length > 0) {
              const pick = pool[Math.floor(Math.random() * pool.length)];
              g.lanterns.push(mkLantern(pick.word, pick.translation, false, g.level));
            }
          }
        });
      }

      // ── Update particles ──
      g.particles = g.particles.filter(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.22; p.vx *= 0.968;
        p.life -= p.decay;
        return p.life > 0;
      });

      // ── DRAW FRAME ──
      ctx.save();
      // Screen shake
      if (Math.abs(g.shakeX) > 0.5) {
        ctx.translate(
          g.shakeX * (Math.random() > 0.5 ? 1 : -1),
          g.shakeY * (Math.random() > 0.5 ? 1 : -1)
        );
      }

      drawBackground(ctx, g.stars, g.shootingStars, g.frame);
      drawFrame(ctx, g.frame);

      // Flash overlay
      if (g.flashAlpha > 0.01) {
        ctx.fillStyle = `rgba(${g.flashColor},${g.flashAlpha.toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }

      drawHUD(ctx, g.score, g.lives, g.level, g.combo, g.frame);
      drawArch(ctx, g.target.e, g.frame);
      g.lanterns.forEach(l => drawLantern(ctx, l, g.frame));
      drawPlayer(ctx, g.player.x, g.frame);
      drawParticles(ctx, g.particles);

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('touchmove', onTouch);
      canvas.removeEventListener('touchstart', onTouch);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, [screen, onComplete]);

  // ── Styles ─────────────────────────────────────────────────────────────────
  const overlayStyle: React.CSSProperties = {
    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(158deg,rgba(5,3,14,0.97),rgba(9,5,22,0.97))',
    borderRadius: 18,
  };

  const primaryBtnStyle: React.CSSProperties = {
    padding: '15px 50px', borderRadius: 100,
    background: 'linear-gradient(138deg,#c8a96e,#a07c30)',
    color: '#150e04', fontFamily: 'Georgia,serif',
    fontSize: 17, fontWeight: 700, fontStyle: 'italic',
    border: 'none', cursor: 'pointer',
    boxShadow: '0 0 32px rgba(200,169,110,0.42), 0 6px 22px rgba(0,0,0,0.6)',
    transition: 'transform 0.13s, box-shadow 0.13s',
    letterSpacing: '0.01em',
  };

  const ghostBtnStyle: React.CSSProperties = {
    padding: '15px 32px', borderRadius: 100,
    background: 'rgba(200,169,110,0.07)',
    color: 'rgba(200,169,110,0.72)',
    fontFamily: 'Georgia,serif', fontSize: 17,
    border: '1px solid rgba(200,169,110,0.25)', cursor: 'pointer',
    transition: 'transform 0.13s',
  };

  const handleHover = (e: React.MouseEvent<HTMLButtonElement>, isHovering: boolean) => {
    e.currentTarget.style.transform = isHovering ? 'scale(1.055)' : 'scale(1)';
  };

  // Loading state
  if (vocabulary.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4" style={{ background: '#030209' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flicker { 0%, 100% { opacity: 0.82; } 45% { opacity: 1; } 90% { opacity: 0.88; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>

      <div className="relative" style={{ width: '100%', maxWidth: W }}>
        {/* Exit button */}
        <button
          onClick={onExit}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 flex items-center justify-center transition-colors"
          style={{ zIndex: 20 }}
        >
          ✕
        </button>

        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full h-auto rounded-2xl"
          style={{
            display: 'block',
            touchAction: 'none',
            cursor: screen === 'playing' ? 'none' : 'default',
            boxShadow: '0 0 70px rgba(200,169,110,0.15), 0 28px 70px rgba(0,0,0,0.8)',
          }}
        />

        {/* ────── MENU ────── */}
        {screen === 'menu' && (
          <div style={{ ...overlayStyle, animation: 'fadeUp 0.55s ease' }}>
            {/* Background stars (decorative) */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden', opacity: 0.35, pointerEvents: 'none' }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${rnd(2, 98)}%`,
                    top: `${rnd(2, 98)}%`,
                    width: rnd(1, 2.5),
                    height: rnd(1, 2.5),
                    borderRadius: '50%',
                    background: 'white',
                    opacity: rnd(0.2, 0.9),
                  }}
                />
              ))}
            </div>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 56, animation: 'float 3.2s ease infinite', marginBottom: 6 }}>🪔</div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.4em', color: 'rgba(200,169,110,0.42)', textTransform: 'uppercase', marginBottom: 10 }}>
                Moroccan Darija
              </div>
              <h1 style={{
                fontSize: 'clamp(36px,10vw,62px)',
                fontWeight: 900,
                color: '#f8eedc',
                letterSpacing: '-0.025em',
                margin: '0 0 4px',
                lineHeight: 1,
                animation: 'flicker 3s ease infinite',
                textShadow: '0 0 30px rgba(200,169,110,0.5)',
              }}>
                Souk Rush
              </h1>
              <p style={{ fontStyle: 'italic', fontSize: 14, color: 'rgba(200,169,110,0.48)', margin: '0 0 30px', textAlign: 'center', lineHeight: 1.7 }}>
                Lanterns fall through the night sky<br />catch the right Darija word
              </p>

              {/* Instruction card */}
              <div style={{
                background: 'rgba(200,169,110,0.05)',
                border: '1px solid rgba(200,169,110,0.13)',
                borderRadius: 14,
                padding: '18px 26px',
                marginBottom: 26,
                maxWidth: 280,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.18em', color: 'rgba(200,169,110,0.38)', textTransform: 'uppercase', marginBottom: 12 }}>
                  how to play
                </div>
                <div style={{ fontSize: 13, color: '#b0a090', lineHeight: 1.82 }}>
                  An English word glows in the arch above<br />
                  Move your golden tray left & right<br />
                  Catch the matching Darija lantern<br />
                  <span style={{ color: 'rgba(200,169,110,0.5)', fontSize: 12 }}>combos × more points · 3 lives</span>
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 14 }}>
                  {['🖱 mouse', '👆 touch', '← → keys'].map(t => (
                    <span key={t} style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(200,169,110,0.32)' }}>{t}</span>
                  ))}
                </div>
              </div>

              {bestScore > 0 && (
                <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(200,169,110,0.38)', marginBottom: 18 }}>
                  best: {bestScore}
                </div>
              )}

              <button
                style={primaryBtnStyle}
                onClick={startGame}
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
              >
                Play · العب
              </button>

              <div style={{ marginTop: 20, fontSize: 9, fontFamily: 'monospace', color: 'rgba(200,169,110,0.18)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                {vocabulary.length} words · 5 levels · endless
              </div>
            </div>
          </div>
        )}

        {/* ────── GAME OVER ────── */}
        {screen === 'gameover' && (
          <div style={{ ...overlayStyle, animation: 'fadeUp 0.48s ease' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 10 }}>💫</div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.32em', color: 'rgba(200,169,110,0.36)', textTransform: 'uppercase', marginBottom: 8 }}>
                game over
              </div>
              <h2 style={{
                fontSize: 'clamp(22px,7vw,42px)',
                fontWeight: 900,
                color: '#f8eedc',
                margin: '0 0 28px',
                animation: 'flicker 2.2s ease infinite',
              }}>
                {finalScore >= bestScore && finalScore > 0 ? 'New Best! 🏆' : 'Well played!'}
              </h2>

              {/* Score card */}
              <div style={{
                background: 'rgba(200,169,110,0.07)',
                border: '1px solid rgba(200,169,110,0.2)',
                borderRadius: 16,
                padding: '24px 56px',
                marginBottom: 28,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.22em', color: 'rgba(200,169,110,0.38)', textTransform: 'uppercase', marginBottom: 8 }}>
                  your score
                </div>
                <div style={{
                  fontFamily: 'Georgia',
                  fontSize: 'clamp(44px,12vw,70px)',
                  fontWeight: 900,
                  color: '#c8a96e',
                  lineHeight: 1,
                  textShadow: '0 0 44px rgba(200,169,110,0.45)',
                }}>
                  {finalScore}
                </div>
                {bestScore > 0 && (
                  <div style={{ marginTop: 8, fontSize: 10, fontFamily: 'monospace', color: 'rgba(200,169,110,0.28)' }}>
                    best: {bestScore}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  style={primaryBtnStyle}
                  onClick={startGame}
                  onMouseEnter={(e) => handleHover(e, true)}
                  onMouseLeave={(e) => handleHover(e, false)}
                >
                  Play Again
                </button>
                <button
                  style={ghostBtnStyle}
                  onClick={() => setScreen('menu')}
                  onMouseEnter={(e) => handleHover(e, true)}
                  onMouseLeave={(e) => handleHover(e, false)}
                >
                  Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
