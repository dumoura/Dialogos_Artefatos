import React, { useState, useCallback } from 'react';
import { Agent, DialogueEntry } from './types';
import { generateDialogueTurn, generateSummary } from './services/geminiService';
import { defaultPoetSystemPrompt, defaultPhilosopherSystemPrompt, defaultOmniscientReaderSystemPrompt } from './constants';
import TopicInput from './components/TopicInput';
import DialogueDisplay from './components/DialogueDisplay';
import SummaryGenerator from './components/SummaryGenerator';
import CharacterEditor from './components/CharacterEditor';

const App: React.FC = () => {
  const [dialogue, setDialogue] = useState<DialogueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // State for character prompts
  const [poetPrompt, setPoetPrompt] = useState(defaultPoetSystemPrompt);
  const [philosopherPrompt, setPhilosopherPrompt] = useState(defaultPhilosopherSystemPrompt);
  const [summaryPrompt, setSummaryPrompt] = useState(defaultOmniscientReaderSystemPrompt);


  const handleStartDialogue = useCallback(async (newTopic: string, turns: number) => {
    setIsLoading(true);
    setError(null);
    setDialogue([]);
    setSummary(null);
    setTopic(newTopic);
    window.speechSynthesis.cancel(); // Stop any ongoing speech from previous dialogues

    let currentHistory: DialogueEntry[] = [];

    try {
      for (let i = 0; i < turns; i++) {
        const nextAgent = i % 2 === 0 ? Agent.Poet : Agent.Philosopher;
        
        const newText = await generateDialogueTurn(newTopic, currentHistory, nextAgent, poetPrompt, philosopherPrompt);
        
        const newEntry: DialogueEntry = {
            agent: nextAgent,
            text: newText,
            id: `${Date.now()}-${i}`
        };

        currentHistory.push(newEntry);
        setDialogue(prev => [...prev, newEntry]);
      }
    } catch (err) {
      console.error("Failed to conduct dialogue:", err);
      setError("Ocorreu um erro ao gerar o diálogo. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [poetPrompt, philosopherPrompt]);

  const handleGenerateSummary = useCallback(async (turns: number) => {
    if (!topic || dialogue.length === 0) return;

    setIsSummarizing(true);
    setError(null);
    setSummary(null);

    const dialogueToSummarize = dialogue.slice(-turns);

    try {
      const result = await generateSummary(topic, dialogueToSummarize, summaryPrompt);
      setSummary(result);
    } catch (err) {
       console.error("Failed to generate summary:", err);
       setError("Ocorreu um erro ao gerar o resumo. Por favor, tente novamente.");
    } finally {
      setIsSummarizing(false);
    }
  }, [topic, dialogue, summaryPrompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-100">
          Dialogo e artefatos
        </h1>
        <p className="mt-2 text-gray-400">Um diálogo entre um Poeta e um Filósofo</p>
      </header>
      
      <main className="w-full flex flex-col items-center">
        <TopicInput onSubmit={handleStartDialogue} isLoading={isLoading} />

        <CharacterEditor
            poetPrompt={poetPrompt}
            setPoetPrompt={setPoetPrompt}
            philosopherPrompt={philosopherPrompt}
            setPhilosopherPrompt={setPhilosopherPrompt}
            summaryPrompt={summaryPrompt}
            setSummaryPrompt={setSummaryPrompt}
            isDisabled={isLoading}
        />

        {error && <p className="mt-4 text-red-500">{error}</p>}
        
        <DialogueDisplay dialogue={dialogue} />
        
        {isLoading && dialogue.length > 0 && (
           <div className="flex items-center justify-center mt-4 text-gray-400">
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             <span>Pensando...</span>
           </div>
        )}

        {!isLoading && dialogue.length > 0 && (
          <SummaryGenerator
            maxTurns={dialogue.length}
            onGenerateSummary={handleGenerateSummary}
            summary={summary}
            isSummarizing={isSummarizing}
          />
        )}
      </main>
    </div>
  );
};

export default App;