'use client';

import { useState, useRef } from 'react';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { SpeakerWaveIcon as SpeakerWaveSolidIcon } from '@heroicons/react/24/solid';

interface AudioPlayerProps {
  audioUrl?: string;
  className?: string;
}

export default function AudioPlayer({ audioUrl, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={togglePlay}
      className={`p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors ${className}`}
      title={isPlaying ? 'Stop' : 'Play pronunciation'}
    >
      {isPlaying ? (
        <SpeakerWaveSolidIcon className="w-5 h-5" />
      ) : (
        <SpeakerWaveIcon className="w-5 h-5" />
      )}
    </button>
  );
}
