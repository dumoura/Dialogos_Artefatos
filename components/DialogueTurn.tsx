import React, { useState, useEffect, useCallback } from 'react';
import { Agent, DialogueEntry } from '../types';
import PlayIcon from './icons/PlayIcon';
import StopIcon from './icons/StopIcon';

interface DialogueTurnProps {
  entry: DialogueEntry;
  currentlySpeakingId: string | null;
  setCurrentlySpeakingId: (id: string | null) => void;
}

const DialogueTurn: React.FC<DialogueTurnProps> = ({ entry, currentlySpeakingId, setCurrentlySpeakingId }) => {
  const isSpeaking = currentlySpeakingId === entry.id;

  const handleToggleSpeech = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
    } else {
      window.speechSynthesis.cancel(); // Stop any other speech
      const utterance = new SpeechSynthesisUtterance(entry.text);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setCurrentlySpeakingId(null);
      setCurrentlySpeakingId(entry.id);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking, entry.text, entry.id, setCurrentlySpeakingId]);

  useEffect(() => {
    // Cleanup function to stop speech if the component unmounts
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const isPoet = entry.agent === Agent.Poet;
  const agentColor = isPoet ? 'text-gray-200' : 'text-gray-300';
  const bgColor = isPoet ? 'bg-gray-800' : 'bg-gray-700';
  const alignment = isPoet ? 'items-start' : 'items-end';
  const bubbleAlignment = isPoet ? 'rounded-br-none' : 'rounded-bl-none';

  return (
    <div className={`flex flex-col w-full max-w-2xl mx-auto my-4 ${alignment}`}>
      <div className="flex items-center mb-2">
        <span className={`font-bold ${agentColor}`}>{entry.agent}</span>
      </div>
      <div className={`p-4 rounded-xl ${bgColor} ${bubbleAlignment} relative group`}>
        <p className="whitespace-pre-wrap leading-relaxed">{entry.text}</p>
        <button
          onClick={handleToggleSpeech}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label={isSpeaking ? 'Stop speech' : 'Play speech'}
        >
          {isSpeaking ? <StopIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default DialogueTurn;