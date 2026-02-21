'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      router.push('/lessons');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push('/lessons');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lora:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        .sh-root{
          min-height:100vh;
          background:radial-gradient(ellipse at 20% 0%,#2a1505 0%,#0e0804 60%),
                      radial-gradient(ellipse at 80% 100%,#12060e 0%,transparent 50%);
          position:relative;overflow-x:hidden;
        }
        .sh-root::before{
          content:'';position:fixed;inset:0;
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(200,169,110,0.025) 60px,rgba(200,169,110,0.025) 61px),
            repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(200,169,110,0.025) 60px,rgba(200,169,110,0.025) 61px);
          pointer-events:none;z-index:0;
        }
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
        .sh-input{
          border-radius:14px;
          padding:16px 18px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(200,169,110,0.2);
          color:#f0e6d0;
          font-family:'Lora',serif;
          font-size:15px;
          outline:none;
          transition:border-color 0.2s,box-shadow 0.2s;
          width:100%;
        }
        .sh-input:focus{
          border-color:#c8a96e;
          box-shadow:0 0 0 3px rgba(200,169,110,0.15);
        }
        .sh-input::placeholder{color:#5a4a3e}
        .sh-btn-primary{
          width:100%;
          padding:16px;
          border-radius:14px;
          background:#c8a96e;
          border:none;
          color:#0e0804;
          font-family:'DM Mono',monospace;
          font-size:14px;
          font-weight:500;
          letter-spacing:0.05em;
          cursor:pointer;
          transition:all 0.2s;
        }
        .sh-btn-primary:hover:not(:disabled){
          background:#d4b87a;
          transform:translateY(-2px);
        }
        .sh-btn-primary:disabled{
          opacity:0.6;
          cursor:not-allowed;
        }
        .sh-btn-secondary{
          width:100%;
          padding:16px;
          border-radius:14px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(200,169,110,0.2);
          color:#f0e6d0;
          font-family:'DM Mono',monospace;
          font-size:14px;
          font-weight:500;
          letter-spacing:0.05em;
          cursor:pointer;
          transition:all 0.2s;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
        }
        .sh-btn-secondary:hover:not(:disabled){
          background:rgba(255,255,255,0.08);
          border-color:#c8a96e;
        }
        .sh-card{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(200,169,110,0.15);
          border-radius:24px;
          padding:36px;
          animation:fadeUp 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .sh-checkbox{
          width:18px;
          height:18px;
          border-radius:6px;
          border:1px solid rgba(200,169,110,0.3);
          background:rgba(255,255,255,0.04);
          accent-color:#c8a96e;
        }
        .sh-link{
          color:#c8a96e;
          text-decoration:none;
          transition:color 0.2s;
        }
        .sh-link:hover{color:#d4b87a}
      `}</style>

      <div className="sh-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', top: '20%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,110,0.15) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,114,176,0.15) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 6s ease-in-out infinite', animationDelay: '3s' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, background: 'linear-gradient(135deg, #c8a96e 0%, #9b72b0 100%)', borderRadius: 20, marginBottom: 20, boxShadow: '0 12px 40px rgba(200,169,110,0.3)' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 32, fontFamily: "'Playfair Display',serif" }}>د</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 36, color: '#f0e6d0', marginBottom: 8 }}>
              Welcome Back
            </h1>
            <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: '#8a7a6e' }}>
              Sign in to continue your Darija journey
            </p>
          </div>

          <div className="sh-card">
            {error && (
              <div style={{ marginBottom: 24, padding: 16, background: 'rgba(212,132,90,0.15)', border: '1px solid rgba(212,132,90,0.3)', borderRadius: 14, color: '#d4845a', fontFamily: "'Lora',serif", fontSize: 14 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#8a7a6e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <EnvelopeIcon style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, color: '#5a4a3e' }} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sh-input"
                    style={{ paddingLeft: 50 }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#8a7a6e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <LockClosedIcon style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, color: '#5a4a3e' }} />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="sh-input"
                    style={{ paddingLeft: 50 }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" className="sh-checkbox" />
                  <span style={{ marginLeft: 10, fontFamily: "'Lora',serif", fontSize: 14, color: '#6a5a4e' }}>Remember me</span>
                </label>
                <Link href="/forgot-password" className="sh-link" style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="sh-btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ position: 'relative', margin: '24px 0' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', height: 1, background: 'rgba(200,169,110,0.15)' }}></div>
              </div>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <span style={{ padding: '0 16px', background: '#1a120a', color: '#5a4a3e', fontFamily: "'DM Mono',monospace", fontSize: 12 }}>Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="sh-btn-secondary"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
                <path fill="#f0e6d0" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#f0e6d0" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#f0e6d0" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#f0e6d0" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <p style={{ marginTop: 32, textAlign: 'center', fontFamily: "'Lora',serif", fontSize: 14, color: '#6a5a4e' }}>
            Don't have an account?{' '}
            <Link href="/signup" className="sh-link" style={{ fontWeight: 600 }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
