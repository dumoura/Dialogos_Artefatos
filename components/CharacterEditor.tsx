import React from 'react';

interface CharacterEditorProps {
  poetPrompt: string;
  setPoetPrompt: (prompt: string) => void;
  philosopherPrompt: string;
  setPhilosopherPrompt: (prompt: string) => void;
  summaryPrompt: string;
  setSummaryPrompt: (prompt: string) => void;
  isDisabled: boolean;
}

const CharacterEditor: React.FC<CharacterEditorProps> = ({
  poetPrompt,
  setPoetPrompt,
  philosopherPrompt,
  setPhilosopherPrompt,
  summaryPrompt,
  setSummaryPrompt,
  isDisabled,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <details className="bg-gray-800/50 border border-gray-700 rounded-lg group">
        <summary className="p-4 font-semibold text-lg cursor-pointer flex justify-between items-center text-gray-300 group-open:border-b group-open:border-gray-700">
          Personalizar Personagens
          <svg
            className="w-5 h-5 transition-transform duration-300 group-open:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="p-4 space-y-6">
          {/* Poet Editor */}
          <div>
            <label htmlFor="poet-prompt" className="block mb-2 font-medium text-gray-300">
              O Poeta
            </label>
            <textarea
              id="poet-prompt"
              value={poetPrompt}
              onChange={(e) => setPoetPrompt(e.target.value)}
              disabled={isDisabled}
              rows={8}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 disabled:opacity-50"
              aria-label="Persona do Poeta"
            />
          </div>

          {/* Philosopher Editor */}
          <div>
            <label htmlFor="philosopher-prompt" className="block mb-2 font-medium text-gray-300">
              O Filósofo
            </label>
            <textarea
              id="philosopher-prompt"
              value={philosopherPrompt}
              onChange={(e) => setPhilosopherPrompt(e.target.value)}
              disabled={isDisabled}
              rows={8}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 disabled:opacity-50"
              aria-label="Persona do Filósofo"
            />
          </div>

          {/* Summarizer Editor */}
          <div>
            <label htmlFor="summary-prompt" className="block mb-2 font-medium text-gray-300">
              O Leitor Onisciente (para resumos)
            </label>
            <textarea
              id="summary-prompt"
              value={summaryPrompt}
              onChange={(e) => setSummaryPrompt(e.target.value)}
              disabled={isDisabled}
              rows={5}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 disabled:opacity-50"
              aria-label="Persona do Leitor Onisciente"
            />
          </div>
        </div>
      </details>
    </div>
  );
};

export default CharacterEditor;