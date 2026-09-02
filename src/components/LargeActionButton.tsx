import { type ComponentProps } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { Text } from '@/design';
import { colors, fontSizes, hitSlop, radii, scaledFontSize, spacing, elevation } from '@/design/tokens';
import { SpeakerButton } from './SpeakerButton';

interface LargeActionButtonProps extends Omit<ComponentProps<typeof Pressable>, 'children' | 'style'> {
  label: string;
  icon: string;
  iconColor?: string;
  speakerText?: string;
  layout?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export function LargeActionButton({
  label,
  icon,
  iconColor = colors.primary,
  speakerText,
  layout = 'horizontal',
  onPressIn,
  style,
  ...rest
}: LargeActionButtonProps) {
  const fontSize = useAccessibilityStore((s) => scaledFontSize(s.fontSize, fontSizes.md));
  const iconSize = fontSize * 1.4;
  const minHeight = layout === 'vertical' ? Math.max(110, fontSize * 4) : Math.max(96, fontSize * 3);

  return (
    <View style={[layout === 'vertical' ? styles.gridItem : styles.row, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        hitSlop={hitSlop}
        onPressIn={(e) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onPressIn?.(e);
        }}
        style={({ pressed }) => [
          layout === 'vertical' ? styles.gridCard : styles.card,
          {
            minHeight,
            backgroundColor: pressed ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.55)',
          },
          elevation.card,
        ]}
        {...rest}
      >
        <FontAwesome6 name={icon} size={layout === 'vertical' ? iconSize * 1.3 : iconSize} color={iconColor} />
        <Text variant="label" style={layout === 'vertical' ? styles.gridLabel : { flex: 1 }}>
          {label}
        </Text>
      </Pressable>
      {speakerText && layout !== 'vertical' ? (
        <View style={styles.speakerWrap}>
          <SpeakerButton text={speakerText} size={Math.max(44, fontSize * 1.5)} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    overflow: 'hidden',
  },
  gridItem: {
    width: '48%',
    flexGrow: 1,
  },
  gridCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    overflow: 'hidden',
  },
  gridLabel: {
    textAlign: 'center',
  },
  speakerWrap: {
    flexShrink: 0,
  },
});
