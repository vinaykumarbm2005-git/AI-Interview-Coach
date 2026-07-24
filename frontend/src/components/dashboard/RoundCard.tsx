import React from 'react';
import { RoundType } from '../../types';
import { Code, Cpu, Users, Clock, HelpCircle, Play, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

interface RoundCardProps {
  roundType: RoundType;
  title: string;
  questionCount: number;
  timeLimitMinutes: number;
  onStart: () => void;
}

export const RoundCard: React.FC<RoundCardProps> = ({
  roundType,
  title,
  questionCount,
  timeLimitMinutes,
  onStart
}) => {
  const { roundStatuses } = useInterview();
  const status = roundStatuses[roundType] || 'Not Started';

  const getIcon = () => {
    switch (roundType) {
      case 'technical':
        return <Cpu className="w-6 h-6 text-emerald-700" />;
      case 'coding':
        return <Code className="w-6 h-6 text-emerald-700" />;
      case 'hr':
        return <Users className="w-6 h-6 text-emerald-700" />;
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case 'Completed':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className={`bg-white border rounded-2xl p-5 shadow-soft transition-all duration-300 relative flex flex-col justify-between h-full ${
      status === 'Completed'
        ? 'border-emerald-300 bg-emerald-50/30' 
        : status === 'In Progress'
        ? 'border-amber-300 bg-amber-50/20'
        : 'border-slate-200/80 hover:border-emerald-400 hover:shadow-soft-lg'
    }`}>
      
      {/* Top Banner & Status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            status === 'Completed' ? 'bg-emerald-100' : status === 'In Progress' ? 'bg-amber-100' : 'bg-slate-100'
          }`}>
            {getIcon()}
          </div>

          {renderStatusBadge()}
        </div>

        <h4 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h4>

        {/* Round Details */}
        <div className="space-y-2 mt-3 mb-5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span><strong className="text-slate-800 font-bold">{questionCount}</strong> Questions</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span><strong className="text-slate-800 font-bold">{timeLimitMinutes}</strong> Minutes</span>
          </div>
        </div>
      </div>

      {/* Start / Continue / Retake CTA Button */}
      <button
        onClick={onStart}
        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm ${
          status === 'Completed'
            ? 'bg-slate-900 hover:bg-slate-800 text-white'
            : status === 'In Progress'
            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-[1.02]'
        }`}
      >
        <span>{status === 'Completed' ? 'Retake Round' : status === 'In Progress' ? 'Continue Round' : 'Start Round'}</span>
        {status === 'Completed' ? <ArrowRight className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
      </button>
    </div>
  );
};
