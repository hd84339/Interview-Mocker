import { Eye, Mic, MicOff, Video, VideoOff, Send } from "lucide-react";

export default function CandidateStudio({
  videoRef,
  cameraActive,
  setCameraActive,
  micActive,
  setMicActive,
  eyeContactScore,
  userAnswer,
  setUserAnswer,
  isRecording,
  toggleSpeechRecognition,
  submitting,
  handleNextQuestion,
  hideTextarea = false,
  hideCamera = false,
}) {
  return (
    <div className="space-y-6">
      {/* Candidate WebCam Box */}
      {!hideCamera && (
        <div className={`relative bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl aspect-video ${hideTextarea ? 'max-h-[220px]' : 'max-h-[350px]'}`}>
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">
              <VideoOff className="w-12 h-12" />
            </div>
          )}

          {/* Overlay Badges: Eye Contact Status + Controls */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-emerald-300">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Eye Contact: {eyeContactScore}%</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setMicActive(!micActive)}
              className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                micActive
                  ? "bg-slate-900/80 border-slate-700 text-white"
                  : "bg-rose-500/20 border-rose-500/30 text-rose-300"
              }`}
            >
              {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCameraActive(!cameraActive)}
              className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                cameraActive
                  ? "bg-slate-900/80 border-slate-700 text-white"
                  : "bg-rose-500/20 border-rose-500/30 text-rose-300"
              }`}
            >
              {cameraActive ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Candidate Response Transcript & Input Box */}
      {!hideTextarea && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Your Answer
            </label>

            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isRecording
                  ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30"
                  : "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>
                {isRecording ? "Listening... (Click to Pause)" : "Push to Speak"}
              </span>
            </button>
          </div>

          <textarea
            rows={4}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your response here or click 'Push to Speak' to use your microphone..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400 font-semibold">
              Word Count:{" "}
              <span className="text-white">
                {userAnswer.trim().split(/\s+/).filter(Boolean).length}
              </span>{" "}
              words
            </div>

            <button
              type="button"
              disabled={submitting || !userAnswer.trim()}
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Submit & Next Question</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* If hideTextarea is true, just show a submit button below the video */}
      {hideTextarea && (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={submitting}
            onClick={handleNextQuestion}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Code & Next Question</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
