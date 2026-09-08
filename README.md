<div align="center">

# 📚 Shadow-Hack

### Turn any PDF into a structured course, quiz, flashcard set, or study guide — powered by AI.

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_API-8E75B2?style=flat&logo=googlegemini&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

</div>

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Notes](#-notes)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | Register / login flow (local, `localStorage`-backed) — all core pages are protected routes |
| 🧭 **Dashboard & Sidebar** | Central dashboard with a persistent sidebar for navigating between courses, quizzes, flashcards, and your profile |
| 🌗 **Theme Toggle** | Light/dark theme support via a dedicated theme context |
| 📄 **PDF Upload** | Drag & drop or browse to upload a PDF — text is extracted automatically |
| 📘 **Course Generator & Viewer** | Generates a structured 4–6 module course outline from the document and lets you browse it module by module |
| 📝 **Quiz Generator** | Generates a multiple-choice quiz with a custom number of questions (1–30), a countdown timer, and score tracking |
| 🗂️ **Flashcards** | Quizlet-style single-card view — click to flip, navigate with arrow keys or on-screen buttons, and toggle "Show first: Term / Definition" |
| 📋 **Study Guide** | Concise, markdown-formatted summary of key concepts |
| 📊 **Recent Scores** | Quiz results are saved per-user and shown on the Quiz page |
| 👤 **Profile** | View account info for the logged-in user |

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- ⚛️ React 18 + Vite
- 🧭 React Router
- 🎨 Tailwind CSS
- 🎞️ Framer Motion — animations
- 📊 Recharts — charts/graphs

</td>
<td valign="top" width="50%">

**Backend**
- ⚡ FastAPI (Python)
- 📄 [pypdf](https://pypi.org/project/pypdf/) — PDF text extraction
- 🤖 Google Gemini API (`google-genai`) — content generation

</td>
</tr>
</table>

---

## 📦 Project Structure

```
Shadow-Hack/
├── backend/
│   └── main.py                       # FastAPI app: upload + generate endpoints
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.jsx        # Register/login/logout, local user storage
        │   └── ThemeContext.jsx       # Light/dark theme
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   └── StudyComponents.jsx    # FlashcardGrid, InteractiveQuiz
        ├── data/                      # Sample/fallback course, quiz & flashcard data
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Upload.jsx
            ├── CourseViewer.jsx
            ├── Quiz.jsx
            ├── Flashcards.jsx
            ├── StudyGuide.jsx
            └── Profile.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Gemini API key](https://ai.google.dev/)

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install fastapi uvicorn pypdf python-dotenv google-genai
```

Create a `.env` file in `backend/`:

```env
GEMINI_API_KEY=your_api_key_here
```

Run the server:

```bash
uvicorn main:app --reload
```

> 🌐 Backend runs at `http://127.0.0.1:8000`

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> 🌐 Frontend runs at `http://localhost:5173`

Register an account on first run — all core pages (Dashboard, Upload, Quiz, Flashcards, Study Guide, Profile) are protected routes and require login.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/` | Health check |
| `POST` | `/upload` | Upload a PDF, returns extracted text |
| `POST` | `/generate/course` | Generate a structured course outline |
| `POST` | `/generate/quiz` | Generate a quiz (`text`, `num_questions`) |
| `POST` | `/generate/flashcards` | Generate flashcards |
| `POST` | `/generate/summary` | Generate a markdown study guide |

---

## 📝 Notes

- 📏 Extracted PDF text is capped at **15,000 characters** before being sent to the AI
- 🔢 Quiz question count is capped between **1 and 30** per request
- 💾 Uploaded file text/info, quiz/flashcard/course/summary results, and user accounts are all cached in `localStorage` — there's no real backend database yet, so data is per-browser
- 🔐 Auth is client-side only (`localStorage`) — fine for a demo/hackathon build, not intended for production use

---

<div align="center">

Built at a hackathon 🚀

</div>