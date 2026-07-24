import React, { useState, useEffect } from 'react';
import { Code2, Play, RefreshCw, Copy, Check, Terminal } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  defaultTemplate?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, defaultTemplate }) => {
  const [language, setLanguage] = useState<'Python' | 'Java' | 'C++' | 'JavaScript'>('Python');
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Default boilerplates per language
  const templates: Record<string, string> = {
    Python: defaultTemplate || "def solution(data):\n    # Write Python code here\n    return result",
    Java: "public class Solution {\n    public static void main(String[] args) {\n        // Write Java code here\n    }\n}",
    'C++': "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write C++ code here\n    return 0;\n}",
    JavaScript: "function solution(data) {\n    // Write JavaScript code here\n    return null;\n}"
  };

  useEffect(() => {
    if (!value || value.trim() === '') {
      onChange(templates[language]);
    }
  }, [language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    onChange(templates[language]);
    setOutput(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Compiling code...");
    setTimeout(() => {
      setIsRunning(false);
      setOutput(`[Execution Success]\nSyntax & Types Check Passed (Language: ${language})\nMemory Usage: 14.2 MB\nRuntime: 12ms\nOutput matched expected test signatures.`);
    }, 1200);
  };

  // Line numbers calculation
  const lines = value ? value.split('\n') : [''];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-soft flex flex-col h-full overflow-hidden text-white font-mono">
      
      {/* Editor Header Bar */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs text-slate-400 font-sans">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">Code Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg font-sans font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="Python">Python 3.10</option>
            <option value="Java">Java 17</option>
            <option value="C++">C++ 20</option>
            <option value="JavaScript">Node.js (ES6)</option>
          </select>

          {/* Action buttons */}
          <button
            onClick={handleCopy}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Reset Code"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-lg shadow transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Text Area with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative min-h-[300px]">
        {/* Line Numbers Column */}
        <div className="w-12 bg-slate-950/60 py-4 text-slate-600 text-right pr-3 select-none text-xs border-r border-slate-800/80 font-mono">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="// Type your code here..."
          spellCheck={false}
          className="flex-1 p-4 bg-transparent text-emerald-400 font-mono text-xs leading-6 resize-none focus:outline-none selection:bg-emerald-900 selection:text-emerald-100"
        />
      </div>

      {/* Execution Output Window */}
      {output && (
        <div className="border-t border-slate-800 bg-slate-950 p-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1.5 text-[11px] font-sans">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Terminal Output</span>
          </div>
          <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};
