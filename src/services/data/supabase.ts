import type { DataRepository } from './types';

export const supabaseRepository: DataRepository = {
  async getContacts() {
    throw new Error('Supabase backend not configured');
  },
  async setContacts() {
    throw new Error('Supabase backend not configured');
  },
  async getPhotos() {
    throw new Error('Supabase backend not configured');
  },
  async addPhoto() {
    throw new Error('Supabase backend not configured');
  },
  async setPhotos() {
    throw new Error('Supabase backend not configured');
  },
  async getPrefs() {
    throw new Error('Supabase backend not configured');
  },
  async setPrefs() {
    throw new Error('Supabase backend not configured');
  },
  async getAudioItems() {
    throw new Error('Supabase backend not configured');
  },
  async setAudioItems() {
    throw new Error('Supabase backend not configured');
  },
  async getSeededFlag() {
    return false;
  },
  async setSeededFlag() {
    throw new Error('Supabase backend not configured');
  },
};
