import { router } from 'expo-router';
import { useAccessibilityStore } from '@/accessibility';
import { BigButton, Screen, Text } from '@/design';
import { colors, spacing } from '@/design/tokens';
import { StyleSheet, View } from 'react-native';

export default function RolePickerScreen() {
  const hydrated = useAccessibilityStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <Screen>
        <View style={styles.centered}>
          <Text variant="title" align="center">
            Loading…
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.centered}>
        <Text variant="heading" align="center" color={colors.primary}>
          AI Companion
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          For seniors and their families
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <BigButton
          label="I am the Senior"
          variant="primary"
          onPress={() => router.replace('/senior')}
        />
        <BigButton
          label="I am Family / Caregiver"
          variant="secondary"
          onPress={() => router.replace('/family')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  buttonGroup: {
    gap: spacing.md,
  },
});
