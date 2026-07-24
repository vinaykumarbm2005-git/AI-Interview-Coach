import { Router } from 'express';
import { 
  getQuestions, 
  evaluateRound, 
  generateReport, 
  createSession, 
  getSession, 
  getReportById 
} from '../controllers/aiController.js';

const router = Router();

router.post('/questions', getQuestions);
router.post('/evaluate', evaluateRound);
router.post('/report', generateReport);
router.post('/session', createSession);
router.get('/session/:id', getSession);
router.get('/report/:id', getReportById);

export default router;
