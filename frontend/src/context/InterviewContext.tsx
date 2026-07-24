import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, DomainType, RoundType, RoundStatus, Question, RoundEvaluation, AIReportData } from '../types';
import { fetchAIQuestions, evaluateAIRound, generateAIReport } from '../services/api';
import { supabase, ensureUserProfile } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface InterviewContextType {
  student: StudentProfile;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  selectedDomain: DomainType;
  roundStatuses: Record<RoundType, RoundStatus>;
  roundEvaluations: {
    technical?: RoundEvaluation;
    coding?: RoundEvaluation;
    hr?: RoundEvaluation;
  };
  savedAnswers: Record<string, Record<number, string>>;
  aiReport: AIReportData | null;
  isEvaluating: boolean;
  logout: () => Promise<void>;
  setDomain: (domain: DomainType) => void;
  saveAnswerLocally: (roundType: RoundType, questionId: number, answerText: string) => void;
  setRoundStatus: (roundType: RoundType, status: RoundStatus) => void;
  submitRound: (roundType: RoundType, questions: Question[], answers: Record<number, string>) => Promise<void>;
  resetSession: () => void;
}

const EMPTY_STUDENT: StudentProfile = {
  username: '',
  name: '',
  email: '',
  usn: '',
  branch: '',
  semester: '',
  avatarUrl: ''
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile>(EMPTY_STUDENT);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const [selectedDomain, setSelectedDomain] = useState<DomainType>(() => {
    try {
      return (localStorage.getItem('ai_interview_coach_domain') as DomainType) || 'AI Engineer';
    } catch {
      return 'AI Engineer';
    }
  });

  const [roundStatuses, setRoundStatusesState] = useState<Record<RoundType, RoundStatus>>(() => {
    try {
      const saved = localStorage.getItem('ai_interview_coach_round_statuses');
      return saved ? JSON.parse(saved) : { technical: 'Not Started', coding: 'Not Started', hr: 'Not Started' };
    } catch {
      return { technical: 'Not Started', coding: 'Not Started', hr: 'Not Started' };
    }
  });

  const [savedAnswers, setSavedAnswers] = useState<Record<string, Record<number, string>>>(() => {
    try {
      const saved = localStorage.getItem('ai_interview_coach_saved_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [roundEvaluations, setRoundEvaluations] = useState<{
    technical?: RoundEvaluation;
    coding?: RoundEvaluation;
    hr?: RoundEvaluation;
  }>(() => {
    try {
      const saved = localStorage.getItem('ai_interview_coach_evaluations');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [aiReport, setAiReport] = useState<AIReportData | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleUserSession = async (user: User | null) => {
    if (!user) {
      setIsAuthenticated(false);
      setStudent(EMPTY_STUDENT);
      return;
    }

    setIsAuthenticated(true);

    // Sync user to profiles table if profile doesn't exist yet
    const profile = await ensureUserProfile(user);

    const meta = user.user_metadata || {};
    const email = user.email || profile?.email || '';
    const emailName = email ? email.split('@')[0] : '';
    const name = profile?.full_name || meta.full_name || meta.name || emailName || 'Student';
    const username = emailName || user.id;
    const avatarUrl = profile?.avatar_url || meta.avatar_url || meta.picture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300";
    const usn = meta.usn || '1MS21CS042';
    const branch = meta.branch || 'Computer Science & Engineering';
    const semester = meta.semester || '7th Semester';

    setStudent({
      username,
      name,
      email,
      usn,
      branch,
      semester,
      avatarUrl
    });
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session?.user || null).finally(() => {
        setIsLoadingAuth(false);
      });
    });

    // Realtime auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session?.user || null).finally(() => {
        setIsLoadingAuth(false);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ai_interview_coach_domain', selectedDomain);
      localStorage.setItem('ai_interview_coach_round_statuses', JSON.stringify(roundStatuses));
      localStorage.setItem('ai_interview_coach_evaluations', JSON.stringify(roundEvaluations));
      localStorage.setItem('ai_interview_coach_saved_answers', JSON.stringify(savedAnswers));
    } catch (e) {
      console.warn("Storage sync warning:", e);
    }
    if (student.name) {
      updateReport(selectedDomain, roundEvaluations);
    }
  }, [selectedDomain, student.name]);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setStudent(EMPTY_STUDENT);
  };

  const setDomain = (domain: DomainType) => {
    setSelectedDomain(domain);
  };

  const setRoundStatus = (roundType: RoundType, status: RoundStatus) => {
    setRoundStatusesState(prev => {
      const updated = { ...prev, [roundType]: status };
      try {
        localStorage.setItem('ai_interview_coach_round_statuses', JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
  };

  const saveAnswerLocally = (roundType: RoundType, questionId: number, answerText: string) => {
    setSavedAnswers(prev => {
      const roundAns = prev[roundType] || {};
      const updatedRound = { ...roundAns, [questionId]: answerText };
      const updated = { ...prev, [roundType]: updatedRound };
      try {
        localStorage.setItem('ai_interview_coach_saved_answers', JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
    if (roundStatuses[roundType] === 'Not Started') {
      setRoundStatus(roundType, 'In Progress');
    }
  };

  const updateReport = async (domain: DomainType, evals: typeof roundEvaluations) => {
    setIsEvaluating(true);
    try {
      const report = await generateAIReport(domain, student.name || 'Student', evals);
      setAiReport(report);
    } catch (e) {
      console.error("Failed to generate AI report:", e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const submitRound = async (roundType: RoundType, questions: Question[], answers: Record<number, string>) => {
    setIsEvaluating(true);
    try {
      const evaluation = await evaluateAIRound(selectedDomain, roundType, questions, answers);

      const newEvals = {
        ...roundEvaluations,
        [roundType]: evaluation
      };

      setRoundEvaluations(newEvals);
      setRoundStatus(roundType, 'Completed');
      try {
        localStorage.setItem('ai_interview_coach_evaluations', JSON.stringify(newEvals));
      } catch (e) { }

      await updateReport(selectedDomain, newEvals);
    } catch (e) {
      console.error("Error submitting round:", e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetSession = () => {
    const defaultStatuses = { technical: 'Not Started' as RoundStatus, coding: 'Not Started' as RoundStatus, hr: 'Not Started' as RoundStatus };
    setRoundStatusesState(defaultStatuses);
    setRoundEvaluations({});
    setSavedAnswers({});
    try {
      localStorage.removeItem('ai_interview_coach_round_statuses');
      localStorage.removeItem('ai_interview_coach_evaluations');
      localStorage.removeItem('ai_interview_coach_saved_answers');
    } catch (e) { }
    updateReport(selectedDomain, {});
  };

  return (
    <InterviewContext.Provider
      value={{
        student,
        isAuthenticated,
        isLoadingAuth,
        selectedDomain,
        roundStatuses,
        roundEvaluations,
        savedAnswers,
        aiReport,
        isEvaluating,
        logout,
        setDomain,
        saveAnswerLocally,
        setRoundStatus,
        submitRound,
        resetSession
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
