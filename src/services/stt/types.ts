export interface SttResult {
  text: string;
  isFinal: boolean;
}

export interface SttProvider {
  start(locale: string, onResult: (result: SttResult) => void): Promise<void>;
  stop(): Promise<string | undefined>;
}
