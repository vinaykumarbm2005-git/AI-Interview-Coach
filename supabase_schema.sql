-- AI Interview Coach
-- Supabase PostgreSQL Database Schema Definition & Indexing Strategy

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles / Students Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  usn VARCHAR(50) NOT NULL UNIQUE,
  branch VARCHAR(100) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Interview Domains Table
CREATE TABLE IF NOT EXISTS public.interview_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Round Evaluations Table (Technical, Coding, HR)
CREATE TABLE IF NOT EXISTS public.round_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  round_type VARCHAR(20) NOT NULL, -- 'technical', 'coding', 'hr'
  questions_json JSONB NOT NULL,
  answers_json JSONB NOT NULL,
  metrics_json JSONB NOT NULL, -- metrics specific to the round
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI Reports Table
CREATE TABLE IF NOT EXISTS public.ai_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain VARCHAR(100) NOT NULL,
  word_count INT NOT NULL,
  summary TEXT NOT NULL,
  technical_strengths TEXT NOT NULL,
  coding_strengths TEXT NOT NULL,
  hr_performance TEXT NOT NULL,
  strong_areas TEXT NOT NULL,
  weak_areas TEXT NOT NULL,
  areas_for_improvement TEXT NOT NULL,
  recommendedTopics TEXT NOT NULL,
  learning_roadmap TEXT NOT NULL,
  hiring_readiness TEXT NOT NULL,
  conclusion TEXT NOT NULL,
  full_report_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Database Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_student_id ON public.interview_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_round_evaluations_session_id ON public.round_evaluations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_session_id ON public.ai_reports(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_student_id ON public.ai_reports(student_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.round_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert initial default sample data for testing
INSERT INTO public.interview_domains (name, description) VALUES
('AI Engineer', 'Specializes in neural networks, LLMs, model fine-tuning, and AI architecture'),
('Machine Learning Engineer', 'Specializes in ML algorithms, feature engineering, MLOps, and model evaluation'),
('Software Engineer', 'Specializes in software design, algorithms, system architecture, and code quality'),
('Python Developer', 'Specializes in Python ecosystem, Django/FastAPI, data structures, and async programming'),
('Java Developer', 'Specializes in Core Java, Spring Boot, OOPs principles, and enterprise systems'),
('Frontend Developer', 'Specializes in React, JavaScript/TypeScript, CSS/Tailwind, and web performance'),
('Backend Developer', 'Specializes in REST/GraphQL APIs, databases, microservices, and server architecture'),
('Full Stack Developer', 'Specializes in end-to-end web app development, UI/UX, and backend databases'),
('Cloud Engineer', 'Specializes in AWS/GCP/Azure, DevOps, Kubernetes, and infrastructure as code'),
('Cyber Security', 'Specializes in network security, vulnerability assessment, cryptography, and ethical hacking'),
('Data Analyst', 'Specializes in SQL, data visualization, statistical analysis, and business intelligence'),
('Data Scientist', 'Specializes in statistical modeling, predictive analytics, Python/R, and big data')
ON CONFLICT (name) DO NOTHING;
