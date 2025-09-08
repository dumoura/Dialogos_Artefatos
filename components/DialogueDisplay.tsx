
import React, { useState } from 'react';
import { DialogueEntry } from '../types';
import DialogueTurn from './DialogueTurn';

interface DialogueDisplayProps {
  dialogue: DialogueEntry[];
}

const DialogueDisplay: React.FC<DialogueDisplayProps> = ({ dialogue }) => {
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  if (dialogue.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8">
      {dialogue.map((entry) => (
        <DialogueTurn 
          key={entry.id} 
          entry={entry}
          currentlySpeakingId={currentlySpeakingId}
          setCurrentlySpeakingId={setCurrentlySpeakingId} 
        />
      ))}
    </div>
  );
};

export default DialogueDisplay;
