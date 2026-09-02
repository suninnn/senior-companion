import type {
  AccessibilityPrefs,
  AudioItem,
  Contact,
  FamilyPhoto,
} from '@/models';

export interface DataRepository {
  getContacts(): Promise<Contact[]>;
  setContacts(contacts: Contact[]): Promise<void>;

  getPhotos(): Promise<FamilyPhoto[]>;
  addPhoto(photo: FamilyPhoto): Promise<void>;
  setPhotos(photos: FamilyPhoto[]): Promise<void>;

  getPrefs(): Promise<AccessibilityPrefs | null>;
  setPrefs(prefs: AccessibilityPrefs): Promise<void>;

  getAudioItems(): Promise<AudioItem[]>;
  setAudioItems(items: AudioItem[]): Promise<void>;

  getSeededFlag(): Promise<boolean>;
  setSeededFlag(): Promise<void>;
}
