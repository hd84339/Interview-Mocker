import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  RotateCcw, 
  Download, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  TrendingUp, 
  Eye, 
  MessageSquare 
} from "lucide-react";
import { interviewService } from "../services/interviewService";

function ReportPage() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQIndex, setExpandedQIndex] = useState(0);

  useEffect(() => {
    async function loadReport() {
      try {
        const stored = sessionStorage.getItem("active_interview_session");
        const session = stored ? JSON.parse(stored) : null;
        const data = await interviewService.getReport(session?.id || "int_demo");
        setReport(data);
      } catch (err) {
        console.error("Error loading report:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  if (loading || !report) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Generating AI Performance Report & Recommendations...</p>
        </div>
      </div>
    );
  }

  const scoreMetrics = [
    { label: "Technical Accuracy", score: report.scores.technical_accuracy, icon: Target, color: "text-emerald-400" },
    { label: "Structural Clarity", score: report.scores.structural_clarity, icon: TrendingUp, color: "text-indigo-400" },
    { label: "Communication & Delivery", score: report.scores.communication_delivery, icon: MessageSquare, color: "text-purple-400" },
    { label: "Eye Contact & Pose", score: report.scores.eye_contact_confidence, icon: Eye, color: "text-amber-400" },
  ];

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

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Summary</span>
          </button>
          <Link
            to="/create-interview"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Interview</span>
          </Link>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Overall Dial Ring */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * report.overall_score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white">{report.overall_score}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">OUT OF 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold">
                <Award className="w-3.5 h-3.5" />
                <span>{report.hire_recommendation}</span>
              </div>
              <p className="text-xs text-slate-400">Evaluated for {report.role}</p>
            </div>
          </div>

          {/* Sub Metric Grid */}
          <div className="md:col-span-7 grid grid-cols-2 gap-4">
            {scoreMetrics.map((m, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{m.label}</span>
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className="text-2xl font-extrabold text-white">{m.score}%</div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${m.color.replace('text-', 'bg-')}`} style={{ width: `${m.score}%` }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Strengths & Improvements Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Key Technical Strengths</span>
          </h2>
          <ul className="space-y-2.5">
            {report.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-400" />
            <span>Actionable Growth Areas</span>
          </h2>
          <ul className="space-y-2.5">
            {report.improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Question-by-Question Deep Dive */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>Question & Response Breakdown</span>
        </h2>

        <div className="space-y-3">
          {report.questions_feedback.map((item, idx) => {
            const isOpen = expandedQIndex === idx;
            return (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg transition-all">
                <button
                  onClick={() => setExpandedQIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 font-extrabold text-xs flex items-center justify-center border border-indigo-500/20">
                      Q{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{item.question}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Score: <strong className="text-emerald-400">{item.score}%</strong></p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 border-t border-slate-800/60 space-y-4 bg-slate-950/40 animate-in fade-in duration-150">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Your Response Transcript</span>
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed italic">
                        "{item.answer}"
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">AI Evaluator Feedback</span>
                        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                          {item.feedback}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Ideal Model Response Strategy</span>
                        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
                          {item.ideal_answer}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default ReportPage;
