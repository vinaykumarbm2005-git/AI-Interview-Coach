import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, DomainType, RoundType, RoundStatus, Question, RoundEvaluation, AIReportData } from '../types';
import { fetchAIQuestions, evaluateAIRound, generateAIReport } from '../services/api';
import { supabase, ensureUserProfile, fetchUserProfile, updateUserProfile, UserProfileRow } from '../lib/supabase';
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
  updateProfile: (updatedFields: Partial<StudentProfile>) => Promise<{ success: boolean; error?: string }>;
  reloadProfile: () => Promise<void>;
}

const EMPTY_STUDENT: StudentProfile = {
  username: '',
  name: '',
  email: '',
  usn: '',
  branch: '',
  department: '',
  semester: '',
  avatarUrl: ''
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile>(EMPTY_STUDENT);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  const mapRowToStudentProfile = (row: UserProfileRow, user?: User | null): StudentProfile => {
    const meta = user?.user_metadata || {};
    const email = row.email || user?.email || '';
    const emailName = email ? email.split('@')[0] : '';
    const name = row.full_name || meta.full_name || meta.name || emailName || 'Student';
    const avatarUrl = row.profile_image || meta.avatar_url || meta.picture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300";

    return {
      id: row.id,
      user_id: row.user_id || user?.id,
      username: emailName || user?.id,
      name,
      email,
      usn: row.usn || meta.usn || '1MS21CS042',
      phone: row.phone || '',
      college: row.college || 'MSRIT',
      branch: row.department || meta.branch || 'Computer Science & Engineering',
      department: row.department || meta.branch || 'Computer Science & Engineering',
      semester: row.semester || meta.semester || '7th Semester',
      cgpa: row.cgpa || '8.8',
      skills: row.skills || 'React, TypeScript, Python, Node.js',
      linkedinUrl: row.linkedin_url || '',
      githubUrl: row.github_url || '',
      portfolioUrl: row.portfolio_url || '',
      avatarUrl,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  };

  const handleUserSession = async (user: User | null) => {
    setCurrentUser(user);
    if (!user) {
      setIsAuthenticated(false);
      setStudent(EMPTY_STUDENT);
      return;
    }

    setIsAuthenticated(true);

    let profileRow = await fetchUserProfile(user.id);
    if (!profileRow) {
      profileRow = await ensureUserProfile(user);
    }

    if (profileRow) {
      setStudent(mapRowToStudentProfile(profileRow, user));
    } else {
      const meta = user.user_metadata || {};
      const email = user.email || '';
      const emailName = email ? email.split('@')[0] : '';
      setStudent({
        user_id: user.id,
        username: emailName,
        name: meta.full_name || meta.name || emailName || 'Student',
        email,
        usn: meta.usn || '1MS21CS042',
        branch: meta.branch || 'Computer Science & Engineering',
        department: meta.branch || 'Computer Science & Engineering',
        semester: meta.semester || '7th Semester',
        avatarUrl: meta.avatar_url || meta.picture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
      });
    }
  };

  const reloadProfile = async () => {
    if (!currentUser) return;
    const profileRow = await fetchUserProfile(currentUser.id);
    if (profileRow) {
      setStudent(mapRowToStudentProfile(profileRow, currentUser));
    }
  };

  const updateProfile = async (updatedFields: Partial<StudentProfile>): Promise<{ success: boolean; error?: string }> => {
    const targetUserId = student.user_id || currentUser?.id;
    if (!targetUserId) {
      return { success: false, error: 'No authenticated user profile found' };
    }

    const rowPayload: Partial<UserProfileRow> = {};
    if (updatedFields.name !== undefined) rowPayload.full_name = updatedFields.name;
    if (updatedFields.email !== undefined) rowPayload.email = updatedFields.email;
    if (updatedFields.usn !== undefined) rowPayload.usn = updatedFields.usn;
    if (updatedFields.phone !== undefined) rowPayload.phone = updatedFields.phone;
    if (updatedFields.college !== undefined) rowPayload.college = updatedFields.college;
    if (updatedFields.department !== undefined || updatedFields.branch !== undefined) {
      rowPayload.department = updatedFields.department || updatedFields.branch;
    }
    if (updatedFields.semester !== undefined) rowPayload.semester = updatedFields.semester;
    if (updatedFields.cgpa !== undefined) rowPayload.cgpa = updatedFields.cgpa;
    if (updatedFields.skills !== undefined) rowPayload.skills = updatedFields.skills;
    if (updatedFields.linkedinUrl !== undefined) rowPayload.linkedin_url = updatedFields.linkedinUrl;
    if (updatedFields.githubUrl !== undefined) rowPayload.github_url = updatedFields.githubUrl;
    if (updatedFields.portfolioUrl !== undefined) rowPayload.portfolio_url = updatedFields.portfolioUrl;
    if (updatedFields.avatarUrl !== undefined) rowPayload.profile_image = updatedFields.avatarUrl;

    const { data, error } = await updateUserProfile(targetUserId, rowPayload);

    if (error) {
      return { success: false, error: error.message };
    }

    if (data) {
      setStudent(prev => ({
        ...prev,
        ...updatedFields,
        branch: updatedFields.department || updatedFields.branch || prev.branch,
        department: updatedFields.department || updatedFields.branch || prev.department,
        updatedAt: data.updated_at
      }));
      return { success: true };
    }

    return { success: false, error: 'Unable to save profile' };
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
  }, [selectedDomain, student.name, roundStatuses]);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setStudent(EMPTY_STUDENT);
    setCurrentUser(null);
    setAiReport(null);
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
    const activeEvals: typeof roundEvaluations = {};
    if (roundStatuses.technical === 'Completed' && evals.technical) {
      activeEvals.technical = evals.technical;
    }
    if (roundStatuses.coding === 'Completed' && evals.coding) {
      activeEvals.coding = evals.coding;
    }
    if (roundStatuses.hr === 'Completed' && evals.hr) {
      activeEvals.hr = evals.hr;
    }

    const hasAnyCompleted = Object.keys(activeEvals).length > 0;

    if (!hasAnyCompleted) {
      setAiReport(null);
      setIsEvaluating(false);
      return;
    }

    setIsEvaluating(true);
    try {
      const report = await generateAIReport(domain, student.name || 'Student', activeEvals);
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
    setAiReport(null);
    try {
      localStorage.removeItem('ai_interview_coach_round_statuses');
      localStorage.removeItem('ai_interview_coach_evaluations');
      localStorage.removeItem('ai_interview_coach_saved_answers');
    } catch (e) { }
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
        resetSession,
        updateProfile,
        reloadProfile
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
