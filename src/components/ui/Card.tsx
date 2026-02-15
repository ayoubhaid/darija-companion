import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm',
      glass: 'bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg border border-white/20 dark:border-zinc-800/30 shadow-lg',
      interactive: 'bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:border-primary/30 hover:shadow-glow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer',
      outline: 'bg-transparent border-2 border-zinc-200 dark:border-zinc-800 shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-2xl',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
