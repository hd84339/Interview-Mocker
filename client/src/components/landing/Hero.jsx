import { Sparkles, CheckCircle2, Mic, FileText, BarChart3, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white">
      {/* Background ambient lighting blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-400/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Next-Gen AI Interview Prep Platform</span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="hidden sm:inline-block text-blue-600/80 text-xs">v2.0 Live</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              Ace Your Next Interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">Real-Time AI</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Upload your resume, select your target role, and practice hyper-realistic AI voice interviews. Get instant scoring on technical depth, tone, and behavioral clarity.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
              <Link
                to="/create-interview"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2.5"
              >
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span>Start Practice Free</span>
              </Link>
              <a
                href="#interactive-demo"
                className="bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-semibold text-base px-6 py-4 rounded-xl transition-all text-center flex items-center justify-center gap-2 border border-slate-200/80"
              >
                <span>Try Live Preview</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 font-semibold pt-2 border-t border-slate-100 w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Tailored Role Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Instant Feedback</span>
              </div>
            </div>
          </div>

          {/* Right Column: SaaS Product Preview Mockup */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl sm:rounded-3xl bg-slate-900/5 p-2 sm:p-3 ring-1 ring-inset ring-slate-900/10 shadow-2xl">
              <div className="bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white space-y-5 shadow-2xl border border-slate-800 overflow-hidden relative">
                
                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] sm:text-xs font-mono text-slate-400 tracking-wide">Live AI Session</span>
                  </div>
                </div>

                {/* Live AI Audio Interface Card */}
                <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl p-5 border border-slate-800 text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[210px] space-y-4">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    REC
                  </div>
                  
                  {/* AI Mic & Audio Spectrum Animation */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600/30 border border-blue-500/80 flex items-center justify-center animate-pulse-glow">
                      <Mic className="w-7 h-7 text-blue-400" />
                    </div>
                  </div>

                  {/* Audio Wave Spectrum Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-6">
                    <span className="w-1 bg-blue-400 rounded-full animate-wave-1" />
                    <span className="w-1 bg-indigo-400 rounded-full animate-wave-2" />
                    <span className="w-1 bg-blue-400 rounded-full animate-wave-3" />
                    <span className="w-1 bg-indigo-400 rounded-full animate-wave-4" />
                    <span className="w-1 bg-blue-400 rounded-full animate-wave-1" />
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-slate-200 text-center italic max-w-xs leading-relaxed">
                    "How do you handle data consistency across microservices during network partition?"
                  </p>
                </div>

                {/* Real-time Analysis Badges */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Resume Match</p>
                      <p className="text-xs sm:text-sm font-bold text-white">96% Relevant</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Confidence</p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-400">92 / 100</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
