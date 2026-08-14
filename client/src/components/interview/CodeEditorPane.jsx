import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditorPane({ code, setCode, language, setLanguage }) {
  const languages = ["javascript", "python", "cpp", "java", "go", "rust"];

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border border-slate-700 rounded-2xl overflow-hidden shadow-xl min-h-[400px]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <h3 className="text-xs font-bold text-slate-300">Code Editor</h3>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
