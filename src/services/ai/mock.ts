import type { AiProvider, AiResponse } from './types';

const SIMPLE_REPLIES: Record<string, string> = {
  hello: "Hello! It's so nice to hear from you. How are you doing today?",
  hi: 'Hi there! I\'m here to help. What would you like to chat about?',
  'how are you': "I'm doing wonderful, thank you for asking! How about you?",
  'what time is it': "Let me check — you can see the time at the top of your screen. Is there anything else I can help with?",
  'thank you': "You're so welcome! Don't hesitate to ask if you need anything else.",
  thanks: "Happy to help! That's what I'm here for.",
  'good morning': 'Good morning! I hope you slept well. What a lovely day to chat!',
  'good night': 'Good night! Sleep well and sweet dreams. I\'ll be here whenever you need me.',
  weather: "I wish I could look outside! But I'd suggest checking your window or a weather app. Stay comfortable!",
  help: "Of course! I can chat with you, answer questions, or just keep you company. What's on your mind?",
  lonely: "I'm always here for you. Would you like me to help you call a family member, or shall we just chat?",
  family: "Your family loves you very much! Would you like to send them a message or share a photo?",
  photo: "Photos are such a wonderful way to share memories! You can take a selfie or browse your family album.",
};

const FALLBACK_REPLIES = [
  "That's a lovely thought! I appreciate you sharing that with me.",
  "I understand. Sometimes the best thing is to take it one step at a time.",
  "What a great question! If you'd like, I can help you reach out to a family member about this.",
  "I hear you. Would you like to talk more about it, or shall we do something else?",
  "That sounds important. Remember, your family is always just a tap away if you need them.",
  "I'm glad you brought that up. Let's think about it together.",
];

let fallbackIndex = 0;

export const mockAiProvider: AiProvider = {
  async ask(prompt) {
    const lower = prompt.toLowerCase().trim();
    await delay(700);

    for (const [keyword, reply] of Object.entries(SIMPLE_REPLIES)) {
      if (lower.includes(keyword)) {
        return { text: reply };
      }
    }

    const reply: AiResponse = { text: FALLBACK_REPLIES[fallbackIndex % FALLBACK_REPLIES.length] };
    fallbackIndex++;
    return reply;
  },

  async summarize(text) {
    await delay(500);
    return `Here is the short version: ${text.slice(0, 120)}${text.length > 120 ? '...' : ''}`;
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
