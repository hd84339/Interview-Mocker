import { Link } from "react-router-dom";
import { Sparkles, PlusCircle, UploadCloud } from "lucide-react";

export default function DashboardHero({ user }) {
  return (
    <div className="relative rounded-3xl p-8 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Interview Prep Active</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              {user?.full_name || user?.displayName || user?.name || "User"}
            </span>{" "}
            👋
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Targeting <strong className="text-white">Senior Full Stack Engineer</strong>. You have completed 12 practice sessions and maintained an 86% average readiness score.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            to="/create-interview"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Start Practice Session</span>
          </Link>
          <Link
            to="/create-interview?tab=resume"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all"
          >
            <UploadCloud className="w-5 h-5 text-indigo-400" />
            <span>Upload Resume</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
