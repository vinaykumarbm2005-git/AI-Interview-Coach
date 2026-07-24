import React, { useState, useEffect } from 'react';
import { InterviewProvider, useInterview } from './context/InterviewContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TechnicalRoundPage } from './pages/TechnicalRoundPage';
import { CodingRoundPage } from './pages/CodingRoundPage';
import { HRRoundPage } from './pages/HRRoundPage';
import { RoundType } from './types';

type PageView = 'landing' | 'dashboard' | 'technical' | 'coding' | 'hr';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, logout } = useInterview();
  const [currentPage, setCurrentPage] = useState<PageView>('landing');

  useEffect(() => {
    if (isAuthenticated && currentPage === 'landing') {
      setCurrentPage('dashboard');
    } else if (!isAuthenticated && currentPage !== 'landing') {
      setCurrentPage('landing');
    }
  }, [isAuthenticated, currentPage]);

  const navigateTo = (page: PageView) => {
    if (!isAuthenticated && page !== 'landing') {
      setCurrentPage('landing');
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartRound = (roundType: RoundType) => {
    if (!isAuthenticated) {
      navigateTo('landing');
      return;
    }
    if (roundType === 'technical') navigateTo('technical');
    else if (roundType === 'coding') navigateTo('coding');
    else if (roundType === 'hr') navigateTo('hr');
  };

  const handleLogout = async () => {
    await logout();
    navigateTo('landing');
  };

  // Protected Routes Enforcer
  if (!isAuthenticated || currentPage === 'landing') {
    return <LandingPage onLoginSuccess={() => navigateTo('dashboard')} />;
  }

  switch (currentPage) {
    case 'dashboard':
      return (
        <DashboardPage
          onStartRound={handleStartRound}
          onLogout={handleLogout}
        />
      );

    case 'technical':
      return <TechnicalRoundPage onBackToDashboard={() => navigateTo('dashboard')} />;

    case 'coding':
      return <CodingRoundPage onBackToDashboard={() => navigateTo('dashboard')} />;

    case 'hr':
      return <HRRoundPage onBackToDashboard={() => navigateTo('dashboard')} />;

    default:
      return <DashboardPage onStartRound={handleStartRound} onLogout={handleLogout} />;
  }
};

export function App() {
  return (
    <InterviewProvider>
      <MainAppContent />
    </InterviewProvider>
  );
}

export default App;
