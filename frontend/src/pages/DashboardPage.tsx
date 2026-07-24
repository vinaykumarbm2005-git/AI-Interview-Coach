import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { StudentProfileCard } from '../components/dashboard/StudentProfileCard';
import { DomainSelector } from '../components/dashboard/DomainSelector';
import { RoundCard } from '../components/dashboard/RoundCard';
import { AnalyticsSummarySection } from '../components/dashboard/AnalyticsSummarySection';
import { AIReportPanel } from '../components/dashboard/AIReportPanel';
import { RoundType } from '../types';

interface DashboardPageProps {
  onStartRound: (roundType: RoundType) => void;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onStartRound, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Container: Full-Screen Responsive 3-Column Layout */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col">
        <main className="flex flex-col lg:flex-row gap-5 items-stretch flex-1">
          
          {/* LEFT COLUMN: Student Profile Card (22%) */}
          <div className="w-full lg:w-[22%] flex flex-col shrink-0">
            <StudentProfileCard />
          </div>

          {/* MIDDLE COLUMN: Domain Selector + 3 Round Start Cards + Analytics Summary Section (53%) */}
          <div className="w-full lg:w-[53%] flex flex-col space-y-5 flex-1 min-w-0">
            
            {/* Domain Selection Dropdown */}
            <DomainSelector />

            {/* 3 Round Start Cards side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <RoundCard
                roundType="technical"
                title="Technical Round"
                timeLimitMinutes={30}
                onStart={() => onStartRound('technical')}
              />

              <RoundCard
                roundType="coding"
                title="Coding Round"
                timeLimitMinutes={25}
                onStart={() => onStartRound('coding')}
              />

              <RoundCard
                roundType="hr"
                title="HR Round"
                timeLimitMinutes={30}
                onStart={() => onStartRound('hr')}
              />
            </div>

            {/* ANALYTICS SUMMARY SECTION (Top Row: 3 Total Score Cards | Bottom Row: Confidence Meter, Accuracy, Overall %) */}
            <div className="flex-1">
              <AnalyticsSummarySection />
            </div>
          </div>

          {/* RIGHT COLUMN: AI Feedback Report Panel (25%) */}
          <div className="w-full lg:w-[25%] flex flex-col shrink-0 h-full min-w-0">
            <AIReportPanel />
          </div>

        </main>
      </div>

    </div>
  );
};
