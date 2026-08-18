import { Clock, Square, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InterviewHeader({ session, questionCount, remainingSeconds, questionSeconds }) {
  const navigate = useNavigate();

  const formatTime = (totalSeconds) => {
    if (totalSeconds === undefined || totalSeconds === null) return "--:--";
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.floor(Math.max(0, totalSeconds) % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = remainingSeconds < 300; // < 5 mins
  const isQuestionLowTime = questionSeconds < 30; // < 30 secs

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <h1 className="text-base font-bold text-white">{session.role}</h1>
          <p className="text-xs text-slate-400">Question {questionCount}</p>
        </div>
      </div>

      {/* Timers & Finish Session CTA */}
      <div className="flex items-center gap-4">
        {/* Question Timer */}
        {questionSeconds !== undefined && (
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${isQuestionLowTime ? 'bg-amber-950/80 border-amber-800 text-amber-300 animate-pulse' : 'bg-slate-800/80 border-slate-700 text-slate-300'}`}>
            <Timer className={`w-4 h-4 ${isQuestionLowTime ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>Q-Time: {formatTime(questionSeconds)}</span>
          </div>
        )}

        {/* Global Timer */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${isLowTime ? 'bg-rose-950/80 border-rose-800 text-rose-300 animate-pulse' : 'bg-slate-950/80 border-slate-800 text-indigo-300'}`}>
          <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-indigo-400'}`} />
          <span>Total: {formatTime(remainingSeconds)}</span>
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
  );
}
