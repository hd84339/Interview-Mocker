# Mockhora | AI-Powered Mock Interview Platform

**Mockhora** is a real-time AI interview preparation platform designed to help job seekers practice technical, behavioral, and system design interviews with AI-driven voice and text feedback.

---

## 🌟 Key Features

- 🤖 **Real-Time AI Interviewer**: Conduct dynamic, role-specific mock interviews powered by Gemini AI.
- 🎙️ **Voice & Text Support**: Interactive speech recognition and speech synthesis for realistic practice.
- 📄 **Resume Analysis**: Instant resume parsing and question tailoring based on target candidate profiles.
- 📊 **Detailed Performance Reports**: Quantitative scoring on structural clarity, technical accuracy, and filler words.
- 🔐 **Secure Authentication**: Built-in user authorization and data security.

---

## 📁 Repository Structure

```
Mockhora/
├── client/              # Vite + React Frontend Application
│   ├── src/
│   │   ├── components/  # Landing page, layout & reusable UI components
│   │   ├── pages/       # Router pages (Login, Dashboard, Interview, Reports)
│   │   └── firebase/    # Authentication configuration
│   └── package.json
└── server/              # FastAPI + Python Backend
    ├── app/
    │   ├── config/      # Settings & Environment variables
    │   ├── database/    # SQLAlchemy models & SQLite setup
    │   ├── routers/     # API endpoints (/auth, /interview, /resume, /report)
    │   └── services/    # Gemini AI integration service
    └── main.py
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+) & npm
- Python (v3.10+)

---

### 1. Setting Up the Backend (Server)

```bash
# Navigate to server directory
cd server

# Create and activate Python virtual environment
python -m venv venv
# On Windows (PowerShell):
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI dev server
uvicorn app.main:app --reload --port 8000
```

The API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 2. Setting Up the Frontend (Client)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend web app will be available at [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Environment Variables

Create a `.env` file in `server/` with the following variables:

```env
APP_NAME=Mockhora
DEBUG=True
DATABASE_URL=sqlite:///./mockhora.db
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_super_secret_jwt_key
```

---

## 📄 License

MIT License © Mockhora. All rights reserved.
