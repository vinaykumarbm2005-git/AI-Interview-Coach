import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { fetchAIQuestions } from '../services/api';
import { Question } from '../types';
import { Timer } from '../components/common/Timer';
import { QuestionDisplay } from '../components/interview/QuestionDisplay';
import { CodeEditor } from '../components/interview/CodeEditor';
import { ThankYouOverlay } from '../components/interview/ThankYouOverlay';
import { ArrowLeft, ArrowRight, CheckCircle2, Code } from 'lucide-react';

interface CodingRoundPageProps {
  onBackToDashboard: () => void;
}

export const CodingRoundPage: React.FC<CodingRoundPageProps> = ({ onBackToDashboard }) => {
  const { selectedDomain, submitRound, saveAnswerLocally, savedAnswers, setRoundStatus } = useInterview();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [codeAnswers, setCodeAnswers] = useState<Record<number, string>>(() => savedAnswers['coding'] || {});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      setRoundStatus('coding', 'In Progress');
      const qList = await fetchAIQuestions(selectedDomain, 'coding', 7);
      if (isMounted) {
        setQuestions(qList);
        setIsLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [selectedDomain]);

  const handleCodeChange = (val: string) => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setCodeAnswers(prev => ({ ...prev, [qId]: val }));
    saveAnswerLocally('coding', qId, val);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowThankYou(true);
    
    await submitRound('coding', questions, codeAnswers);

    setTimeout(() => {
      onBackToDashboard();
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800">Generating AI Coding Challenges for {selectedDomain}...</p>
          <p className="text-xs text-slate-500">Creating 7 domain-specific algorithmic problems & boilerplate code</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {showThankYou && <ThankYouOverlay roundName="Coding Round" />}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Coding Round</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                {selectedDomain}
              </span>
            </div>
          </div>

          <Timer initialMinutes={25} onTimeUp={handleSubmit} />

        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        <div className="h-full">
          {currentQ && (
            <QuestionDisplay
              question={currentQ}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              domain={selectedDomain}
            />
          )}
        </div>

        <div className="h-full flex flex-col justify-between space-y-4">
          <div className="flex-1 min-h-[420px]">
            <CodeEditor
              value={codeAnswers[currentQ?.id] || ''}
              onChange={handleCodeChange}
              defaultTemplate={currentQ?.codeTemplate}
            />
          </div>

          <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-4 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Challenge</span>
            </button>

            <div className="text-xs font-semibold text-slate-500">
              Challenge {currentIndex + 1} of {questions.length}
            </div>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Submit Coding Round</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </main>

    </div>
  );
};
