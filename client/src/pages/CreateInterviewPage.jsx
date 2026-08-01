import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { resumeService } from "../services/resumeService";
import { interviewService } from "../services/interviewService";
import RoleDetailsStep from "../components/create-interview/RoleDetailsStep";
import ResumeUploadStep from "../components/create-interview/ResumeUploadStep";
import PracticeModeStep from "../components/create-interview/PracticeModeStep";

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
          <RoleDetailsStep
            role={role}
            setRole={setRole}
            level={level}
            setLevel={setLevel}
            type={type}
            setType={setType}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            onNext={() => setStep(2)}
          />
        )}

        {/* STEP 2: Resume Upload Zone */}
        {step === 2 && (
          <ResumeUploadStep
            resumeError={resumeError}
            setResumeError={setResumeError}
            handleDrop={handleDrop}
            uploadingResume={uploadingResume}
            resumeFile={resumeFile}
            resumeData={resumeData}
            setResumeFile={setResumeFile}
            setResumeData={setResumeData}
            handleFileChange={handleFileChange}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {/* STEP 3: Practice Mode & Audio/Video Settings */}
        {step === 3 && (
          <PracticeModeStep
            enableVoice={enableVoice}
            setEnableVoice={setEnableVoice}
            enableCamera={enableCamera}
            setEnableCamera={setEnableCamera}
            onBack={() => setStep(2)}
            handleLaunch={handleLaunch}
            launching={launching}
          />
        )}

      </div>
    </div>
  );
}

export default CreateInterviewPage;
