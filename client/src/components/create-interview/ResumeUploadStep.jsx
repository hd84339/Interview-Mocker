import { FileText, AlertCircle, X, CheckCircle2, UploadCloud, ArrowRight } from "lucide-react";

export default function ResumeUploadStep({
  resumeError,
  setResumeError,
  handleDrop,
  uploadingResume,
  resumeFile,
  resumeData,
  setResumeFile,
  setResumeData,
  handleFileChange,
  onBack,
  onNext,
}) {
  return (
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
          <button onClick={() => setResumeError("")}>
            <X className="w-4 h-4" />
          </button>
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
            <p className="text-sm font-semibold text-indigo-300">
              Extracting & analyzing resume skills...
            </p>
          </div>
        ) : resumeFile ? (
          <div className="py-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">
              {resumeFile.name}
            </h3>
            <p className="text-xs text-slate-400">
              {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Uploaded &
              Parsed Successfully
            </p>

            {resumeData?.skills && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {resumeData.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold border border-emerald-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setResumeFile(null);
                setResumeData(null);
              }}
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
              <p className="text-sm font-bold text-white">
                Drag & drop your resume file here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, DOCX, TXT (Maximum file size: 10MB)
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-all">
              <span>Browse Computer</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all"
        >
          <span>Continue to Practice Mode</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
