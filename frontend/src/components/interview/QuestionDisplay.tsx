import React from 'react';
import { Question } from '../../types';
import { HelpCircle, Tag, AlertCircle, Code, Layers } from 'lucide-react';

interface QuestionDisplayProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  domain: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentIndex,
  totalQuestions,
  domain
}) => {
  return (
    <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-6 h-full flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              #{currentIndex + 1}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Question <strong className="text-slate-900">{currentIndex + 1}</strong> of <strong>{totalQuestions}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {domain}
            </span>
            {question.difficulty && (
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                question.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border border-red-200' :
                question.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {question.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Question Category */}
        {question.category && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Category: <strong className="text-slate-700">{question.category}</strong></span>
          </div>
        )}

        {/* Main Question Text */}
        <div className="prose max-w-none">
          <h3 className="text-base font-bold text-slate-900 leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* Sample Input / Output for Coding Questions */}
        {(question.sampleInput || question.sampleOutput) && (
          <div className="mt-6 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-emerald-600" /> Test Case Specifications
            </h4>
            
            {question.sampleInput && (
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Sample Input:</span>
                <pre className="text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 overflow-x-auto">
                  {question.sampleInput}
                </pre>
              </div>
            )}

            {question.sampleOutput && (
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Sample Output:</span>
                <pre className="text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 overflow-x-auto">
                  {question.sampleOutput}
                </pre>
              </div>
            )}

            {question.constraints && (
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <span className="font-semibold text-slate-700">Constraints:</span> {question.constraints}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Descriptive AI Evaluation. Answers are evaluated on technical depth and reasoning.</span>
      </div>
    </div>
  );
};
