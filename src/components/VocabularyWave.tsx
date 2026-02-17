'use client';

import { useEffect, useRef, useState } from 'react';
import { getAllVocabulary } from '@/lib/firestore';
import { VocabularyItem } from '@/types';

interface Word {
  id: string;
  darija: string;
  english: string;
}

const SPACING = 180;
const SPEED = 1.2;
const WAVE_AMPLITUDE = 40;
const WAVE_FREQUENCY = 0.0025;
const WAVE_SPEED = 80;
const CENTER_Y = 110;

export default function VocabularyWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const vocabulary = await getAllVocabulary();
        const mappedWords: Word[] = vocabulary.slice(0, 30).map((item: VocabularyItem) => ({
          id: item.id,
          darija: item.word,
          english: item.translation,
        }));
        setWords(mappedWords);
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  useEffect(() => {
    if (words.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = 220;
      canvas.height = 220;
    };

    resizeCanvas();

    const draw = () => {
      time += SPEED;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      words.forEach((word, index) => {
        const x = (index * SPACING) % (canvas.width + SPACING);
        const waveOffset = Math.sin((time * WAVE_FREQUENCY) + (index * 0.5)) * WAVE_AMPLITUDE;
        const y = CENTER_Y + waveOffset;

        ctx.save();
        ctx.font = '600 14px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#1a1a1a';
        ctx.fillText(word.darija, x, y - 8);

        ctx.font = '400 11px system-ui, sans-serif';
        ctx.fillStyle = '#666';
        ctx.fillText(word.english, x, y + 8);

        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [words]);

  if (loading) {
    return (
      <canvas
        ref={canvasRef}
        width={220}
        height={220}
        className="rounded-full"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={220}
      className="rounded-full bg-gradient-to-br from-primary/5 to-accent/5"
    />
  );
}
