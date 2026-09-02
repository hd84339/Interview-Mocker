import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { interviewService } from "../services/interviewService";
import InterviewHeader from "../components/interview/InterviewHeader";
import AIInterviewer from "../components/interview/AIInterviewer";
import CandidateStudio from "../components/interview/CandidateStudio";
import CodeEditorPane from "../components/interview/CodeEditorPane";

function InterviewPage() {
  const navigate = useNavigate();
  
  // Session data state
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  
  // Coding state
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  
  // Controls & Hardware
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Stats & Timers
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(120);
  const [eyeContactScore, setEyeContactScore] = useState(88);
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load session from Storage or create default
  useEffect(() => {
    async function init() {
      try {
        const stored = sessionStorage.getItem("active_interview_session");
        let s = stored ? JSON.parse(stored) : null;
        if (!s) {
          s = await interviewService.createInterview({ role: "Senior Full Stack Engineer", duration: 30 });
        }
        setSession(s);
        let dur = parseInt(s.duration, 10);
        if (isNaN(dur)) dur = 30; // fallback if missing
        setRemainingSeconds(dur * 60);

        // Start session to get first question
        const startRes = await interviewService.startInterview(s.id);
        if (startRes.question) {
          setCurrentQuestion(startRes.question);
          speakQuestionText(startRes.question.text || startRes.question.question);
          const qt = startRes.question.type;
          setQuestionSeconds(qt === "coding" || qt === "system_design" ? 180 : 120);
        }
      } catch (err) {
        console.error("Failed to start interview", err);
      } finally {
        setInitializing(false);
      }
    }
    init();
  }, []);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !initializing && session && !submitting) {
        setShowTabSwitchWarning(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initializing, session, submitting]);

  const handleCancelInterview = () => {
    navigate("/dashboard");
  };

  // Timer effect
  useEffect(() => {
    if (initializing || !session || submitting) return;
    
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });

      setQuestionSeconds((prev) => {
        if (prev <= 1) {
          handleNextQuestion(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [initializing, session, submitting, currentQuestion]);

  // Eye Contact Simulation effect
  useEffect(() => {
    if (!cameraActive) return;
    const interval = setInterval(() => {
      setEyeContactScore((prev) => {
        const change = Math.floor(Math.random() * 7) - 3;
        const next = prev + change;
        return Math.min(99, Math.max(70, next));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [cameraActive]);

  // WebCam Video Stream Simulation
  useEffect(() => {
    let currentStream = null;
    if (cameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {});
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
    return () => {
      if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    };
  }, [cameraActive]);

  // Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your response.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => (prev ? prev + " " + transcript : transcript));
      };
      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }

    if (!isRecording) {
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Recognition already started", e);
      }
    } else {
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  };

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakQuestionText = (text) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => setAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTimeUp = async () => {
    setSubmitting(true);
    const isCode = currentQuestion?.type === "coding";
    const answerToSubmit = isCode ? code : userAnswer;
    
    await interviewService.submitAnswer(
      session.id, 
      currentQuestion?.id, 
      answerToSubmit || "Time expired",
      isCode,
      language,
      true // force finish
    );
    navigate("/report");
  };

  const handleNextQuestion = async (isTimeout = false) => {
    const isCode = currentQuestion?.type === "coding";
    if (!isTimeout) {
      if (!isCode && !userAnswer.trim()) return;
      if (isCode && !code.trim()) return;
    }
    
    setSubmitting(true);
    let answerToSubmit = isCode ? code : userAnswer;
    if (isTimeout && !answerToSubmit.trim()) {
      answerToSubmit = "Time expired";
    }

    const res = await interviewService.submitAnswer(
      session.id, 
      currentQuestion.id, 
      answerToSubmit,
      isCode,
      language
    );

    setUserAnswer("");
    setCode("");

    if (res.finished || remainingSeconds <= 0) {
      setSubmitting(false);
      navigate("/report");
    } else if (res.question) {
      setQuestionCount(prev => prev + 1);
      setCurrentQuestion(res.question);
      const qt = res.question.type;
      setQuestionSeconds(qt === "coding" || qt === "system_design" ? 180 : 120);
      speakQuestionText(res.question.text || res.question.question);
      setSubmitting(false);
    } else {
      setSubmitting(false);
    }
  };

  if (initializing || !session || !currentQuestion) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">
            {initializing ? "Initializing Live AI Interview Studio..." : "AI is generating your first question..."}
          </p>
        </div>
      </div>
    );
  }

  const isCoding = currentQuestion?.type === "coding";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
      {showTabSwitchWarning && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-xl font-bold">Tab Switch Detected</h2>
            </div>
            <p className="text-slate-300 text-sm">
              We noticed you navigated away from the interview tab. During a real interview, this might be flagged.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setShowTabSwitchWarning(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all"
              >
                Continue Interview
              </button>
              <button
                onClick={handleCancelInterview}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all shadow-lg shadow-rose-600/20"
              >
                Cancel Interview
              </button>
            </div>
          </div>
        </div>
      )}

      <InterviewHeader
        session={session}
        questionCount={questionCount}
        remainingSeconds={remainingSeconds}
        questionSeconds={questionSeconds}
      />

      <div className="flex flex-col gap-6 flex-1 h-full min-h-0">
        {/* Main Video & Code Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
          {/* AI Interviewer */}
          <div className={isCoding ? 'lg:col-span-3' : 'lg:col-span-6'}>
            <AIInterviewer
              currentQuestion={currentQuestion}
              currentQIndex={questionCount - 1} // just for UI display
              totalQuestions={"∞"} // dynamic
              aiSpeaking={aiSpeaking}
              speakQuestionText={speakQuestionText}
              compact={isCoding}
            />
            {isCoding && (
              <div className="mt-6">
                <CandidateStudio
                  videoRef={videoRef}
                  cameraActive={cameraActive}
                  setCameraActive={setCameraActive}
                  micActive={micActive}
                  setMicActive={setMicActive}
                  eyeContactScore={eyeContactScore}
                  hideTextarea={true}
                />
              </div>
            )}
          </div>

          {/* Candidate Camera & Answer Area (When not coding) */}
          {!isCoding && (
            <div className="lg:col-span-6 flex flex-col gap-6 h-full">
              {/* Answer Input Top */}
              <div className="flex-1">
                <CandidateStudio
                  hideCamera={true}
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                  isRecording={isRecording}
                  toggleSpeechRecognition={toggleSpeechRecognition}
                  submitting={submitting}
                  handleNextQuestion={() => handleNextQuestion(false)}
                />
              </div>

              {/* Camera Below */}
              <div className="mt-auto">
                <CandidateStudio
                  videoRef={videoRef}
                  cameraActive={cameraActive}
                  setCameraActive={setCameraActive}
                  micActive={micActive}
                  setMicActive={setMicActive}
                  eyeContactScore={eyeContactScore}
                  hideTextarea={true}
                  hideSubmit={true}
                />
              </div>
            </div>
          )}

          {/* Code Editor (When coding) */}
          {isCoding && (
            <div className="lg:col-span-9 h-full min-h-[500px]">
              <CodeEditorPane
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleNextQuestion(false)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Submit Code & Next Question</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
