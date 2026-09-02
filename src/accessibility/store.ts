import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AccessibilityPrefs, FontSizePreset } from '@/models';
import { DEFAULT_PREFS } from '@/models';
import { nextPreset, previousPreset } from './scale';

interface AccessibilityState extends AccessibilityPrefs {
  hydrated: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setFontSize: (preset: FontSizePreset) => void;
  setHighContrast: (enabled: boolean) => void;
  setTtsEnabled: (enabled: boolean) => void;
  setSpeechRate: (rate: number) => void;
  setPrimaryLanguage: (lang: AccessibilityPrefs['primaryLanguage']) => void;
  reset: () => void;
}

const STORAGE_KEY = '@sc/prefs';

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PREFS,
      hydrated: false,
      increaseFontSize: () => {
        const next = nextPreset(get().fontSize);
        if (next) set({ fontSize: next });
      },
      decreaseFontSize: () => {
        const prev = previousPreset(get().fontSize);
        if (prev) set({ fontSize: prev });
      },
      setFontSize: (preset) => set({ fontSize: preset }),
      setHighContrast: (enabled) => set({ highContrast: enabled }),
      setTtsEnabled: (enabled) => set({ ttsEnabled: enabled }),
      setSpeechRate: (rate) => set({ speechRate: Math.max(0.5, Math.min(1.5, rate)) }),
      setPrimaryLanguage: (lang) => set({ primaryLanguage: lang }),
      reset: () => set(DEFAULT_PREFS),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);
