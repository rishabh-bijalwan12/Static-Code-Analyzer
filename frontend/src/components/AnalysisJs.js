import React from 'react';

function AnalysisJs({ result }) {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
        JavaScript Analysis
      </h2>

      {result.errors?.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Issues
          </h3>
          <ul className="space-y-2 bg-gray-800/50 p-3 rounded-lg border border-green-500/30 max-h-60 overflow-y-auto">
            {result.errors.map((err, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div>
                  {err.line && err.column && (
                    <span className="font-mono text-xs text-gray-400">
                      Line {err.line}, Col {err.column}
                    </span>
                  )}
                  <p className="text-sm text-red-200">{err.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ):null}

      {/* LLM Analysis Section */}
      {result.llm_analysis && (
        <div className="bg-gray-900/70 p-4 rounded-lg border border-indigo-600/50 whitespace-pre-wrap text-indigo-300 font-mono text-sm shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 14h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Detailed LLM Analysis
          </h3>
          <pre className="whitespace-pre-wrap">{result.llm_analysis}</pre>
        </div>
      )}
    </div>
  );
}

export default AnalysisJs;
