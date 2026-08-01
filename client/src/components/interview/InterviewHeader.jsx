import { Clock, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InterviewHeader({ session, currentQIndex, elapsedSeconds }) {
  const navigate = useNavigate();

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
  );
}
