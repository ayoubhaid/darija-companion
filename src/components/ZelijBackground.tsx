'use client';

import { useEffect, useRef } from 'react';

interface Vertex {
  x: number;
  y: number;
}

interface MouseState {
  x: number;
  y: number;
  radius: number;
}

class Tile {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  color: string;
  verts: Vertex[];
  angle: number;
  baseAngle: number;
  depth: number;
  random: number;
  hoverScale: number = 1;
  pulsePhase: number;

  constructor(x: number, y: number, color: string, verts: Vertex[], angle: number, depth: number) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.color = color;
    this.verts = verts;
    this.angle = angle;
    this.baseAngle = angle;
    this.depth = depth;
    this.random = Math.random() * 1000;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    if (dist < mouse.radius) {
      const force = Math.pow((mouse.radius - dist) / mouse.radius, 2);
      this.vx -= (dx / dist) * force * 1.5;
      this.vy -= (dy / dist) * force * 1.5;
      this.hoverScale = 1 + force * 0.15;
      this.angle = this.baseAngle + force * 0.3;
    } else {
      this.hoverScale += (1 - this.hoverScale) * 0.15;
      this.angle += (this.baseAngle - this.angle) * 0.15;
    }

    this.vx += (this.baseX - this.x) * 0.06;
    this.vy += (this.baseY - this.y) * 0.06;
    this.vx *= 0.92;
    this.vy *= 0.92;

    const morph = Math.sin(scrollY * 0.003 + this.random) * 4;
    this.x += morph * 0.04;

    const breathe = Math.sin(time * 0.002 + this.pulsePhase) * 1;

    this.x += this.vx;
    this.y += this.vy + breathe;
  }

  draw() {
    if (!ctx) return;
    ctx.save();
    ctx.translate(this.x, this.y - scrollY * this.depth);
    ctx.rotate(this.angle);
    ctx.scale(this.hoverScale, this.hoverScale);
    ctx.globalAlpha = 0.4;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.verts[0].x, this.verts[0].y);
    for (let i = 1; i < this.verts.length; i++) {
      ctx.lineTo(this.verts[i].x, this.verts[i].y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number = 1;
  size: number;
  color: string;
  life: number = 1;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3 - 1;
    this.size = Math.random() * 3 + 1;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1;
    this.life -= 0.02;
    this.alpha = this.life;
  }

  draw() {
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const palette = {
  teal: "#1a7a6e",
  darkTeal: "#0e5449",
  orange: "#d9943a",
  amber: "#e5a945",
  blue: "#2d5d87",
  darkBlue: "#1e4059",
  black: "#1a1a1a",
  charcoal: "#2d2d2d",
  cream: "#e8e4dc",
};

let ctx: CanvasRenderingContext2D | null = null;
let canvas: HTMLCanvasElement | null = null;
let tiles: Tile[] = [];
let particles: Particle[] = [];
let time = 0;
let scrollY = 0;
const mouse: MouseState = { x: -1000, y: -1000, radius: 180 };

function centroid(verts: Vertex[]): { x: number; y: number } {
  let cx = 0, cy = 0;
  verts.forEach(p => { cx += p.x; cy += p.y; });
  return { x: cx / verts.length, y: cy / verts.length };
}

function createRosette(cx: number, cy: number, scale: number) {
  const PI = Math.PI;
  const A = PI / 12;
  const pt = (r: number, a: number) => ({ x: r * scale * Math.cos(a), y: r * scale * Math.sin(a) });

  const shapes = [
    { c: palette.teal, v: [pt(0, 0), pt(15, -A), pt(25, 0), pt(15, A)] },
    { c: palette.blue, v: [pt(25, 0), pt(15, A), pt(38, A), pt(55, 0), pt(38, -A), pt(15, -A)] },
    { c: palette.black, v: [pt(55, 0), pt(38, A), pt(72, A), pt(92, A * 0.4), pt(110, 0), pt(92, -A * 0.4), pt(72, -A), pt(38, -A)] },
    { c: palette.orange, v: [pt(72, A), pt(92, A * 0.4), pt(122, A), pt(92, A * 1.6)] },
    { c: palette.darkTeal, v: [pt(110, 0), pt(92, -A * 0.4), pt(122, -A), pt(92, -A * 1.6)] },
  ];

  for (let i = 0; i < 12; i++) {
    const angle = i * (PI / 6);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    shapes.forEach(s => {
      const c = centroid(s.v);
      const rx = c.x * cos - c.y * sin;
      const ry = c.x * sin + c.y * cos;
      const centered = s.v.map(v => ({ x: v.x - c.x, y: v.y - c.y }));

      tiles.push(new Tile(cx + rx, cy + ry, s.c, centered, angle, Math.random() * 0.4));
    });
  }
}

function init() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  tiles = [];
  particles = [];

  const scale = 1.2;
  const spacingX = 600 * scale;
  const spacingY = 520 * scale;

  for (let y = -spacingY; y < canvas.height + spacingY; y += spacingY) {
    for (let x = -spacingX; x < canvas.width + spacingX; x += spacingX) {
      const offset = x + (Math.floor(y / spacingY) % 2 === 0 ? 0 : spacingX / 2);
      createRosette(offset, y, scale);
    }
  }
}

function createClickEffect(x: number, y: number) {
  const colors = [palette.orange, palette.amber, palette.blue, palette.teal];
  for (let i = 0; i < 4; i++) {
    particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
  }
}

function animate(timestamp: number) {
  if (!ctx || !canvas) return;
  time = timestamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  tiles.forEach(tile => {
    tile.update();
    tile.draw();
  });

  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

export default function ZelijBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    canvas = canvasRef.current;
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY + scrollY;
    };

    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleMouseDown = () => {
      createClickEffect(mouse.x, mouse.y);
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    init();
    animate(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 -z-10 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
