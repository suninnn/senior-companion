# Senior AI Companion

A mobile-first, accessibility-first React Native Expo app designed for older adults and their families. It combines a simple, large-text senior interface with a family caregiver dashboard.

## Features

- **Senior Mode**
  - Talk to an AI companion with voice
  - Two-way Chinese ↔ English voice translation
  - One-tap emergency family contacts
  - Family photo feed
  - Scam / safety checker for suspicious messages
  - News and podcasts audio player
  - Adjustable font size, speech rate, TTS, and primary language

- **Family / Caregiver Mode**
  - Manage emergency contacts
  - Upload photos with captions
  - Configure senior accessibility preferences

## Tech Stack

- Expo SDK 57
- React Native 0.86
- TypeScript
- expo-router (file-based routing)
- expo-speech, expo-audio, expo-image, expo-image-picker
- Zustand + AsyncStorage persistence
- react-native-reanimated

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- [Expo Go](https://expo.dev/go) on an iOS or Android device (for the quickest start)

### Install

```bash
cd senior-companion
npm install
```

### Run in Expo Go

```bash
npm start
```

Scan the QR code with the Expo Go app on your phone.

### Run on iOS Simulator

```bash
npm run ios
```

### Run on Android Emulator

```bash
npm run android
```

## Mock-First Providers

The app ships with mock AI, STT, and translation providers so every screen works immediately in Expo Go, without a backend or native dev build.

To swap in real providers later, update the values in `src/config/env.ts`:

| Provider | Mock option | Real option |
|---|---|---|
| AI | `mock` | `openai` |
| STT | `mock` | `native` (requires native dev build) |
| TTS | `mock` | `expo-speech` |
| Data | `asyncStorage` | `supabase` |

`expo-speech` TTS is enabled by default and supports `zh-CN` and `en-US`.

## Project Structure

```
senior-companion/
├── app/                    # expo-router screens
│   ├── index.tsx           # Role picker
│   ├── senior/             # Senior screens
│   └── family/             # Family/caregiver screens
├── src/
│   ├── accessibility/      # Font scaling + preference store
│   ├── components/         # Reusable UI pieces
│   ├── design/             # Design-system primitives
│   ├── hooks/              # Voice and translation session hooks
│   ├── models/             # TypeScript types
│   ├── services/           # Provider interfaces + implementations
│   └── data/seed/          # Demo contacts, photos, news
└── assets/                 # Icons and images
```

## Verification

```bash
npm run typecheck
npm run lint
npx expo export --platform ios
```

## Accessibility

- All senior controls use a minimum 72 pt touch target.
- Text scales across three presets: Normal, Large, and Extra Large.
- High-contrast mode and spoken responses are configurable.
- Input forms use clear labels and large tap areas.

## License

MIT
