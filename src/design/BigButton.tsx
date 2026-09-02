import { type ComponentProps, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAccessibilityStore } from '@/accessibility';
import { Text } from './Text';
import { colors, fontSizes, hitSlop, radii, scaledFontSize, spacing } from './tokens';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';

interface BigButtonProps extends Omit<ComponentProps<typeof Pressable>, 'children'> {
  label: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<
  ButtonVariant,
  { bg: string; fg: string; border: string; pressed: string; shadow?: object }
> = {
  primary: {
    bg: 'rgba(255,255,255,0.72)',
    fg: colors.text,
    border: 'rgba(255,255,255,0.5)',
    pressed: 'rgba(255,255,255,0.88)',
    shadow: {
      shadowColor: 'rgba(80,50,30,0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
    },
  },
  secondary: {
    bg: 'rgba(255,255,255,0.55)',
    fg: colors.text,
    border: 'rgba(255,255,255,0.5)',
    pressed: 'rgba(255,255,255,0.72)',
    shadow: {
      shadowColor: 'rgba(80,50,30,0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 2,
    },
  },
  danger: {
    bg: 'rgba(201,90,87,0.15)',
    fg: colors.danger,
    border: 'rgba(255,255,255,0.5)',
    pressed: 'rgba(201,90,87,0.25)',
    shadow: {
      shadowColor: 'rgba(201,90,87,0.15)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 4,
    },
  },
  ghost: {
    bg: 'transparent',
    fg: colors.text,
    border: 'transparent',
    pressed: 'rgba(255,255,255,0.4)',
  },
  glass: {
    bg: 'rgba(255,255,255,0.72)',
    fg: colors.text,
    border: 'rgba(255,255,255,0.5)',
    pressed: 'rgba(255,255,255,0.88)',
    shadow: {
      shadowColor: 'rgba(80,50,30,0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
    },
  },
};

export function BigButton({
  label,
  icon,
  variant = 'primary',
  fullWidth = true,
  onPressIn,
  style,
  ...rest
}: BigButtonProps) {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const theme = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={hitSlop}
      onPressIn={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPressIn?.(e);
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? theme.pressed : theme.bg,
          borderColor: theme.border,
          minHeight: Math.max(72, fontSize * 2.8),
        },
        theme.shadow,
        fullWidth && styles.fullWidth,
        style as ViewStyle,
      ]}
      {...rest}
    >
      {icon ? <>{icon}</> : null}
      <Text
        variant="label"
        style={{ color: theme.fg }}
        align="center"
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
});
