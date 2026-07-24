import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import { DomainType } from '../../types';
import { Briefcase, ChevronDown, Sparkles } from 'lucide-react';

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

export const DomainSelector: React.FC = () => {
  const { selectedDomain, setDomain } = useInterview();

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-950 rounded-2xl p-5 text-white shadow-soft relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Target Specialization</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">Select Your Interview Domain</h3>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            AI customizes technical questions, code challenges, and HR scenarios for your chosen role.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
            <Briefcase className="w-4 h-4" />
          </div>
          <select
            value={selectedDomain}
            onChange={(e) => setDomain(e.target.value as DomainType)}
            className="w-full pl-10 pr-10 py-2.5 bg-white text-slate-900 font-semibold text-sm rounded-xl border border-emerald-300 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent cursor-pointer appearance-none"
          >
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d} value={d} className="text-slate-900 py-1 font-medium">
                {d}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
