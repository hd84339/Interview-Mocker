import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  PlusCircle, 
  UploadCloud, 
  Trophy, 
  Clock, 
  Target, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  FileText,
  TrendingUp,
  Award
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { interviewService } from "../services/interviewService";

function DashboardPage() {
  const { user } = useAuthContext();
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await interviewService.getRecentInterviews();
        setRecentInterviews(data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { label: "Interviews Completed", value: "12", change: "+3 this week", icon: Trophy, color: "from-amber-500/20 to-orange-500/20 text-amber-400" },
    { label: "Average Performance Score", value: "86%", change: "+5% overall", icon: TrendingUp, color: "from-emerald-500/20 to-teal-500/20 text-emerald-400" },
    { label: "Practice Time", value: "14.5 hrs", change: "4 sessions", icon: Clock, color: "from-indigo-500/20 to-purple-500/20 text-indigo-400" },
    { label: "Target Role Readiness", value: "Senior Level", change: "Top 10%", icon: Target, color: "from-pink-500/20 to-rose-500/20 text-pink-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Hero Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Interview Prep Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">{user?.displayName || "Alex"}</span> 👋
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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">{item.label}</span>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">{item.value}</div>
            <div className="text-xs font-medium text-indigo-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split: Recent Interviews + Skill Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Practice Sessions (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Recent Mock Interviews</span>
              </h2>
              <p className="text-xs text-slate-400">Review your past sessions and AI feedback</p>
            </div>
            <Link to="/report" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <span>View All Reports</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading interview records...</div>
            ) : recentInterviews.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No interviews completed yet.</div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {recentInterviews.map((session) => (
                  <div key={session.id} className="p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">{session.role}</h3>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                            {session.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {session.type} • {session.questions_count} Questions • {session.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-emerald-400">{session.score}%</div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{session.status}</div>
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

        {/* Skill Readiness Card (1 Column) */}
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
                <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" style={{ width: "90%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Structural Clarity (STAR Method)</span>
                <span className="text-indigo-400 font-bold">85%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Communication & Delivery</span>
                <span className="text-purple-400 font-bold">88%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" style={{ width: "88%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Eye Contact & Eye Tracking</span>
                <span className="text-amber-400 font-bold">82%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: "82%" }} />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-200">💡 Recommended Next Step:</p>
              <p>Practice System Design scaling questions to boost your senior-level architecture score.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
