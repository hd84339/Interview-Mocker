import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { interviewService } from "../services/interviewService";
import InterviewHeader from "../components/interview/InterviewHeader";
import AIInterviewer from "../components/interview/AIInterviewer";
import CandidateStudio from "../components/interview/CandidateStudio";

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
  const recognitionRef = useRef(null);

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
    let currentStream = null;

    if (cameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          currentStream = stream;
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

    // Cleanup function: runs on unmount or when cameraActive changes
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
      <InterviewHeader
        session={session}
        currentQIndex={currentQIndex}
        elapsedSeconds={elapsedSeconds}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <AIInterviewer
          currentQuestion={currentQuestion}
          currentQIndex={currentQIndex}
          totalQuestions={session.questions.length}
          aiSpeaking={aiSpeaking}
          speakQuestionText={speakQuestionText}
        />

        <CandidateStudio
          videoRef={videoRef}
          cameraActive={cameraActive}
          setCameraActive={setCameraActive}
          micActive={micActive}
          setMicActive={setMicActive}
          eyeContactScore={eyeContactScore}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          isRecording={isRecording}
          toggleSpeechRecognition={toggleSpeechRecognition}
          submitting={submitting}
          handleNextQuestion={handleNextQuestion}
        />
      </div>
    </div>
  );
}

export default InterviewPage;
