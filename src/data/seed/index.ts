import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDataRepository } from '@/services';
import { SEED_CONTACTS } from './contacts';
import { SEED_PHOTOS } from './photos';
import { SEED_AUDIO_ITEMS } from './news';

const SEED_VERSION_KEY = '@sc/seedVersion';
const SEED_VERSION = 4;

export async function seedIfNeeded() {
  const currentVersion = await readSeedVersion();
  if (currentVersion >= SEED_VERSION) return;

  const repo = getDataRepository();
  await repo.setContacts(SEED_CONTACTS);
  await repo.setPhotos(SEED_PHOTOS);
  await repo.setAudioItems(SEED_AUDIO_ITEMS);
  await repo.setSeededFlag();
  await writeSeedVersion(SEED_VERSION);
}

async function readSeedVersion(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(SEED_VERSION_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

async function writeSeedVersion(version: number) {
  try {
    await AsyncStorage.setItem(SEED_VERSION_KEY, String(version));
  } catch {
    // silently fail — seeding will retry next launch
  }
}

export * from './contacts';
export * from './photos';
export * from './scams';
export * from './news';
export * from './familyMembers';
export * from './chats';
export * from './location';
