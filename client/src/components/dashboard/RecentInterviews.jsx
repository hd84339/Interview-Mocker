import { Link } from "react-router-dom";
import { FileText, ArrowUpRight, Award } from "lucide-react";

export default function RecentInterviews({ loading, recentInterviews }) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Recent Mock Interviews</span>
          </h2>
          <p className="text-xs text-slate-400">
            Review your past sessions and AI feedback
          </p>
        </div>
        <Link
          to="/report"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          <span>View All Reports</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-slate-400">
            Loading interview records...
          </div>
        ) : recentInterviews.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No interviews completed yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {recentInterviews.map((session) => (
              <div
                key={session.id}
                className="p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">
                        {session.role}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                        {session.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {session.type} • {session.questions_count} Questions •{" "}
                      {session.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-emerald-400">
                      {session.score}%
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {session.status}
                    </div>
                  </div>
                  <Link
                    to={`/report`}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold transition-all"
                  >
                    Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
