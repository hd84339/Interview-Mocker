# Mockhora | AI-Powered Mock Interview Platform

> **Practice smarter. Interview with confidence.**

Mockhora is an AI-powered mock interview and technical preparation platform designed to help software engineers, engineering managers, and technical candidates master behavioral, system design, and coding interviews. By fusing Large Language Models (Google Gemini 1.5 Flash), semantic vector search (ChromaDB with Sentence Transformers), and customizable role context, Mockhora dynamically adapts interview questions to a candidate's uploaded resume and target job requirements, evaluates answers against rubrics, and delivers structured coaching reports.

[![Live Application](https://img.shields.io/badge/Live%20Demo-mockhora.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://mockhora.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Interview--Mocker-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hd84339/Interview-Mocker)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20+%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Gemini 1.5 Flash](https://img.shields.io/badge/LLM-Gemini%201.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![ChromaDB](https://img.shields.io/badge/Vector%20Store-ChromaDB%200.4+-FF6F00?style=for-the-badge&logo=database&logoColor=white)](https://www.trychroma.com/)

---

## 📑 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Key Features](#-key-features)
3. [Product Workflow](#-product-workflow)
4. [System Architecture](#-system-architecture)
5. [End-to-End AI Interview Lifecycle](#-end-to-end-ai-interview-lifecycle)
6. [Resume Processing and RAG Pipeline](#-resume-processing-and-rag-pipeline)
7. [AI Models and Provider Integrations](#-ai-models-and-provider-integrations)
8. [Camera and Attention Telemetry Analysis](#-camera-and-attention-telemetry-analysis)
9. [Performance Reports and Dashboard Metrics](#-performance-reports-and-dashboard-metrics)
10. [Technology Stack](#-technology-stack)
11. [Repository Structure](#-repository-structure)
12. [Database Design](#-database-design)
13. [Authentication and Security](#-authentication-and-security)
14. [API Reference](#-api-reference)
15. [Installation and Local Development](#-installation-and-local-development)
16. [Environment Variables](#-environment-variables)
17. [Testing and Quality Assurance](#-testing-and-quality-assurance)
18. [Deployment Architecture](#-deployment-architecture)
19. [Current Implementation Status](#-current-implementation-status)
20. [Engineering Decisions and Trade-offs](#-engineering-decisions-and-trade-offs)
21. [Limitations and Future Improvements](#-limitations-and-future-improvements)
22. [Contributing](#-contributing)
23. [License](#-license)
24. [Links and Resources](#-links-and-resources)

---

## 🎯 Problem Statement

Traditional interview preparation suffers from systemic limitations that leave candidates unprepared for real technical hiring bars:

- **Lack of Role-Specific Adaptation**: Generic question banks (e.g., static LeetCode lists or generic HR lists) fail to reflect the nuance of a candidate's specific background, past project architectures, or the exact job description of target roles.
- **Absence of Objective, Iterative Feedback**: Peer practice is difficult to schedule and often lacks technical rigor. Candidates rarely receive granular breakdowns of communication structure (e.g., STAR framework), technical depth, or edge-case handling.
- **Difficulty Diagnosing Real-Time Gaps**: Candidates often cannot assess whether their answers are too brief, overly verbose, lacking architectural trade-offs, or drifting away from interviewer attention.
- **Fragmented Progress Tracking**: Practice sessions are rarely recorded with quantitative metrics across sessions, making it difficult to measure readiness, average performance improvements, or time spent per topic.

### How Mockhora Addresses These Challenges

Mockhora bridges the gap between passive study and live technical interviews:
1. **Contextual Questioning**: Indexes candidate resumes into vector embeddings and extracts relevant project experience to ground interview questions.
2. **Dynamic Conversation Flow**: Uses Gemini 1.5 Flash to generate follow-up questions that probe previous answers, technical trade-offs, and behavioral nuances rather than reciting a static question list.
3. **Structured AI Evaluation**: Scores candidate transcripts across technical accuracy, communication delivery, and structural clarity, providing ideal reference answers for every question.
4. **Unified Telemetry Dashboard**: Persists interview sessions and computes performance trends over time, tracking completed practice sessions and identified growth areas.

*Note: Mockhora is an adaptive preparation and training tool. It does not predict or guarantee employment outcomes with specific employers.*

---

## ✨ Key Features

### 🎙️ Interview Experience
- **Adaptive Question Generation**: Generates role-tailored questions covering Behavioral, Technical Architecture, Coding, and System Design rounds.
- **Dynamic Follow-Up Logic**: The AI analyzes the previous question-answer transcript in real time before selecting the next question topic.
- **Configurable Session Parameters**: Custom duration (e.g., 15, 30, 45, 60 minutes), experience tier (Junior, Mid-Level, Senior, Staff), and difficulty tier.
- **Voice Synthesis & Transcription**: Integrated browser-native Speech Synthesis (TTS) for the interviewer and Web Speech Recognition (STT) for hands-free candidate responses.
- **Anti-Distraction Telemetry**: Built-in tab-switch visibility detection alerts candidates if they navigate away during an active interview session.

### 📄 Resume Intelligence & RAG
- **Multi-Format Upload**: Supports `.pdf`, `.txt`, `.doc`, and `.docx` uploads up to 10 MB with disk storage and unique file hashing.
- **Semantic Vector Storage**: Resumes are chunked into overlapping windows and indexed into a local ChromaDB collection using cosine similarity.
- **Targeted Context Isolation**: ChromaDB queries strictly filter by `resume_id` to guarantee zero cross-candidate data leakage.
- **Context Injection**: Relevant resume segments matching the role title and job description are dynamically injected into the LLM system prompt.

### 📊 AI Evaluation & Reporting
- **Multi-Dimensional Scoring**: Evaluates candidate transcripts across overall performance, technical accuracy, and communication clarity.
- **Per-Question Feedback**: Detailed breakdown comparing candidate responses with ideal benchmark solutions.
- **Actionable Growth Plans**: Automatic synthesis of key technical strengths and prioritized areas for improvement.
- **Export & Retake Actions**: Native printable summary exports and single-click interview retry workflows.

### 💻 Developer & Candidate Tools
- **Integrated Monaco Code Editor**: Syntax-highlighted code editor supporting JavaScript, Python, C++, Java, Go, and Rust.
- **Heuristic Code Submission Analysis**: Evaluates submitted code logic, structural patterns, and estimated time/space complexity.
- **Admin Management Panel**: Role-guarded dashboard allowing administrators to audit registered user accounts and activity statuses.

### 🔐 Authentication & Data Persistence
- **Google Identity Services**: One-tap sign-in via `@react-oauth/google` with server-side token validation.
- **Stateless JWT Authorization**: HS256-signed bearer tokens guarding all sensitive API routes.
- **Relational Persistence**: SQLAlchemy ORM backing users, resumes, interviews, and performance reports with SQLite locally and PostgreSQL in production.

---

## 🔄 Product Workflow

```mermaid
flowchart TD
    A[Sign In via Google OAuth or Demo] --> B[Candidate Dashboard]
    B --> C[Configure Interview Role, Level, Duration]
    C --> D[Upload Resume / Select Active Profile]
    D --> E[FastAPI Creates Session & Indexes Resume to ChromaDB]
    E --> F[Launch Interview Studio]
    F --> G[FastAPI Retrieves Relevant RAG Resume Context]
    G --> H[Gemini 1.5 Flash Generates First Tailored Question]
    H --> I[Candidate Listens via TTS / Reads Question]
    I --> J{Question Type}
    J -->|Coding| K[Type Solution in Monaco Editor]
    J -->|Technical / Behavioral| L[Speak via Web Speech STT or Type Response]
    K --> M[Submit Answer to Backend API]
    L --> M
    M --> N{Remaining Time > 0?}
    N -->|Yes| O[Gemini Generates Next Dynamic Question with History Context]
    O --> I
    N -->|No / Finished| P[Interview Session Completed]
    P --> Q[Gemini Evaluates Full Transcript & Generates Report]
    Q --> R[Report Saved to Database & Displayed to Candidate]
```

### End-to-End User Journey
1. **Authentication**: Candidate signs in via Google OAuth or uses the quick demo access mode.
2. **Dashboard Overview**: Candidate inspects historical performance metrics, completed sessions, and recommended practice areas.
3. **Session Configuration**: Candidate sets the target role, experience level, duration, and optional job description in the three-step creation wizard.
4. **Resume Attachment**: Candidate uploads a resume file. The server validates the file, stores it locally, and generates vector embeddings in ChromaDB.
5. **Studio Launch**: The studio initializes media hardware (webcam and microphone) and requests the initial question from the API.
6. **Dynamic Interaction Loop**:
   - The AI interviewer poses a question (read aloud via Speech Synthesis).
   - Candidate answers via voice transcription (Web Speech API) or text. If a coding problem is posed, Monaco Editor is rendered.
   - The answer is transmitted to `/api/v1/interviews/{id}/answers`.
   - The backend checks elapsed time against session limits. If time permits, Gemini generates a follow-up or next topic based on prior answers and retrieved resume chunks.
7. **Session Completion & Scoring**: Upon time expiration or completion, `/api/v1/reports/generate/{id}` triggers Gemini to perform rubric evaluation.
8. **Feedback Review**: Candidate inspects overall score dials, question-by-question ideal answers, and growth recommendations.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Presentation_Layer [Presentation Layer - Client]
        UI[React 19 + Vite]
        RTR[React Router DOM v7]
        TW[Tailwind CSS v4]
        MNC[Monaco Code Editor]
        WSA[Web Speech API STT/TTS]
        G_AUTH[Google OAuth SDK]
    end

    subgraph API_Layer [API & Application Layer - Server]
        FA[FastAPI Application]
        CORS[CORS Middleware]
        AUTH_ROUTER[/api/v1/auth]
        INT_ROUTER[/api/v1/interviews]
        RES_ROUTER[/api/v1/resumes]
        REP_ROUTER[/api/v1/reports]
        CAM_ROUTER[/api/v1/camera]
        ADM_ROUTER[/api/v1/admin]
    end

    subgraph Service_Layer [Business & AI Service Layer]
        AUTH_SVC[Auth & JWT Handler]
        INT_SVC[Interview Service]
        RES_SVC[Resume Service]
        RAG_SVC[RAG Vector Service]
        AI_SVC[Gemini AI Service]
        CAM_SVC[Camera Telemetry Service]
        REP_SVC[Report Service]
    end

    subgraph Persistence_Layer [Persistence & Retrieval Layer]
        SQL_DB[(Relational DB: SQLite / PostgreSQL via SQLAlchemy)]
        CHROMA_DB[(ChromaDB Vector Store: Cosine HNSW)]
        FS[Local File Storage: app/uploads/resumes]
    end

    subgraph External_Providers [External Cloud Providers]
        GEMINI_API[Google Gemini 1.5 Flash API]
        GOOGLE_OAUTH[Google OAuth Tokeninfo API]
    end

    UI --> FA
    G_AUTH -.-> GOOGLE_OAUTH
    FA --> AUTH_ROUTER & INT_ROUTER & RES_ROUTER & REP_ROUTER & CAM_ROUTER & ADM_ROUTER
    AUTH_ROUTER --> AUTH_SVC
    INT_ROUTER --> INT_SVC
    RES_ROUTER --> RES_SVC
    REP_ROUTER --> REP_SVC
    CAM_ROUTER --> CAM_SVC
    ADM_ROUTER --> SQL_DB

    AUTH_SVC --> GOOGLE_OAUTH
    AUTH_SVC --> SQL_DB
    RES_SVC --> FS
    RES_SVC --> RAG_SVC
    RES_SVC --> SQL_DB
    RAG_SVC --> CHROMA_DB
    INT_SVC --> RAG_SVC
    INT_SVC --> AI_SVC
    INT_SVC --> SQL_DB
    AI_SVC --> GEMINI_API
    REP_SVC --> AI_SVC
    REP_SVC --> SQL_DB
```

### Architectural Layer Responsibilities
- **Presentation Layer (`client/`)**: Single-page application built on React 19 and Vite. Manages client state, route guards (`ProtectedRoute.jsx`), local media streams (`getUserMedia`), speech synthesis/recognition, and code editing.
- **API Routing Layer (`server/app/routers/`)**: FastAPI endpoints performing Pydantic request validation, dependency-injected JWT authentication (`get_current_user`), and HTTP response serialization under `/api/v1`.
- **Application & Service Layer (`server/app/services/`)**: Orchestrates business logic, manages the interview state machine, constructs prompt payloads for LLM calls, and chunks text for RAG retrieval.
- **Persistence Layer (`server/app/models/` & `server/app/database/`)**: SQLAlchemy declarative models managing relational data. Executes SQLite for zero-config local development and PostgreSQL in hosted deployments.
- **Retrieval Layer (`RAGService`)**: Manages ChromaDB collections, executes text chunking, and conducts filtered cosine distance vector queries.
- **AI Layer (`AIService`)**: Integrates with the official `google-generativeai` SDK, handles structured prompt formatting, cleans markdown delimiters, and provides fallbacks if the API key is unconfigured.

---

## 🔁 End-to-End AI Interview Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Candidate (Browser)
    participant Client as React Client
    participant API as FastAPI Backend
    participant DB as Relational Database
    participant RAG as ChromaDB Vector Store
    participant Gemini as Google Gemini 1.5 Flash

    Candidate->>Client: Clicks "Launch Interview"
    Client->>API: POST /api/v1/interviews (role, level, resume_id, duration)
    API->>DB: INSERT Interview (status="pending", questions=[], responses=[])
    DB-->>API: Interview Created (id=12)
    API-->>Client: Return Interview Session

    Client->>API: POST /api/v1/interviews/12/start
    API->>DB: UPDATE Interview SET status="in_progress", started_at=NOW
    API->>RAG: query_resume_context(resume_id=4, query="Role + Job Description", top_k=3)
    RAG-->>API: Return Matched Resume Chunks
    API->>Gemini: generate_next_question(history=[], resume_context, role, duration)
    Gemini-->>API: Return JSON {id: 1, type: "behavioral", question: "..."}
    API->>DB: Append question to questions JSON
    API-->>Client: Return initial question

    Client->>Candidate: Plays question via SpeechSynthesis
    Candidate->>Client: Speaks answer / writes code
    Client->>API: POST /api/v1/interviews/12/answers {question_id: 1, answer: "..."}
    API->>DB: Append answer to responses JSON
    
    alt Time Remaining > 0
        API->>RAG: query_resume_context(resume_id=4, query=...)
        RAG-->>API: Return Relevant Chunks
        API->>Gemini: generate_next_question(history=[Q1, A1], resume_context, remaining_time)
        Gemini-->>API: Return JSON {id: 2, type: "technical", question: "..."}
        API->>DB: Append Q2 to questions JSON
        API-->>Client: Return {finished: false, question: Q2}
    else Time Expired or Force Finish
        API->>DB: UPDATE Interview SET status="completed", completed_at=NOW
        API-->>Client: Return {finished: true}
    end

    Client->>API: POST /api/v1/reports/generate/12
    API->>Gemini: generate_feedback_report(role_title, full_responses_transcript)
    Gemini-->>API: Return JSON Report {overall_score, feedback, questions_feedback}
    API->>DB: INSERT Report (scores, strengths, improvements, feedback)
    API-->>Client: Return Full Report Data
    Client->>Candidate: Renders Report Breakdown & Score Dials
```

---

## 🧠 Resume Processing and RAG Pipeline

Mockhora implements a Retrieval-Augmented Generation (RAG) pipeline to personalize interview sessions to the candidate's actual work experience.

```mermaid
flowchart TD
    A[Candidate Uploads Resume File] --> B[Validate File Type .pdf, .txt, .doc, .docx and Size <= 10MB]
    B --> C[Persist File to app/uploads/resumes with UUID]
    C --> D[Remove User's Previous Resume File and DB Record]
    D --> E[Create Relational Resume Record in DB]
    E --> F[Extract Skills & Summary Metadata]
    F --> G[RAGService: Text Chunking Window = 400 words, Overlap = 50 words]
    G --> H[Generate Dense Vector Embeddings via Sentence Transformers]
    H --> I[ChromaDB: Upsert Vectors into 'candidate_resumes' with metadata resume_id]

    subgraph Interview_Runtime_Retrieval [Interview Runtime Query]
        J[Interview Created with role_title & job_description] --> K[Construct Query: 'role_title + job_description']
        K --> L[ChromaDB Similarity Query with top_k = 3]
        I -.->|Filtered by resume_id| L
        L --> M[Extract Top 3 Cosine Matched Chunks]
        M --> N[Format Candidate Resume Context Block]
        N --> O[Inject Context into Gemini 1.5 Flash Prompt]
    end
```

### Detailed Pipeline Mechanics
1. **Upload Validation**: File extensions are validated (`.pdf`, `.txt`, `.doc`, `.docx`) and file size is capped at 10 MB (`MAX_UPLOAD_SIZE_MB`).
2. **Lifecycle & Replacement**: To maintain profile clarity, `ResumeService` purges old physical files and database rows for the user before persisting the new resume, maintaining a single active resume record per candidate.
3. **Chunking Strategy**: Text is parsed through an overlapping sliding window:
   $$\text{Step Size} = \text{Chunk Size} (400 \text{ words}) - \text{Overlap} (50 \text{ words}) = 350 \text{ words}$$
   This preserves cross-boundary semantic context between employment history sections.
4. **Vector Embedding & Storage**:
   - Vector database: ChromaDB `PersistentClient` targeting directory `./.chroma_db`.
   - Collection name: `candidate_resumes`.
   - Space metric: Cosine distance (`hnsw:space: "cosine"`).
   - Embedding pipeline: Sentence Transformers dense embeddings (`all-MiniLM-L6-v2`, 384 dimensions).
5. **Context Isolation**: When querying for interview question context, the query executes with a strict metadata filter:
   ```python
   results = self.collection.query(
       query_texts=[query_text],
       n_results=top_k,
       where={"resume_id": resume_id}
   )
   ```
   This prevents unrelated resumes from entering the prompt context window.
6. **Prompt Injection**: The top 3 retrieved chunks are injected directly into the `Candidate Resume Context (Retrieved via RAG)` section of the question generation prompt.

---

## 🤖 AI Models and Provider Integrations

| Component | Verified Implementation / Provider | Model / Configuration | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Large Language Model (LLM)** | Google Generative AI SDK (`google-generativeai`) | `gemini-1.5-flash` | Generates role-specific questions, adaptive follow-ups, and structured post-interview evaluations. |
| **Text Embedding Model** | Sentence Transformers (via ChromaDB default) | `all-MiniLM-L6-v2` (384-dimensional dense vectors) | Embeds resume text chunks into semantic vector space for cosine similarity search. |
| **Vector Database** | ChromaDB (`chromadb.PersistentClient`) | Local persistent storage (`./.chroma_db`) with HNSW index | Stores resume chunk vectors and executes filtered nearest-neighbor queries. |
| **Speech-to-Text (STT)** | Browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) | Native browser client engine (continuous mode) | Transcribes candidate verbal answers into text in the browser. |
| **Text-to-Speech (TTS)** | Browser Web Speech API (`window.speechSynthesis`) | Native browser `SpeechSynthesisUtterance` (1.0x rate) | Synthesizes interviewer questions aloud to simulate a live spoken interview. |
| **Code Evaluation** | Heuristic backend evaluator (`AIService.evaluate_code_submission`) | Rule-based parser + structured feedback schema | Evaluates submitted code text for basic patterns and returns complexity metrics. |
| **Camera & Attention Analysis** | Mathematical telemetry analyzer (`CameraService`) | Gaze distance threshold calculation (`abs(gaze) <= 0.35`) | Analyzes normalized numerical gaze and head pose coordinates (`/camera/analyze-frame`). |

*Note: The platform does not use paid third-party voice APIs (e.g., ElevenLabs, Whisper API) or remote cloud computer-vision endpoints. Speech functions operate entirely within supported browsers (Chrome, Edge, Safari).*

---

## 📷 Camera and Attention Telemetry Analysis

### Current Implementation State
The platform currently features a hybrid implementation of candidate attention monitoring:

1. **Browser Camera Stream**:
   - `InterviewPage.jsx` calls `navigator.mediaDevices.getUserMedia({ video: true, audio: true })`.
   - The live candidate video feed is rendered in an HTML `<video>` element inside `CandidateStudio.jsx`.
2. **Frontend Simulation**:
   - In `InterviewPage.jsx`, the real-time "Eye Contact Score" displayed on screen is generated via a 2-second interval timer that varies randomly between 70% and 99%:
     ```javascript
     const change = Math.floor(Math.random() * 7) - 3;
     const next = prev + change;
     return Math.min(99, Math.max(70, next));
     ```
   - The frontend is **not yet connected** to an in-browser face-landmark library (e.g., MediaPipe Face Mesh or TensorFlow.js).
3. **Backend Telemetry Service (`/api/v1/camera`)**:
   - A dedicated backend router (`camera.py`) and service (`camera_service.py`) are fully implemented to process geometric gaze and head-pose telemetry.
   - **Endpoint**: `POST /api/v1/camera/analyze-frame`
   - **Input Schema**:
     ```json
     {
       "gaze_x": 0.12,
       "gaze_y": -0.05,
       "pitch": 2.4,
       "yaw": -3.1,
       "roll": 0.0
     }
     ```
   - **Evaluation Logic**:
     $$\text{gaze\_distance} = \sqrt{\text{gaze\_x}^2 + \text{gaze\_y}^2}$$
     $$\text{attention\_score} = \max(0.0, \min(100.0, 100.0 - (\text{gaze\_distance} \times 70.0) - (|\text{yaw}| \times 0.8)))$$
     $$\text{is\_looking\_at\_camera} = (|\text{gaze\_x}| \le 0.35) \land (|\text{gaze\_y}| \le 0.35) \land (|\text{yaw}| \le 20.0^\circ) \land (|\text{pitch}| \le 20.0^\circ)$$
   - **Endpoint**: `POST /api/v1/camera/summarize-session` computes aggregated eye-contact percentages across an array of recorded frames.

*Roadmap: Integrating client-side MediaPipe Face Landmarker in WebAssembly to pipe real-time coordinate telemetry from the browser into the backend `/camera/analyze-frame` endpoint.*

---

## 📈 Performance Reports and Dashboard Metrics

The candidate dashboard (`DashboardPage.jsx` and `DashboardStats.jsx`) computes key metrics from session history.

### Metric Derivation Breakdown

| Dashboard Metric | Data Source | Included Sessions | Calculation Formula & Logic | Empty State |
| :--- | :--- | :--- | :--- | :--- |
| **Interviews Completed** | `interviews` array | Filtered where `status === 'Completed'` | Count of completed sessions. The sublabel displays `interviews.length - totalCompleted` as aborted/pending sessions. | `0` |
| **Average Performance Score** | Completed session `score` values | Excludes aborted and pending sessions | Arithmetic mean of completed session scores: $$\text{avgScore} = \text{round}\left(\frac{\sum \text{score}_{\text{completed}}}{N_{\text{completed}}}\right)$$ | `0%` |
| **Practice Time** | `questions_count` across all sessions | Includes all sessions | Estimated assuming 5 minutes per question: $$\text{hours} = \frac{\sum \text{questions\_count} \times 5}{60}$$ formatted to 1 decimal place. | `0.0 hrs` |
| **Target Role Readiness** | `interviews[0]?.level` | Latest session | Extracted directly from the most recent interview record's seniority level (e.g., "Senior", "Mid"). | `"N/A"` |
| **Skill Breakdown Bars** | `SkillBreakdown.jsx` | Static UI template | Renders visual demonstration baseline values: 90% Technical Accuracy, 85% Structural Clarity (STAR), 88% Communication, 82% Eye Contact. | Static display |

### Individual Report Generation Formula (`ReportPage.jsx`)
When an interview concludes, `ai_service.generate_feedback_report` prompts Gemini 1.5 Flash using `FEEDBACK_GENERATION_PROMPT`. The prompt enforces strict mathematical constraints:
- Skipped or "Time expired" answers receive 0 marks.
- The `overall_score` must reflect the arithmetic mean of individual question evaluations.
- Scores for `technical_accuracy` and `communication_score` are returned along with qualitative strengths, improvement points, and ideal answers.

---

## 💻 Technology Stack

### Frontend Architecture
| Package / Dependency | Version | Architectural Role |
| :--- | :--- | :--- |
| `react` | `^19.2.7` | UI component tree and reactivity |
| `react-dom` | `^19.2.7` | DOM rendering target |
| `vite` | `^8.1.1` | Build tooling, dev server, and module bundling |
| `tailwindcss` & `@tailwindcss/vite` | `^4.3.3` | Utility-first responsive CSS design system |
| `react-router-dom` | `^7.18.1` | Client-side routing and protected routes |
| `@monaco-editor/react` | `^4.7.0` | In-browser VS Code Monaco code editor |
| `@react-oauth/google` | `^0.13.5` | Google Identity Services authentication client |
| `lucide-react` | `^1.27.0` | Accessible iconography suite |
| Browser Web Speech API | Native | SpeechRecognition (STT) and SpeechSynthesis (TTS) |

### Backend Architecture
| Package / Dependency | Version | Architectural Role |
| :--- | :--- | :--- |
| `fastapi` | `>=0.110.0` | Asynchronous REST API framework |
| `uvicorn[standard]` | `>=0.28.0` | ASGI production application server |
| `pydantic` & `pydantic-settings` | `>=2.6.0` / `>=2.2.0` | Schema validation and typed environment settings |
| `sqlalchemy` | `>=2.0.0` | Object-Relational Mapping (ORM) and SQL generation |
| `alembic` | Installed | Database migrations management |
| `python-jose[cryptography]` | `>=3.3.0` | JWT token encoding, decoding, and signing |
| `passlib[bcrypt]` | `>=1.7.4` | Password hashing for local credentials |
| `python-multipart` | `>=0.0.9` | Multipart form parsing for resume file uploads |
| `google-generativeai` | `>=0.4.0` | Official Google Gemini API client |
| `chromadb` | `>=0.4.24` | Local embedded vector store for RAG embeddings |
| `sentence-transformers` | `>=2.5.0` | Sentence embedding model pipelines |
| `psycopg[binary]` | `>=3.1.0` | PostgreSQL database driver for production |
| `httpx` | `>=0.27.0` | Asynchronous HTTP client for Google token validation |

---

## 📂 Repository Structure

```text
Mockhora/
├── client/                              # React 19 + Vite frontend
│   ├── public/                          # Static public assets
│   ├── src/
│   │   ├── components/                  # Modular UI components
│   │   │   ├── create-interview/        # Step wizard components (Role, Resume, Mode)
│   │   │   ├── dashboard/               # Metrics, Hero, RecentInterviews, SkillBreakdown
│   │   │   ├── interview/               # CandidateStudio, AIInterviewer, CodeEditorPane, Header
│   │   │   └── landing/                 # Hero, Features, HowItWorks, Testimonials
│   │   ├── constants/                   # Storage keys and authentication constants
│   │   ├── context/                     # Shared AuthContext provider
│   │   ├── layouts/                     # MainLayout (with Navbar) and AuthLayout
│   │   ├── pages/                       # Application route page components
│   │   ├── routes/                      # AppRoutes.jsx and ProtectedRoute.jsx
│   │   ├── services/                    # Centralized API clients (apiClient, auth, interview, resume)
│   │   ├── App.jsx                      # App root component
│   │   ├── main.jsx                     # Vite entry point
│   │   └── index.css                    # Tailwind CSS v4 styling rules
│   ├── .env.example                     # Client environment template
│   ├── package.json                     # Frontend dependencies and scripts
│   ├── vercel.json                      # Vercel SPA routing rewrite rules
│   └── vite.config.js                   # Vite configuration
│
├── server/                              # FastAPI backend
│   ├── alembic/                         # Database migrations
│   │   ├── versions/                    # Migration version scripts
│   │   └── env.py                       # Alembic environment configuration
│   ├── app/
│   │   ├── auth/                        # Security, JWT tokens, dependencies, Google OAuth
│   │   ├── config/                      # Pydantic Settings and environment configuration
│   │   ├── database/                    # Database engine, SessionLocal, declarative base
│   │   ├── models/                      # SQLAlchemy models (User, Resume, Interview, Report)
│   │   ├── prompts/                     # Structured LLM prompts (interview, feedback, resume)
│   │   ├── routers/                     # FastAPI route controllers under /api/v1
│   │   ├── schemas/                     # Pydantic input/output validation schemas
│   │   ├── services/                    # Business services (AI, RAG, Interview, Resume, Camera, Report)
│   │   ├── utils/                       # File helpers and naming utilities
│   │   └── main.py                      # FastAPI application entry point & CORS
│   ├── .chroma_db/                      # Local persistent ChromaDB vector store
│   ├── .env.example                     # Backend environment template
│   ├── alembic.ini                      # Alembic database migration settings
│   ├── requirements.txt                 # Python backend dependencies
│   └── .python-version                  # Pinned Python version (3.11.8)
│
├── docs/                                # Documentation assets
├── LICENSE                              # Project license file (pending configuration)
└── README.md                            # Comprehensive engineering documentation
```

### Architectural Distinctions
- **`app/routers/` vs `app/services/`**: Routers handle HTTP protocol concerns, status codes, and Pydantic validation. Services encapsulate pure application logic, database operations, RAG queries, and LLM communication.
- **`app/models/` vs `app/schemas/`**: Models define the relational database schema in SQLAlchemy. Schemas govern the API contract (request/response validation) in Pydantic.
- **`client/services/apiClient.js`**: Centralized HTTP client managing Bearer token injection, demo token handling, and automated session expiration redirection.

---

## 🗄️ Database Design

Mockhora uses SQLAlchemy to model the interview lifecycle. Relational integrity is enforced with foreign keys, while questions and candidate transcripts are modeled as JSON documents to support dynamic, polymorphic interview sessions.

```mermaid
erDiagram
    USERS ||--o{ RESUMES : "uploads"
    USERS ||--o{ INTERVIEWS : "conducts"
    USERS ||--o{ REPORTS : "receives"
    RESUMES ||--o{ INTERVIEWS : "contextualizes"
    INTERVIEWS ||--o| REPORTS : "evaluated in"

    USERS {
        int id PK
        string email UK
        string full_name
        string hashed_password
        string google_id UK
        string avatar_url
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    RESUMES {
        int id PK
        int user_id FK
        string file_name
        string file_path
        json parsed_skills
        text parsed_summary
        datetime created_at
    }

    INTERVIEWS {
        int id PK
        int user_id FK
        int resume_id FK
        string role_title
        text job_description
        string company_name
        string experience_level
        string difficulty
        int duration
        string status
        json questions
        json responses
        datetime started_at
        datetime completed_at
        datetime created_at
    }

    REPORTS {
        int id PK
        int interview_id FK
        int user_id FK
        float overall_score
        float technical_accuracy
        float communication_score
        json strengths
        json improvements
        text detailed_feedback
        json questions_feedback
        datetime created_at
    }
```

### Database Highlights
- **JSON Column Pattern**: The `questions` and `responses` fields on `Interview` store flexible question types (behavioral, system design, coding) without requiring multi-table polymorphic joins.
- **Single Active Resume**: When a candidate uploads a new resume, previous resume rows and physical files for that user are removed, ensuring questions reflect the latest credentials.
- **Local SQLite vs. Hosted PostgreSQL**: Local environments use `sqlite:///./mockhora.db`. Production deployments use PostgreSQL via `psycopg` by setting `DATABASE_URL=postgresql+psycopg://...`.
- **Automatic Startup Migration**: `app/main.py` invokes `Base.metadata.create_all(bind=engine)` on startup to provision missing tables automatically.

---

## 🔒 Authentication and Security

### Authentication Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Candidate
    participant Google as Google Identity Services
    participant Client as React Client
    participant API as FastAPI Backend (/auth/google)
    participant DB as Database

    Candidate->>Client: Clicks "Sign in with Google"
    Client->>Google: Authenticate user
    Google-->>Client: Returns ID Token (JWT)
    Client->>API: POST /api/v1/auth/google { id_token }
    API->>Google: GET https://oauth2.googleapis.com/tokeninfo?id_token={token}
    Google-->>API: Returns verified user claims (email, sub, name, picture)
    API->>DB: Query User by email or google_id
    alt User exists
        API->>DB: Update avatar_url and full_name
    else User does not exist
        API->>DB: INSERT User (email, google_id, full_name, avatar_url)
    end
    API->>API: Generate Mockhora JWT (HS256, sub=email)
    API-->>Client: Return { access_token, token_type: "bearer", user }
    Client->>Client: Persist token to localStorage
    Client->>API: Authenticated requests with Header: Authorization: Bearer <token>
```

### Security Measures & Implementation Details
- **Token Verification**: Google OAuth tokens are verified server-side against Google's tokeninfo/userinfo endpoints, preventing forged client-side identities.
- **Stateless JWT Authorization**: API routes use FastAPI's `OAuth2PasswordBearer` and `decode_access_token` with HS256 cryptographic signatures.
- **Local Credentials**: For standard registration, passwords are encrypted using `passlib` with `bcrypt`.
- **Administrative Role Guarding**: Admin-only endpoints (`/api/v1/admin/users`) enforce `current_user.is_admin`, which verifies whether `current_user.email == settings.ADMIN_EMAIL`.
- **File Upload Protection**: Uploads are restricted to approved MIME types (`.pdf`, `.txt`, `.doc`, `.docx`), hashed to unique file names (`uuid4`), and size-capped at 10 MB.
- **RAG Context Isolation**: ChromaDB vector retrieval filters strictly by `resume_id` to prevent cross-candidate data leakage.

### Security Gaps & Known Trade-offs
- **CORS Configuration**: `CORSMiddleware` in `main.py` is configured with `allow_origins=["*"]` to accommodate multiple deployment domains; this should be restricted to specific frontend origins in production.
- **Client Demo Token Bypass**: The client provides a demo quick-login mode using client-side tokens (`mockhora_jwt_token_*`) that are bypassed before reaching the backend API. Real database operations require genuine Google authentication.

---

## 📡 API Reference

All backend API routes are prefixed under `/api/v1`. Interactive Swagger documentation is available locally at `http://localhost:8000/docs`.

### Authentication Endpoints (`/api/v1/auth`)
| Method | Endpoint | Request Body | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/google` | `{"id_token": "string"}` | No | Verifies Google ID token, upserts user, and returns Mockhora JWT bearer token. |
| `POST` | `/api/v1/auth/register` | `{"email": "...", "password": "...", "full_name": "..."}` | No | Registers a new account with email and hashed password. |
| `POST` | `/api/v1/auth/login` | `{"email": "...", "password": "..."}` | No | Authenticates local credentials and returns a JWT bearer token. |

### Resume Endpoints (`/api/v1/resumes`)
| Method | Endpoint | Request Body | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/resumes/upload` | `multipart/form-data` (`file`) | Yes (Bearer) | Validates and saves resume file, replaces old resumes, and indexes text into ChromaDB. |
| `GET` | `/api/v1/resumes/latest` | None | Yes (Bearer) | Retrieves the candidate's latest active parsed resume metadata. |

### Interview Endpoints (`/api/v1/interviews`)
| Method | Endpoint | Request Body | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/interviews` | `{"role_title": "...", "duration": 30, "resume_id": 1, ...}` | Yes (Bearer) | Creates a new interview session in `pending` state. |
| `GET` | `/api/v1/interviews` | None | Yes (Bearer) | Lists all interview sessions belonging to the authenticated user. |
| `GET` | `/api/v1/interviews/{id}` | None | Yes (Bearer) | Fetches complete interview state, question list, and recorded answers. |
| `POST` | `/api/v1/interviews/{id}/start` | None | Yes (Bearer) | Initializes interview timer, retrieves RAG context, and generates the first question. |
| `POST` | `/api/v1/interviews/{id}/answers` | `{"question_id": 1, "answer": "...", "is_code": false}` | Yes (Bearer) | Records candidate answer, verifies time, and returns the next dynamic question. |

### Report Endpoints (`/api/v1/reports`)
| Method | Endpoint | Request Body | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/reports/generate/{interview_id}` | None | Yes (Bearer) | Prompts Gemini to evaluate the interview transcript and saves the score report. |
| `GET` | `/api/v1/reports/{report_id}` | None | Yes (Bearer) | Retrieves detailed scoring, metrics, strengths, improvements, and question feedback. |

### Camera Telemetry Endpoints (`/api/v1/camera`)
| Method | Endpoint | Request Body | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/camera/analyze-frame` | `{"gaze_x": 0.1, "gaze_y": 0.0, "pitch": 0.0, "yaw": 0.0, "roll": 0.0}` | Yes (Bearer) | Evaluates geometric gaze/pose telemetry and returns an attention score (0-100%). |
| `POST` | `/api/v1/camera/summarize-session` | `{"frames": [...]}` | Yes (Bearer) | Aggregates frame evaluations into overall session attention and eye-contact percentage. |

### Admin & System Endpoints
| Method | Endpoint | Request Body | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/users` | None | Yes (Admin) | Lists all registered platform users. Restricted to `settings.ADMIN_EMAIL`. |
| `GET` | `/` | None | No | Root service status and documentation link. |
| `GET` | `/health` | None | No | Simple health check reporting application online status. |

---

## 🚀 Installation and Local Development

### Prerequisites
- **Python**: `3.10` or higher (`3.11.8` recommended)
- **Node.js**: `v18.0.0` or higher & **npm**
- **Google Gemini API Key**: Free tier or paid key from [Google AI Studio](https://aistudio.google.com/)
- **Google OAuth Client ID**: Obtained from the [Google Cloud Console](https://console.cloud.google.com/)

---

### 1. Repository Setup
```bash
git clone https://github.com/hd84339/Interview-Mocker.git
cd Interview-Mocker
```

---

### 2. Backend Setup (`server/`)

#### Step A: Navigate to server and initialize virtual environment
```bash
cd server

# On Windows (PowerShell):
python -m venv venv
.\venv\Scripts\Activate.ps1

# On macOS / Linux:
python3 -m venv venv
source venv/bin/activate
```

#### Step B: Install dependencies
```bash
pip install -r requirements.txt
```

#### Step C: Configure environment variables
Create a `.env` file in the `server/` directory:
```bash
cp .env.example .env
```
Populate the configuration values:
```env
APP_NAME=Mockhora
APP_ENV=development
DEBUG=True
API_V1_STR=/api/v1

SECRET_KEY=replace_with_a_secure_random_string_min_32_chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ADMIN_EMAIL=your_admin_email@example.com

GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# SQLite for local development
DATABASE_URL=sqlite:///./mockhora.db

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

UPLOAD_DIR=app/uploads/resumes
MAX_UPLOAD_SIZE_MB=10
```

#### Step D: Database initialization & startup
Database tables are automatically created on startup by `app/main.py`. If you wish to run Alembic migrations:
```bash
alembic upgrade head
```

#### Step E: Start the FastAPI development server
Execute Uvicorn from within the `server/` directory:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Base: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc UI: `http://localhost:8000/redoc`

---

### 3. Frontend Setup (`client/`)

#### Step A: Open a new terminal and navigate to client
```bash
cd client
```

#### Step B: Install dependencies
```bash
npm install
```

#### Step C: Configure environment variables
Create a `.env` file in the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
VITE_ADMIN_EMAIL=your_admin_email@example.com
```

#### Step D: Start the Vite development server
```bash
npm run dev
```
- Client Web Application: `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend Environment Variables (`server/.env`)

| Variable Name | Required | Default Value | Description & Security Note |
| :--- | :---: | :--- | :--- |
| `APP_NAME` | No | `Mockhora` | Application name returned in health check responses. |
| `APP_ENV` | No | `development` | Deployment environment mode (`development`, `production`). |
| `DEBUG` | No | `True` | Enables debug error responses in FastAPI. Set to `False` in production. |
| `API_V1_STR` | No | `/api/v1` | URL path prefix for all version 1 endpoints. |
| `SECRET_KEY` | **Yes** | `supersecretkey_change_me...` | Secret key used to sign HS256 JWT access tokens. Must be minimum 32 random bytes. |
| `ALGORITHM` | No | `HS256` | JWT cryptographic signature algorithm. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `1440` (24 hours) | JWT token lifespan before re-authentication is required. |
| `ADMIN_EMAIL` | No | `hd84339@gmail.com` | Email address granted superadmin access to `/api/v1/admin/users`. |
| `GOOGLE_CLIENT_ID` | **Yes** | `""` | Google Cloud OAuth 2.0 Web Client ID. |
| `GOOGLE_CLIENT_SECRET` | No | `""` | Google Cloud OAuth 2.0 Client Secret. |
| `GOOGLE_REDIRECT_URI` | No | `http://localhost:5173/...` | Registered OAuth callback URI. |
| `DATABASE_URL` | **Yes** | `sqlite:///./mockhora.db` | SQLAlchemy connection string (`sqlite:///...` or `postgresql+psycopg://...`). |
| `GEMINI_API_KEY` | **Yes** | `""` | Google AI Studio API key for Gemini 1.5 Flash generation. |
| `UPLOAD_DIR` | No | `app/uploads/resumes` | Local filesystem directory where resume uploads are saved. |
| `MAX_UPLOAD_SIZE_MB` | No | `10` | Maximum allowable upload file size in megabytes. |

### Frontend Environment Variables (`client/.env`)

| Variable Name | Required | Default Value | Description & Purpose |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | **Yes** | `http://localhost:8000/api/v1` | Base URL pointing to the FastAPI backend API prefix. |
| `VITE_GOOGLE_CLIENT_ID` | **Yes** | `""` | Public Google OAuth Client ID required for the Google Sign-In button. |
| `VITE_ADMIN_EMAIL` | No | `hd84339@gmail.com` | Client-side email check to display the Admin Panel navigation link. |

---

## 🧪 Testing and Quality Assurance

### Current Testing State
- **Automated Test Suites**: Automated unit test suites (e.g., `pytest` on backend, `vitest` / `jest` on frontend) are **not currently configured** in this repository.
- **Frontend Linting**: ESLint is configured on the client (`npm run lint`). The project includes rules from `@eslint/js`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
  - Running `npm run lint` identifies 5 unresolved issues (unused variables in `CodeEditorPane.jsx` and `InteractivePreview.jsx`, component export rules in `AuthContext.jsx`, and function declaration orders in `AdminPage.jsx` and `InterviewPage.jsx`).
- **Production Bundle Validation**: The client builds cleanly with Vite:
  ```bash
  cd client
  npm run build
  ```

### Manual Verification Workflows
For developers validating changes locally:
1. **API Endpoints**: Open `http://localhost:8000/docs` to test authentication, resume upload, and interview generation through Swagger UI.
2. **Audio & Media Diagnostic**: Open `http://localhost:5173/settings` to run the native speech synthesis audio check and test webcam/microphone permission requests.
3. **Tab Switch Warning**: While in an active interview session at `/interview`, switch to another browser tab to confirm that the tab-switch alert modal fires.

---

## 🌐 Deployment Architecture

```mermaid
flowchart LR
    subgraph Frontend_Host [Vercel CDN]
        SPA[React 19 SPA - dist]
        REWRITE[vercel.json SPA Rewrites]
    end

    subgraph Backend_Host [Render Web Service]
        UVICORN[Uvicorn ASGI Server]
        FASTAPI_APP[FastAPI app.main:app]
        UVICORN --> FASTAPI_APP
    end

    subgraph Database_Host [Managed PostgreSQL]
        PG[(PostgreSQL Database)]
    end

    subgraph External_Cloud [Google Cloud]
        GEMINI[Google Gemini 1.5 Flash]
    end

    Candidate[Candidate Browser] -->|HTTPS| SPA
    SPA -->|REST API over HTTPS| UVICORN
    FASTAPI_APP -->|Database Connection| PG
    FASTAPI_APP -->|HTTPS API Calls| GEMINI
```

### Production Deployment Configuration

#### 1. Frontend on Vercel
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: `client/vercel.json` contains URL rewrite rules to route all subpaths to `/index.html`:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- **Environment Variables**: Set `VITE_API_BASE_URL` to the hosted Render backend URL (e.g., `https://your-api.onrender.com/api/v1`) and set `VITE_GOOGLE_CLIENT_ID`.

#### 2. Backend on Render
- **Environment**: Python 3.11
- **Root Directory**: `server`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
- **Database**: Add a managed PostgreSQL instance and set:
  ```env
  DATABASE_URL=postgresql+psycopg://username:password@host:port/dbname
  ```

#### 3. Ephemeral Vector Storage Considerations
- **ChromaDB State on Render**: In default free-tier container deployments, the local filesystem (`./.chroma_db` and `app/uploads/resumes`) is ephemeral. Any container restart or rebuild will reset local ChromaDB vector collections.
- **Recommended Production Fix**: Mount a Render Persistent Disk to the ChromaDB directory or migrate vector indexing to a managed vector service (e.g., Pinecone, Qdrant Cloud, or PostgreSQL with `pgvector`).

---

## 📊 Current Implementation Status

| Feature / Subsystem | Status | Verified Implementation Details |
| :--- | :---: | :--- |
| **Google OAuth Sign-In** | **Implemented** | Frontend `@react-oauth/google` sends token to `/api/v1/auth/google`; verified against Google APIs; issues HS256 JWT. |
| **Demo Login Mode** | **Implemented** | Client-side instant login generating demo user state without Google credentials. |
| **Email/Password Auth** | **Partial** | Backend endpoints `/register` and `/login` exist with bcrypt; frontend currently uses Google OAuth or Demo mode. |
| **Resume Upload & Storage** | **Implemented** | File uploaded via multipart form, validated, saved to disk, and recorded in database. Single active resume per user. |
| **PDF Text Extraction** | **Simulated** | Text parsing currently passes placeholder string to parser; PyPDF/pdfplumber binary extraction is not yet integrated. |
| **ChromaDB Vector Indexing** | **Implemented** | Chunks indexed into `./.chroma_db` with `hnsw:space: "cosine"` and isolated by `resume_id`. |
| **RAG Resume Retrieval** | **Implemented** | Retrieves top 3 semantic chunks based on job role and injects them into the Gemini prompt. |
| **Dynamic Interview Loop** | **Implemented** | Gemini 1.5 Flash generates role-specific questions and adaptive follow-ups based on transcript history. |
| **Post-Interview Scoring** | **Implemented** | Comprehensive evaluation by Gemini with overall, technical, and communication scores. |
| **Speech-to-Text (STT)** | **Implemented** | Browser-native Web Speech API (`webkitSpeechRecognition`). Supported in Chrome/Edge/Safari. |
| **Text-to-Speech (TTS)** | **Implemented** | Browser-native Web Speech API (`SpeechSynthesisUtterance`). |
| **Monaco Code Editor** | **Implemented** | Embedded Monaco editor with language switcher (JS, Python, C++, Java, Go, Rust). |
| **Code Execution Sandbox** | **Planned** | Solutions are submitted as text and evaluated heuristically; real-time execution in a Docker/Pyodide sandbox does not exist. |
| **Webcam Feed** | **Implemented** | Browser `getUserMedia` streams candidate video in the interview studio. |
| **Eye-Contact Detection** | **Simulated** | Live score fluctuates randomly (70–99%). Backend `/camera/analyze-frame` endpoint is ready for coordinate telemetry. |
| **Admin Management** | **Implemented** | Role-guarded admin panel (`/admin`) displaying all registered users for `settings.ADMIN_EMAIL`. |
| **Automated Test Suites** | **Planned** | No automated `pytest` or `vitest` suites currently exist. |

---

## ⚖️ Engineering Decisions and Trade-offs

1. **FastAPI for the AI Backend**:
   FastAPI was chosen over Django or Flask for its native `asyncio` support (essential for non-blocking LLM streaming and HTTP requests to Google APIs), built-in Pydantic v2 data validation, and automated OpenAPI Swagger documentation generation.

2. **ChromaDB Embedded Vector Store vs. Managed Cloud Vector DB**:
   ChromaDB provides an in-process, zero-setup vector database that runs directly inside Python without external infrastructure costs. While ideal for rapid development, it introduces persistence constraints on ephemeral serverless hosts (Render/Heroku) unless backed by a persistent disk volume.

3. **Separate Embedding Pipeline vs. Generation LLM**:
   Using Sentence Transformers (`all-MiniLM-L6-v2`) for local chunk vectorization decouples semantic retrieval from Gemini generation. This drastically cuts operational API costs and minimizes latency during similarity queries.

4. **JSON Schema Storage for Session Transcripts**:
   Interview transcripts, questions, and evaluations are modeled as JSON columns on the `interviews` and `reports` SQLAlchemy tables. This avoids fragile multi-table polymorphic joins for different question categories (coding problems vs. system design vs. behavioral STAR questions) while maintaining relational referential integrity for users.

5. **Browser Web Speech API vs. Cloud Voice APIs (Whisper / ElevenLabs)**:
   Relying on browser-native SpeechRecognition and SpeechSynthesis delivers zero-latency voice interaction with zero cloud operating cost. The trade-off is browser inconsistency (Web Speech API behaves differently across Chrome, Firefox, and Safari) and sensitivity to background microphone noise.

6. **Heuristic Code Evaluation vs. Sandboxed Execution Engine**:
   Allowing arbitrary code execution from candidates introduces severe remote code execution (RCE) security risks unless isolated in secure containers (e.g., Docker sidecars, gVisor, or Pyodide WebAssembly). The current architecture accepts code submissions as text and evaluates them via structured heuristics, prioritizing platform security.

---

## 🔮 Limitations and Future Improvements

- **Real-Time Computer Vision (MediaPipe)**: Integrate `@mediapipe/tasks-vision` in the browser to compute 3D facial landmarks and head pose in WebAssembly, streaming real coordinates to the backend `/camera/analyze-frame` endpoint.
- **True Binary PDF Extraction**: Integrate `pypdf` or `pdfplumber` in `ResumeService` to extract full-text content from uploaded PDF binaries before vector indexing.
- **Multi-Resume Library**: Extend the database schema and UI to support multiple named resumes per user, allowing candidates to switch between specialized resumes for different roles.
- **Sandboxed Code Execution**: Integrate a secure sandboxing engine (such as Judge0 or client-side Pyodide) to execute candidate algorithms against unit test cases.
- **Third-Party Voice Fallback**: Provide an optional backend audio pipeline (e.g., OpenAI Whisper and ElevenLabs) for browsers lacking native Web Speech API support.
- **Managed Vector Store Support**: Add a configuration toggle for hosted vector databases (Pinecone, Qdrant, or PostgreSQL `pgvector`) for persistent cloud deployments.
- **Automated Test Coverage**: Introduce unit test suites for FastAPI services (`pytest` with `httpx.AsyncClient`) and React component tests (`vitest` with React Testing Library).

---

## 🤝 Contributing

Contributions to Mockhora are welcome! To contribute:

1. **Fork the repository** on GitHub.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** describing your changes, technical implementation details, and screenshots if applicable.

---

## 📄 License

The repository includes a `LICENSE` file that is currently awaiting final open-source license selection (e.g., MIT License). Please consult the repository owner prior to commercial distribution.

---

## 🔗 Links and Resources

- **Live Application**: [https://mockhora.vercel.app/](https://mockhora.vercel.app/)
- **GitHub Repository**: [https://github.com/hd84339/Interview-Mocker](https://github.com/hd84339/Interview-Mocker)
- **Local Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) *(when running backend locally)*
- **Issue Tracker**: [https://github.com/hd84339/Interview-Mocker/issues](https://github.com/hd84339/Interview-Mocker/issues)

---

*Mockhora — Practice smarter. Interview with confidence.*
