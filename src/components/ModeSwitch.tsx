import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';

type Mode = 'senior' | 'family';

interface ModeSwitchProps {
  current: Mode;
}

export function ModeSwitch({ current }: ModeSwitchProps) {
  const fontSize = useAccessibilityStore((s) => scaledFontSize(s.fontSize, fontSizes.xs));

  const switchTo = useCallback(
    (mode: Mode) => {
      if (mode === current) return;
      router.replace(mode === 'senior' ? '/senior' : '/family');
    },
    [current]
  );

  return (
    <View style={styles.container} accessibilityRole="tablist">
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: current === 'senior' }}
        onPress={() => switchTo('senior')}
        style={[styles.tab, current === 'senior' && styles.activeTab]}
      >
        <Text
          variant="caption"
          style={{
            fontSize,
            color: current === 'senior' ? colors.text : colors.textSecondary,
            fontWeight: current === 'senior' ? '700' : '500',
          }}
        >
          Senior
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: current === 'family' }}
        onPress={() => switchTo('family')}
        style={[styles.tab, current === 'family' && styles.activeTab]}
      >
        <Text
          variant="caption"
          style={{
            fontSize,
            color: current === 'family' ? colors.text : colors.textSecondary,
            fontWeight: current === 'family' ? '700' : '500',
          }}
        >
          Family
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radii.round,
    backgroundColor: 'rgba(255,255,255,0.35)',
    padding: 3,
    alignSelf: 'center',
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.round,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
});
