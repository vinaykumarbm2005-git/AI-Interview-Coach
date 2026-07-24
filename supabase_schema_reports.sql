-- Supabase Schema for AI Evaluation & Dynamic Report Generation

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 2. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  round_type VARCHAR(20) NOT NULL,
  question_index INT NOT NULL,
  question_text TEXT NOT NULL,
  category VARCHAR(100),
  difficulty VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Candidate Answers Table
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Per-Answer AI Evaluations Table
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL,
  strengths_json JSONB DEFAULT '[]'::jsonb,
  weaknesses_json JSONB DEFAULT '[]'::jsonb,
  feedback_text TEXT,
  improvement_text TEXT,
  confidence INT DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Dynamic AI Generated Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain VARCHAR(100) NOT NULL,
  rounds_completed JSONB NOT NULL,
  overall_score INT,
  report_json JSONB NOT NULL,
  word_count INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_session_id ON public.questions(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_question_id ON public.evaluations(question_id);
CREATE INDEX IF NOT EXISTS idx_reports_session_id ON public.reports(session_id);

-- RLS Policies
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own sessions" ON public.interview_sessions;
CREATE POLICY "Users can manage own sessions" ON public.interview_sessions FOR ALL USING (auth.uid() = user_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can view session questions" ON public.questions;
CREATE POLICY "Users can view session questions" ON public.questions FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can manage own answers" ON public.answers;
CREATE POLICY "Users can manage own answers" ON public.answers FOR ALL USING (auth.uid() = user_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage own evaluations" ON public.evaluations;
CREATE POLICY "Users can manage own evaluations" ON public.evaluations FOR ALL USING (auth.uid() = user_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage own reports" ON public.reports;
CREATE POLICY "Users can manage own reports" ON public.reports FOR ALL USING (auth.uid() = user_id OR auth.role() = 'authenticated');
