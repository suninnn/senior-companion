import { Stack, Tabs } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { colors, scaledFontSize, fontSizes } from '@/design/tokens';
import { useI18n } from '@/i18n';

export default function SeniorLayout() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.xs)
  );
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: { fontSize, fontWeight: '600' },
        tabBarStyle: {
          height: 64,
          paddingBottom: 6,
          paddingTop: 6,
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(0,0,0,0.08)',
          backgroundColor: 'rgba(255,248,243,0.95)',
        },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      {/* ── Visible tabs ── */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="house" size={fontSize * 1.2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fam"
        options={{
          title: t('tabs.fam'),
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="heart" size={fontSize * 1.2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="gear" size={fontSize * 1.2} color={color} />
          ),
        }}
      />

      {/* ── Hidden push screens (accessible via router.push) ── */}
      <Tabs.Screen name="talk" options={{ href: null }} />
      <Tabs.Screen name="translate" options={{ href: null }} />
      <Tabs.Screen name="family" options={{ href: null }} />
      <Tabs.Screen name="photos" options={{ href: null }} />
      <Tabs.Screen name="safety" options={{ href: null }} />
      <Tabs.Screen name="news" options={{ href: null }} />
      <Tabs.Screen name="medication" options={{ href: null }} />
      <Tabs.Screen name="location" options={{ href: null }} />
      <Tabs.Screen name="chats" options={{ href: null }} />
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="camera" options={{ href: null }} />
    </Tabs>
  );
}
