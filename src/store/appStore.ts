import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ChatMessage,
  ChatThread,
  FamilyMember,
  SharedLocation,
} from '@/models';
import type { FamilyStatus } from '@/components/StatusBadge';
import { SEED_FAMILY_MEMBERS } from '@/data/seed/familyMembers';
import { SEED_CHAT_THREADS } from '@/data/seed/chats';
import { SEED_LOCATION } from '@/data/seed/location';

const STORAGE_KEY = '@sc/appStore';
const INITIALIZED_KEY = '@sc/appStoreInitialized';

interface AppState {
  seniorName: string;
  mode: 'senior' | 'family';
  familyMembers: FamilyMember[];
  threads: ChatThread[];
  location: SharedLocation;

  setMode: (mode: 'senior' | 'family') => void;
  sendMessage: (threadId: string, message: ChatMessage) => void;
  sendNudge: (threadId: string, senderName: string) => void;
  setStatus: (memberId: string, status: FamilyStatus) => void;
  updateLocation: (location: Partial<SharedLocation>) => void;
  addPhotoComment: (photoId: string, comment: { authorName: string; text: string; kind: 'text' | 'voice' }) => void;
  seedStore: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      seniorName: 'Margaret',
      mode: 'senior',
      familyMembers: [],
      threads: [],
      location: SEED_LOCATION,

      setMode: (mode) => set({ mode }),

      sendMessage: (threadId, message) => {
        set((state) => ({
          threads: state.threads.map((t) =>
            t.id === threadId
              ? { ...t, messages: [...t.messages, message] }
              : t
          ),
        }));
      },

      sendNudge: (threadId, senderName) => {
        const nudge: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: 'self',
          senderName,
          kind: 'nudge',
          text: `${senderName} sent a nudge!`,
          createdAt: new Date().toISOString(),
        };
        get().sendMessage(threadId, nudge);
      },

      setStatus: (memberId, status) => {
        set((state) => ({
          familyMembers: state.familyMembers.map((m) =>
            m.id === memberId ? { ...m, status } : m
          ),
        }));
      },

      updateLocation: (location) => {
        set((state) => ({
          location: { ...state.location, ...location, updatedAt: new Date().toISOString() },
        }));
      },

      addPhotoComment: () => {
        // Photo comments are managed at the screen level via the DataRepository.
        // This action is a placeholder for future store-based photo management.
      },

      seedStore: async () => {
        const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
        if (initialized === 'true') return;

        set({
          familyMembers: SEED_FAMILY_MEMBERS,
          threads: SEED_CHAT_THREADS,
          location: SEED_LOCATION,
        });

        await AsyncStorage.setItem(INITIALIZED_KEY, 'true');
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
