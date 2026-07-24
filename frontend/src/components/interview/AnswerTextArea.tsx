import React from 'react';
import { PenTool, CheckCircle2 } from 'lucide-react';

interface AnswerTextAreaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const AnswerTextArea: React.FC<AnswerTextAreaProps> = ({
  value,
  onChange,
  placeholder = "Type your detailed descriptive response here. Focus on clear reasoning, technical terminology, and practical examples..."
}) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <PenTool className="w-4 h-4 text-emerald-600" />
            <span>Your Response</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
            <span>Words: <strong className="text-emerald-700">{wordCount}</strong></span>
            <span>Chars: <strong className="text-slate-800">{charCount}</strong></span>
          </div>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-80 p-4 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-sans"
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Auto-saved to session state</span>
        </div>
        <span>AI evaluates depth & structural clarity</span>
      </div>
    </div>
  );
};
