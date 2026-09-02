import { Pressable, StyleSheet, View } from 'react-native';
import { useAccessibilityStore } from '@/accessibility';
import { Text } from '@/design';
import { colors, fontSizes, hitSlop, radii, scaledFontSize, spacing } from '@/design/tokens';

export function FontSizeController() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const preset = useAccessibilityStore((s) => s.fontSize);
  const increase = useAccessibilityStore((s) => s.increaseFontSize);
  const decrease = useAccessibilityStore((s) => s.decreaseFontSize);

  const canDecrease = preset !== 'normal';
  const canIncrease = preset !== 'extraLarge';

  return (
    <View style={styles.row} accessibilityRole="toolbar">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease text size"
        accessibilityState={{ disabled: !canDecrease }}
        disabled={!canDecrease}
        hitSlop={hitSlop}
        onPress={decrease}
        style={({ pressed }) => [
          styles.button,
          { opacity: canDecrease ? (pressed ? 0.7 : 1) : 0.35 },
        ]}
      >
        <Text variant="label" align="center" style={{ color: colors.primary }}>
          A−
        </Text>
      </Pressable>

      <View style={styles.labelBox}>
        <Text variant="label" align="center" color={colors.textSecondary}>
          {preset === 'normal' ? 'Text Size' : `${preset.charAt(0).toUpperCase() + preset.slice(1)}`}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase text size"
        accessibilityState={{ disabled: !canIncrease }}
        disabled={!canIncrease}
        hitSlop={hitSlop}
        onPress={increase}
        style={({ pressed }) => [
          styles.button,
          { opacity: canIncrease ? (pressed ? 0.7 : 1) : 0.35 },
        ]}
      >
        <Text
          variant="label"
          align="center"
          style={{ color: colors.primary, fontSize: fontSize * 1.15 }}
        >
          A+
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  button: {
    minWidth: 56,
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  labelBox: {
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
});
