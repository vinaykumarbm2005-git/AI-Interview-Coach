import React, { useState, useEffect } from 'react';
import { Target, Sparkles, ShieldCheck, ArrowRight, Lock, Mail, User as UserIcon, Cpu, Code, Users, BarChart3, FileText, CheckCircle2 } from 'lucide-react';
import { supabase, ensureUserProfile } from '../lib/supabase';

interface LandingPageProps {
  onLoginSuccess: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status State
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check initial session on mount - automatically redirect to dashboard if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        onLoginSuccess();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        onLoginSuccess();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onLoginSuccess]);

  const formatAuthError = (errMessage: string): string => {
    const msg = errMessage.toLowerCase();
    if (msg.includes('user already registered') || msg.includes('already exists') || msg.includes('unique constraint')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
      return 'Incorrect email or password. Please check your credentials and try again.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Please verify your email address before signing in.';
    }
    if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
      return 'Please enter a valid email address.';
    }
    if (msg.includes('password should be at least')) {
      return 'Password must be at least 8 characters long.';
    }
    if (msg.includes('failed to fetch') || msg.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    return errMessage;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in your email and password.');
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    setLoading(false);

    if (authError) {
      setError(formatAuthError(authError.message));
    } else if (data.session) {
      await ensureUserProfile(data.session.user);
      onLoginSuccess();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password must match.');
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          full_name: fullName.trim()
        }
      }
    });

    setLoading(false);

    if (signUpError) {
      setError(formatAuthError(signUpError.message));
      return;
    }

    if (data.user) {
      await ensureUserProfile(data.user, fullName.trim());

      if (data.session) {
        // Confirmation disabled in Supabase -> auto-login
        onLoginSuccess();
      } else {
        // Email confirmation required in Supabase
        setSuccessMessage('Registration successful. Please verify your email before signing in.');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMessage('');
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (authError) {
      setError(formatAuthError(authError.message));
    }
  };

  const featureTags = [
    { label: 'AI Interview Coach', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: 'Technical Assessment', icon: <Cpu className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: 'Coding Challenge', icon: <Code className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: 'HR Interview', icon: <Users className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: 'Performance Analytics', icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: 'AI Feedback Report', icon: <FileText className="w-3.5 h-3.5 text-emerald-600" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">

      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">AI Interview Coach</span>
            <span className="text-xs ml-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              AI Platform
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Placement Drive Ready</span>
        </div>
      </nav>

      {/* Main SaaS Hero & Split Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* LEFT SECTION */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Next-Gen Placement Preparation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Your Career Starts With{' '}
            <span
              className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Smart AI Interview Practice.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium">
            Prepare for Technical Interviews, Coding Challenges and HR Interviews using AI-generated questions, AI evaluation, professional analytics and personalized feedback.
          </p>

          {/* Feature Tags */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Capabilities</h4>
            <div className="flex flex-wrap gap-2.5">
              {featureTags.map((tag) => (
                <div
                  key={tag.label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 text-xs font-bold shadow-soft hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-default"
                >
                  {tag.icon}
                  <span>{tag.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Professional Login / Register Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white border border-slate-200/90 shadow-soft-lg rounded-3xl p-8 relative overflow-hidden">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 to-green-500" />

            <div className="text-center mb-5">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {authMode === 'signin' ? 'Student Sign In' : 'Create Student Account'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {authMode === 'signin'
                  ? 'Access your AI Interview Assessment Portal'
                  : 'Join the AI Placement Preparation Platform'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/60">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Register
              </button>
            </div>

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {authMode === 'signin' ? (
              /* SIGN IN FORM */
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Submit Sign In */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 mt-2"
                >
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password (Min 8 characters)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 mt-2"
                >
                  <span>{loading ? 'Registering...' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">Or</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl shadow-sm hover:border-slate-300 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-200/80 text-center text-xs text-slate-500 font-medium">
        AI Interview Coach Platform • Placement & Career Readiness Cell
      </footer>

    </div>
  );
};
