import React from "react";
import Editor from "@monaco-editor/react";

function CodeInput({ code, setCode, language }) {
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: "on",
    tabSize: 2,
    scrollBeyondLastLine: false,
    renderWhitespace: "selection",
    padding: { top: 20, bottom: 20 },
    bracketPairColorization: { enabled: true },
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    smoothScrolling: true,
    cursorSmoothCaretAnimation: "on",
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900 border border-gray-700/50">
      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800/80 backdrop-blur-sm flex items-center px-4 z-10">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-xs text-gray-400 font-mono">
          {language === "python" ? "script.py" : "script.js"}
        </div>
      </div>
      <Editor
        height="100%"
        language={language}
        value={code || ""}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Loading editor...</div>
          </div>
        }
        className="pt-8"
      />
    </div>
  );
}

export default CodeInput;