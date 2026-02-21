'use client';

import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  label?: string;
  title: string;
  subtitle?: string;
}

export default function PageLayout({ children, label, title, subtitle }: PageLayoutProps) {
  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(ellipse at 20% 0%, #2a1505 0%, #0e0804 60%), radial-gradient(ellipse at 80% 100%, #12060e 0%, transparent 50%)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Grid pattern overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(200,169,110,0.025) 60px, rgba(200,169,110,0.025) 61px),
          repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(200,169,110,0.025) 60px, rgba(200,169,110,0.025) 61px)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(16px,4vw,40px) 60px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        {label && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,transparent,#7a5e32)', maxWidth: 60 }} />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.3em', color: '#8a6a4a', textTransform: 'uppercase' }}>
              {label}
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left,transparent,#7a5e32)', maxWidth: 60 }} />
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 style={{ 
            fontFamily: "'Playfair Display',serif", 
            fontSize: 'clamp(38px,7vw,68px)', 
            fontWeight: 900, 
            color: '#f0e6d0', 
            lineHeight: 1.05, 
            letterSpacing: '-0.03em', 
            marginBottom: 14 
          }}>
            {title}
          </h1>
          
          {subtitle && (
            <p style={{ 
              fontFamily: "'Lora',serif", 
              fontStyle: 'italic', 
              fontSize: 'clamp(15px,2.5vw,19px)', 
              color: '#8a7a6e', 
              maxWidth: 520, 
              margin: '0 auto 28px' 
            }}>
              {subtitle}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to right,transparent,#c8a96e)' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8a96e' }} />
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to left,transparent,#c8a96e)' }} />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

// Card component for consistent styling
interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  onClick?: () => void;
}

export function PageCard({ children, className = '', style, href, onClick }: CardProps) {
  const cardStyle: React.CSSProperties = {
    display: 'block',
    borderRadius: 18,
    padding: '28px 24px',
    textDecoration: 'none',
    transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s',
    position: 'relative',
    overflow: 'hidden',
    background: 'rgba(26, 21, 8, 0.6)',
    border: '1px solid rgba(200, 169, 110, 0.2)',
    ...style
  };

  const content = (
    <>
      {/* Glow blob */}
      <div style={{
        position: 'absolute',
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: '#c8a96e',
        opacity: 0.06,
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />
      {children}
    </>
  );

  if (href) {
    return (
      <a 
        href={href} 
        className={className}
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.015)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <div 
        className={className}
        style={{ ...cardStyle, cursor: 'pointer' }}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.015)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={className} style={cardStyle}>
      {content}
    </div>
  );
}

// Badge component
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

export function PageBadge({ children, variant = 'default' }: BadgeProps) {
  const colors = {
    default: { bg: 'rgba(200,169,110,0.15)', color: '#c8a96e', border: 'rgba(200,169,110,0.3)' },
    success: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
    warning: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' }
  };
  const c = colors[variant];
  
  return (
    <span style={{
      fontFamily: "'DM Mono',monospace",
      fontSize: 9,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      padding: '3px 8px',
      borderRadius: 100,
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

// Simple button
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function PageButton({ children, variant = 'primary', href, onClick, className = '' }: ButtonProps) {
  const styles: React.CSSProperties = {
    fontFamily: "'DM Mono',monospace",
    fontSize: 12,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '12px 24px',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    border: 'none',
  };

  const variants = {
    primary: {
      background: 'rgba(200,169,110,0.15)',
      color: '#c8a96e',
      border: '1px solid rgba(200,169,110,0.4)'
    },
    secondary: {
      background: 'rgba(255,255,255,0.05)',
      color: '#f0e6d0',
      border: '1px solid rgba(255,255,255,0.1)'
    },
    outline: {
      background: 'transparent',
      color: '#c8a96e',
      border: '1px solid rgba(200,169,110,0.4)'
    }
  };

  const style = { ...styles, ...variants[variant] };

  if (href) {
    return (
      <a href={href} className={className} style={style}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = variant === 'primary' ? 'rgba(200,169,110,0.25)' : 'rgba(255,255,255,0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = variants[variant].background;
          e.currentTarget.style.transform = '';
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className} style={style}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = variant === 'primary' ? 'rgba(200,169,110,0.25)' : 'rgba(255,255,255,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variants[variant].background;
        e.currentTarget.style.transform = '';
      }}
    >
      {children}
    </button>
  );
}
