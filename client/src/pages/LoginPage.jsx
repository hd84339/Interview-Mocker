import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";
import { STORAGE_KEYS } from "../constants/authKeys";

function LoginPage() {
  const navigate = useNavigate();
  const { loginUser, setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleSuccess = async (credential) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await authService.loginWithGoogle(credential);
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
        if (res.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
        }
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMessage(
        err.message || "Google Authentication failed. Verify your token or backend status."
      );
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
              Mockhora
            </span>
          </Link>
          <p className="text-slate-400 text-sm">
            Sign in with Google to access your AI interview dashboard
          </p>
        </div>

        {/* Main Glassmorphism Auth Card */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Official Google Sign In Button Container */}
          <div className="flex flex-col items-center justify-center w-full min-h-[48px]">
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-indigo-400 font-medium py-3">
                <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <span>Authenticating with Google...</span>
              </div>
            ) : (
              <div className="w-full flex justify-center [&>div]:!w-full [&>div>iframe]:!w-full">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      handleGoogleSuccess(credentialResponse.credential);
                    }
                  }}
                  onError={() => {
                    setErrorMessage("Google Sign In failed. Please check your Google account.");
                  }}
                  useOneTap
                  theme="filled_blue"
                  shape="circle"
                  text="continue_with"
                  width="100%"
                />
              </div>
            )}
          </div>


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
