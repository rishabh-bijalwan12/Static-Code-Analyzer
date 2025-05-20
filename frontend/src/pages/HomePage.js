import React, { useState } from "react";
import Header from "../components/Header";
import CodeInput from "../components/CodeInput";
import AnalysisPy from "../components/AnalysisPy";
import AnalysisJs from "../components/AnalysisJs";

function HomePage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisType, setAnalysisType] = useState(""); // "regular" or "detailed"

  // Regular analysis handler
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setAnalysisType("regular");

    const endpoint =
      language === "python"
        ? "http://localhost:5000/analyze_python"
        : "http://localhost:5002/analyze_js";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server responded with an error.");
      }

      const data = await response.json();
      setResult(data);
      console.log("Regular analysis result:", data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Detailed LLM analysis handler
  const handleDetailedAnalysis = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setAnalysisType("detailed");

    const endpoint =
      language === "python"
        ? "http://localhost:5000/analyze_python_llm"
        : "http://localhost:5002/analyze_js_llm";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server responded with an error.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 flex flex-col md:flex-row">
      {/* Left - Editor Section */}
      <div className="w-full md:w-1/2 h-screen p-4 md:p-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl h-full flex flex-col p-4 border border-gray-700/50">
          <Header language={language} setLanguage={setLanguage} />
          <div className="flex-1 overflow-hidden">
            <CodeInput code={code} setCode={setCode} language={language} />
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={handleSubmit}
              className={`flex items-center gap-2 py-3 px-8 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                loading
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              }`}
              disabled={loading}
            >
              {loading && analysisType === "regular" ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Analyze Code
                </>
              )}
            </button>

            <button
              onClick={handleDetailedAnalysis}
              className={`flex items-center gap-2 py-3 px-8 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                loading && analysisType === "detailed"
                  ? "bg-green-600/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              }`}
              disabled={loading}
            >
              {loading && analysisType === "detailed" ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                  </svg>
                  Detailed Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right - Result Section */}
      <div className="w-full md:w-1/2 h-screen p-4 md:p-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl h-full p-4 border border-gray-700/50 overflow-y-auto">
          {error && (
            <div className="bg-red-900/50 text-red-100 p-4 rounded-xl mb-6 border border-red-700/50 flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-400 flex-shrink-0"
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
              <div>
                <strong className="font-semibold">Error:</strong> {error}
              </div>
            </div>
          )}
          {result && (
            language === "python" ? (
              <AnalysisPy result={result} />
            ) : (
              <AnalysisJs result={result} />
            )
          )}
          {!result && !error && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="text-xl font-medium mb-2">No analysis yet</h3>
              <p className="text-center max-w-md">
                Enter your code and click "Analyze Code" or "Detailed Analysis" to see results here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
