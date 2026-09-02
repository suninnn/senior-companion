import { Stack } from 'expo-router';
import { useAccessibilityStore } from '@/accessibility';
import { colors, scaledFontSize, fontSizes } from '@/design/tokens';

export default function SeniorLayout() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: { fontSize, fontWeight: '700' },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Home', headerBackVisible: false }}
      />
      <Stack.Screen name="talk" options={{ title: 'Talk to AI' }} />
      <Stack.Screen name="translate" options={{ title: 'Translate' }} />
      <Stack.Screen name="family" options={{ title: 'Call Family' }} />
      <Stack.Screen name="photos" options={{ title: 'Family Photos' }} />
      <Stack.Screen name="safety" options={{ title: 'Safety / Scam Help' }} />
      <Stack.Screen name="news" options={{ title: 'News & Podcasts' }} />
      <Stack.Screen name="camera" options={{ title: 'Take a Photo' }} />
      <Stack.Screen name="location" options={{ title: 'My Location' }} />
      <Stack.Screen name="chats" options={{ title: 'Messages' }} />
      <Stack.Screen name="chat" options={{ title: 'Chat' }} />
    </Stack>
  );
}
