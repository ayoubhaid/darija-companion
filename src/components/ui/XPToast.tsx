'use client';

import { useEffect, useState } from 'react';
import { BoltIcon } from '@heroicons/react/24/outline';

interface XPToastProps {
  xp: number;
  message?: string;
  onDone?: () => void;
}

export function XPToast({ xp, message = 'XP earned!', onDone }: XPToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 400);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 right-4 z-[100] transition-all duration-400 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center gap-2.5 px-4 py-3 bg-primary text-white rounded-2xl shadow-glow-md font-semibold text-sm animate-fade-in-up">
        <BoltIcon className="w-5 h-5 text-yellow-300" />
        <span className="text-yellow-200 font-bold">+{xp} XP</span>
        <span className="text-white/80">{message}</span>
      </div>
    </div>
  );
}

// Global XP toast manager
let toastQueue: Array<{ xp: number; message?: string; id: number }> = [];
let listeners: Array<() => void> = [];
let nextId = 0;

export function showXPToast(xp: number, message?: string) {
  toastQueue.push({ xp, message, id: nextId++ });
  listeners.forEach((l) => l());
}

export function XPToastContainer() {
  const [toasts, setToasts] = useState<Array<{ xp: number; message?: string; id: number }>>([]);

  useEffect(() => {
    const listener = () => {
      setToasts([...toastQueue]);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = (id: number) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    setToasts([...toastQueue]);
  };

  return (
    <>
      {toasts.map((toast) => (
        <XPToast
          key={toast.id}
          xp={toast.xp}
          message={toast.message}
          onDone={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
