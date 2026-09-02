import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { GlassCard, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useI18n } from '@/i18n';

export default function RolePickerScreen() {
  const hydrated = useAccessibilityStore((s) => s.hydrated);
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const { t } = useI18n();

  if (!hydrated) {
    return (
      <Screen>
        <View style={styles.centered}>
          <Text variant="title" align="center">
            {t('common.loading')}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="title" align="center" color={colors.primary}>
          {t('landing.welcome')}
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          {t('landing.howToUse')}
        </Text>
      </View>

      <View style={styles.cards}>
        <Pressable
          onPress={() => router.replace('/senior')}
          style={({ pressed }) => [
            styles.cardPressable,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <GlassCard padding="lg" style={styles.roleCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(244,125,85,0.15)' }]}>
              <FontAwesome6 name="user" size={fontSize * 1.4} color={colors.primary} />
            </View>
            <Text variant="heading" color={colors.primary}>
              {t('landing.forMe')}
            </Text>
            <Text variant="body" color={colors.textSecondary}>
              {t('landing.forMeDesc')}
            </Text>
          </GlassCard>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/family')}
          style={({ pressed }) => [
            styles.cardPressable,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <GlassCard padding="lg" style={styles.roleCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(110,166,141,0.15)' }]}>
              <FontAwesome6 name="heart" size={fontSize * 1.4} color={colors.success} />
            </View>
            <Text variant="heading" color={colors.success}>
              {t('landing.forMyFamily')}
            </Text>
            <Text variant="body" color={colors.textSecondary}>
              {t('landing.forMyFamilyDesc')}
            </Text>
          </GlassCard>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  cards: {
    gap: spacing.md,
  },
  cardPressable: {
    borderRadius: radii.xl,
  },
  roleCard: {
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
});
