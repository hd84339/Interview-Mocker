import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FileText, 
  ArrowLeft, 
  Award, 
  AlertTriangle,
  Calendar,
  Clock,
  Trash2
} from "lucide-react";
import { interviewService } from "../services/interviewService";

function ReportListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await interviewService.getRecentInterviews();
        setReports(data);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      try {
        await interviewService.deleteReport(id);
        setReports(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        console.error("Failed to delete report:", err);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-400" />
          <span>All Interview Reports</span>
        </h1>
        <p className="text-sm text-slate-400">Review your past interview sessions, including completed feedback and aborted attempts.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl relative">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Loading your reports...</p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="text-center space-y-3">
              <p className="text-sm text-slate-400">You haven't attempted any interviews yet.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {reports.map((session) => (
              <div
                key={session.id}
                onClick={() => navigate(`/report/${session.id}`)}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-800/40 transition-colors group cursor-pointer gap-6 relative z-10"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-transform ${session.status === 'Completed' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                    {session.status === 'Completed' ? <Award className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-lg">
                        {session.role}
                      </h3>
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold tracking-wide border border-slate-700">
                        {session.level}
                      </span>
                      {session.status === 'Aborted' && (
                        <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-bold tracking-wide border border-rose-500/20">
                          ABORTED
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-slate-400 font-medium">
                      <span>{session.type}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span>{session.questions_count} Questions</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {session.date}</span>
                      {session.time && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {session.time}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    {session.status === 'Completed' ? (
                      <>
                        <div className="text-2xl font-extrabold text-emerald-400">
                          {session.score}%
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Overall Score
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-bold text-slate-500">
                          N/A
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          No Score
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(e, session.id)}
                      className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all group-hover:opacity-100 opacity-50"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/report/${session.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-300 text-sm font-semibold transition-all shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportListPage;
