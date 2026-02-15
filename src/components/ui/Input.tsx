import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 dark:text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-3 border border-zinc-700 rounded-xl',
              'bg-zinc-900/50 text-white placeholder:text-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
              'transition-all duration-200',
              icon && 'pl-12',
              error && 'border-red-500 focus:ring-red-500/30',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
