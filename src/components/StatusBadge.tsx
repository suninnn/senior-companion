import { StyleSheet, View } from 'react-native';
import { Text } from '@/design';
import { colors, radii, spacing } from '@/design/tokens';

export type FamilyStatus = 'working' | 'dinner' | 'traveling' | 'home' | 'available';

export const STATUS_META: Record<FamilyStatus, { emoji: string; label: string }> = {
  working: { emoji: '💻', label: 'Working' },
  dinner: { emoji: '🍽️', label: 'Having dinner' },
  traveling: { emoji: '✈️', label: 'Traveling' },
  home: { emoji: '🏠', label: 'At home' },
  available: { emoji: '🟢', label: 'Available' },
};

interface StatusBadgeProps {
  status: FamilyStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  return (
    <View style={styles.badge}>
      <Text variant="caption" style={styles.text}>
        {meta.emoji} {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: radii.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  text: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
