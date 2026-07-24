export interface StudentProfile {
  id?: string;
  user_id?: string;
  username?: string;
  name: string;
  email: string;
  usn: string;
  phone?: string;
  college?: string;
  branch: string;
  department?: string;
  semester: string;
  cgpa?: string;
  skills?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DomainType = 
  | 'AI Engineer'
  | 'Machine Learning Engineer'
  | 'Software Engineer'
  | 'Python Developer'
  | 'Java Developer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Cloud Engineer'
  | 'Cyber Security'
  | 'Data Analyst'
  | 'Data Scientist';

export type RoundType = 'technical' | 'coding' | 'hr';

export type RoundStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Question {
  id: number;
  question: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  codeTemplate?: string;
  sampleInput?: string;
  sampleOutput?: string;
  constraints?: string;
}

export interface TechnicalMetrics {
  score: string;
  accuracy: string;
  strongTopics: string;
  weakTopics: string;
  completionStatus: string;
  answeredQuestions?: number;
  skippedQuestions?: number;
}

export interface CodingMetrics {
  codeQuality: string;
  logic: string;
  problemSolving: string;
  timeManagement: string;
  completionStatus: string;
  answeredQuestions?: number;
  skippedQuestions?: number;
}

export interface HRMetrics {
  communication: string;
  confidence: string;
  professionalism: string;
  leadership: string;
  completionStatus: string;
  answeredQuestions?: number;
  skippedQuestions?: number;
}

export interface QuestionEvaluation {
  questionId: number;
  questionText: string;
  candidateAnswer: string;
  status: 'Answered' | 'Skipped' | 'Not Visited';
  score?: number;
  strengths?: string[];
  weaknesses?: string[];
  feedback?: string;
  improvement?: string;
  confidence?: number;
}

export interface RoundEvaluation {
  roundType: RoundType;
  domain: string;
  metrics: TechnicalMetrics | CodingMetrics | HRMetrics | any;
  strengths: string[];
  weaknesses: string[];
  feedbackSummary: string;
  questionEvaluations?: QuestionEvaluation[];
  overallScore?: number | null;
  answeredCount: number;
  skippedCount: number;
  totalQuestions: number;
  hasSufficientResponses: boolean;
}

export interface ReportSection {
  id: string;
  title: string;
  icon?: string;
  content: string;
  items?: string[];
}

export interface AIReportData {
  completedRounds: RoundType[];
  answeredCount: number;
  skippedCount: number;
  totalQuestions: number;
  hasSufficientResponses: boolean;
  overallScore?: number;
  overallSummary?: string;
  technicalSummary?: string;
  technicalStrengths?: string;
  technicalWeaknesses?: string;
  technicalScore?: number;
  technicalRecommendations?: string;
  codingSummary?: string;
  codingStrengths?: string;
  codingWeaknesses?: string;
  codingScore?: number;
  codingRecommendations?: string;
  hrSummary?: string;
  hrStrengths?: string;
  hrWeaknesses?: string;
  hrScore?: number;
  hrRecommendations?: string;
  combinedStrengths?: string;
  combinedWeaknesses?: string;
  strongAreas?: string;
  weakAreas?: string;
  areasForImprovement?: string;
  recommendedTopics?: string;
  learningRoadmap?: string;
  hiringReadiness?: string;
  conclusion?: string;
  totalWordCount: number;
  sections?: ReportSection[];
}
