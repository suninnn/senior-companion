import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  AccessibilityPrefs,
  AudioItem,
  Contact,
  FamilyPhoto,
} from '@/models';
import type { DataRepository } from './types';

const KEYS = {
  contacts: '@sc/contacts',
  photos: '@sc/photos',
  prefs: '@sc/prefs',
  audioItems: '@sc/audioItems',
  seeded: '@sc/seeded',
};

export const asyncStorageRepository: DataRepository = {
  async getContacts() {
    const raw = await AsyncStorage.getItem(KEYS.contacts);
    return raw ? (JSON.parse(raw) as Contact[]) : [];
  },
  async setContacts(contacts) {
    await AsyncStorage.setItem(KEYS.contacts, JSON.stringify(contacts));
  },

  async getPhotos() {
    const raw = await AsyncStorage.getItem(KEYS.photos);
    return raw ? (JSON.parse(raw) as FamilyPhoto[]) : [];
  },
  async addPhoto(photo) {
    const photos = await this.getPhotos();
    photos.unshift(photo);
    await AsyncStorage.setItem(KEYS.photos, JSON.stringify(photos));
  },
  async setPhotos(photos) {
    await AsyncStorage.setItem(KEYS.photos, JSON.stringify(photos));
  },

  async getPrefs() {
    const raw = await AsyncStorage.getItem(KEYS.prefs);
    return raw ? (JSON.parse(raw) as AccessibilityPrefs) : null;
  },
  async setPrefs(prefs) {
    await AsyncStorage.setItem(KEYS.prefs, JSON.stringify(prefs));
  },

  async getAudioItems() {
    const raw = await AsyncStorage.getItem(KEYS.audioItems);
    return raw ? (JSON.parse(raw) as AudioItem[]) : [];
  },
  async setAudioItems(items) {
    await AsyncStorage.setItem(KEYS.audioItems, JSON.stringify(items));
  },

  async getSeededFlag() {
    const raw = await AsyncStorage.getItem(KEYS.seeded);
    return raw === 'true';
  },
  async setSeededFlag() {
    await AsyncStorage.setItem(KEYS.seeded, 'true');
  },
};
