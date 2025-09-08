import React, { useState, useEffect } from 'react';

interface SummaryGeneratorProps {
  maxTurns: number;
  onGenerateSummary: (turns: number) => void;
  summary: string | null;
  isSummarizing: boolean;
}

const SummaryGenerator: React.FC<SummaryGeneratorProps> = ({ maxTurns, onGenerateSummary, summary, isSummarizing }) => {
  const [turns, setTurns] = useState<number>(maxTurns);

  // Dynamically create options for summary length
  const options = [];
  if (maxTurns >= 2) {
    options.push({ label: 'Diálogo completo', value: maxTurns });
    // Add "last 2" option only if there are more than 2 turns
    if (maxTurns > 2) {
        options.unshift({ label: 'Últimas 2 rodadas', value: 2 });
    }
  }

  // When the dialogue changes (and maxTurns changes), reset the selected option
  // to be the full dialogue.
  useEffect(() => {
    setTurns(maxTurns);
  }, [maxTurns]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateSummary(turns);
  };
  
  if (options.length === 0) {
      return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold text-gray-100 mb-4">
        Análise do Leitor Onisciente
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <fieldset className="flex items-center gap-4">
            <legend className="text-gray-300 mr-4">Analisar:</legend>
            {options.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="turns"
                  value={option.value}
                  checked={turns === option.value}
                  onChange={() => setTurns(option.value)}
                  className="h-4 w-4 text-gray-400 bg-gray-700 border-gray-600 focus:ring-gray-500"
                />
                <span className="text-gray-300">{option.label}</span>
              </label>
            ))}
          </fieldset>
          <button
            type="submit"
            disabled={isSummarizing}
            className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSummarizing ? 'Gerando...' : 'Gerar Análise'}
          </button>
        </div>
      </form>
      
      {isSummarizing && (
        <div className="flex items-center justify-center mt-4 text-gray-400">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Analisando...</span>
        </div>
      )}

      {summary && !isSummarizing && (
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-300">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryGenerator;