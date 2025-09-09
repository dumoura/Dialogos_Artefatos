import React from 'react';
import { KnowledgeBase, Agent } from '../types';
import TrashIcon from './icons/TrashIcon';

interface CharacterEditorProps {
  poetPrompt: string;
  setPoetPrompt: (prompt: string) => void;
  philosopherPrompt: string;
  setPhilosopherPrompt: (prompt: string) => void;
  summaryPrompt: string;
  setSummaryPrompt: (prompt: string) => void;
  poetKnowledgeBase: KnowledgeBase | null;
  philosopherKnowledgeBase: KnowledgeBase | null;
  onFileChange: (file: File | null, agent: Agent) => void;
  isDisabled: boolean;
}

const KnowledgeBaseUploader: React.FC<{
    agent: Agent;
    knowledgeBase: KnowledgeBase | null;
    onFileChange: (file: File | null, agent: Agent) => void;
    isDisabled: boolean;
}> = ({ agent, knowledgeBase, onFileChange, isDisabled }) => {
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onFileChange(file, agent);
        e.target.value = ''; // Reset input to allow re-uploading the same file
    };

    return (
        <div className="mt-3">
            {knowledgeBase ? (
                <div className="flex items-center justify-between p-2.5 bg-gray-900/50 border border-gray-600 rounded-md">
                    <span className="text-sm text-gray-300 truncate" title={knowledgeBase.filename}>
                        Fonte: {knowledgeBase.filename}
                    </span>
                    <button
                        type="button"
                        onClick={() => onFileChange(null, agent)}
                        disabled={isDisabled}
                        className="p-1 text-gray-400 hover:text-red-400 disabled:opacity-50"
                        aria-label={`Remover ${knowledgeBase.filename}`}
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <>
                    <label htmlFor={`${agent}-kb-upload`} className="block text-sm font-medium text-gray-400 mb-1">
                        Adicionar base de conhecimento (PDF, DOCX)
                    </label>
                    <input
                        id={`${agent}-kb-upload`}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileSelect}
                        disabled={isDisabled}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 disabled:opacity-50"
                        aria-label={`Base de conhecimento para ${agent}`}
                    />
                </>
            )}
        </div>
    );
};


const CharacterEditor: React.FC<CharacterEditorProps> = ({
  poetPrompt,
  setPoetPrompt,
  philosopherPrompt,
  setPhilosopherPrompt,
  summaryPrompt,
  setSummaryPrompt,
  poetKnowledgeBase,
  philosopherKnowledgeBase,
  onFileChange,
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
             <KnowledgeBaseUploader 
                agent={Agent.Poet}
                knowledgeBase={poetKnowledgeBase}
                onFileChange={onFileChange}
                isDisabled={isDisabled}
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
             <KnowledgeBaseUploader 
                agent={Agent.Philosopher}
                knowledgeBase={philosopherKnowledgeBase}
                onFileChange={onFileChange}
                isDisabled={isDisabled}
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