import { type ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/design/Text';
import { colors, fontSizes, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';

type MicStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

interface MicButtonProps extends Omit<ComponentProps<typeof Pressable>, 'children'> {
  status: MicStatus;
  label?: string;
}

const statusConfig: Record<
  MicStatus,
  { icon: string; color: string; bg: string; label: string }
> = {
  idle: { icon: 'microphone', color: colors.textInverse, bg: colors.primary, label: 'Tap to Talk' },
  listening: { icon: 'microphone-lines', color: colors.textInverse, bg: colors.danger, label: 'Listening...' },
  thinking: { icon: 'brain', color: colors.textInverse, bg: colors.caution, label: 'Thinking...' },
  speaking: { icon: 'volume-high', color: colors.textInverse, bg: colors.success, label: 'Speaking...' },
};

export function MicButton({ status, label, onPressIn, ...rest }: MicButtonProps) {
  const config = statusConfig[status];
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.xxl)
  );

  const scale = useSharedValue(1);

  if (status === 'listening') {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      true
    );
  } else {
    scale.value = withTiming(1, { duration: 200 });
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? config.label}
      accessibilityState={{ busy: status !== 'idle' }}
      onPressIn={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPressIn?.(e);
      }}
      {...rest}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: config.bg,
            width: fontSize * 3.2,
            height: fontSize * 3.2,
            borderRadius: (fontSize * 3.2) / 2,
          },
          animatedStyle,
        ]}
      >
        <FontAwesome6 name={config.icon} size={fontSize * 1.4} color={config.color} />
      </Animated.View>
      <Text variant="heading" align="center" style={{ color: config.bg, marginTop: spacing.md }}>
        {label ?? config.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
