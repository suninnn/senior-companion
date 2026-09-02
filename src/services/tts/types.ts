export interface TtsProvider {
  speak(text: string, options?: { language?: string; rate?: number }): Promise<void>;
  stop(): Promise<void>;
  isSpeaking(): Promise<boolean>;
}
