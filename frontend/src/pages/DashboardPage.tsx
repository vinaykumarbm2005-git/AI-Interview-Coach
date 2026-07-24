import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { StudentProfileCard } from '../components/dashboard/StudentProfileCard';
import { DomainSelector } from '../components/dashboard/DomainSelector';
import { RoundCard } from '../components/dashboard/RoundCard';
import { IndividualAnalyticsCard } from '../components/dashboard/IndividualAnalyticsCard';
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

          {/* MIDDLE COLUMN: Domain Selector + 3 Round Cards + 3 Analytics Cards (53%) */}
          <div className="w-full lg:w-[53%] flex flex-col space-y-5 flex-1 min-w-0">
            
            {/* Domain Selection Dropdown */}
            <DomainSelector />

            {/* 3 Round Cards side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <RoundCard
                roundType="technical"
                title="Technical Round"
                questionCount={15}
                timeLimitMinutes={30}
                onStart={() => onStartRound('technical')}
              />

              <RoundCard
                roundType="coding"
                title="Coding Round"
                questionCount={7}
                timeLimitMinutes={25}
                onStart={() => onStartRound('coding')}
              />

              <RoundCard
                roundType="hr"
                title="HR Round"
                questionCount={10}
                timeLimitMinutes={30}
                onStart={() => onStartRound('hr')}
              />
            </div>

            {/* Individual Analytics Dashboards side-by-side in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              <IndividualAnalyticsCard
                roundType="technical"
                title="Technical"
              />

              <IndividualAnalyticsCard
                roundType="coding"
                title="Coding"
              />

              <IndividualAnalyticsCard
                roundType="hr"
                title="HR"
              />
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
