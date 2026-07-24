import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors({
  origin: '*', // Production: replace with specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Operational Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP ${req.method}] ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AI Interview Coach Backend',
    timestamp: new Date().toISOString(),
    groqConfigured: !!process.env.GROQ_API_KEY,
    databaseReady: true,
    version: '1.0.0'
  });
});

// AI Routes
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Global Backend Error]:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AI Interview Coach Backend Server running on port ${PORT}`);
  console.log(`📌 Groq API Key: ${process.env.GROQ_API_KEY ? 'Configured' : 'Missing (Using Smart Fallback Generator)'}`);
  console.log(`====================================================`);
});
