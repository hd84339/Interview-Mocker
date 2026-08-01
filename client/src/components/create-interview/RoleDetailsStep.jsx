import { Briefcase, ArrowRight } from "lucide-react";

export default function RoleDetailsStep({
  role,
  setRole,
  level,
  setLevel,
  type,
  setType,
  questionCount,
  setQuestionCount,
  onNext,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-indigo-400" />
        <span>Target Role & Scope</span>
      </h2>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Job Title / Target Role
        </label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Senior React Developer, DevOps Engineer"
          className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Experience Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["Junior", "Mid", "Senior", "Lead"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  level === lvl
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Interview Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option>Technical & Architecture</option>
            <option>Behavioral & Leadership</option>
            <option>System Design & Scalability</option>
            <option>HR & Background Screening</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Number of Questions ({questionCount})
        </label>
        <input
          type="range"
          min="3"
          max="10"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-1">
          <span>3 Questions (Quick Practice)</span>
          <span>5 Questions (Standard)</span>
          <span>10 Questions (Full Mock)</span>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all"
        >
          <span>Continue to Resume Upload</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
