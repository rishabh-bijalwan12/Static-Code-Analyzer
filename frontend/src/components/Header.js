import React from 'react';

function Header({ language, setLanguage }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-5xl font-extrabold">
        <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          {language === "python" ? "Python" : "JavaScript"} 
        </span>
        <span className="text-gray-300"> Code Analyzer</span>
      </h1>
      
      <div className="inline-flex items-center gap-4 bg-gray-700/50 px-4 py-2 rounded-full border border-gray-600/50 shadow-sm">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-blue-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent text-gray-200 text-lg font-medium focus:outline-none focus:ring-0 cursor-pointer"
        >
          <option value="python" className="bg-gray-800 text-gray-200">Python</option>
          <option value="javascript" className="bg-gray-800 text-gray-200">JavaScript</option>
        </select>
      </div>
    </div>
  );
}

export default Header;