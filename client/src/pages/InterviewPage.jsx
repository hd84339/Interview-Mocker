import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  Send, 
  Clock, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Square
} from "lucide-react";
import { interviewService } from "../services/interviewService";

function InterviewPage() {
  const navigate = useNavigate();
  
  // Session data state
  const [session, setSession] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  
  // Controls & Hardware
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Stats & Timers
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [eyeContactScore, setEyeContactScore] = useState(88);

  const videoRef = useRef(null);

  // Load session from Storage or create default
  useEffect(() => {
    const stored = sessionStorage.getItem("active_interview_session");
    if (stored) {
      setSession(JSON.parse(stored));
    } else {
      // Default session
      interviewService.createInterview({ role: "Senior Full Stack Engineer" }).then((s) => {
        setSession(s);
      });
    }
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WebCam Video Stream Simulation / WebCam request
  useEffect(() => {
    if (cameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera permission refused or unavailable
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  }, [cameraActive]);

  // Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your response.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();
      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => (prev ? prev + " " + transcript : transcript));
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    } else {
      setIsRecording(false);
    }
  };

  const speakQuestionText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => setAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextQuestion = async () => {
    if (!userAnswer.trim()) return;
    setSubmitting(true);

    const question = session.questions[currentQIndex];
    await interviewService.submitAnswer(session.id, question.id, userAnswer);

    setUserAnswer("");
    setSubmitting(false);

    if (currentQIndex + 1 < session.questions.length) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      speakQuestionText(session.questions[nextIdx].text);
    } else {
      // Finished all questions!
      navigate("/report");
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session || !session.questions) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Initializing Live AI Interview Studio...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQIndex];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h1 className="text-base font-bold text-white">{session.role}</h1>
            <p className="text-xs text-slate-400">Question {currentQIndex + 1} of {session.questions.length}</p>
          </div>
        </div>

        {/* Timer & Finish Session CTA */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-indigo-300">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => navigate("/report")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold transition-all"
          >
            <Square className="w-3.5 h-3.5" />
            <span>Finish & View Report</span>
          </button>
        </div>
      </div>

      {/* Main Dual Grid: AI Interviewer vs Candidate Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Interviewer Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Interviewer</span>
              </span>
              <button
                onClick={() => speakQuestionText(currentQuestion.text)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/20 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Replay Question</span>
              </button>
            </div>

            {/* AI Avatar Waveform Animation Box */}
            <div className="relative rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-950 border border-indigo-500/20 p-6 text-center overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4 relative">
                {aiSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-indigo-500/40 animate-ping" />
                )}
                <Sparkles className="w-10 h-10 text-white relative z-10" />
              </div>

              {/* Audio Waveform visualizer bars */}
              <div className="flex items-center justify-center gap-1 h-6">
                {[40, 70, 30, 90, 50, 80, 40, 60].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all ${
                      aiSpeaking ? "bg-indigo-400 animate-bounce" : "bg-slate-700"
                    }`}
                    style={{
                      height: aiSpeaking ? `${h}%` : "30%",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Question Text Box */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>CATEGORY: {currentQuestion.category || "General"}</span>
                <span>Q{currentQIndex + 1}/{session.questions.length}</span>
              </div>
              <p className="text-base font-semibold text-white leading-relaxed">
                "{currentQuestion.text}"
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Speak clearly or type your response in the candidate panel on the right.</span>
          </div>
        </div>

        {/* Right Column: Candidate WebCam & Response Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Candidate WebCam Box */}
          <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl aspect-video max-h-[280px]">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">
                <VideoOff className="w-12 h-12" />
              </div>
            )}

            {/* Overlay Badges: Eye Contact Status + Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-emerald-300">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Eye Contact: {eyeContactScore}%</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setMicActive(!micActive)}
                className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                  micActive ? "bg-slate-900/80 border-slate-700 text-white" : "bg-rose-500/20 border-rose-500/30 text-rose-300"
                }`}
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                  cameraActive ? "bg-slate-900/80 border-slate-700 text-white" : "bg-rose-500/20 border-rose-500/30 text-rose-300"
                }`}
              >
                {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Candidate Response Transcript & Input Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Answer</label>
              
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isRecording
                    ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30"
                    : "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30"
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? "Listening... (Click to Pause)" : "Push to Speak"}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your response here or click 'Push to Speak' to use your microphone..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400 font-semibold">
                Word Count: <span className="text-white">{userAnswer.trim().split(/\s+/).filter(Boolean).length}</span> words
              </div>

              <button
                type="button"
                disabled={submitting || !userAnswer.trim()}
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit & Next Question</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default InterviewPage;
