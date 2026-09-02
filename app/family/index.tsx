import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LocationCard } from '@/components/LocationCard';
import { BigButton, GlassCard, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/appStore';

interface FamilyMedDose {
  name: string;
  dosage: string;
  timeLabel: string;
  confirmed: boolean;
}

const FAMILY_MEDS: FamilyMedDose[] = [
  { name: 'Metformin', dosage: '500 mg', timeLabel: 'Breakfast', confirmed: true },
  { name: 'Januvia', dosage: '100 mg', timeLabel: 'Morning', confirmed: true },
  { name: 'Glipizide', dosage: '5 mg', timeLabel: 'Before meal', confirmed: false },
  { name: 'Metformin', dosage: '500 mg', timeLabel: 'Dinner', confirmed: false },
];

export default function FamilyDashboardScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.sm)
  );
  const { t } = useI18n();
  const location = useAppStore((s) => s.location);
  const [calling, setCalling] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  /* eslint-disable react-hooks/purity -- Date.now() for display-only time-ago label */
  const timeAgo = useMemo(
    () => Math.round((Date.now() - new Date(location.updatedAt).getTime()) / 60000),
    [location.updatedAt]
  );
  /* eslint-enable react-hooks/purity */

  const confirmedCount = FAMILY_MEDS.filter((d) => d.confirmed).length;

  useEffect(() => {
    if (!calling) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [calling, pulseAnim]);

  const startCall = useCallback(() => {
    setCalling(true);
  }, []);

  const endCall = useCallback(() => {
    setCalling(false);
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  if (calling) {
    return (
      <Screen contentContainerStyle={callStyles.container} bottomPadding={0}>
        <View style={callStyles.top}>
          <Text variant="body" align="center" color={colors.textSecondary}>
            {t('callScreen.calling')}...
          </Text>
        </View>
        <View style={callStyles.center}>
          <Animated.View style={[callStyles.avatarRing, { transform: [{ scale: pulseAnim }] }]}>
            <View style={callStyles.avatar}>
              <FontAwesome6 name="user" size={fontSize * 3} color={colors.textInverse} />
            </View>
          </Animated.View>
          <Text variant="title" align="center">
            Margaret
          </Text>
          <Text variant="body" align="center" color={colors.textSecondary}>
            {t('callScreen.calling')}...
          </Text>
        </View>
        <View style={callStyles.bottom}>
          <Pressable
            onPress={endCall}
            style={callStyles.endButton}
          >
            <FontAwesome6 name="phone-slash" size={fontSize * 1.4} color={colors.textInverse} />
          </Pressable>
          <Text variant="label" align="center" color={colors.danger}>
            {t('callScreen.endCall')}
          </Text>
        </View>
      </Screen>
    );
  }

  const activities = [
    { icon: 'camera', text: t('familyDash.activity_selfie'), time: t('familyDash.time_2h') },
    { icon: 'microphone', text: t('familyDash.activity_voice'), time: t('familyDash.time_5h') },
    { icon: 'comments', text: t('familyDash.activity_chat'), time: t('familyDash.time_yesterday') },
    { icon: 'location-dot', text: t('familyDash.activity_location'), time: t('familyDash.time_yesterday') },
  ];

  return (
    <Screen bottomPadding={0}>
      <View style={styles.header}>
        <Text variant="heading" color={colors.primary}>
          {t('familyDash.title')}
        </Text>
        <Text variant="body" color={colors.textSecondary}>
          {t('familyDash.subtitle')}
        </Text>
      </View>

      {/* ── Call Mom ── */}
      <BigButton
        label={t('familyDash.callMom')}
        variant="primary"
        icon={<FontAwesome6 name="phone" size={fontSize} color={colors.primary} />}
        onPress={startCall}
      />

      {/* ── Mom's Status ── */}
      <GlassCard padding="md">
        <View style={styles.statusRow}>
          <View style={[styles.statusIcon, { backgroundColor: colors.successLight }]}>
            <FontAwesome6 name="heart-pulse" size={fontSize * 1.1} color={colors.success} />
          </View>
          <View style={styles.statusText}>
            <Text variant="heading" color={colors.primary}>
              {t('familyDash.momsStatus')}
            </Text>
            <Text variant="body" color={colors.textSecondary}>
              {t('familyDash.doingWell')}
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* ── Medication Today ── */}
      <GlassCard padding="md">
        <View style={styles.sectionHeader}>
          <Text variant="heading" color={colors.primary}>
            {t('familyDash.medicationToday')}
          </Text>
          <Text variant="caption" color={colors.textSecondary}>
            {confirmedCount}/{FAMILY_MEDS.length} {t('medication.taken')}
          </Text>
        </View>
        <View style={styles.medList}>
          {FAMILY_MEDS.map((dose, i) => (
            <View key={`${dose.name}-${dose.timeLabel}-${i}`} style={styles.medRow}>
              <View
                style={[
                  styles.medDot,
                  { backgroundColor: dose.confirmed ? colors.success : colors.primary },
                ]}
              />
              <View style={styles.medInfo}>
                <Text variant="body">
                  {dose.name} {dose.dosage}
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {dose.timeLabel}
                </Text>
              </View>
              {dose.confirmed ? (
                <View style={[styles.confirmedBadge, { backgroundColor: colors.successLight }]}>
                  <FontAwesome6 name="circle-check" size={fontSize * 0.7} color={colors.success} />
                  <Text variant="caption" color={colors.success}>
                    {t('familyDash.momConfirmed')}
                  </Text>
                </View>
              ) : (
                <View style={[styles.confirmedBadge, { backgroundColor: colors.dangerLight }]}>
                  <FontAwesome6 name="circle-exclamation" size={fontSize * 0.7} color={colors.danger} />
                  <Text variant="caption" color={colors.danger}>
                    {t('familyDash.medicationOverdue')}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </GlassCard>

      {/* ── Mom's Location ── */}
      <GlassCard padding="md">
        <Text variant="heading" color={colors.primary}>
          {t('familyDash.location')}
        </Text>
        <LocationCard
          address={location.address}
          updatedAt={`${timeAgo} ${t('familyDash.minAgo')}`}
          showShare
        />
      </GlassCard>

      {/* ── Recent Activity ── */}
      <GlassCard padding="md">
        <Text variant="heading" color={colors.primary}>
          {t('familyDash.recentActivity')}
        </Text>
        <View style={styles.activityList}>
          {activities.map((a, i) => (
            <View key={i} style={styles.activityRow}>
              <FontAwesome6 name={a.icon as any} size={fontSize * 0.8} color={colors.primary} />
              <View style={styles.activityInfo}>
                <Text variant="body">{a.text}</Text>
                <Text variant="caption" color={colors.textSecondary}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* ── Manage ── */}
      <View style={styles.manageSection}>
        <Pressable
          onPress={() => router.push('/family/contacts')}
          style={({ pressed }) => [styles.manageBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <FontAwesome6 name="users-gear" size={fontSize} color={colors.primary} />
          <Text variant="label" style={{ color: colors.primary }}>{t('familyDash.manageContacts')}</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/family/settings')}
          style={({ pressed }) => [styles.manageBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <FontAwesome6 name="gear" size={fontSize} color={colors.primary} />
          <Text variant="label" style={{ color: colors.primary }}>{t('familyDash.seniorSettings')}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const callStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  top: {
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatarRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(244,125,85,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  endButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
    gap: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  medList: {
    gap: spacing.xs,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  medDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  medInfo: {
    flex: 1,
    gap: 1,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  activityList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  activityInfo: {
    flex: 1,
    gap: 1,
  },
  manageSection: {
    gap: spacing.sm,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
