import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import { downloadPDFReport } from '../../services/pdfService';
import { Download, Sparkles, Award, FileText, Cpu, Code, Users, AlertCircle } from 'lucide-react';

export const AIReportPanel: React.FC = () => {
  const { aiReport, isEvaluating, student, selectedDomain } = useInterview();

  const activeRounds = aiReport?.completedRounds || [];
  const hasCompletedRounds = activeRounds.length > 0;
  const hasSufficientResponses = Boolean(aiReport?.hasSufficientResponses);

  const handleDownload = () => {
    if (!aiReport || !hasCompletedRounds || !hasSufficientResponses) return;
    downloadPDFReport(aiReport, student, selectedDomain);
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-5 flex flex-col h-full relative overflow-hidden">
      {/* Top Banner Header - Fixed at Top */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">AI Feedback Report</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time Evaluation ({selectedDomain})</p>
          </div>
        </div>

        {/* Download Report Button */}
        <button
          onClick={handleDownload}
          disabled={!hasCompletedRounds || !hasSufficientResponses || isEvaluating}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer disabled:cursor-not-allowed shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </button>
      </div>

      {/* Loading state */}
      {isEvaluating && (
        <div className="py-16 text-center space-y-3 flex-1 flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-emerald-800">Evaluating answered responses with AI...</p>
          <p className="text-[11px] text-slate-400">Synthesizing candidate evaluations for completed round(s)</p>
        </div>
      )}

      {/* 1. NO INTERVIEW COMPLETED STATE */}
      {!isEvaluating && !hasCompletedRounds && (
        <div className="py-16 px-4 text-center space-y-3 flex-1 flex flex-col justify-center items-center my-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner mb-1">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No interview completed yet.</h4>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
            Complete at least one interview round to receive your personalized AI evaluation and performance report.
          </p>
        </div>
      )}

      {/* 2. EDGE CASE: ALL QUESTIONS SKIPPED (0 Answered) */}
      {!isEvaluating && hasCompletedRounds && aiReport && !hasSufficientResponses && (
        <div className="py-12 px-4 text-center space-y-3 flex-1 flex flex-col justify-center items-center my-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner mb-1">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-amber-900">No sufficient responses available for AI evaluation.</h4>
          <p className="text-xs text-amber-800 max-w-xs leading-relaxed font-medium">
            You skipped all interview questions. Please answer at least one question to receive AI analysis and performance report.
          </p>
        </div>
      )}

      {/* 3. COMPLETED ROUNDS REPORT CONTENT (WITH ANSWERED RESPONSES) */}
      {!isEvaluating && hasCompletedRounds && aiReport && hasSufficientResponses && (
        <div className="flex-1 overflow-y-auto pr-2 space-y-5 text-xs text-slate-700 leading-relaxed min-h-0">

          {/* Certification & Response Breakdown Badge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="font-bold text-emerald-900 text-xs block">AI Evaluation Certified</span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Evaluated {activeRounds.map(r => r.toUpperCase()).join(' + ')} Round(s) • {aiReport.totalWordCount} words
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                {activeRounds.length === 3 ? 'Complete' : 'Partial'}
              </span>
            </div>

            {/* Answered vs Skipped Breakdown Banner */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span className="text-emerald-800">Answered: <strong>{aiReport.answeredCount}</strong></span>
              <span className="text-amber-800">Skipped: <strong>{aiReport.skippedCount}</strong></span>
              <span className="text-slate-500 text-[10px]">Based on {aiReport.answeredCount} answered responses</span>
            </div>
          </div>

          {/* Overall Summary */}
          {aiReport.overallSummary && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                <span>📌</span> Interview Summary
              </h4>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800 whitespace-pre-line">{aiReport.overallSummary}</p>
            </div>
          )}

          {/* TECHNICAL ROUND SECTION (ONLY rendered if Technical was completed & answered) */}
          {activeRounds.includes('technical') && aiReport.technicalSummary && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Technical Round Analysis</span>
                </h4>
                {aiReport.technicalScore && (
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200">
                    Score: {aiReport.technicalScore}/100
                  </span>
                )}
              </div>

              {aiReport.technicalSummary && (
                <p className="text-slate-800 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.technicalSummary}</p>
              )}

              {aiReport.technicalStrengths && (
                <div className="space-y-1">
                  <h5 className="font-bold text-emerald-800 text-[11px]">Technical Strengths:</h5>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.technicalStrengths}</p>
                </div>
              )}

              {aiReport.technicalWeaknesses && (
                <div className="space-y-1">
                  <h5 className="font-bold text-amber-800 text-[11px]">Technical Weaknesses:</h5>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.technicalWeaknesses}</p>
                </div>
              )}

              {aiReport.technicalRecommendations && (
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800 text-[11px]">Technical Recommendations:</h5>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.technicalRecommendations}</p>
                </div>
              )}
            </div>
          )}

          {/* CODING ROUND SECTION (ONLY rendered if Coding was completed & answered) */}
          {activeRounds.includes('coding') && aiReport.codingSummary && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                  <Code className="w-4 h-4 text-emerald-600" />
                  <span>Coding Round Analysis</span>
                </h4>
                {aiReport.codingScore && (
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200">
                    Score: {aiReport.codingScore}/100
                  </span>
                )}
              </div>

              {aiReport.codingSummary && (
                <p className="text-slate-800 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.codingSummary}</p>
              )}

              {aiReport.codingStrengths && (
                <div className="space-y-1">
                  <h5 className="font-bold text-emerald-800 text-[11px]">Coding Strengths & Quality:</h5>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.codingStrengths}</p>
                </div>
              )}

              {aiReport.codingWeaknesses && (
                <div className="space-y-1">
                  <h5 className="font-bold text-amber-800 text-[11px]">Coding Weaknesses & Complexity:</h5>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.codingWeaknesses}</p>
                </div>
              )}

              {aiReport.codingRecommendations && (
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800 text-[11px]">Coding Recommendations:</h5>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.codingRecommendations}</p>
                </div>
              )}
            </div>
          )}

          {/* HR ROUND SECTION (ONLY rendered if HR was completed & answered) */}
          {activeRounds.includes('hr') && aiReport.hrSummary && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>HR Round Analysis</span>
                </h4>
                {aiReport.hrScore && (
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200">
                    Score: {aiReport.hrScore}/100
                  </span>
                )}
              </div>

              {aiReport.hrSummary && (
                <p className="text-slate-800 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.hrSummary}</p>
              )}

              {aiReport.hrStrengths && (
                <div className="space-y-1">
                  <h5 className="font-bold text-emerald-800 text-[11px]">HR Strengths & Leadership:</h5>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.hrStrengths}</p>
                </div>
              )}

              {aiReport.hrWeaknesses && (
                <div className="space-y-1">
                  <h5 className="font-bold text-amber-800 text-[11px]">HR Areas to Improve:</h5>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.hrWeaknesses}</p>
                </div>
              )}

              {aiReport.hrRecommendations && (
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800 text-[11px]">HR Recommendations:</h5>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">{aiReport.hrRecommendations}</p>
                </div>
              )}
            </div>
          )}

          {/* Strong & Weak Areas Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiReport.strongAreas && (
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <h5 className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                  <span>🎯</span> Key Strengths
                </h5>
                <div className="whitespace-pre-line text-slate-700">{aiReport.strongAreas}</div>
              </div>
            )}

            {aiReport.weakAreas && (
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                <h5 className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                  <span>⚠️</span> Identified Weaknesses
                </h5>
                <div className="whitespace-pre-line text-slate-700">{aiReport.weakAreas}</div>
              </div>
            )}
          </div>

          {/* Areas for Improvement */}
          {aiReport.areasForImprovement && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                <span>📈</span> Areas for Improvement
              </h4>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800">{aiReport.areasForImprovement}</p>
            </div>
          )}

          {/* Recommended Topics */}
          {aiReport.recommendedTopics && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                <span>📚</span> Recommended Topics
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800 whitespace-pre-line">
                {aiReport.recommendedTopics}
              </div>
            </div>
          )}

          {/* Learning Roadmap */}
          {aiReport.learningRoadmap && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                <span>🗺️</span> Learning Roadmap
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800 whitespace-pre-line">
                {aiReport.learningRoadmap}
              </div>
            </div>
          )}

          {/* Hiring Readiness */}
          {aiReport.hiringReadiness && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-green-950 text-white shadow-sm space-y-1">
              <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <span>🏆</span> Hiring Readiness Recommendation
              </h5>
              <p className="text-xs text-emerald-50 leading-relaxed">{aiReport.hiringReadiness}</p>
            </div>
          )}

          {/* Professional Conclusion */}
          {aiReport.conclusion && (
            <div className="space-y-1.5 pt-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                <span>✨</span> Professional Conclusion
              </h4>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800 italic">{aiReport.conclusion}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
