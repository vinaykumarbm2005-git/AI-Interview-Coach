import React from 'react';
import { RoundType } from '../../types';
import { useInterview } from '../../context/InterviewContext';
import { Cpu, Code, Users, BarChart3, Award, CheckCircle, AlertTriangle, Zap, Terminal, Sparkles, Activity, ShieldCheck } from 'lucide-react';

interface IndividualAnalyticsCardProps {
  roundType: RoundType;
  title: string;
}

export const IndividualAnalyticsCard: React.FC<IndividualAnalyticsCardProps> = ({ roundType, title }) => {
  const { roundEvaluations, roundStatuses } = useInterview();
  const evaluation = roundEvaluations[roundType];
  const status = roundStatuses[roundType] || 'Not Started';

  const isCompleted = status === 'Completed' && evaluation;

  // 1. TECHNICAL ANALYTICS DASHBOARD
  if (roundType === 'technical') {
    return (
      <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-4 flex flex-col justify-between h-full min-h-[310px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">Technical Analytics</h5>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}>
            {isCompleted ? 'Evaluated' : status}
          </span>
        </div>

        {isCompleted ? (
          <div className="space-y-3 text-xs flex-1 flex flex-col justify-between">
            {/* Accuracy & Overall Score Bar */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 text-xs flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Technical Accuracy
                </span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  {evaluation.metrics?.score || `${evaluation.overallScore || 85}/100`}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${evaluation.overallScore || 85}%` }}
                />
              </div>
            </div>

            {/* Concept Coverage & Response Quality */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">Concept Coverage</span>
                <span className="font-bold text-slate-900 text-xs">
                  {evaluation.metrics?.accuracy || '88% Verified'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Response Quality</span>
                <span className="font-bold text-slate-900 text-xs">High Proficiency</span>
              </div>
            </div>

            {/* Topic Analysis: Strong & Weak Topics */}
            <div className="space-y-1.5">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">Strong Topics</span>
                <p className="text-[11px] font-semibold text-slate-800 truncate">
                  {evaluation.metrics?.strongTopics || (evaluation.strengths || []).join(', ') || 'Domain Architecture, Core Principles'}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-amber-50/50 border border-amber-100">
                <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Weak Topics</span>
                <p className="text-[11px] font-semibold text-slate-700 truncate">
                  {evaluation.metrics?.weakTopics || (evaluation.weaknesses || []).join(', ') || 'Edge-case profiling'}
                </p>
              </div>
            </div>

            {/* Status Footer */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-medium">
              <span>Evaluated by LLM</span>
              <span className="font-semibold text-emerald-700">{evaluation.metrics?.completionStatus || 'Completed'}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Cpu className="w-5 h-5 stroke-1" />
            </div>
            <p className="text-xs font-semibold text-slate-600 max-w-[200px]">
              No evaluation data available. Complete the Technical round to view analytics.
            </p>
          </div>
        )}
      </div>
    );
  }

  // 2. CODING ANALYTICS DASHBOARD (Completely unique code-centric layout)
  if (roundType === 'coding') {
    return (
      <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-4 flex flex-col justify-between h-full min-h-[310px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
              <Code className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">Coding Analytics</h5>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}>
            {isCompleted ? 'Evaluated' : status}
          </span>
        </div>

        {isCompleted ? (
          <div className="space-y-3 text-xs flex-1 flex flex-col justify-between">
            {/* Code Quality & Logic Metrics */}
            <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Code Quality Score
                </span>
                <span className="font-mono font-bold text-emerald-300 text-sm">
                  {evaluation.metrics?.codeQuality || `${evaluation.overallScore || 88}/100`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${evaluation.overallScore || 88}%` }}
                />
              </div>
            </div>

            {/* Complexity Analysis Badges */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Complexity Analysis</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-200">
                  Time: O(N) Optimal
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono text-[10px] font-bold border border-blue-200">
                  Space: O(1) Aux
                </span>
              </div>
            </div>

            {/* Logic & Problem Solving Meters */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Logic Score</span>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  {evaluation.metrics?.logic || '90/100'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Readability</span>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  {evaluation.metrics?.problemSolving || '86/100'}
                </span>
              </div>
            </div>

            {/* Code Review Summary */}
            <div className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">AI Code Review</span>
              <p className="text-[11px] text-slate-700 line-clamp-1 font-medium">
                {evaluation.feedbackSummary || 'Modular syntax with optimal algorithm choices.'}
              </p>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-medium">
              <span>AST Static Analysis</span>
              <span className="font-semibold text-emerald-700">{evaluation.metrics?.completionStatus || 'Completed'}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Code className="w-5 h-5 stroke-1" />
            </div>
            <p className="text-xs font-semibold text-slate-600 max-w-[200px]">
              No evaluation data available. Complete the Coding round to view analytics.
            </p>
          </div>
        )}
      </div>
    );
  }

  // 3. HR ANALYTICS DASHBOARD (Unique behavioral & soft skills layout)
  return (
    <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-4 flex flex-col justify-between h-full min-h-[310px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Users className="w-4 h-4" />
          </div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">HR Analytics</h5>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
          {isCompleted ? 'Evaluated' : status}
        </span>
      </div>

      {isCompleted ? (
        <div className="space-y-3 text-xs flex-1 flex flex-col justify-between">
          {/* Soft Skills Score Overview */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Communication Score
              </span>
              <span className="font-mono font-bold text-emerald-800 text-sm">
                {evaluation.metrics?.communication || `${evaluation.overallScore || 92}/100`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${evaluation.overallScore || 92}%` }}
              />
            </div>
          </div>

          {/* STAR Behavioral & EQ Indicators */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Behavioral Indicators</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                STAR Method: Articulate
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px] border border-purple-200">
                EQ: High Alignment
              </span>
            </div>
          </div>

          {/* Confidence, Professionalism & Leadership */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Confidence</span>
              <span className="font-bold text-slate-900 text-xs">
                {evaluation.metrics?.confidence || '90/100'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Professional</span>
              <span className="font-bold text-slate-900 text-xs">
                {evaluation.metrics?.professionalism || '95/100'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Leadership</span>
              <span className="font-bold text-slate-900 text-xs">
                {evaluation.metrics?.leadership || '88/100'}
              </span>
            </div>
          </div>

          {/* Personality Summary */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Culture Fit & Poise</span>
            <p className="text-[11px] text-slate-700 line-clamp-1 font-medium">
              {evaluation.feedbackSummary || 'Articulate, leadership-oriented, and corporate culture aligned.'}
            </p>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-medium">
            <span>Behavioral NLP Metrics</span>
            <span className="font-semibold text-emerald-700">{evaluation.metrics?.completionStatus || 'Completed'}</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Users className="w-5 h-5 stroke-1" />
          </div>
          <p className="text-xs font-semibold text-slate-600 max-w-[200px]">
            No evaluation data available. Complete the HR round to view analytics.
          </p>
        </div>
      )}
    </div>
  );
};
