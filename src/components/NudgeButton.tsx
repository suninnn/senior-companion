import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { FontAwesome6 } from '@expo/vector-icons';
import { colors, fontSizes, hitSlop, radii, scaledFontSize, spacing } from '@/design/tokens';
import { Text } from '@/design';
import { useAccessibilityStore } from '@/accessibility';

interface NudgeButtonProps {
  onNudge?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function NudgeButton({ onNudge }: NudgeButtonProps) {
  const fontSize = useAccessibilityStore((s) => scaledFontSize(s.fontSize, fontSizes.sm));
  const scale = useSharedValue(1);
  const pressedRef = useRef(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    if (pressedRef.current) return;
    pressedRef.current = true;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values are mutated by design
    scale.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 400 }),
      withSpring(0.9, { damping: 10, stiffness: 300 }),
      withSpring(1.1, { damping: 12, stiffness: 200 }),
      withTiming(1, { duration: 200 }, () => {
        pressedRef.current = false;
      })
    );

    onNudge?.();
  }, [onNudge, scale]);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel="Send a nudge"
      hitSlop={hitSlop}
      onPress={handlePress}
      style={[styles.button, animatedStyle]}
    >
      <FontAwesome6 name="hand" size={fontSize} color={colors.primary} />
      <Text variant="caption" style={{ color: colors.primary, fontWeight: '600' }}>
        Nudge
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.round,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignSelf: 'flex-start',
  },
});
