import React from 'react';

function AnalysisPy({ result }) {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
        Python Analysis
      </h2>

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

      {result.errors?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Syntax Errors
          </h3>
          <ul className="space-y-2 bg-gray-800/50 p-3 rounded-lg border border-red-500/30">
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
      )}

      {result.security_issues?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Security Issues
          </h3>
          <ul className="space-y-2 bg-gray-800/50 p-3 rounded-lg border border-yellow-500/30">
            {result.security_issues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <p className="text-sm text-yellow-200">{issue}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.bandit_findings?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Bandit Findings
          </h3>
          <ul className="space-y-2 bg-gray-800/50 p-3 rounded-lg border border-blue-500/30">
            {result.bandit_findings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <p className="text-sm text-blue-200">{finding}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AnalysisPy;
