import React, { useState } from 'react';

interface TopicInputProps {
  onSubmit: (topic: string, turns: number) => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [turns, setTurns] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim(), turns);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      <div className="relative">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Digite o tema para o diálogo..."
          className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 resize-none"
          disabled={isLoading}
          aria-label="Tema para o diálogo"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <label htmlFor="turns-input" className="text-gray-300 font-medium whitespace-nowrap">Total de Falas:</label>
            <input
                id="turns-input"
                type="number"
                value={turns}
                onChange={(e) => setTurns(parseInt(e.target.value, 10) || 2)}
                min="2"
                max="20"
                step="2"
                className="w-20 p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                disabled={isLoading}
                aria-describedby="turns-description"
            />
        </div>
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex-grow sm:flex-grow-0"
        >
          {isLoading ? 'Gerando...' : 'Iniciar'}
        </button>
      </div>
      <p id="turns-description" className="text-sm text-gray-500 -mt-2">O diálogo terá este número total de intervenções. Deve ser par.</p>
    </form>
  );
};

export default TopicInput;