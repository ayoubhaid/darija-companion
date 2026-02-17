'use client';

import { useState, useCallback, useEffect } from 'react';
import { Eye, EyeOff, Clock, CheckCircle, Lock } from 'lucide-react';
import clsx from 'clsx';

interface RevealBlockProps {
  id: string;
  title?: string;
  revealType?: 'click' | 'timer' | 'scroll' | 'completion';
  timerSeconds?: number;
  buttonText?: string;
  hint?: string;
  onReveal?: () => void;
  isLocked?: boolean;
}

export function RevealBlock({
  id,
  title = 'Reveal Answer',
  revealType = 'click',
  timerSeconds = 5,
  buttonText = 'Reveal Answer',
  hint,
  onReveal,
  isLocked = false,
}: RevealBlockProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [canReveal, setCanReveal] = useState(revealType !== 'timer');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (revealType === 'timer' && !isRevealed) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanReveal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [revealType, isRevealed]);

  const handleReveal = useCallback(() => {
    if (!canReveal || isLocked) return;
    setIsRevealed(true);
    onReveal?.();
  }, [canReveal, isLocked, onReveal]);

  const handleScrollReveal = useCallback(() => {
    if (revealType !== 'scroll' || isRevealed) return;
    
    const handleScroll = () => {
      const element = document.getElementById(`reveal-${id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.8) {
          setIsRevealed(true);
          onReveal?.();
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [revealType, isRevealed, id, onReveal]);

  useEffect(() => {
    if (revealType === 'scroll') {
      return handleScrollReveal();
    }
  }, [revealType, handleScrollReveal]);

  const handleCompletionReveal = useCallback(() => {
    if (revealType !== 'completion') return;
    // In a real implementation, this would check if all blocks are completed
    setIsCompleted(true);
    setIsRevealed(true);
    onReveal?.();
  }, [revealType, onReveal]);

  if (isLocked) {
    return (
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex items-center gap-3 text-zinc-500">
          <Lock className="w-5 h-5" />
          <span>Complete previous items to unlock</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={`reveal-${id}`}
      className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isRevealed ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
            <h3 className="font-bold">{title}</h3>
          </div>
          {revealType === 'timer' && !isRevealed && (
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{timeLeft}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isRevealed ? (
          <div className="animate-fade-in">
            <div className="flex items-start gap-3 text-green-600 dark:text-green-400 mb-4">
              <CheckCircle className="w-5 h-5 mt-0.5" />
              <span className="font-medium">Answer Revealed!</span>
            </div>
            {/* Content would be rendered here - this is a placeholder */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-zinc-700 dark:text-zinc-300">
                The hidden content would be displayed here. This could be an answer, 
                explanation, or any other content you want to reveal.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                {hint && <span className="text-amber-600 dark:text-amber-400">💡 Hint: {hint}</span>}
              </p>
            </div>

            {revealType === 'timer' ? (
              <div>
                {canReveal ? (
                  <button
                    onClick={handleReveal}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    {buttonText}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-zinc-500">Reveal available in</p>
                    <div className="w-16 h-16 rounded-full border-4 border-amber-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-amber-600">{timeLeft}</span>
                    </div>
                    <p className="text-sm text-zinc-400">seconds</p>
                  </div>
                )}
              </div>
            ) : revealType === 'completion' ? (
              <div>
                {isCompleted ? (
                  <button
                    onClick={handleReveal}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    {buttonText}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-zinc-500">Complete the lesson to reveal</p>
                    <button
                      onClick={handleCompletionReveal}
                      className="px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Mark as Complete
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleReveal}
                disabled={!canReveal}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {buttonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
