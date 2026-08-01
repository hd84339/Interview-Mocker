import { Video, Mic, CheckCircle2, Sparkles } from "lucide-react";

export default function PracticeModeStep({
  enableVoice,
  setEnableVoice,
  enableCamera,
  setEnableCamera,
  onBack,
  handleLaunch,
  launching,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Video className="w-5 h-5 text-indigo-400" />
        <span>Studio Hardware & Mode</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voice Toggle */}
        <div
          onClick={() => setEnableVoice(!enableVoice)}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            enableVoice
              ? "bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10"
              : "bg-slate-950/40 border-slate-800 opacity-60"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Mic className="w-5 h-5" />
            </div>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                enableVoice
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "border-slate-700"
              }`}
            >
              {enableVoice && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </div>
          <h3 className="font-bold text-white text-sm">
            AI Voice & Speech Output
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time speech synthesis for asking questions orally.
          </p>
        </div>

        {/* WebCam Eye Tracking Toggle */}
        <div
          onClick={() => setEnableCamera(!enableCamera)}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            enableCamera
              ? "bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-500/10"
              : "bg-slate-950/40 border-slate-800 opacity-60"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Video className="w-5 h-5" />
            </div>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                enableCamera
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "border-slate-700"
              }`}
            >
              {enableCamera && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </div>
          <h3 className="font-bold text-white text-sm">
            WebCam Eye & Pose Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Analyze eye contact, posture, and facial confidence signals.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
        >
          Back
        </button>

        <button
          type="button"
          disabled={launching}
          onClick={handleLaunch}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {launching ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Launch Interview Studio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
