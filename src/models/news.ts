export type NewsCategory = 'dailyNews' | 'health' | 'localNews' | 'stories' | 'podcasts' | 'weather' | 'finance';

export interface AudioItem {
  id: string;
  category: NewsCategory;
  title: string;
  durationSec: number;
  audioSource: number | string;
  summary?: string;
}
