export interface AiResponse {
  text: string;
  suggestedLanguage?: 'zh-CN' | 'en-US';
}

export interface AiProvider {
  ask(prompt: string): Promise<AiResponse>;
  summarize(text: string): Promise<string>;
}
