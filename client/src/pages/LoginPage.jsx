import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const { loginUser, setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await authService.loginWithGoogle();
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem("mockora_user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token || "google_token");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google sign in failed:", err);
      loginUser("Google Candidate", "candidate@gmail.com");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickLogin = () => {
    loginUser("Alex Morgan", "alex.morgan@example.com");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Mockora
            </span>
          </Link>
          <p className="text-slate-400 text-sm">
            Sign in with Google to access your AI interview dashboard
          </p>
        </div>

        {/* Main Glassmorphism Auth Card */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {/* Primary Google Sign In Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </>
            )}
          </button>

          {/* Quick Demo Login Banner */}
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Instant Demo Access</p>
                <p className="text-[11px] text-slate-400">Try without Google Sign-In</p>
              </div>
            </div>
            <button
              onClick={handleDemoQuickLogin}
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Quick Login
            </button>
          </div>

          {/* Key Features Bullet List */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time Gemini AI voice & text interviewing</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Resume parsing & tailored question generator</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant feedback report & quantitative scoring</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default LoginPage;
