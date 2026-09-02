import type { LanguageCode } from './prefs';

export type Speaker = 'senior' | 'ai' | 'other';

export interface ConversationTurn {
  id: string;
  speaker: Speaker;
  text: string;
  translatedText?: string;
  language: LanguageCode;
  createdAt: string;
}
