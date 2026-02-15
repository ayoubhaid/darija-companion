'use client';

import { clsx } from 'clsx';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'accent';
  showLabel?: boolean;
}

export default function Progress({ 
  value, 
  max = 100, 
  size = 'md', 
  variant = 'primary',
  showLabel = false 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    default: 'bg-gray-200 dark:bg-slate-700',
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
  };

  const indicatorVariants = {
    default: 'bg-gray-500',
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={clsx('w-full rounded-full overflow-hidden', sizes[size], variants[variant])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', indicatorVariants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
