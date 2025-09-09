import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Agent, DialogueEntry } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const formatHistory = (history: DialogueEntry[]): string => {
  if (history.length === 0) {
    return "No prior discussion. This is the first turn.";
  }
  return history.map(entry => `${entry.agent}:\n${entry.text}`).join('\n\n---\n\n');
};

export const generateDialogueTurn = async (
  topic: string, 
  history: DialogueEntry[], 
  nextAgent: Agent,
  poetPrompt: string,
  philosopherPrompt: string,
  poetKnowledge?: string,
  philosopherKnowledge?: string
): Promise<string> => {
  try {
    const agentPersona = nextAgent === Agent.Poet ? poetPrompt : philosopherPrompt;
    const knowledgeBase = nextAgent === Agent.Poet ? poetKnowledge : philosopherKnowledge;
    const historyText = formatHistory(history);

    const knowledgeBaseSection = knowledgeBase 
      ? `
**Knowledge Base (You MUST ground your response in this text. Refer to it as your primary source of information and inspiration):**
---
${knowledgeBase}
---
` 
      : '';

    const fullPrompt = `
You are an AI agent generating a response for a dialogue between a Poet and a Philosopher.
The current turn is for the ${nextAgent}.

${knowledgeBaseSection}

**Overall Dialogue Topic:**
${topic}

**${nextAgent}'s Persona and Instructions:**
${agentPersona.replace('{topic}', topic)}

**Conversation History (so far):**
${historyText}

Your task is to generate ONLY the ${nextAgent}'s response for this turn.
Adhere strictly to their persona and instructions.
If a Knowledge Base is provided, your response must be heavily influenced and informed by its content.
Do not include any introductory text like "${nextAgent}:" or any meta-analysis.
The response must be in Brazilian Portuguese.

Now, generate the response for the ${nextAgent}:
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating dialogue turn:", error);
    if (error instanceof Error) {
        return `Error generating response: ${error.message}`;
    }
    return "An unknown error occurred while generating the response.";
  }
};

export const generateSummary = async (
  topic: string, 
  dialogueToSummarize: DialogueEntry[],
  summaryAgentPrompt: string
): Promise<string> => {
  try {
    const historyText = formatHistory(dialogueToSummarize);

    const prompt = `
${summaryAgentPrompt}

The dialogue you will analyze is between a Poet and a Philosopher on the topic of: "${topic}".

**Dialogue to Analyze:**
${historyText}

---

**Your Task:**
Generate a concise and insightful summary and analysis of the provided dialogue.
- Capture the main arguments and perspectives of both the Poet and the Philosopher.
- Highlight the key themes and any points of tension or agreement.
- Adhere strictly to your defined persona.
- The summary must be in Brazilian Portuguese.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    if (error instanceof Error) {
      return `Error generating summary: ${error.message}`;
    }
    return "An unknown error occurred while generating the summary.";
  }
};