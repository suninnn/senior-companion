import { useMemo, useCallback } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { BigButton, GlassCard, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/appStore';

interface MedDose {
  name: string;
  dosage: string;
  time: string;
  timeLabel: string;
  taken: boolean;
}

const MEDICATIONS: MedDose[] = [
  { name: 'Metformin', dosage: '500 mg', time: '08:00', timeLabel: 'Breakfast', taken: true },
  { name: 'Januvia', dosage: '100 mg', time: '08:00', timeLabel: 'Morning', taken: true },
  { name: 'Glipizide', dosage: '5 mg', time: '08:00', timeLabel: 'Before meal', taken: false },
  { name: 'Metformin', dosage: '500 mg', time: '18:00', timeLabel: 'Dinner', taken: false },
];

function ShortcutCard({
  icon,
  title,
  subtitle,
  onPress,
  color,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  color: string;
}) {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.sm)
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shortcut, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={[styles.shortcutIcon, { backgroundColor: `${color}18` }]}>
        <FontAwesome6 name={icon as any} size={fontSize * 1.1} color={color} />
      </View>
      <View style={styles.shortcutText}>
        <Text variant="label">{title}</Text>
        <Text variant="caption" color={colors.textSecondary}>
          {subtitle}
        </Text>
      </View>
      <FontAwesome6 name="chevron-right" size={fontSize * 0.7} color={colors.textSecondary} />
    </Pressable>
  );
}

export default function SeniorHomeScreen() {
  const seniorName = useAppStore((s) => s.seniorName);
  const { t } = useI18n();
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const smallFontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.sm)
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('senior.greeting_morning')
      : hour < 18
      ? t('senior.greeting_afternoon')
      : t('senior.greeting_evening');

  const upcomingDoses = useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return MEDICATIONS.filter((d) => {
      const [h, m] = d.time.split(':').map(Number);
      return h * 60 + m > currentMinutes || !d.taken;
    }).slice(0, 3);
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="title" color={colors.primary} align="center">
          MyFam AI
        </Text>
        <Text variant="heading" align="center">
          {greeting}, {seniorName}
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          {t('home.howCanIHelp')}
        </Text>
      </View>

      <GlassCard padding="md" style={styles.aiCard}>
        <View style={styles.aiIconCircle}>
          <FontAwesome6 name="microphone" size={fontSize * 1.5} color={colors.textInverse} />
        </View>
        <Text variant="heading" color={colors.primary} align="center">
          {t('home.aiCompanion')}
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          {t('home.aiSubtitle')}
        </Text>
        <BigButton
          label={t('home.talkToAI')}
          variant="primary"
          icon={
            <FontAwesome6 name="microphone" size={smallFontSize} color={colors.primary} />
          }
          onPress={() => router.push('/senior/talk')}
        />
      </GlassCard>

      <GlassCard padding="md">
        <View style={styles.sectionHeader}>
          <FontAwesome6 name="phone-volume" size={smallFontSize} color={colors.danger} />
          <Text variant="label">Emergency</Text>
        </View>
        <View style={styles.emergencyRow}>
          <Pressable
            onPress={() => Alert.alert('Calling 911', 'Emergency services are being contacted...')}
            style={({ pressed }) => [styles.emergencyBtn, styles.emergency911, { opacity: pressed ? 0.8 : 1 }]}
          >
            <FontAwesome6 name="phone" size={smallFontSize * 1.2} color={colors.textInverse} />
            <Text variant="label" style={{ color: colors.textInverse, fontWeight: '700' }}>
              Call 911
            </Text>
          </Pressable>
          <Pressable
            onPress={() => Alert.alert('Calling Amy', 'Calling your daughter Amy...')}
            style={({ pressed }) => [styles.emergencyBtn, styles.emergencyContact, { opacity: pressed ? 0.8 : 1 }]}
          >
            <FontAwesome6 name="user" size={smallFontSize * 1.2} color={colors.primary} />
            <Text variant="label" style={{ color: colors.primary, fontWeight: '700' }}>
              Call Amy
            </Text>
            <Text variant="caption" color={colors.textSecondary}>Daughter</Text>
          </Pressable>
        </View>
      </GlassCard>

      <GlassCard padding="md">
        <View style={styles.sectionHeader}>
          <Text variant="heading" color={colors.primary}>
            {t('home.today')}
          </Text>
          <Pressable
            onPress={() => router.push('/senior/medication')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text variant="label" color={colors.primary}>
              {t('home.viewAll')}
            </Text>
          </Pressable>
        </View>
        <View style={styles.doseList}>
          {upcomingDoses.map((dose, i) => (
            <View key={`${dose.name}-${dose.time}-${i}`} style={styles.doseRow}>
              <View
                style={[
                  styles.doseDot,
                  { backgroundColor: dose.taken ? colors.success : colors.primary },
                ]}
              />
              <View style={styles.doseInfo}>
                <Text variant="body">
                  {dose.name} {dose.dosage}
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {dose.timeLabel}
                </Text>
              </View>
              <Text
                variant="caption"
                color={dose.taken ? colors.success : colors.primary}
              >
                {dose.taken ? t('medication.taken') : t('medication.upcoming')}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <View style={styles.shortcuts}>
        <ShortcutCard
          icon="headphones"
          title={t('home.newsStories')}
          subtitle={t('home.newsSubtitle')}
          onPress={() => router.push('/senior/news')}
          color={colors.primary}
        />
        <ShortcutCard
          icon="language"
          title={t('home.translate')}
          subtitle={t('home.translateSubtitle')}
          onPress={() => router.push('/senior/translate')}
          color={colors.sage}
        />
        <ShortcutCard
          icon="shield-heart"
          title={t('home.safetyHelp')}
          subtitle={t('home.safetySubtitle')}
          onPress={() => router.push('/senior/safety')}
          color={colors.danger}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    alignItems: 'center',
  },
  aiCard: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  aiIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doseList: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  doseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  doseInfo: {
    flex: 1,
    gap: 1,
  },
  shortcuts: {
    gap: spacing.xs,
  },
  emergencyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  emergencyBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    minHeight: 64,
  },
  emergency911: {
    backgroundColor: colors.danger,
  },
  emergencyContact: {
    backgroundColor: 'rgba(244,125,85,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244,125,85,0.3)',
  },
  shortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutText: {
    flex: 1,
    gap: 2,
  },
});
