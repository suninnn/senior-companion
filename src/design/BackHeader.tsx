import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { colors, fontSizes, scaledFontSize, spacing } from './tokens';
import { useAccessibilityStore } from '@/accessibility';
import { Text } from './Text';

interface BackHeaderProps {
  title?: string;
  light?: boolean;
}

export function BackHeader({ title, light }: BackHeaderProps) {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const iconColor = light ? colors.textInverse : colors.primary;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <FontAwesome6 name="chevron-left" size={fontSize} color={iconColor} />
      </Pressable>
      {title ? (
        <Text
          variant="label"
          style={styles.title}
          numberOfLines={1}
          color={light ? colors.textInverse : colors.text}
        >
          {title}
        </Text>
      ) : null}
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 28,
  },
});
