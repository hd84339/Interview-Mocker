import { Sparkles, Volume2, CheckCircle2 } from "lucide-react";

export default function AIInterviewer({
  currentQuestion,
  currentQIndex,
  totalQuestions,
  aiSpeaking,
  speakQuestionText,
}) {
  return (
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
            <span>
              Q{currentQIndex + 1}/{totalQuestions}
            </span>
          </div>
          <p className="text-base font-semibold text-white leading-relaxed">
            "{currentQuestion.text}"
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Speak clearly or type your response in the candidate panel on the right.
        </span>
      </div>
    </div>
  );
}
