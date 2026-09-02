export interface PhotoComment {
  id: string;
  authorName: string;
  text?: string;
  kind: 'text' | 'voice';
  durationSec?: number;
  createdAt: string;
}

export interface FamilyPhoto {
  id: string;
  uri: string | number | { uri: string; width?: number; height?: number };
  senderName: string;
  caption?: string;
  createdAt: string;
  comments?: PhotoComment[];
}
