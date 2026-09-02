import { Stack } from 'expo-router';
import { useAccessibilityStore } from '@/accessibility';
import { colors, fontSizes, scaledFontSize } from '@/design/tokens';
import { useI18n } from '@/i18n';

export default function FamilyLayout() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const { t } = useI18n();

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: { fontSize, fontWeight: '700' },
        headerBackTitle: t('common.back'),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: t('familyLayout.dashboard'), headerBackVisible: false }}
      />
      <Stack.Screen name="contacts" options={{ title: t('familyLayout.manageContacts') }} />
      <Stack.Screen name="photos" options={{ title: t('familyLayout.sendPhotos') }} />
      <Stack.Screen name="settings" options={{ title: t('familyLayout.seniorSettings') }} />
    </Stack>
  );
}
