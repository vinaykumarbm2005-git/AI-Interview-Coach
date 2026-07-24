import { Request, Response } from 'express';
import { GroqAIService } from '../services/groqService.js';

// In-memory session store (ready for Supabase persistence)
const SESSIONS_DB: Record<string, any> = {};
const REPORTS_DB: Record<string, any> = {};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { domain = 'AI Engineer', roundType = 'technical', count = 15, previousQuestions = [], sessionId } = req.body;
    
    let finalCount = Number(count);
    if (roundType === 'technical') finalCount = 15;
    if (roundType === 'coding') finalCount = 7;
    if (roundType === 'hr') finalCount = 10;

    console.log(`[Backend API] Generating ${finalCount} dynamic ${roundType} questions for domain: ${domain}`);
    const questions = await GroqAIService.generateQuestions(domain, roundType, finalCount, previousQuestions);

    // Save session memory if sessionId present
    if (sessionId) {
      if (!SESSIONS_DB[sessionId]) SESSIONS_DB[sessionId] = { id: sessionId, domain, questions: {} };
      SESSIONS_DB[sessionId].questions[roundType] = questions;
    }

    return res.status(200).json({
      success: true,
      domain,
      roundType,
      count: questions.length,
      questions
    });
  } catch (error: any) {
    console.error("[Backend Error] getQuestions controller error:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate dynamic questions',
      error: error.message
    });
  }
};

export const evaluateRound = async (req: Request, res: Response) => {
  try {
    const { domain = 'AI Engineer', roundType = 'technical', questions = [], answers = {}, sessionId } = req.body;

    console.log(`[Backend API] Evaluating ${roundType} round for domain: ${domain}`);
    const evaluation = await GroqAIService.evaluateRound(domain, roundType, questions, answers);

    if (sessionId) {
      if (!SESSIONS_DB[sessionId]) SESSIONS_DB[sessionId] = { id: sessionId, domain, evaluations: {} };
      if (!SESSIONS_DB[sessionId].evaluations) SESSIONS_DB[sessionId].evaluations = {};
      SESSIONS_DB[sessionId].evaluations[roundType] = evaluation;
    }

    return res.status(200).json({
      success: true,
      evaluation
    });
  } catch (error: any) {
    console.error("[Backend Error] evaluateRound controller error:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to evaluate round',
      error: error.message
    });
  }
};

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { domain = 'AI Engineer', studentName = 'vinay kumar BM', evaluations = {}, sessionId } = req.body;

    console.log(`[Backend API] Generating comprehensive dynamic report for ${studentName} (${domain})`);
    const report = await GroqAIService.generateComprehensiveReport(domain, studentName, evaluations);

    if (sessionId) {
      REPORTS_DB[sessionId] = { sessionId, domain, studentName, report, timestamp: new Date().toISOString() };
    }

    return res.status(200).json({
      success: true,
      report
    });
  } catch (error: any) {
    console.error("[Backend Error] generateReport controller error:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};

export const createSession = async (req: Request, res: Response) => {
  try {
    const { studentId, domain } = req.body;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    SESSIONS_DB[sessionId] = {
      id: sessionId,
      studentId,
      domain,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      completedRounds: { technical: false, coding: false, hr: false }
    };

    return res.status(201).json({
      success: true,
      session: SESSIONS_DB[sessionId]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create session', error: error.message });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = SESSIONS_DB[id];
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    return res.status(200).json({ success: true, session });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error fetching session', error: error.message });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reportData = REPORTS_DB[id];
    if (!reportData) return res.status(404).json({ success: false, message: 'Report not found' });
    return res.status(200).json({ success: true, report: reportData });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error fetching report', error: error.message });
  }
};
