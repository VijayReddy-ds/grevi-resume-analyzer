
# 🚀 Grevi Resume Analyzer

Grevi Resume Analyzer is an AI-powered web application that analyzes resumes against job descriptions and provides actionable insights to improve job readiness.

---

## 🌐 Live Demo
👉 https://grevi-resume-analyzer.vercel.app  

## 💻 Backend API
👉 https://grevi-backend.onrender.com  

---

## 🔥 Features

- 📊 Resume Match Score (out of 100)
- 🧠 Skill Gap Analysis (missing & relevant skills)
- 🎯 Job Role Alignment Detection
- 💡 Project Recommendations based on job requirements
- 📈 Resume Improvement Suggestions
- ⚡ Fast and interactive UI with smooth animations

---

## 🖥️ User Interface

- Upload resume (PDF/DOCX)
- Enter or upload job description
- Click **Analyze Resume**
- View detailed analysis results

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion

### Backend
- FastAPI
- Python

### AI / Logic
- NLP (Keyword Extraction)
- TF-IDF & Similarity Matching
- Skill-based analysis engine

### Deployment
- Frontend → Vercel
- Backend → Render

---

## 📂 Project Structure

grevi-resume-analyzer/
│
├── src/ # React frontend
├── public/ # Static assets
├── backend/ # FastAPI backend
├── package.json
└── README.md

---

## 🚀 How It Works

1. User uploads a resume
2. User provides job description
3. Backend extracts and analyzes text
4. AI compares skills and keywords
5. Generates:
   - Match score
   - Missing skills
   - Suggested projects
   - Resume improvements

---

## ⚙️ Installation (Local Setup)

### Frontend
```bash
npm install
npm run dev
