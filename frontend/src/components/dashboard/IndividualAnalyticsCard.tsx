import React from 'react';
import { RoundType } from '../../types';
import { useInterview } from '../../context/InterviewContext';
import { BarChart3, Cpu, Code, Users } from 'lucide-react';

interface IndividualAnalyticsCardProps {
  roundType: RoundType;
  title: string;
}

export const IndividualAnalyticsCard: React.FC<IndividualAnalyticsCardProps> = ({ roundType, title }) => {
  const { roundEvaluations, roundStatuses } = useInterview();
  const evaluation = roundEvaluations[roundType];
  const status = roundStatuses[roundType] || 'Not Started';

  const getHeaderIcon = () => {
    switch (roundType) {
      case 'technical': return <Cpu className="w-4 h-4 text-emerald-600" />;
      case 'coding': return <Code className="w-4 h-4 text-emerald-600" />;
      case 'hr': return <Users className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-4 flex flex-col justify-between h-full min-h-[250px]">
      <div className="flex flex-col h-full justify-between">
        {/* Title Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            {getHeaderIcon()}
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">{title} Analytics</h5>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
          }`}>
            {status}
          </span>
        </div>

        {/* If Completed / Evaluated -> Render Metrics */}
        {status === 'Completed' && evaluation ? (
          <div className="space-y-2.5 text-xs flex-1">
            {roundType === 'technical' && (
              <>
                <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <span className="text-slate-600 font-medium">Technical Score</span>
                  <span className="font-bold text-emerald-800">{evaluation.metrics.score || '85/100'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Accuracy</span>
                  <span className="font-bold text-slate-800">{evaluation.metrics.accuracy || '88%'}</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Strong Topics</span>
                  <span className="font-semibold text-slate-800 line-clamp-1">{evaluation.metrics.strongTopics}</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Weak Topics</span>
                  <span className="font-semibold text-slate-700 line-clamp-1">{evaluation.metrics.weakTopics}</span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-emerald-700">{evaluation.metrics.completionStatus}</span>
                </div>
              </>
            )}

            {roundType === 'coding' && (
              <>
                <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <span className="text-slate-600 font-medium">Code Quality</span>
                  <span className="font-bold text-emerald-800">{evaluation.metrics.codeQuality || '88/100'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Logic</span>
                  <span className="font-bold text-slate-800">{evaluation.metrics.logic || '92/100'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Problem Solving</span>
                  <span className="font-bold text-slate-800">{evaluation.metrics.problemSolving || '86/100'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Time Management</span>
                  <span className="font-bold text-slate-800">{evaluation.metrics.timeManagement || '85/100'}</span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-emerald-700">{evaluation.metrics.completionStatus}</span>
                </div>
              </>
            )}

            {roundType === 'hr' && (
              <>
                <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <span className="text-slate-600 font-medium">Communication</span>
                  <span className="font-bold text-emerald-800">{evaluation.metrics.communication || '94/100'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Confidence</span>
                  <span className="font-bold text-slate-800">{evaluation.metrics.confidence || '90/100'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Professionalism</span>
                  <span className="font-bold text-slate-800">{evaluation.metrics.professionalism || '95/100'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Leadership</span>
                  <span className="font-bold text-slate-800">{evaluation.metrics.leadership || '88/100'}</span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-emerald-700">{evaluation.metrics.completionStatus}</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-400 space-y-2">
            <BarChart3 className="w-8 h-8 mx-auto stroke-1 opacity-50 text-slate-400" />
            <p className="text-xs font-medium text-slate-500">
              {status === 'In Progress' ? 'Assessment in progress...' : 'Complete round to unlock analytics'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
