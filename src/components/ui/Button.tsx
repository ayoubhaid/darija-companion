import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary hover:bg-primary-600 text-white shadow-md hover:shadow-glow-sm focus:ring-primary/30 active:scale-[0.98] transition-all duration-200',
      secondary: 'bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-700 dark:hover:bg-zinc-600 text-white shadow-md focus:ring-zinc-500/30 active:scale-[0.98] transition-all duration-200',
      outline: 'border-2 border-primary/50 text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-glow-sm focus:ring-primary/30 active:scale-[0.98] transition-all duration-200',
      ghost: 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-zinc-500/30 active:scale-[0.98] transition-all duration-200',
      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md focus:ring-red-500/30 active:scale-[0.98] transition-all duration-200',
      glow: 'bg-primary hover:bg-primary-600 text-white shadow-glow-md hover:shadow-glow-lg animate-pulse-glow focus:ring-primary/30 active:scale-[0.98] transition-all duration-200',
    };

    const sizes = {
      sm: 'px-3.5 py-2 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-semibold rounded-xl focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
