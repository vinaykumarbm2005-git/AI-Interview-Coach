# AI Interview Coach

## Project Overview

AI Interview Coach is a Generative AI-powered web application that helps students prepare for technical, coding, and HR interviews through AI-generated interview sessions and intelligent performance analysis.

The application generates medium-level interview questions based on the selected interview round, evaluates each answered response using AI, and provides detailed analytics including confidence, accuracy, strengths, weaknesses, and personalized improvement suggestions.

The platform also maintains interview history, generates downloadable AI reports, and helps candidates improve their interview skills through data-driven feedback.

---

# Features

- User Authentication (Supabase)
- Technical Interview Round
- Coding Interview Round
- HR Interview Round
- AI-generated Medium-Level Questions
- Real-time AI Answer Evaluation
- Confidence Analysis
- Accuracy Analysis
- Round-wise Analytics
- Overall Interview Performance Dashboard
- AI Feedback & Recommendations
- Interview History
- PDF Report Generation
- Responsive Modern UI

---

# Technologies Used

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- Supabase
- PostgreSQL

## AI

- Groq API (LLM)

## Other Libraries

- React Router
- Recharts / Chart Components
- jsPDF
- Supabase JavaScript SDK

---

# Folder Structure

```
AI-Interview-Coach
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.ts
│
├── backend
│   ├── src
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── database
│   └── supabase_schema.sql
│
├── README.md
└── .gitignore
```

---

# Installation Steps

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/AI-Interview-Coach.git
```

## 2. Open the Project

```bash
cd AI-Interview-Coach
```

---

## Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
GROQ_API_KEY=your_groq_api_key

SUPABASE_URL=your_supabase_url

SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

Open another terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

---

# Execution Instructions

1. Start the backend server.
2. Start the frontend server.
3. Open the application in your browser.
4. Register or log in using Supabase Authentication.
5. Select an interview round:
   - Technical
   - Coding
   - HR
6. Answer the interview questions.
7. AI evaluates responses in the background.
8. After completing the interview, view:
   - Confidence Meter
   - Accuracy Analysis
   - Overall Performance
   - Round-wise Analytics
   - AI Feedback
9. Download the AI-generated interview report as PDF.

---

# Future Enhancements

- Voice-based AI Interview
- Resume-based Personalized Questions
- Company-specific Interview Modes
- Recruiter Dashboard
- Advanced Performance Comparison
- Leaderboard
- AI Mock Interview Simulation

---

# Author

Vinay Kumar B M

B.Tech – Computer Science Engineering

GM University
