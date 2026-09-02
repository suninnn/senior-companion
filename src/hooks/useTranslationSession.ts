import { useCallback, useEffect, useRef, useState } from 'react';
import type { LanguageCode } from '@/models';
import { getSttProvider, getTranslationProvider, getTtsProvider } from '@/services';
import type { TranslationResult } from '@/services/translation/types';

type TranslationStatus = 'idle' | 'listening' | 'translating' | 'speaking';

interface TranslationSessionState {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  status: TranslationStatus;
  currentText: string;
  history: TranslationResult[];
  error: string | null;
}

interface UseTranslationSessionOptions {
  speechRate?: number;
  ttsEnabled?: boolean;
  onError?: (message: string) => void;
}

export function useTranslationSession(options: UseTranslationSessionOptions = {}) {
  const { speechRate = 0.9, ttsEnabled = true, onError } = options;

  const [state, setState] = useState<TranslationSessionState>({
    sourceLanguage: 'zh-CN',
    targetLanguage: 'en-US',
    status: 'idle',
    currentText: '',
    history: [],
    error: null,
  });

  const mountedRef = useRef(true);
  const sttRef = useRef(getSttProvider());
  const translationRef = useRef(getTranslationProvider());
  const ttsRef = useRef(getTtsProvider());
  const processingRef = useRef(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      ttsRef.current.stop().catch(() => {});
      sttRef.current.stop().catch(() => {});
    };
  }, []);

  const safeSetState = useCallback((
    update: Partial<TranslationSessionState> | ((prev: TranslationSessionState) => Partial<TranslationSessionState>)
  ) => {
    if (!mountedRef.current) return;

    setState((prev) => ({
      ...prev,
      ...(typeof update === 'function' ? update(prev) : update),
    }));
  }, []);

  const stopListening = useCallback(async () => {
    if (state.status !== 'listening') return;

    try {
      const finalText = await sttRef.current.stop();
      const textToTranslate = finalText?.trim() || state.currentText.trim();
      if (!textToTranslate) {
        safeSetState({ status: 'idle' });
        return;
      }

      if (processingRef.current) return;
      processingRef.current = true;

      safeSetState({ status: 'translating', currentText: textToTranslate });
      const result = await translationRef.current.translate(textToTranslate, {
        from: state.sourceLanguage,
        to: state.targetLanguage,
      });

      if (!mountedRef.current) return;

      safeSetState((prev) => ({
        status: 'idle',
        history: [...prev.history, result],
        currentText: '',
      }));

      if (ttsEnabled && result.translatedText) {
        safeSetState({ status: 'speaking' });
        await ttsRef.current.speak(result.translatedText, {
          language: result.targetLanguage,
          rate: speechRate,
        });
        if (mountedRef.current) {
          safeSetState({ status: 'idle' });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Translation failed';
      safeSetState({ status: 'idle', error: message });
      onError?.(message);
    } finally {
      processingRef.current = false;
    }
  }, [state.status, state.currentText, state.sourceLanguage, state.targetLanguage, ttsEnabled, speechRate, safeSetState, onError]);

  const startListening = useCallback(
    async (language: LanguageCode) => {
      if (state.status !== 'idle') {
        await stopListening();
        return;
      }

      const target: LanguageCode = language === 'zh-CN' ? 'en-US' : 'zh-CN';

      safeSetState({
        sourceLanguage: language,
        targetLanguage: target,
        status: 'listening',
        currentText: '',
        error: null,
      });

      try {
        await ttsRef.current.stop();
        await sttRef.current.start(language, (result) => {
          if (!mountedRef.current) return;

          safeSetState({ currentText: result.text });

          if (result.isFinal) {
            processingRef.current = true;
            safeSetState({ status: 'translating', currentText: result.text.trim() });

            translationRef.current
              .translate(result.text.trim(), {
                from: language,
                to: target,
              })
              .then(async (translation) => {
                if (!mountedRef.current) return;

                safeSetState((prev) => ({
                  status: 'idle',
                  history: [...prev.history, translation],
                  currentText: '',
                }));

                if (ttsEnabled && translation.translatedText) {
                  safeSetState({ status: 'speaking' });
                  await ttsRef.current.speak(translation.translatedText, {
                    language: translation.targetLanguage,
                    rate: speechRate,
                  });
                  if (mountedRef.current) {
                    safeSetState({ status: 'idle' });
                  }
                }
              })
              .catch((err) => {
                const message = err instanceof Error ? err.message : 'Translation failed';
                safeSetState({ status: 'idle', error: message });
                onError?.(message);
              })
              .finally(() => {
                processingRef.current = false;
              });
          }
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not start listening';
        safeSetState({ status: 'idle', error: message });
        onError?.(message);
      }
    },
    [state.status, ttsEnabled, speechRate, safeSetState, stopListening, onError]
  );

  const swapLanguages = useCallback(() => {
    safeSetState((prev) => ({
      sourceLanguage: prev.targetLanguage,
      targetLanguage: prev.sourceLanguage,
    }));
  }, [safeSetState]);

  const clearHistory = useCallback(() => {
    safeSetState({ history: [] });
  }, [safeSetState]);

  const stopSpeaking = useCallback(async () => {
    await ttsRef.current.stop();
    safeSetState({ status: 'idle' });
  }, [safeSetState]);

  return {
    ...state,
    startListening,
    stopListening,
    stopSpeaking,
    swapLanguages,
    clearHistory,
    isActive: state.status !== 'idle',
  };
}
