import React from 'react';
import { Target, Sparkles, LogOut, RefreshCw, Briefcase, ChevronDown } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import { DomainType } from '../../types';

interface NavbarProps {
  onNavigateHome?: () => void;
}

const DOMAIN_OPTIONS: DomainType[] = [
  'AI Engineer',
  'Machine Learning Engineer',
  'Software Engineer',
  'Python Developer',
  'Java Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Cloud Engineer',
  'Cyber Security',
  'Data Analyst',
  'Data Scientist'
];

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
  const { student, isAuthenticated, logout, selectedDomain, setDomain, resetSession } = useInterview();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm w-full">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">AI Interview Coach</span>
              <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">AI Platform</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Placement & Career Readiness</p>
          </div>
        </div>

        {/* Center: Domain Selector (Desktop/Tablet) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-500 shrink-0">Target Domain:</span>
            <div className="relative flex items-center">
              <select
                value={selectedDomain}
                onChange={(e) => setDomain(e.target.value as DomainType)}
                className="bg-transparent text-emerald-800 font-extrabold text-xs pr-5 focus:outline-none cursor-pointer appearance-none"
              >
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d} value={d} className="text-slate-900 font-medium">
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-600 absolute right-0 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Right Info & Actions */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={resetSession}
              title="Reset Assessment Session"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200 hover:border-emerald-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <img
                src={student.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"}
                alt={student.name}
                className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover shadow-sm"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{student.name}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{student.usn}</p>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Campus Placement Edition
            </span>
          </div>
        )}

      </div>
    </header>
  );
};
