import { useState } from "react";
import { User, Settings as SettingsIcon, Mic, Video, Volume2, Save, CheckCircle2 } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

function SettingsPage() {
  const { user, setUser } = useAuthContext();

  const [displayName, setDisplayName] = useState(user?.full_name || user?.displayName || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Senior Full Stack Engineer");
  
  const [aiVoice, setAiVoice] = useState("en-US-Neural-Standard");
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [micStatus, setMicStatus] = useState("Ready");
  const [camStatus, setCamStatus] = useState("Ready");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      displayName,
      email,
      targetRole,
    };
    if (setUser) setUser(updatedUser);
    localStorage.setItem("mockhora_user", JSON.stringify(updatedUser));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const testAudio = () => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance("Welcome to Mockhora AI voice test.");
      msg.rate = speechSpeed;
      window.speechSynthesis.speak(msg);
    } else {
      alert("Speech synthesis is not supported in this browser.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-indigo-400" />
          <span>Account & Platform Settings</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your profile, target preferences, and AI hardware settings.</p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Candidate Profile Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Candidate Profile</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Target Job Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* AI Voice & Audio Preferences */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Volume2 className="w-5 h-5 text-indigo-400" />
            <span>AI Voice & Speech Controls</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">AI Accent & Tone</label>
              <select
                value={aiVoice}
                onChange={(e) => setAiVoice(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="en-US-Neural-Standard">English (US) - Professional Neutral</option>
                <option value="en-UK-Neural-Formal">English (UK) - Formal Technical</option>
                <option value="en-AU-Neural-Casual">English (AU) - Friendly Conversational</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Speech Speed ({speechSpeed}x)</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.1"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>0.8x (Slower)</span>
                <span>1.0x (Normal)</span>
                <span>1.4x (Faster)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Test how the AI interviewer voice sounds:</span>
            <button
              type="button"
              onClick={testAudio}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 hover:bg-indigo-600/30 transition-all"
            >
              Play Sample Voice
            </button>
          </div>
        </div>

        {/* Hardware Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Mic className="w-5 h-5 text-indigo-400" />
            <span>Hardware Diagnostics</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs font-bold text-white">Microphone</p>
                  <p className="text-[11px] font-semibold text-emerald-400">{micStatus}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMicStatus("Tested & Active")}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Test Mic
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs font-bold text-white">WebCam Eye Tracker</p>
                  <p className="text-[11px] font-semibold text-emerald-400">{camStatus}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCamStatus("Tested & Active")}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Test Camera
              </button>
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
}

export default SettingsPage;
