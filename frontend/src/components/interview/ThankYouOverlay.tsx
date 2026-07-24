import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface ThankYouOverlayProps {
  roundName: string;
}

export const ThankYouOverlay: React.FC<ThankYouOverlayProps> = ({ roundName }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white border border-emerald-200 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Top ambient green glow */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-600 to-green-500" />

        {/* Animated Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Thank You</h2>
          <p className="text-sm font-semibold text-emerald-800 bg-emerald-50 px-4 py-1 rounded-full inline-block border border-emerald-200">
            {roundName} Submitted Successfully
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-left">
          <div className="flex items-center gap-3 text-sm text-slate-800 font-medium">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            <span>AI is evaluating your performance...</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your responses are being processed through domain-aware LLM prompts to analyze technical depth, algorithmic efficiency, and behavioral structure.
          </p>
        </div>

        <div className="pt-2 text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5">
          <span>Automatically returning to Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
        </div>
      </motion.div>
    </motion.div>
  );
};
