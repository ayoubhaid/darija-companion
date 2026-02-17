'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { DialogueSpeaker, DialogueLine, DialogueSettings } from '@/types/lms';
import { Play, Pause, Volume2, Rewind, FastForward, Settings } from 'lucide-react';
import clsx from 'clsx';

interface DialogueBlockProps {
  id: string;
  title?: string;
  description?: string;
  speakers: DialogueSpeaker[];
  lines: DialogueLine[];
  settings?: {
    showTranslation: boolean;
    showTransliteration: boolean;
    enableSlowPlayback: boolean;
    playbackSpeed: number;
  };
}

export function DialogueBlock({
  id,
  title = 'Dialogue',
  description,
  speakers = [],
  lines = [],
  settings = {
    showTranslation: true,
    showTransliteration: true,
    enableSlowPlayback: true,
    playbackSpeed: 1,
  },
}: DialogueBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [hoveredTranslation, setHoveredTranslation] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentLine = lines[currentLineIndex];
  const currentSpeaker = speakers.find(s => s.id === currentLine?.speakerId);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleLineClick = useCallback((index: number) => {
    setCurrentLineIndex(index);
    setIsPlaying(true);
    
    // Play audio if available
    const line = lines[index];
    if (line.audioUrl && audioRef.current) {
      audioRef.current.src = line.audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(console.error);
    }
  }, [lines, playbackSpeed]);

  const handleNext = useCallback(() => {
    if (currentLineIndex < lines.length - 1) {
      const nextIndex = currentLineIndex + 1;
      setCurrentLineIndex(nextIndex);
      
      const line = lines[nextIndex];
      if (line.audioUrl && audioRef.current) {
        audioRef.current.src = line.audioUrl;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(console.error);
      }
    } else {
      setIsPlaying(false);
    }
  }, [currentLineIndex, lines, playbackSpeed]);

  const handlePrev = useCallback(() => {
    if (currentLineIndex > 0) {
      const prevIndex = currentLineIndex - 1;
      setCurrentLineIndex(prevIndex);
      
      const line = lines[prevIndex];
      if (line.audioUrl && audioRef.current) {
        audioRef.current.src = line.audioUrl;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentLineIndex, lines, playbackSpeed]);

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  }, []);

  // Auto-advance through dialogue
  useEffect(() => {
    if (isPlaying && currentLine?.delay) {
      timeoutRef.current = setTimeout(() => {
        handleNext();
      }, (currentLine.delay || 3000) / playbackSpeed);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentLineIndex, currentLine, playbackSpeed, handleNext]);

  // Handle audio end
  const handleAudioEnded = useCallback(() => {
    handleNext();
  }, [handleNext]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {description && <p className="text-emerald-100 text-sm">{description}</p>}
          </div>
          <span className="text-emerald-200 text-sm">{lines.length} lines</span>
        </div>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="auto"
      />

      {/* Controls */}
      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentLineIndex === 0}
            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Rewind className="w-5 h-5" />
          </button>
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={currentLineIndex === lines.length - 1}
            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">
            {currentLineIndex + 1} / {lines.length}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-2 min-w-[150px] z-10">
                <p className="text-xs text-zinc-500 mb-2 px-2">Playback Speed</p>
                {[0.5, 0.75, 1, 1.25, 1.5].map(speed => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded text-sm',
                      playbackSpeed === speed
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    )}
                  >
                    {speed}x {speed === 1 && '(Normal)'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogue Content */}
      <div className="p-4 space-y-2">
        {lines.map((line, index) => {
          const speaker = speakers.find(s => s.id === line.speakerId);
          const isActive = index === currentLineIndex;
          const isPast = index < currentLineIndex;

          return (
            <div
              key={line.id || index}
              onClick={() => handleLineClick(index)}
              className={clsx(
                'p-4 rounded-lg cursor-pointer transition-all',
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                  : isPast
                  ? 'bg-zinc-50 dark:bg-zinc-800/50 opacity-60'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Speaker Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shrink-0"
                  style={{ backgroundColor: speaker?.color || '#6B7280' }}
                >
                  {speaker?.avatar ? (
                    <img src={speaker.avatar} alt={speaker.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    speaker?.name?.charAt(0) || '?'
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: speaker?.color || '#374151' }}
                    >
                      {speaker?.name || 'Unknown'}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">
                        Playing
                      </span>
                    )}
                  </div>

                  <p className="text-lg mb-1">{line.text}</p>

                  {settings.showTransliteration && line.transliteration && (
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm italic mb-1">
                      {line.transliteration}
                    </p>
                  )}

                  {settings.showTranslation && line.translation && (
                    <p 
                      className="text-zinc-600 dark:text-zinc-300 text-sm"
                      onMouseEnter={() => setHoveredTranslation(line.translation || null)}
                      onMouseLeave={() => setHoveredTranslation(null)}
                    >
                      {line.translation}
                    </p>
                  )}
                </div>

                {line.audioUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (audioRef.current && line.audioUrl) {
                        audioRef.current.src = line.audioUrl;
                        audioRef.current.playbackRate = playbackSpeed;
                        audioRef.current.play().catch(console.error);
                      }
                    }}
                    className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 transition-colors shrink-0"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="h-1 bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${((currentLineIndex + 1) / lines.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
