'use client';

import { useEffect, useRef } from 'react';

export default function ZelligeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tiles: any[] = [];
    let particles: any[] = [];
    let stars: any[] = [];
    let time = 0;
    let scrollY = 0;

    const mouse = { x: -1000, y: -1000, radius: 180 };

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

    // Moroccan Color Palette
    const palette = {
      teal: '#1a7a6e',
      darkTeal: '#0e5449',
      orange: '#d9943a',
      amber: '#e5a945',
      blue: '#2d5d87',
      darkBlue: '#1e4059',
      black: '#1a1a1a',
      charcoal: '#2d2d2d',
      cream: '#e8e4dc',
    };

    function shade(hex: string, percent: number) {
      const num = parseInt(hex.slice(1), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, Math.max(0, (num >> 16) + amt));
      const G = Math.min(255, Math.max(0, ((num >> 8) & 255) + amt));
      const B = Math.min(255, Math.max(0, (num & 255) + amt));
      return `#${(0x1000000 + R * 65536 + G * 256 + B).toString(16).slice(1)}`;
    }

    class Tile {
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      vx: number = 0;
      vy: number = 0;
      color: string;
      verts: { x: number; y: number }[];
      angle: number;
      baseAngle: number;
      depth: number;
      random: number;
      hoverScale: number = 1;
      pulsePhase: number;

      constructor(x: number, y: number, color: string, verts: { x: number; y: number }[], angle: number, depth: number) {
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
        ctx.save();
        ctx.translate(this.x, this.y - scrollY * this.depth);
        ctx.rotate(this.angle);
        ctx.scale(this.hoverScale, this.hoverScale);

        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 90);
        grad.addColorStop(0, shade(this.color, 18));
        grad.addColorStop(1, shade(this.color, -12));

        ctx.fillStyle = grad;
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
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Star {
      x: number;
      y: number;
      alpha: number = 1;
      size: number;
      rotation: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.alpha = 1;
        this.size = Math.random() * 4 + 2;
        this.rotation = Math.random() * Math.PI * 2;
      }

      update() {
        this.alpha -= 0.015;
        this.rotation += 0.1;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
        gradient.addColorStop(0, '#e5a945');
        gradient.addColorStop(0.5, '#f5b955');
        gradient.addColorStop(1, 'rgba(229,169,69,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const r = i % 2 === 0 ? this.size * 2 : this.size;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    function createClickEffect(x: number, y: number) {
      const colors = [palette.orange, palette.amber, palette.blue, palette.teal];
      for (let i = 0; i < 8; i++) {
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
      }
      stars.push(new Star(x, y));
    }

    function centroid(verts: { x: number; y: number }[]) {
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
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, document.body.scrollHeight + 500);
      tiles = [];
      particles = [];
      stars = [];

      const scale = 1.2;
      const spacingX = 350 * scale;
      const spacingY = 310 * scale;

      for (let y = -spacingY; y < canvas.height + spacingY; y += spacingY) {
        for (let x = -spacingX; x < canvas.width + spacingX; x += spacingX) {
          const offset = x + (Math.floor(y / spacingY) % 2 === 0 ? 0 : spacingX / 2);
          createRosette(offset, y, scale);
        }
      }
    }

    function drawLighting() {
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.15, 100,
        canvas.width / 2, canvas.height * 0.15, canvas.width
      );

      grad.addColorStop(0, 'rgba(255,250,240,0.15)');
      grad.addColorStop(0.7, 'rgba(232,228,220,0.08)');
      grad.addColorStop(1, 'rgba(0,0,0,0.02)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate(timestamp: number) {
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

      stars = stars.filter(s => s.alpha > 0);
      stars.forEach(s => {
        s.update();
        s.draw();
      });

      drawLighting();

      if (Math.random() < 0.008 && mouse.x > 0) {
        stars.push(new Star(mouse.x + (Math.random() - 0.5) * 50, mouse.y + (Math.random() - 0.5) * 50));
      }

      requestAnimationFrame(animate);
    }

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Initialize
    init();
    animate(0);

    // Cleanup
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
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #ebe7df 0%, #e8e4dc 50%, #ddd9d1 100%)',
      }}
    />
  );
}
