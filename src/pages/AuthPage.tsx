/**
 * AuthPage - Luxury Editorial Sign-In
 * Firebase Auth: Email/Password + Google Sign-In
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col lg:flex-row">
      {/* Left Decoration - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A1A1A] relative items-center justify-center overflow-hidden border-r border-[#1A1A1A]">
        {/* Decorative corner text */}
        <div className="absolute top-12 right-12 text-right">
          <div className="font-sans text-[10px] font-medium text-[#F9F8F6]/30 uppercase tracking-[0.4em] mb-1">Vol. 01</div>
          <div className="font-serif text-sm italic text-[#F9F8F6]/50">Editorial Access</div>
        </div>

        <div className="relative z-10 p-16 max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="DammyLive" className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl text-[#F9F8F6] tracking-tight leading-none">
                Dammy<em className="text-[#D4AF37]">Live</em>
              </span>
              <span className="font-sans text-[7px] font-medium uppercase tracking-[0.4em] text-[#F9F8F6]/40">
                Editorial · 2026
              </span>
            </div>
          </div>

          <div className="w-12 h-px bg-[#D4AF37] mb-10" />
          <h1 className="font-serif text-5xl xl:text-6xl text-[#F9F8F6] leading-[0.9] tracking-tight mb-8">
            Welcome <br />
            <em className="text-[#D4AF37]">Home</em>
          </h1>
          <p className="font-sans text-base text-[#F9F8F6]/50 leading-relaxed">
            Sign in to access the full editorial experience — real-time telemetry, 
            personalized standings, and curated insights.
          </p>
        </div>

        {/* Large decorative serif text */}
        <div className="absolute -bottom-16 -left-8 font-serif text-[20rem] text-[#F9F8F6]/[0.015] italic select-none pointer-events-none leading-none">
          D
        </div>
      </div>

      {/* Right Content - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 bg-[#F9F8F6] relative min-h-screen lg:min-h-0">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 font-sans text-[10px] font-medium uppercase text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Home
        </button>

        <div className="w-full max-w-md mt-16 sm:mt-0">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <img src="/logo.png" alt="DammyLive" className="w-8 h-8 object-contain" />
            <span className="font-serif text-xl text-[#1A1A1A] tracking-tight">
              Dammy<em className="text-[#D4AF37]">Live</em>
            </span>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                Authentication
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] leading-[0.9]">
              {isLogin ? 'Sign In' : (<>Create <em className="text-[#D4AF37]">Account</em></>)}
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-5 bg-[#8B0000]/5 border border-[#8B0000]/20">
              <AlertCircle className="w-4 h-4 text-[#8B0000] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="font-sans text-sm text-[#8B0000]">{error}</p>
              <button onClick={clearError} className="ml-auto text-[#8B0000]/50 hover:text-[#8B0000] text-xs font-medium">✕</button>
            </div>
          )}

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#F9F8F6] border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all duration-500 mb-8 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#6C6863]" />
            ) : (
              <GoogleLogo className="w-5 h-5" />
            )}
            <span className="font-sans text-sm font-medium text-[#1A1A1A]">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[#1A1A1A]/10" />
            <span className="font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.2em]">Or with email</span>
            <div className="flex-1 h-px bg-[#1A1A1A]/10" />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.25em]">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 focus:border-[#D4AF37] text-sm font-sans text-[#1A1A1A] placeholder:text-[#6C6863]/50 placeholder:font-serif placeholder:italic transition-colors duration-500 outline-none"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.25em]">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 focus:border-[#D4AF37] text-sm font-sans text-[#1A1A1A] placeholder:text-[#6C6863]/50 placeholder:font-serif placeholder:italic transition-colors duration-500 outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.25em]">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 focus:border-[#D4AF37] text-sm font-sans text-[#1A1A1A] placeholder:text-[#6C6863]/50 transition-colors duration-500 outline-none"
                required
                minLength={6}
              />
              {!isLogin && (
                <p className="font-sans text-[9px] text-[#6C6863] uppercase tracking-[0.2em]">Minimum 6 characters</p>
              )}
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="font-sans text-[10px] font-medium text-[#D4AF37] uppercase tracking-[0.2em] hover:text-[#1A1A1A] transition-colors duration-500">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="font-sans text-[10px] font-medium text-[#6C6863] uppercase tracking-[0.2em]">
              {isLogin ? "No account?" : "Already have one?"}
            </span>
            <button
              onClick={switchMode}
              className="font-sans text-[10px] font-medium text-[#D4AF37] uppercase tracking-[0.2em] hover:text-[#1A1A1A] transition-colors duration-500"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
