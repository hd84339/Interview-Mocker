import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Video, 
  Mic, 
  FileText,
  AlertCircle,
  X
} from "lucide-react";
import { resumeService } from "../services/resumeService";
import { interviewService } from "../services/interviewService";

function CreateInterviewPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("Senior Full Stack Engineer");
  const [level, setLevel] = useState("Senior");
  const [type, setType] = useState("Technical & Architecture");
  const [questionCount, setQuestionCount] = useState(5);
  
  // Resume File State
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [resumeError, setResumeError] = useState("");

  // Mode Options
  const [enableVoice, setEnableVoice] = useState(true);
  const [enableCamera, setEnableCamera] = useState(true);

  const [launching, setLaunching] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setResumeError("");
    setUploadingResume(true);

    try {
      const data = await resumeService.uploadResume(file);
      setResumeFile(file);
      setResumeData(data);
    } catch (err) {
      setResumeError(err.message || "Failed to upload resume file.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      const session = await interviewService.createInterview({
        role,
        level,
        type,
        questionCount,
        enableVoice,
        enableCamera,
        resumeId: resumeData?.id,
      });

      // Save active session to session storage
      sessionStorage.setItem("active_interview_session", JSON.stringify(session));

      setTimeout(() => {
        navigate("/interview");
      }, 600);
    } catch (err) {
      console.error("Error launching interview:", err);
      setLaunching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI Setup</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Create New Mock Interview</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Tailor your role, upload your resume for personalized questions, and choose practice preferences.
        </p>
      </div>

      {/* Step Progress Indicators */}
      <div className="flex items-center justify-center gap-4 border-b border-slate-800 pb-6">
        {[
          { num: 1, title: "Role Details" },
          { num: 2, title: "Resume Upload" },
          { num: 3, title: "Practice Mode" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all ${
                step === s.num
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : step > s.num
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-semibold ${step === s.num ? "text-white" : "text-slate-400"}`}>
              {s.title}
            </span>
            {s.num < 3 && <div className="w-8 h-px bg-slate-800 hidden sm:block mx-1" />}
          </div>
        ))}
      </div>

      {/* Main Form Container */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        
        {/* STEP 1: Role & Experience Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Target Role & Scope</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Job Title / Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior React Developer, DevOps Engineer"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Experience Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Junior", "Mid", "Senior", "Lead"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        level === lvl
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                          : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Interview Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>Technical & Architecture</option>
                  <option>Behavioral & Leadership</option>
                  <option>System Design & Scalability</option>
                  <option>HR & Background Screening</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Number of Questions ({questionCount})</label>
              <input
                type="range"
                min="3"
                max="10"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-1">
                <span>3 Questions (Quick Practice)</span>
                <span>5 Questions (Standard)</span>
                <span>10 Questions (Full Mock)</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all"
              >
                <span>Continue to Resume Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Resume Upload Zone */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Resume Tailoring (Optional)</span>
            </h2>

            {resumeError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resumeError}</span>
                </div>
                <button onClick={() => setResumeError("")}><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Upload Drag & Drop Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                resumeFile
                  ? "border-emerald-500/50 bg-emerald-950/10"
                  : "border-slate-800 hover:border-indigo-500/50 bg-slate-950/40"
              }`}
            >
              {uploadingResume ? (
                <div className="py-6 space-y-3">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-indigo-300">Extracting & analyzing resume skills...</p>
                </div>
              ) : resumeFile ? (
                <div className="py-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base">{resumeFile.name}</h3>
                  <p className="text-xs text-slate-400">
                    {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Uploaded & Parsed Successfully
                  </p>

                  {resumeData?.skills && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                      {resumeData.skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold border border-emerald-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => { setResumeFile(null); setResumeData(null); }}
                    className="text-xs text-slate-400 hover:text-rose-400 underline pt-2"
                  >
                    Remove & Change File
                  </button>
                </div>
              ) : (
                <div className="py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Drag & drop your resume file here</p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT (Maximum file size: 10MB)</p>
                  </div>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-all">
                    <span>Browse Computer</span>
                    <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all"
              >
                <span>Continue to Practice Mode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Practice Mode & Audio/Video Settings */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-400" />
              <span>Studio Hardware & Mode</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Voice Toggle */}
              <div
                onClick={() => setEnableVoice(!enableVoice)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  enableVoice
                    ? "bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10"
                    : "bg-slate-950/40 border-slate-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    enableVoice ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-700"
                  }`}>
                    {enableVoice && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <h3 className="font-bold text-white text-sm">AI Voice & Speech Output</h3>
                <p className="text-xs text-slate-400 mt-1">Real-time speech synthesis for asking questions orally.</p>
              </div>

              {/* WebCam Eye Tracking Toggle */}
              <div
                onClick={() => setEnableCamera(!enableCamera)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  enableCamera
                    ? "bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-500/10"
                    : "bg-slate-950/40 border-slate-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    enableCamera ? "bg-purple-600 border-purple-500 text-white" : "border-slate-700"
                  }`}>
                    {enableCamera && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <h3 className="font-bold text-white text-sm">WebCam Eye & Pose Analysis</h3>
                <p className="text-xs text-slate-400 mt-1">Analyze eye contact, posture, and facial confidence signals.</p>
              </div>

            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Back
              </button>
              
              <button
                type="button"
                disabled={launching}
                onClick={handleLaunch}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {launching ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>Launch Interview Studio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CreateInterviewPage;
