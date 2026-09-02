import { useMemo } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LocationCard } from '@/components/LocationCard';
import { ModeSwitch } from '@/components/ModeSwitch';
import { GlassCard, Screen, Text } from '@/design';
import { colors, fontSizes, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import { useAppStore } from '@/store/appStore';

const ACTIVITIES = [
  { icon: 'camera', text: 'Mom shared a new selfie', time: '2 hours ago' },
  { icon: 'microphone', text: 'Mom left a voice comment on a photo', time: '5 hours ago' },
  { icon: 'comments', text: 'Mom sent a message in Family Chat', time: 'Yesterday' },
  { icon: 'location-dot', text: "Mom's location was updated", time: 'Yesterday' },
];

export default function FamilyDashboardScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.sm)
  );
  const location = useAppStore((s) => s.location);
  /* eslint-disable react-hooks/purity -- Date.now() for display-only time-ago label */
  const timeAgo = useMemo(
    () => Math.round((Date.now() - new Date(location.updatedAt).getTime()) / 60000),
    [location.updatedAt]
  );
  /* eslint-enable react-hooks/purity */

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="heading" color={colors.primary}>
          Family Dashboard
        </Text>
        <Text variant="body" color={colors.textSecondary}>
          Stay connected with Mom.
        </Text>
        <ModeSwitch current="family" />
      </View>

      <GlassCard padding="md">
        <Text variant="label">{"Mom's Location"}</Text>
        <LocationCard
          address={location.address}
          updatedAt={`${timeAgo} min ago`}
          showShare
        />
      </GlassCard>

      <GlassCard padding="md">
        <Text variant="label">Quick Actions</Text>
        <View style={styles.quickActions}>
          <QuickAction icon="phone" label="Call Mom" onPress={() => router.push('/senior/family')} />
          <QuickAction icon="image" label="Send Photo" onPress={() => {}} />
          <QuickAction icon="microphone" label="Voice Msg" onPress={() => {}} />
          <QuickAction icon="location-dot" label="View Map" onPress={() => router.push('/senior/location')} />
        </View>
      </GlassCard>

      <GlassCard padding="md">
        <Text variant="label">Recent Activity</Text>
        <View style={styles.activityList}>
          {ACTIVITIES.map((a, i) => (
            <View key={i} style={styles.activityRow}>
              <FontAwesome6 name={a.icon as any} size={fontSize * 0.8} color={colors.primary} />
              <View style={styles.activityInfo}>
                <Text variant="body">{a.text}</Text>
                <Text variant="caption" color={colors.textSecondary}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>

      <View style={styles.manageSection}>
        <Pressable
          onPress={() => router.push('/family/contacts')}
          style={({ pressed }) => [styles.manageBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <FontAwesome6 name="users-gear" size={fontSize} color={colors.primary} />
          <Text variant="label" style={{ color: colors.primary }}>Manage Contacts</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/family/settings')}
          style={({ pressed }) => [styles.manageBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <FontAwesome6 name="gear" size={fontSize} color={colors.primary} />
          <Text variant="label" style={{ color: colors.primary }}>Senior Settings</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.xs)
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.quickAction, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.quickIcon}>
        <FontAwesome6 name={icon as any} size={fontSize * 1.4} color={colors.primary} />
      </View>
      <Text variant="caption" align="center" style={{ fontSize }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.sm,
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(10,102,194,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  activityInfo: {
    flex: 1,
    gap: 1,
  },
  manageSection: {
    gap: spacing.sm,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
