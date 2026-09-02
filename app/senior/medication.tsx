import { useCallback, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Switch, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { BigButton, GlassCard, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useI18n, type TranslationKey } from '@/i18n';

type DoseStatus = 'taken' | 'upcoming' | 'missed';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  icon: string;
  tint: string;
  instruction: string;
}

interface DoseSlot {
  id: string;
  label: string;
  hour: number;
  medId: string;
}

const MEDICATIONS: Medication[] = [
  {
    id: 'metformin',
    name: 'Metformin',
    dosage: '500 mg',
    icon: 'tablets',
    tint: colors.primary,
    instruction: 'withBreakfast',
  },
  {
    id: 'januvia',
    name: 'Januvia',
    dosage: '100 mg',
    icon: 'pills',
    tint: colors.sage,
    instruction: 'onceDaily',
  },
  {
    id: 'glipizide',
    name: 'Glipizide',
    dosage: '5 mg',
    icon: 'capsules',
    tint: colors.mutedRose,
    instruction: 'beforeMeal',
  },
];

const DOSES: DoseSlot[] = [
  { id: 'metformin-am', label: 'Breakfast', hour: 8, medId: 'metformin' },
  { id: 'januvia-am', label: 'Morning', hour: 8, medId: 'januvia' },
  { id: 'glipizide-am', label: 'Before meal', hour: 8, medId: 'glipizide' },
  { id: 'metformin-pm', label: 'Dinner', hour: 18, medId: 'metformin' },
];

const STATUS_COLORS: Record<DoseStatus, string> = {
  taken: colors.success,
  upcoming: colors.primary,
  missed: colors.danger,
};

const STATUS_BG: Record<DoseStatus, string> = {
  taken: colors.successLight,
  upcoming: colors.primaryLight,
  missed: colors.dangerLight,
};

const STATUS_ICONS: Record<DoseStatus, string> = {
  taken: 'circle-check',
  upcoming: 'clock',
  missed: 'circle-exclamation',
};

export default function MedicationScreen() {
  const { t } = useI18n();
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );

  const [takenDoses, setTakenDoses] = useState<Record<string, boolean>>({});
  const [reminderOn, setReminderOn] = useState(true);
  const [photoStep, setPhotoStep] = useState<'idle' | 'camera' | 'confirmed'>('idle');
  const [pendingDoseId, setPendingDoseId] = useState<string | null>(null);

  const currentHour = useMemo(() => new Date().getHours(), []);

  const getMed = useCallback((medId: string) => MEDICATIONS.find((m) => m.id === medId)!, []);

  const statusFor = useCallback(
    (doseId: string, hour: number): DoseStatus => {
      if (takenDoses[doseId]) return 'taken';
      return currentHour > hour ? 'missed' : 'upcoming';
    },
    [takenDoses, currentHour]
  );

  const nextDose = useMemo(() => {
    return DOSES.find((d) => !takenDoses[d.id]) ?? null;
  }, [takenDoses]);

  const takenCount = useMemo(
    () => DOSES.filter((d) => takenDoses[d.id]).length,
    [takenDoses]
  );

  const openCamera = useCallback((doseId: string) => {
    setPendingDoseId(doseId);
    setPhotoStep('camera');
  }, []);

  const simulatePhoto = useCallback(() => {
    setPhotoStep('confirmed');
  }, []);

  const confirmDose = useCallback(() => {
    if (!pendingDoseId) return;
    setTakenDoses((prev) => ({ ...prev, [pendingDoseId]: true }));
    setPhotoStep('idle');
    setPendingDoseId(null);
    Alert.alert(
      t('medication.medicationRecorded'),
      t('medication.familyNotified')
    );
  }, [pendingDoseId, t]);

  const closeModal = useCallback(() => {
    setPhotoStep('idle');
    setPendingDoseId(null);
  }, []);

  const pendingDose = pendingDoseId
    ? DOSES.find((d) => d.id === pendingDoseId) ?? null
    : null;
  const pendingMed = pendingDose ? getMed(pendingDose.medId) : null;

  return (
    <Screen>
      {/* ── Next Medication Card ── */}
      {nextDose ? (
        <GlassCard padding="lg" style={styles.nextCard}>
          <View style={[styles.nextIcon, { backgroundColor: `${getMed(nextDose.medId).tint}22` }]}>
            <FontAwesome6
              name={getMed(nextDose.medId).icon}
              size={fontSize * 1.6}
              color={getMed(nextDose.medId).tint}
            />
          </View>
          <Text variant="heading" align="center">
            {t('medication.nextMedication')}
          </Text>
          <Text variant="title" align="center" color={colors.primary}>
            {getMed(nextDose.medId).name} {getMed(nextDose.medId).dosage}
          </Text>
          <Text variant="body" align="center" color={colors.textSecondary}>
            {nextDose.label} · {t(`medication.${getMed(nextDose.medId).instruction}` as TranslationKey)}
          </Text>
          <BigButton
            label={t('medication.takeMedication')}
            variant="primary"
            icon={
              <FontAwesome6 name="camera" size={fontSize} color={colors.primary} />
            }
            onPress={() => openCamera(nextDose.id)}
          />
        </GlassCard>
      ) : (
        <GlassCard padding="lg" style={styles.nextCard}>
          <View style={[styles.nextIcon, { backgroundColor: colors.successLight }]}>
            <FontAwesome6 name="circle-check" size={fontSize * 1.6} color={colors.success} />
          </View>
          <Text variant="heading" align="center" color={colors.success}>
            {t('medication.noUpcoming')}
          </Text>
          <Text variant="body" align="center" color={colors.textSecondary}>
            {takenCount} / {DOSES.length} {t('medication.taken')}
          </Text>
        </GlassCard>
      )}

      {/* ── Today's Schedule ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome6 name="calendar-day" size={fontSize} color={colors.primary} />
          <Text variant="heading" color={colors.primary}>
            {t('medication.todaysSchedule')}
          </Text>
        </View>

        <GlassCard padding="md">
          {DOSES.map((dose, i) => {
            const med = getMed(dose.medId);
            const status = statusFor(dose.id, dose.hour);

            return (
              <View
                key={dose.id}
                style={[styles.doseRow, i > 0 && styles.divider]}
              >
                <View style={[styles.medIcon, { backgroundColor: `${med.tint}22` }]}>
                  <FontAwesome6 name={med.icon} size={fontSize} color={med.tint} />
                </View>
                <View style={styles.doseInfo}>
                  <Text variant="body" style={styles.medName}>
                    {med.name} {med.dosage}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    {dose.label} · {t(`medication.${med.instruction}` as TranslationKey)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: STATUS_BG[status],
                      borderColor: STATUS_COLORS[status],
                    },
                  ]}
                >
                  <FontAwesome6
                    name={STATUS_ICONS[status]}
                    size={fontSize * 0.65}
                    color={STATUS_COLORS[status]}
                  />
                  <Text variant="caption" color={STATUS_COLORS[status]}>
                    {t(`medication.${status}`)}
                  </Text>
                </View>
              </View>
            );
          })}
        </GlassCard>
      </View>

      {/* ── Medication List ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome6 name="prescription-bottle-medical" size={fontSize} color={colors.primary} />
          <Text variant="heading" color={colors.primary}>
            {t('medication.myMedications')}
          </Text>
        </View>

        <GlassCard padding="md">
          {MEDICATIONS.map((med, i) => (
            <View key={med.id} style={[styles.medListRow, i > 0 && styles.divider]}>
              <View style={[styles.medIcon, { backgroundColor: `${med.tint}22` }]}>
                <FontAwesome6 name={med.icon} size={fontSize} color={med.tint} />
              </View>
              <View style={styles.doseInfo}>
                <Text variant="body" style={styles.medName}>
                  {med.name}
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {med.dosage} · {t(`medication.${med.instruction}` as TranslationKey)}
                </Text>
              </View>
            </View>
          ))}
        </GlassCard>
      </View>

      {/* ── Daily Reminder ── */}
      <View style={styles.section}>
        <GlassCard padding="md">
          <View style={styles.reminderRow}>
            <View style={styles.reminderLeft}>
              <FontAwesome6 name="bell" size={fontSize} color={colors.primary} />
              <View style={styles.reminderText}>
                <Text variant="body" style={styles.medName}>
                  {t('medication.reminder')}
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {t('medication.reminderMsg')}
                </Text>
              </View>
            </View>
            <Switch
              value={reminderOn}
              onValueChange={setReminderOn}
              accessibilityLabel={t('medication.reminder')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={reminderOn ? colors.textInverse : colors.textSecondary}
            />
          </View>
        </GlassCard>
        <Text variant="caption" color={colors.textSecondary} align="center">
          {t('medication.demoDisclaimer')}
        </Text>
      </View>

      {/* ── Photo Confirmation Modal ── */}
      <Modal
        visible={photoStep !== 'idle'}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text variant="heading">{t('medication.photoConfirm')}</Text>
              <Pressable
                onPress={closeModal}
                accessibilityRole="button"
                accessibilityLabel={t('common.cancel')}
                hitSlop={12}
              >
                <FontAwesome6 name="xmark" size={fontSize} color={colors.textSecondary} />
              </Pressable>
            </View>

            {pendingMed ? (
              <Text variant="body" color={colors.textSecondary} align="center">
                {pendingMed.name} · {pendingMed.dosage}
              </Text>
            ) : null}

            {photoStep === 'camera' ? (
              <>
                <View style={styles.viewfinder}>
                  <FontAwesome6 name="camera" size={fontSize * 2.4} color={colors.primary} />
                  <Text variant="body" align="center" color={colors.textSecondary}>
                    {t('medication.takePhotoFirst')}
                  </Text>
                </View>
                <BigButton
                  label={t('medication.photoConfirm')}
                  variant="glass"
                  icon={<FontAwesome6 name="camera" size={fontSize} color={colors.primary} />}
                  onPress={simulatePhoto}
                />
              </>
            ) : (
              <>
                <View style={[styles.viewfinder, styles.viewfinderSuccess]}>
                  <FontAwesome6 name="circle-check" size={fontSize * 2.4} color={colors.success} />
                  <Text variant="heading" align="center" color={colors.success}>
                    {t('medication.medicationRecorded')}
                  </Text>
                  <Text variant="body" align="center" color={colors.textSecondary}>
                    {t('medication.familyNotified')}
                  </Text>
                </View>
                <BigButton
                  label={t('medication.iTakeMyMedication')}
                  variant="primary"
                  icon={<FontAwesome6 name="check" size={fontSize} color={colors.primary} />}
                  onPress={confirmDose}
                />
              </>
            )}

            <BigButton
              label={t('common.cancel')}
              variant="ghost"
              onPress={closeModal}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nextCard: {
    alignItems: 'center',
    gap: spacing.md,
  },
  nextIcon: {
    width: 80,
    height: 80,
    borderRadius: radii.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  medListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  medIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  medName: {
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.round,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  reminderText: {
    flex: 1,
    gap: 2,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(36,34,32,0.45)',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  viewfinder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    minHeight: 200,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.surfaceDark,
    padding: spacing.lg,
  },
  viewfinderSuccess: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
});
