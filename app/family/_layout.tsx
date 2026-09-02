import { Stack } from 'expo-router';
import { useAccessibilityStore } from '@/accessibility';
import { colors, fontSizes, scaledFontSize } from '@/design/tokens';

export default function FamilyLayout() {
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
        options={{ title: 'Family Dashboard', headerBackVisible: false }}
      />
      <Stack.Screen name="contacts" options={{ title: 'Manage Contacts' }} />
      <Stack.Screen name="photos" options={{ title: 'Send Photos' }} />
      <Stack.Screen name="settings" options={{ title: 'Senior Settings' }} />
    </Stack>
  );
}
