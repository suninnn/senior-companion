export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  kind: 'text' | 'voice' | 'nudge';
  text: string;
  durationSec?: number;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  name: string;
  participantIds: string[];
  isGroup: boolean;
  avatarUri?: string;
  messages: ChatMessage[];
}
