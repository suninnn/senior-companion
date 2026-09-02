import { StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { GlassCard, Text } from '@/design';
import { colors, fontSizes, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';

interface LocationCardProps {
  address: string;
  updatedAt?: string;
  showShare?: boolean;
}

export function LocationCard({ address, updatedAt, showShare }: LocationCardProps) {
  const fontSize = useAccessibilityStore((s) => scaledFontSize(s.fontSize, fontSizes.md));

  return (
    <GlassCard intensity="regular">
      <View style={styles.header}>
        <FontAwesome6 name="location-dot" size={fontSize} color={colors.primary} />
        <Text variant="label">My Location</Text>
      </View>
      <Text variant="body">{address}</Text>
      {updatedAt ? (
        <Text variant="caption" color={colors.textSecondary}>
          Updated {updatedAt}
        </Text>
      ) : null}
      {showShare ? (
        <View style={styles.shareHint}>
          <FontAwesome6 name="share-nodes" size={fontSize * 0.7} color={colors.success} />
          <Text variant="caption" color={colors.success}>
            Shared with family
          </Text>
        </View>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  shareHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
