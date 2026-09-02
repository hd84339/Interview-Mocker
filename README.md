# Mockhora | AI-Powered Mock Interview Platform

**Mockhora** is a comprehensive, real-time AI interview preparation platform designed to help job seekers practice technical, behavioral, and system design interviews. Powered by advanced Large Language Models (Google Gemini), it offers an interactive, realistic interview experience complete with voice and text feedback.

---

## 🌟 Key Features

- 🤖 **Real-Time AI Interviewer**: Conduct dynamic, role-specific mock interviews that adapt to your responses, just like a real interviewer. Powered by Google Gemini AI.
- 🎙️ **Voice & Text Support**: Seamlessly interact using speech-to-text recognition and text-to-speech synthesis for a highly realistic practice environment.
- 📄 **Context-Aware Resume Analysis**: Upload your resume to have it instantly parsed. The AI tailors the interview questions based on your specific experience, skills, and target role.
- 🧠 **RAG-Powered Questioning**: Utilizing ChromaDB and Sentence Transformers to retrieve relevant technical questions and contexts based on the interview domain.
- 💻 **Integrated Code Editor**: Built-in Monaco Editor for technical and coding rounds, allowing candidates to write and execute code in real-time.
- 📊 **Detailed Performance Reports**: Receive quantitative scoring and qualitative feedback on structural clarity, technical accuracy, communication skills, and usage of filler words.
- 🔐 **Secure Authentication**: Robust user authentication via Google OAuth and JWT-based authorization.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS (v4)
- **Routing**: React Router DOM v7
- **Editor**: Monaco Editor
- **Icons**: Lucide React
- **Auth**: Google OAuth

### Backend (Server)
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL (via SQLAlchemy) + Alembic for migrations
- **Vector Database**: ChromaDB (for Retrieval-Augmented Generation)
- **AI/LLM**: Google Generative AI (Gemini Pro)
- **Embeddings**: Sentence Transformers
- **Auth**: Passlib (Bcrypt), Python-JOSE (JWT)

---

## 📁 Repository Structure

```text
Mockhora/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components (Landing, Dashboard, Interview, Reports)
│   │   ├── pages/       # Router pages
│   │   ├── services/    # API integration services (e.g., resumeService.js)
│   │   └── firebase/    # Firebase/Auth configuration
│   └── package.json
└── server/              # FastAPI backend application
    ├── alembic/         # Database migrations
    ├── app/
    │   ├── config/      # Application settings & Environment variables
    │   ├── database/    # SQLAlchemy models & database connection
    │   ├── routers/     # API endpoints (/auth, /interview, /resume, /report)
    │   └── services/    # Gemini AI & RAG integration services
    ├── requirements.txt
    └── main.py
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+) & **npm**
- **Python** (v3.10+)
- **PostgreSQL** database (or SQLite for local dev)
- **Google Gemini API Key**

---

### 1. Setting Up the Backend (Server)

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Create and activate a Python virtual environment**:
   ```bash
   python -m venv venv
   
   # On Windows (PowerShell):
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Environment Variables**:
   Create a `.env` file in the `server/` directory:
   ```env
   APP_NAME=Mockhora
   DEBUG=True
   # Use PostgreSQL or SQLite
   DATABASE_URL=sqlite:///./mockora.db 
   GEMINI_API_KEY=your_gemini_api_key_here
   SECRET_KEY=your_super_secret_jwt_key
   ```

5. **Run Database Migrations (Optional but recommended)**:
   ```bash
   alembic upgrade head
   ```

6. **Start the FastAPI development server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The API documentation (Swagger UI) will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

---

### 2. Setting Up the Frontend (Client)

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the `client/` directory (if required for OAuth/Firebase):
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   *The frontend web app will be accessible at [http://localhost:5173](http://localhost:5173).*

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information. © Mockhora. All rights reserved.
