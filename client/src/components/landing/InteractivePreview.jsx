import { useState } from "react";
import { Sparkles, Terminal, CheckCircle, HelpCircle, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ROLE_SAMPLES = [
  {
    id: "fullstack",
    title: "Full Stack Engineer",
    question: "Explain how React 19 Server Components differ from traditional Client Components, and when you would use each.",
    sampleAnswer: "Server components run exclusively on the server during rendering and ship zero JavaScript bundle to the client for that sub-tree. Client components use standard React state, effects, and event handlers on the browser.",
    feedback: {
      score: 95,
      technicalDepth: "Excellent",
      keyStrength: "Clear distinction between bundle size impact and client interactivity requirement.",
      improvementTip: "Mention Server Actions for form submissions and mutations."
    }
  },
  {
    id: "system-design",
    title: "System Design",
    question: "How would you design a rate limiter service for a public API gateway handling 100k requests per second?",
    sampleAnswer: "I would use Redis with a Sliding Window Log or Token Bucket algorithm. Redis cluster handles distributed state with atomic INCR and EXPIRE operations.",
    feedback: {
      score: 92,
      technicalDepth: "High",
      keyStrength: "Correct choice of Token Bucket in distributed Redis environment.",
      improvementTip: "Discuss handling Redis node failure with dynamic local fallback memory buffers."
    }
  },
  {
    id: "product-manager",
    title: "Product Manager",
    question: "Tell me about a time a major feature launch failed metrics. How did you diagnose and pivot?",
    sampleAnswer: "After launching an onboarding wizard, drop-off spiked by 18%. I analyzed funnel drop-off telemetry, identified a mandatory phone verification step causing friction, and made it optional.",
    feedback: {
      score: 88,
      technicalDepth: "Good",
      keyStrength: "Strong metric-driven analysis (funnel drop-off) and fast iteration.",
      improvementTip: "Highlight user interview qualitative feedback alongside analytics data."
    }
  }
];

function InteractivePreview() {
  const [selectedRoleId, setSelectedRoleId] = useState("fullstack");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentSample = ROLE_SAMPLES.find((role) => role.id === selectedRoleId) || ROLE_SAMPLES[0];

  const handleRoleChange = (id) => {
    setIsRefreshing(true);
    setSelectedRoleId(id);
    setTimeout(() => setIsRefreshing(false), 250);
  };

  return (
    <section id="interactive-demo" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glowing accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive AI Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Experience AI Interviewing in Action
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            Select a target role below to see how our AI generates tailored prompts and provides granular response diagnostics.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {ROLE_SAMPLES.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${
                selectedRoleId === role.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
              }`}
            >
              <span>{role.title}</span>
            </button>
          ))}
        </div>

        {/* Interactive Demo Display Card */}
        <div className="max-w-4xl mx-auto bg-slate-950/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
          <div className={`space-y-6 ${isRefreshing ? "opacity-40 transition-opacity" : "opacity-100"}`}>
            
            {/* AI Prompt Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                    AI Interview Prompt
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Role: {currentSample.title}</span>
                </div>
                <p className="text-slate-100 font-semibold text-base sm:text-lg leading-snug">
                  "{currentSample.question}"
                </p>
              </div>
            </div>

            {/* Candidate Sample Answer */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
                Sample Candidate Answer
              </span>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                "{currentSample.sampleAnswer}"
              </p>
            </div>

            {/* AI Instant Feedback Result */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    {currentSample.feedback.score}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Diagnostic Score</h4>
                    <p className="text-xs text-slate-400">Technical Depth: <span className="text-emerald-400 font-semibold">{currentSample.feedback.technicalDepth}</span></p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Strong Candidate Response</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Key Strength
                  </span>
                  <p className="text-slate-200 leading-relaxed">{currentSample.feedback.keyStrength}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    AI Improvement Tip
                  </span>
                  <p className="text-slate-300 leading-relaxed">{currentSample.feedback.improvementTip}</p>
                </div>
              </div>
            </div>

          </div>

          {/* CTA Bar */}
          <div className="mt-8 text-center pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-400">
              Want personalized feedback on your own resume & target role?
            </p>
            <Link
              to="/create-interview"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 shrink-0"
            >
              <span>Create Full Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

export default InteractivePreview;
