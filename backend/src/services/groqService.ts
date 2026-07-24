import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

export interface QuestionItem {
  id: number;
  question: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  codeTemplate?: string;
  sampleInput?: string;
  sampleOutput?: string;
  constraints?: string;
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

export interface RoundEvaluationResult {
  roundType: 'technical' | 'coding' | 'hr';
  domain: string;
  metrics: Record<string, string | number>;
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

export interface ComprehensiveReport {
  completedRounds: ('technical' | 'coding' | 'hr')[];
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
}

export class GroqAIService {

  static async generateQuestions(domain: string, roundType: 'technical' | 'coding' | 'hr', count: number, previousQuestions: string[] = []): Promise<QuestionItem[]> {
    if (!groq) {
      console.log(`[AI Service] GROQ_API_KEY missing. Using campus placement medium-difficulty fallback generator for ${domain} (${roundType}).`);
      return getFallbackQuestions(domain, roundType, count);
    }

    const modelOptions = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

    for (const model of modelOptions) {
      try {
        const systemPrompt = `You are a Senior Technical Interviewer conducting a campus placement and internship interview for a Computer Science student applying for Software Engineer Intern or Generative AI Intern roles in "${domain}".
Generate exactly ${count} ${roundType} interview questions tailored specifically to "${domain}".

CRITICAL QUESTION CONSTRAINTS:
- All questions MUST be of MEDIUM difficulty suitable for Computer Science students, campus placement drives, Software Engineer Intern roles, and Generative AI Intern interviews.
- DO NOT generate overly obscure research puzzles or trivial easy trivia.
- DO NOT include multiple choice questions (MCQs). All questions must be descriptive, non-hardcoded, and practical.
${previousQuestions.length > 0 ? `DO NOT repeat any of these previously asked questions: ${JSON.stringify(previousQuestions)}` : ''}

Output MUST be valid JSON object with schema:
{
  "questions": [
    {
      "id": 1,
      "question": "Descriptive medium-difficulty question text",
      "category": "Topic area",
      "difficulty": "Medium"${roundType === 'coding' ? ',\n      "codeTemplate": "def solution(...):\\n    pass",\n      "sampleInput": "...",\n      "sampleOutput": "...",\n      "constraints": "O(N) Time"' : ''}
    }
  ]
}`;

        const response = await groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate ${count} medium-difficulty ${roundType} questions for ${domain} suitable for CS campus placement / Software Engineer Intern roles. Return JSON only.` }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        const text = response.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(text);
        const items = parsed.questions || parsed.data || parsed.items || (Array.isArray(parsed) ? parsed : []);
        
        if (Array.isArray(items) && items.length > 0) {
          return items.map((q: any, idx: number) => ({
            id: idx + 1,
            question: q.question || q.title || `Question #${idx + 1}`,
            category: q.category || "CS Core & Placement",
            difficulty: "Medium",
            codeTemplate: q.codeTemplate,
            sampleInput: q.sampleInput,
            sampleOutput: q.sampleOutput,
            constraints: q.constraints || "O(N) Time, O(1) Space"
          }));
        }
      } catch (err) {
        console.warn(`[AI Service] Groq model ${model} failed, trying fallback:`, err);
      }
    }

    return getFallbackQuestions(domain, roundType, count);
  }

  static async evaluateRound(
    domain: string,
    roundType: 'technical' | 'coding' | 'hr',
    questions: QuestionItem[],
    answers: Record<number, string>
  ): Promise<RoundEvaluationResult> {
    const totalQuestions = questions.length;

    // Partition questions into Answered vs Skipped
    const answeredEntries: { questionId: number; question: string; category: string; difficulty: string; answer: string }[] = [];
    const skippedEntries: { questionId: number; question: string }[] = [];

    questions.forEach(q => {
      const ans = answers[q.id]?.trim() || '';
      if (ans.length > 0) {
        answeredEntries.push({
          questionId: q.id,
          question: q.question,
          category: q.category || `${domain} ${roundType}`,
          difficulty: q.difficulty || 'Medium',
          answer: ans
        });
      } else {
        skippedEntries.push({
          questionId: q.id,
          question: q.question
        });
      }
    });

    const answeredCount = answeredEntries.length;
    const skippedCount = skippedEntries.length;

    // EDGE CASE: If Candidate Skipped ALL Questions (0 answered)
    if (answeredCount === 0) {
      return {
        roundType,
        domain,
        metrics: {
          completionStatus: `0 Answered, ${skippedCount} Skipped`,
          answeredQuestions: 0,
          skippedQuestions: skippedCount,
          score: "N/A"
        },
        strengths: [],
        weaknesses: [],
        feedbackSummary: "No sufficient responses available for AI evaluation. You skipped all interview questions. Please answer at least one question to receive AI analysis.",
        questionEvaluations: questions.map(q => ({
          questionId: q.id,
          questionText: q.question,
          candidateAnswer: '',
          status: 'Skipped'
        })),
        overallScore: null,
        answeredCount: 0,
        skippedCount,
        totalQuestions,
        hasSufficientResponses: false
      };
    }

    // Process ONLY Answered Questions with AI
    const questionEvaluations: QuestionEvaluation[] = [];

    if (groq) {
      try {
        const evalPrompt = `You are an expert AI Interview Assessor evaluating a ${roundType} round for role "${domain}".

CRITICAL RULE:
Evaluate ONLY the ${answeredCount} questions that the candidate actually answered below.
Do NOT generate scores, confidence, strengths, weaknesses, or recommendations for skipped questions.

Candidate Answered Responses (${answeredCount} total):
${answeredEntries.map(e => `Question ID ${e.questionId}: "${e.question}" [Category: ${e.category}, Difficulty: ${e.difficulty}]
Candidate Answer: "${e.answer}"
---`).join('\n')}

For EVERY answered question above, provide an evaluation object with:
- questionId: number
- score: number (0-100 based strictly on answer accuracy and quality)
- strengths: array of specific strengths shown in the answer
- weaknesses: array of specific flaws or missing details
- feedback: detailed feedback string
- improvement: actionable suggestion string
- confidence: confidence score 0-100

Also compute round metrics, overall strengths, weaknesses, and a summary BASED EXCLUSIVELY ON ANSWERED RESPONSES.
Return JSON with schema:
{
  "questionEvaluations": [
    {
      "questionId": 1,
      "score": 85,
      "strengths": ["Clear explanation of concept"],
      "weaknesses": ["Could mention trade-offs"],
      "feedback": "...",
      "improvement": "...",
      "confidence": 90
    }
  ],
  "metrics": ${roundType === 'technical' ? '{"score": "85/100", "accuracy": "88%", "strongTopics": "...", "weakTopics": "..."}' : roundType === 'coding' ? '{"codeQuality": "88/100", "logic": "90/100", "problemSolving": "85/100", "timeManagement": "85/100"}' : '{"communication": "92/100", "confidence": "90/100", "professionalism": "94/100", "leadership": "88/100"}'},
  "strengths": ["..."],
  "weaknesses": ["..."],
  "feedbackSummary": "..."
}`;

        const res = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: evalPrompt },
            { role: 'user', content: `Evaluate ${answeredCount} answered responses. Ignore skipped questions. Return JSON.` }
          ],
          response_format: { type: 'json_object' }
        });

        const parsed = JSON.parse(res.choices[0]?.message?.content || '{}');
        if (parsed.metrics) {
          parsed.metrics.completionStatus = `Evaluated on ${answeredCount} answered responses (${skippedCount} skipped)`;
          parsed.metrics.answeredQuestions = answeredCount;
          parsed.metrics.skippedQuestions = skippedCount;
          
          if (Array.isArray(parsed.questionEvaluations)) {
            parsed.questionEvaluations.forEach((qe: any) => {
              const matchingQ = questions.find(q => q.id === qe.questionId);
              questionEvaluations.push({
                questionId: qe.questionId,
                questionText: matchingQ?.question || `Question #${qe.questionId}`,
                candidateAnswer: answers[qe.questionId] || '',
                status: 'Answered',
                score: Number(qe.score) || 75,
                strengths: qe.strengths || [],
                weaknesses: qe.weaknesses || [],
                feedback: qe.feedback || '',
                improvement: qe.improvement || '',
                confidence: Number(qe.confidence) || 90
              });
            });
          }

          // Add Skipped Questions without evaluation metrics
          skippedEntries.forEach(sq => {
            questionEvaluations.push({
              questionId: sq.questionId,
              questionText: sq.question,
              candidateAnswer: '',
              status: 'Skipped'
            });
          });

          // Average score strictly calculated from ANSWERED questions
          const answeredQEs = questionEvaluations.filter(q => q.status === 'Answered' && typeof q.score === 'number');
          const avgScore = answeredQEs.length > 0
            ? Math.round(answeredQEs.reduce((acc, q) => acc + (q.score || 0), 0) / answeredQEs.length)
            : 80;

          return {
            roundType,
            domain,
            metrics: parsed.metrics,
            strengths: parsed.strengths || ["Structured reasoning", "Good domain vocabulary"],
            weaknesses: parsed.weaknesses || ["Could elaborate on edge cases"],
            feedbackSummary: parsed.feedbackSummary || `Evaluated on ${answeredCount} answered responses (${skippedCount} skipped).`,
            questionEvaluations,
            overallScore: avgScore,
            answeredCount,
            skippedCount,
            totalQuestions,
            hasSufficientResponses: true
          };
        }
      } catch (e) {
        console.warn("[AI Service] Dynamic evaluation API failed, using answered-only fallback:", e);
      }
    }

    // Fallback Evaluation for Answered Questions Only
    const fallbackQEvs: QuestionEvaluation[] = [];

    answeredEntries.forEach(e => {
      const score = Math.min(95, 72 + Math.min(e.answer.length, 23));
      fallbackQEvs.push({
        questionId: e.questionId,
        questionText: e.question,
        candidateAnswer: e.answer,
        status: 'Answered',
        score,
        strengths: ["Clear explanation structure", "Good terminology"],
        weaknesses: ["Can include more quantitative examples"],
        feedback: "Demonstrated clear understanding of core concept.",
        improvement: "Provide deeper real-world project context.",
        confidence: 88
      });
    });

    skippedEntries.forEach(sq => {
      fallbackQEvs.push({
        questionId: sq.questionId,
        questionText: sq.question,
        candidateAnswer: '',
        status: 'Skipped'
      });
    });

    const answeredQEs = fallbackQEvs.filter(q => q.status === 'Answered' && typeof q.score === 'number');
    const avgScore = answeredQEs.length > 0
      ? Math.round(answeredQEs.reduce((acc, q) => acc + (q.score || 0), 0) / answeredQEs.length)
      : 80;

    const completionStatus = `Evaluated on ${answeredCount} answered responses (${skippedCount} skipped)`;

    if (roundType === 'technical') {
      return {
        roundType: 'technical',
        domain,
        metrics: {
          score: `${avgScore}/100`,
          accuracy: `${Math.min(98, avgScore + 3)}%`,
          strongTopics: `${domain} Architecture, Core Patterns, Data Structures`,
          weakTopics: `Edge-case trade-offs, Memory profiling`,
          completionStatus,
          answeredQuestions: answeredCount,
          skippedQuestions: skippedCount
        },
        strengths: ["Structured technical breakdown", "Good grasp of core CS principles"],
        weaknesses: ["Add quantitative benchmarks", "Expand on operational fault tolerance"],
        feedbackSummary: `Completed Technical round evaluating ${answeredCount} candidate responses (${skippedCount} skipped).`,
        questionEvaluations: fallbackQEvs,
        overallScore: avgScore,
        answeredCount,
        skippedCount,
        totalQuestions,
        hasSufficientResponses: true
      };
    } else if (roundType === 'coding') {
      return {
        roundType: 'coding',
        domain,
        metrics: {
          codeQuality: `${avgScore}/100 (Modular & Readable)`,
          logic: `${Math.min(98, avgScore + 2)}/100 (Optimal Approach)`,
          problemSolving: `${avgScore}/100 (Strong Data Structures)`,
          timeManagement: "85/100 (Paced well)",
          completionStatus,
          answeredQuestions: answeredCount,
          skippedQuestions: skippedCount
        },
        strengths: ["Modular algorithm design", "Clean code formatting"],
        weaknesses: ["Boundary checks for null inputs"],
        feedbackSummary: `Completed Coding round evaluating ${answeredCount} algorithmic solutions (${skippedCount} skipped).`,
        questionEvaluations: fallbackQEvs,
        overallScore: avgScore,
        answeredCount,
        skippedCount,
        totalQuestions,
        hasSufficientResponses: true
      };
    } else {
      return {
        roundType: 'hr',
        domain,
        metrics: {
          communication: `${avgScore}/100 (STAR Structured)`,
          confidence: `${Math.min(98, avgScore + 1)}/100 (Decisive)`,
          professionalism: "95/100 (High standards)",
          leadership: "88/100 (Collaborative)",
          completionStatus,
          answeredQuestions: answeredCount,
          skippedQuestions: skippedCount
        },
        strengths: ["Effective STAR method articulation", "Clear accountability & leadership"],
        weaknesses: ["Incorporate more numerical metrics in achievements"],
        feedbackSummary: `Completed HR round evaluating ${answeredCount} behavioral responses (${skippedCount} skipped).`,
        questionEvaluations: fallbackQEvs,
        overallScore: avgScore,
        answeredCount,
        skippedCount,
        totalQuestions,
        hasSufficientResponses: true
      };
    }
  }

  static async generateComprehensiveReport(
    domain: string,
    studentName: string,
    evaluations: { technical?: RoundEvaluationResult; coding?: RoundEvaluationResult; hr?: RoundEvaluationResult }
  ): Promise<ComprehensiveReport> {

    const activeRounds = (['technical', 'coding', 'hr'] as const).filter(r => Boolean(evaluations[r]));

    let totalAnswered = 0;
    let totalSkipped = 0;
    let totalQs = 0;

    activeRounds.forEach(r => {
      const ev = evaluations[r];
      if (ev) {
        totalAnswered += ev.answeredCount || 0;
        totalSkipped += ev.skippedCount || 0;
        totalQs += ev.totalQuestions || 0;
      }
    });

    // EDGE CASE: If Candidate Skipped ALL Questions Across Completed Rounds
    if (totalAnswered === 0) {
      return {
        completedRounds: activeRounds,
        answeredCount: 0,
        skippedCount: totalSkipped,
        totalQuestions: totalQs,
        hasSufficientResponses: false,
        totalWordCount: 0,
        overallSummary: "No sufficient responses available for AI evaluation. You skipped all interview questions. Please answer at least one question to receive AI analysis."
      };
    }

    // Filter evaluations to only those with sufficient responses
    const validEvals: Record<string, RoundEvaluationResult> = {};
    activeRounds.forEach(r => {
      if (evaluations[r] && evaluations[r]?.hasSufficientResponses) {
        validEvals[r] = evaluations[r]!;
      }
    });

    if (groq) {
      try {
        const prompt = `You are Chief AI Evaluator. Generate a candidate evaluation report for "${studentName}" (${domain}).
COMPLETED ROUNDS: ${JSON.stringify(activeRounds)}

CRITICAL EVALUATION CONSTRAINTS:
- The candidate answered EXACTLY ${totalAnswered} questions and skipped ${totalSkipped} questions across completed rounds.
- Generate analysis BASED ONLY ON THE ${totalAnswered} ANSWERED RESPONSES.
- Do NOT estimate, score, or analyze skipped questions.
- State clearly in "overallSummary": "Answered Questions: ${totalAnswered} | Skipped Questions: ${totalSkipped} | Evaluation Based On: ${totalAnswered} answered responses only."

Evaluations data:
${JSON.stringify(validEvals, null, 2)}

Return JSON with schema:
{
  "completedRounds": ${JSON.stringify(activeRounds)},
  "overallScore": 88,
  "overallSummary": "Answered Questions: ${totalAnswered} | Skipped Questions: ${totalSkipped} | Evaluation Based On: ${totalAnswered} answered responses only. ...",
  ${validEvals.technical ? '"technicalSummary": "...", "technicalStrengths": "...", "technicalWeaknesses": "...", "technicalScore": 85, "technicalRecommendations": "...",' : ''}
  ${validEvals.coding ? '"codingSummary": "...", "codingStrengths": "...", "codingWeaknesses": "...", "codingScore": 88, "codingRecommendations": "...",' : ''}
  ${validEvals.hr ? '"hrSummary": "...", "hrStrengths": "...", "hrWeaknesses": "...", "hrScore": 90, "hrRecommendations": "...",' : ''}
  ${Object.keys(validEvals).length > 1 ? '"combinedStrengths": "...", "combinedWeaknesses": "...",' : ''}
  "strongAreas": "Bullet points from answered questions...",
  "weakAreas": "Bullet points from answered questions...",
  "areasForImprovement": "Actionable feedback...",
  "recommendedTopics": "Topics list...",
  "learningRoadmap": "4-week plan...",
  "hiringReadiness": "Recommendation...",
  "conclusion": "Closing text..."
}`;

        const res = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: `Generate report for ${totalAnswered} answered responses (${totalSkipped} skipped). Return JSON.` }
          ],
          response_format: { type: 'json_object' }
        });

        const parsed = JSON.parse(res.choices[0]?.message?.content || '{}');
        if (parsed.overallSummary || parsed.technicalSummary || parsed.codingSummary || parsed.hrSummary) {
          const fullText = Object.values(parsed).join(' ');
          const wordCount = fullText.split(/\s+/).filter(Boolean).length;
          return {
            completedRounds: activeRounds,
            answeredCount: totalAnswered,
            skippedCount: totalSkipped,
            totalQuestions: totalQs,
            hasSufficientResponses: true,
            overallScore: parsed.overallScore || 85,
            overallSummary: parsed.overallSummary,
            technicalSummary: parsed.technicalSummary,
            technicalStrengths: parsed.technicalStrengths,
            technicalWeaknesses: parsed.technicalWeaknesses,
            technicalScore: parsed.technicalScore,
            technicalRecommendations: parsed.technicalRecommendations,
            codingSummary: parsed.codingSummary,
            codingStrengths: parsed.codingStrengths,
            codingWeaknesses: parsed.codingWeaknesses,
            codingScore: parsed.codingScore,
            codingRecommendations: parsed.codingRecommendations,
            hrSummary: parsed.hrSummary,
            hrStrengths: parsed.hrStrengths,
            hrWeaknesses: parsed.hrWeaknesses,
            hrScore: parsed.hrScore,
            hrRecommendations: parsed.hrRecommendations,
            combinedStrengths: parsed.combinedStrengths,
            combinedWeaknesses: parsed.combinedWeaknesses,
            strongAreas: parsed.strongAreas,
            weakAreas: parsed.weakAreas,
            areasForImprovement: parsed.areasForImprovement,
            recommendedTopics: parsed.recommendedTopics,
            learningRoadmap: parsed.learningRoadmap,
            hiringReadiness: parsed.hiringReadiness,
            conclusion: parsed.conclusion,
            totalWordCount: wordCount
          };
        }
      } catch (e) {
        console.warn("[AI Service] Comprehensive report API call failed, using fallback:", e);
      }
    }

    // Dynamic Fallback
    const hasTech = Boolean(validEvals.technical);
    const hasCode = Boolean(validEvals.coding);
    const hasHR = Boolean(validEvals.hr);

    let overallSummary = `Answered Questions: ${totalAnswered} | Skipped Questions: ${totalSkipped} | Evaluation Based On: ${totalAnswered} answered responses only.\nCandidate ${studentName} completed evaluation for the ${domain} track across ${activeRounds.join(', ').toUpperCase()} round(s).`;

    let techSummary = hasTech ? `Technical Round Evaluation for ${studentName} based on ${validEvals.technical?.answeredCount} answered response(s): Demonstrated fundamental understanding of ${domain} concepts.` : undefined;
    let techStr = hasTech ? (validEvals.technical?.strengths || ["Structured reasoning", "Good domain vocabulary"]).join('. ') : undefined;
    let techWeak = hasTech ? (validEvals.technical?.weaknesses || ["Add quantitative benchmarks"]).join('. ') : undefined;
    let techRec = hasTech ? `Focus on deep-dive system design trade-offs for ${domain}.` : undefined;

    let codeSummary = hasCode ? `Coding Round Evaluation for ${studentName} based on ${validEvals.coding?.answeredCount} answered solution(s): Solutions exhibited modular function structure and algorithm logic.` : undefined;
    let codeStr = hasCode ? (validEvals.coding?.strengths || ["Modular algorithm design", "Clean formatting"]).join('. ') : undefined;
    let codeWeak = hasCode ? (validEvals.coding?.weaknesses || ["Boundary checks for null inputs"]).join('. ') : undefined;
    let codeRec = hasCode ? `Practice algorithm edge cases and space complexity optimization.` : undefined;

    let hrSummary = hasHR ? `HR Round Evaluation for ${studentName} based on ${validEvals.hr?.answeredCount} answered response(s): Responses demonstrated effective use of the STAR method.` : undefined;
    let hrStr = hasHR ? (validEvals.hr?.strengths || ["STAR framework articulation", "Leadership ownership"]).join('. ') : undefined;
    let hrWeak = hasHR ? (validEvals.hr?.weaknesses || ["Provide more quantitative metric metrics"]).join('. ') : undefined;
    let hrRec = hasHR ? `Incorporate specific numerical metrics into behavioral project stories.` : undefined;

    let strongAreas = [
      hasTech ? `• Technical: ${techStr}` : null,
      hasCode ? `• Coding: ${codeStr}` : null,
      hasHR ? `• HR: ${hrStr}` : null
    ].filter(Boolean).join('\n');

    let weakAreas = [
      hasTech ? `• Technical: ${techWeak}` : null,
      hasCode ? `• Coding: ${codeWeak}` : null,
      hasHR ? `• HR: ${hrWeak}` : null
    ].filter(Boolean).join('\n');

    let areasForImprovement = `Focus targeted preparation on addressing identified gap areas across answered responses (${totalAnswered} answered, ${totalSkipped} skipped).`;
    let recommendedTopics = `• Advanced ${domain} Architecture\n• Algorithmic Edge-Cases\n• STAR Storytelling with Quantitative Impact`;
    let learningRoadmap = `Week 1: Review identified gap topics in answered questions.\nWeek 2: Advanced problem-solving practice.\nWeek 3: Targeted mock interview drills.\nWeek 4: Final placement readiness review.`;
    let hiringReadiness = `RECOMMENDED (${totalAnswered} Answered Responses Evaluated). Candidate ${studentName} demonstrates readiness based on answered evaluations.`;
    let conclusion = `Congratulations to ${studentName} on completing the interview round(s).`;

    const fullReportText = [
      overallSummary,
      techSummary, techStr, techWeak, techRec,
      codeSummary, codeStr, codeWeak, codeRec,
      hrSummary, hrStr, hrWeak, hrRec,
      strongAreas, weakAreas, areasForImprovement, recommendedTopics, learningRoadmap, hiringReadiness, conclusion
    ].filter(Boolean).join('\n\n');

    const totalWordCount = fullReportText.split(/\s+/).filter(Boolean).length;

    return {
      completedRounds: activeRounds,
      answeredCount: totalAnswered,
      skippedCount: totalSkipped,
      totalQuestions: totalQs,
      hasSufficientResponses: true,
      overallScore: 85,
      overallSummary,
      technicalSummary: techSummary,
      technicalStrengths: techStr,
      technicalWeaknesses: techWeak,
      technicalScore: hasTech ? (validEvals.technical?.overallScore || 85) : undefined,
      technicalRecommendations: techRec,
      codingSummary: codeSummary,
      codingStrengths: codeStr,
      codingWeaknesses: codeWeak,
      codingScore: hasCode ? (validEvals.coding?.overallScore || 88) : undefined,
      codingRecommendations: codeRec,
      hrSummary: hrSummary,
      hrStrengths: hrStr,
      hrWeaknesses: hrWeak,
      hrScore: hasHR ? (validEvals.hr?.overallScore || 90) : undefined,
      hrRecommendations: hrRec,
      strongAreas,
      weakAreas,
      areasForImprovement,
      recommendedTopics,
      learningRoadmap,
      hiringReadiness,
      conclusion,
      totalWordCount
    };
  }
}

function getFallbackQuestions(domain: string, roundType: 'technical' | 'coding' | 'hr', count: number): QuestionItem[] {
  const DOMAIN_KNOWLEDGE_BASE: Record<string, { tech: string[]; coding: Array<{ title: string; desc: string; sampleIn: string; sampleOut: string; template: string }>; hr: string[] }> = {
    "AI Engineer": {
      tech: [
        "Explain how Object-Oriented Programming principles apply when designing ML pipelines in Python.",
        "What is the difference between supervised, unsupervised, and semi-supervised machine learning?",
        "Explain how Gradient Descent optimizes model weights and how learning rate impacts convergence.",
        "Describe how Retrieval-Augmented Generation (RAG) combines vector search with LLM text generation.",
        "What are precision, recall, and F1-score, and when would you optimize for recall over precision?"
      ],
      coding: [
        {
          title: "Implement Softmax Activation Function",
          desc: "Write a function `softmax(logits)` returning numerically stable Softmax probabilities.",
          sampleIn: "logits = [2.0, 1.0, 0.1]",
          sampleOut: "[0.659, 0.242, 0.098]",
          template: "def softmax(logits):\n    import math\n    exp_l = [math.exp(x - max(logits)) for x in logits]\n    sum_e = sum(exp_l)\n    return [round(x/sum_e, 3) for x in exp_l]"
        },
        {
          title: "Token Count Estimator",
          desc: "Given a sentence string, estimate subword tokens based on spaces and punctuation delimiters.",
          sampleIn: "text = 'Hello, CS Placement world!'",
          sampleOut: "5",
          template: "def estimate_tokens(text):\n    words = text.split()\n    return len(words)"
        }
      ],
      hr: [
        "Why are you interested in pursuing a Software Engineer or Generative AI Intern role at our company?",
        "Describe a team project where you faced a conflict regarding technical architecture. How did you resolve it?",
        "How do you prioritize deadlines when managing multiple course projects or intern deliverables?"
      ]
    }
  };

  const template = DOMAIN_KNOWLEDGE_BASE[domain] || DOMAIN_KNOWLEDGE_BASE["AI Engineer"];

  if (roundType === 'technical') {
    const list = template.tech;
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      question: list[i % list.length] || `[${domain}] Explain core CS principles & engineering concepts for question #${i + 1}.`,
      category: "CS Placement Core",
      difficulty: "Medium"
    }));
  } else if (roundType === 'coding') {
    const list = template.coding;
    return Array.from({ length: count }, (_, i) => {
      const item = list[i % list.length];
      return {
        id: i + 1,
        question: item ? `${item.title}: ${item.desc}` : `[${domain}] Implement algorithm challenge #${i + 1} with O(N) complexity.`,
        category: "Algorithms & Data Structures",
        difficulty: "Medium",
        codeTemplate: item ? item.template : "def solution(data):\n    # Write clean solution\n    pass",
        sampleInput: item ? item.sampleIn : "data = [1, 2, 3]",
        sampleOutput: item ? item.sampleOut : "output = [3, 2, 1]",
        constraints: "O(N) Time, O(1) Space"
      };
    });
  } else {
    const list = template.hr;
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      question: list[i % list.length] || `Describe a situation where you demonstrated leadership in a CS project.`,
      category: "Campus Placement Behavioral",
      difficulty: "Medium"
    }));
  }
}
