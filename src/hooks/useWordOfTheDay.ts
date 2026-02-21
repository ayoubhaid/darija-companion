'use client';

import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/types';
import { getAllVocabulary } from '@/lib/firestore';

const STORAGE_KEY = 'darija_wotd';

interface WOTDState {
  word: VocabularyItem | null;
  date: string; // YYYY-MM-DD
  known: boolean;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function useWordOfTheDay() {
  const [wotd, setWotd] = useState<WOTDState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const today = getTodayStr();

      // Check localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: WOTDState = JSON.parse(stored);
          if (parsed.date === today && parsed.word) {
            setWotd(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // Fetch vocabulary and pick today's word deterministically
      try {
        const vocab = await getAllVocabulary();
        if (vocab.length === 0) {
          setLoading(false);
          return;
        }

        // Use date as seed for deterministic selection
        const dateNum = parseInt(today.replace(/-/g, ''), 10);
        const idx = dateNum % vocab.length;
        const word = vocab[idx];

        const state: WOTDState = { word, date: today, known: false };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setWotd(state);
      } catch (e) {
        console.error('WOTD error:', e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const markKnown = () => {
    if (!wotd) return;
    const updated = { ...wotd, known: true };
    setWotd(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { wotd, loading, markKnown };
}
