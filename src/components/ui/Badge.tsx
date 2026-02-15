import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    primary: 'bg-primary/10 text-primary-700 dark:text-primary-300 border border-primary/20',
    secondary: 'bg-zinc-800 text-zinc-300 dark:bg-zinc-700 dark:text-zinc-200',
    accent: 'bg-accent/10 text-accent-700 dark:text-accent-300 border border-accent/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={clsx('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
