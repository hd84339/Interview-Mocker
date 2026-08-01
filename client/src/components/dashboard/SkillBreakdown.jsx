import { Sparkles } from "lucide-react";

export default function SkillBreakdown() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <span>AI Skill Breakdown</span>
      </h2>

      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-5">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-300">Technical & Code Accuracy</span>
            <span className="text-emerald-400 font-bold">90%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
              style={{ width: "90%" }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-300">
              Structural Clarity (STAR Method)
            </span>
            <span className="text-indigo-400 font-bold">85%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
              style={{ width: "85%" }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-300">Communication & Delivery</span>
            <span className="text-purple-400 font-bold">88%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"
              style={{ width: "88%" }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-300">Eye Contact & Eye Tracking</span>
            <span className="text-amber-400 font-bold">82%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
              style={{ width: "82%" }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-slate-200">
            💡 Recommended Next Step:
          </p>
          <p>
            Practice System Design scaling questions to boost your senior-level
            architecture score.
          </p>
        </div>
      </div>
    </div>
  );
}
