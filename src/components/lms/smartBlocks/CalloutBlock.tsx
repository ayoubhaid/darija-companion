'use client';

import { Info, Lightbulb, AlertTriangle, CheckCircle, XCircle, Globe } from 'lucide-react';
import clsx from 'clsx';

interface CalloutBlockProps {
  id: string;
  type?: 'info' | 'tip' | 'warning' | 'success' | 'error' | 'cultural';
  title?: string;
  message: string;
  icon?: string;
}

const calloutConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-200',
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    titleColor: 'text-yellow-800 dark:text-yellow-200',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    iconColor: 'text-orange-600 dark:text-orange-400',
    titleColor: 'text-orange-800 dark:text-orange-200',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-800 dark:text-green-200',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-800 dark:text-red-200',
  },
  cultural: {
    icon: Globe,
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    iconColor: 'text-purple-600 dark:text-purple-400',
    titleColor: 'text-purple-800 dark:text-purple-200',
  },
};

const defaultIcons: Record<string, string> = {
  info: 'ℹ️',
  tip: '💡',
  warning: '⚠️',
  success: '✅',
  error: '❌',
  cultural: '🌍',
};

export function CalloutBlock({
  id,
  type = 'info',
  title,
  message,
  icon,
}: CalloutBlockProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  
  // Use custom icon if provided, otherwise use emoji fallback
  const iconContent = icon || defaultIcons[type];

  return (
    <div
      className={clsx(
        'rounded-lg border p-4 my-4',
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={clsx('shrink-0 mt-0.5', config.iconColor)}>
          {icon?.startsWith('<') ? (
            <span className="text-xl" dangerouslySetInnerHTML={{ __html: icon }} />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={clsx('font-semibold mb-1', config.titleColor)}>
              {title}
            </h4>
          )}
          <div 
            className="text-zinc-700 dark:text-zinc-300 text-sm"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
      </div>
    </div>
  );
}

// Compact version for inline use
export function InlineCallout({
  type = 'info',
  message,
}: {
  type?: 'info' | 'tip' | 'warning' | 'success' | 'error' | 'cultural';
  message: string;
}) {
  const config = calloutConfig[type];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded text-sm',
        config.bgColor,
        config.borderColor,
        'border'
      )}
    >
      <span className={clsx(config.iconColor)}>
        {defaultIcons[type]}
      </span>
      <span className="text-zinc-700 dark:text-zinc-300">{message}</span>
    </span>
  );
}
