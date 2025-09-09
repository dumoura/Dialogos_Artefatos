
export enum Agent {
  Poet = 'Poet',
  Philosopher = 'Philosopher',
}

export interface DialogueEntry {
  agent: Agent;
  text: string;
  id: string;
}

export interface KnowledgeBase {
  filename: string;
  content: string;
}
