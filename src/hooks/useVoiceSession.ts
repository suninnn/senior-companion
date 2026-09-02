import { useCallback, useEffect, useRef, useState } from 'react';
import type { LanguageCode } from '@/models';
import { getAiProvider, getSttProvider, getTtsProvider } from '@/services';

type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

interface VoiceSessionState {
  status: VoiceStatus;
  transcript: string;
  responseText: string;
  error: string | null;
}

interface UseVoiceSessionOptions {
  language?: LanguageCode;
  speechRate?: number;
  ttsEnabled?: boolean;
  onError?: (message: string) => void;
}

export function useVoiceSession(options: UseVoiceSessionOptions = {}) {
  const {
    language = 'en-US',
    speechRate = 0.9,
    ttsEnabled = true,
    onError,
  } = options;

  const [state, setState] = useState<VoiceSessionState>({
    status: 'idle',
    transcript: '',
    responseText: '',
    error: null,
  });

  const mountedRef = useRef(true);
  const sttRef = useRef(getSttProvider());
  const aiRef = useRef(getAiProvider());
  const ttsRef = useRef(getTtsProvider());
  const processingRef = useRef(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      ttsRef.current.stop().catch(() => {});
      sttRef.current.stop().catch(() => {});
    };
  }, []);

  const safeSetState = useCallback((update: Partial<VoiceSessionState>) => {
    if (mountedRef.current) {
      setState((prev) => ({ ...prev, ...update }));
    }
  }, []);

  const processTurn = useCallback(
    async (finalText: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      try {
        safeSetState({ status: 'thinking', transcript: finalText });
        const response = await aiRef.current.ask(finalText);

        if (!mountedRef.current) return;

        safeSetState({ responseText: response.text });

        if (ttsEnabled && response.text) {
          safeSetState({ status: 'speaking' });
          await ttsRef.current.speak(response.text, {
            language: response.suggestedLanguage ?? language,
            rate: speechRate,
          });

          if (mountedRef.current) {
            safeSetState({ status: 'idle' });
          }
        } else {
          safeSetState({ status: 'idle' });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        safeSetState({ status: 'idle', error: message });
        onError?.(message);
      } finally {
        processingRef.current = false;
      }
    },
    [language, speechRate, ttsEnabled, onError, safeSetState]
  );

  const stopListening = useCallback(async () => {
    if (state.status !== 'listening') return;

    try {
      const finalText = await sttRef.current.stop();
      const textToProcess = finalText?.trim() || state.transcript.trim();
      if (textToProcess) {
        await processTurn(textToProcess);
      } else {
        safeSetState({ status: 'idle' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not stop listening';
      safeSetState({ status: 'idle', error: message });
      onError?.(message);
    }
  }, [state.status, state.transcript, processTurn, safeSetState, onError]);

  const startListening = useCallback(async () => {
    if (state.status !== 'idle') {
      await stopListening();
      return;
    }

    safeSetState({
      status: 'listening',
      transcript: '',
      responseText: '',
      error: null,
    });

    try {
      await ttsRef.current.stop();
      await sttRef.current.start(language, (result) => {
        if (!mountedRef.current) return;

        safeSetState({ transcript: result.text });

        if (result.isFinal) {
          processTurn(result.text.trim());
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not start listening';
      safeSetState({ status: 'idle', error: message });
      onError?.(message);
    }
  }, [state.status, language, stopListening, processTurn, safeSetState, onError]);

  const stopSpeaking = useCallback(async () => {
    await ttsRef.current.stop();
    safeSetState({ status: 'idle' });
  }, [safeSetState]);

  const reset = useCallback(() => {
    ttsRef.current.stop().catch(() => {});
    sttRef.current.stop().catch(() => {});
    safeSetState({
      status: 'idle',
      transcript: '',
      responseText: '',
      error: null,
    });
  }, [safeSetState]);

  return {
    ...state,
    startListening,
    stopListening,
    stopSpeaking,
    reset,
    isActive: state.status !== 'idle',
  };
}
