export interface StudentProfile {
  username: string;
  name: string;
  email?: string;
  usn: string;
  branch: string;
  semester: string;
  avatarUrl?: string;
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
}

export interface CodingMetrics {
  codeQuality: string;
  logic: string;
  problemSolving: string;
  timeManagement: string;
  completionStatus: string;
}

export interface HRMetrics {
  communication: string;
  confidence: string;
  professionalism: string;
  leadership: string;
  completionStatus: string;
}

export interface RoundEvaluation {
  roundType: RoundType;
  domain: string;
  metrics: TechnicalMetrics | CodingMetrics | HRMetrics | any;
  strengths: string[];
  weaknesses: string[];
  feedbackSummary: string;
}

export interface AIReportData {
  overallSummary: string;
  technicalStrengths: string;
  codingStrengths: string;
  hrPerformance: string;
  strongAreas: string;
  weakAreas: string;
  areasForImprovement: string;
  recommendedTopics: string;
  learningRoadmap: string;
  hiringReadiness: string;
  conclusion: string;
  totalWordCount: number;
}
