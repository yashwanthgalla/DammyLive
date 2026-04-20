/**
 * AuthPage - F1 Premium Login Experience
 * Firebase Auth: Email/Password + Google Sign-In
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ChevronRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

/** Inline Google "G" logo SVG */
function GoogleLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, loginWithEmail, signupWithEmail, loginWithGoogle, clearError } = useAuthStore();

  // If already logged in, redirect home
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(name, email, password);
      }
      navigate('/');
    } catch {
      // Error is already set in the store
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      // Only navigate if auth succeeded
      if (useAuthStore.getState().isAuthenticated) {
        navigate('/');
      }
    } catch {
      // Error is already set in the store
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    clearError();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Decoration - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-bg-subtle relative items-center justify-center overflow-hidden border-r border-border">
        <div className="absolute top-0 right-0 p-12 text-right">
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-2">Protocol 77</div>
          <div className="text-sm font-bold text-text-primary uppercase italic">Synchronized Feed</div>
        </div>

        <div className="relative z-10 p-12 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="DammyLive" className="w-12 h-12 object-contain" />
            <div className="flex flex-col -space-y-1">
              <span className="text-3xl font-black italic tracking-tighter text-text-primary uppercase">
                Dammy<span className="text-f1-red">Live</span>
              </span>
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-text-muted">Telemetry Hub // 2026</span>
            </div>
          </div>

          <div className="w-16 h-1 bg-f1-red mb-8" />
          <h1 className="text-5xl xl:text-6xl font-black text-text-primary uppercase italic leading-none tracking-tighter mb-6">
            Redline <span className="text-f1-red">Access</span>
          </h1>
          <p className="text-text-secondary text-base leading-relaxed uppercase font-medium tracking-wide">
            Join the global telemetry network. Get real-time race data, personalized standings, and advanced archive access.
          </p>
        </div>

        <div className="absolute -bottom-16 -left-16 text-[20rem] font-black text-f1-red opacity-[0.03] italic select-none pointer-events-none">
          DRIVE
        </div>
      </div>

      {/* Right Content - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-white relative min-h-screen lg:min-h-0">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-[10px] font-black uppercase text-text-muted hover:text-f1-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="w-full max-w-md mt-12 sm:mt-0">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/logo.png" alt="DammyLive" className="w-8 h-8 object-contain" />
            <span className="text-xl font-black italic tracking-tighter text-text-primary uppercase">
              Dammy<span className="text-f1-red">Live</span>
            </span>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-f1-red text-white text-[10px] font-black uppercase tracking-widest mb-4 rounded-lg">
              Security Portal
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary uppercase italic leading-none tracking-tighter">
              {isLogin ? 'Sign In' : 'Join the Race'}
            </h2>
            <p className="text-text-muted text-xs uppercase font-bold tracking-widest mt-2">
              Authorized Personnel Only
            </p>
          </div>

          {/* ── Error Message ── */}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
              <AlertCircle className="w-5 h-5 text-f1-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-f1-red">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-auto text-f1-red/50 hover:text-f1-red text-xs font-black"
              >
                ✕
              </button>
            </div>
          )}

          {/* ── Google Sign-In Button ── */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 sm:py-4 px-6 bg-white border-2 border-border rounded-xl hover:border-text-primary hover:shadow-md transition-all duration-200 mb-6 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
            ) : (
              <GoogleLogo className="w-5 h-5" />
            )}
            <span className="text-sm font-bold text-text-primary tracking-tight">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-f1-red transition-colors pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="J. DOE"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-border py-3.5 sm:py-4 pr-4 pl-14 rounded-xl focus:outline-none focus:border-f1-red text-sm font-black uppercase italic tracking-wider transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-f1-red transition-colors pointer-events-none z-10" />
                <input
                  type="email"
                  placeholder="EMAIL@EXAMPLE.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-border py-3.5 sm:py-4 pr-4 pl-14 rounded-xl focus:outline-none focus:border-f1-red text-sm font-black uppercase italic tracking-wider transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-f1-red transition-colors pointer-events-none z-10" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-border py-3.5 sm:py-4 pr-4 pl-14 rounded-xl focus:outline-none focus:border-f1-red text-sm font-black transition-all"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider ml-1">Minimum 6 characters</p>
              )}
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-[10px] font-black text-f1-red uppercase tracking-widest hover:underline">Lost Signal?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 sm:py-5 flex items-center justify-center gap-3 transition-transform active:scale-95 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Establish Connection' : 'Register ID'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              {isLogin ? "No Access ID yet?" : "Already Authorized?"}
            </span>
            <button
              onClick={switchMode}
              className="text-[10px] font-black text-f1-red uppercase tracking-widest hover:underline"
            >
              {isLogin ? 'Join Network' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
