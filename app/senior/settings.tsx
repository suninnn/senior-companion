import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { presetLabel } from '@/accessibility/scale';
import { BigButton, GlassCard, Screen, Text } from '@/design';
import { colors, fontSizes, hitSlop, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useI18n } from '@/i18n';
import type { LanguageCode } from '@/models';

const SPEECH_RATE_STEP = 0.1;

function SectionHeader({ title }: { title: string }) {
  return (
    <Text variant="heading" color={colors.primary}>
      {title}
    </Text>
  );
}

function SettingRow({
  label,
  description,
  control,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text variant="body">{label}</Text>
        {description ? (
          <Text variant="caption" color={colors.textSecondary}>
            {description}
          </Text>
        ) : null}
      </View>
      {control}
    </View>
  );
}

function NavRow({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.sm)
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.navRow, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.navRowLeft}>
        <FontAwesome6 name={icon as any} size={fontSize * 0.9} color={colors.primary} />
        <Text variant="body">{label}</Text>
      </View>
      <FontAwesome6 name="chevron-right" size={fontSize * 0.7} color={colors.textSecondary} />
    </Pressable>
  );
}

function Stepper({
  value,
  onDecrease,
  onIncrease,
  min,
  max,
  label,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min: number;
  max: number;
  label: string;
}) {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );

  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease"
        disabled={value <= min}
        hitSlop={hitSlop}
        onPress={onDecrease}
        style={({ pressed }) => [
          styles.stepperButton,
          { opacity: value <= min ? 0.35 : pressed ? 0.7 : 1 },
        ]}
      >
        <FontAwesome6 name="minus" size={fontSize * 0.7} color={colors.primary} />
      </Pressable>
      <View style={styles.stepperValue}>
        <Text variant="label" align="center">
          {label}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase"
        disabled={value >= max}
        hitSlop={hitSlop}
        onPress={onIncrease}
        style={({ pressed }) => [
          styles.stepperButton,
          { opacity: value >= max ? 0.35 : pressed ? 0.7 : 1 },
        ]}
      >
        <FontAwesome6 name="plus" size={fontSize * 0.7} color={colors.primary} />
      </Pressable>
    </View>
  );
}

function LanguageOption({
  code,
  label,
  selected,
  onSelect,
}: {
  code: LanguageCode;
  label: string;
  selected: boolean;
  onSelect: (code: LanguageCode) => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={() => onSelect(code)}
      style={({ pressed }) => [
        styles.languageButton,
        {
          backgroundColor: pressed
            ? colors.surfaceDark
            : selected
            ? colors.primaryLight
            : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text variant="label" color={selected ? colors.primary : colors.text} align="center">
        {label}
      </Text>
    </Pressable>
  );
}

export default function SeniorSettingsScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const { t } = useI18n();
  const preset = useAccessibilityStore((s) => s.fontSize);
  const highContrast = useAccessibilityStore((s) => s.highContrast);
  const ttsEnabled = useAccessibilityStore((s) => s.ttsEnabled);
  const speechRate = useAccessibilityStore((s) => s.speechRate);
  const primaryLanguage = useAccessibilityStore((s) => s.primaryLanguage);

  const increaseFontSize = useAccessibilityStore((s) => s.increaseFontSize);
  const decreaseFontSize = useAccessibilityStore((s) => s.decreaseFontSize);
  const setHighContrast = useAccessibilityStore((s) => s.setHighContrast);
  const setTtsEnabled = useAccessibilityStore((s) => s.setTtsEnabled);
  const setSpeechRate = useAccessibilityStore((s) => s.setSpeechRate);
  const setPrimaryLanguage = useAccessibilityStore((s) => s.setPrimaryLanguage);
  const reset = useAccessibilityStore((s) => s.reset);

  const [medicationReminders, setMedicationReminders] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const decreaseRate = useCallback(() => {
    setSpeechRate(Math.round((speechRate - SPEECH_RATE_STEP) * 10) / 10);
  }, [speechRate, setSpeechRate]);

  const increaseRate = useCallback(() => {
    setSpeechRate(Math.round((speechRate + SPEECH_RATE_STEP) * 10) / 10);
  }, [speechRate, setSpeechRate]);

  const speedLabel =
    speechRate <= 0.7 ? t('settings.slow') : speechRate >= 1.3 ? t('settings.fast') : t('settings.normal');

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="title" align="center">
          {t('tabs.settings')}
        </Text>
      </View>

      <GlassCard padding="md">
        <SectionHeader title={t('settings.accessibility')} />
        <View style={styles.sectionContent}>
          <SettingRow
            label={t('settings.textSize')}
            description={presetLabel(preset)}
            control={
              <View style={styles.fontSizeControl}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Decrease text size"
                  disabled={preset === 'normal'}
                  hitSlop={hitSlop}
                  onPress={decreaseFontSize}
                  style={({ pressed }) => [
                    styles.fontButton,
                    { opacity: preset === 'normal' ? 0.35 : pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text variant="label" align="center" color={colors.primary}>
                    A−
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Increase text size"
                  disabled={preset === 'extraLarge'}
                  hitSlop={hitSlop}
                  onPress={increaseFontSize}
                  style={({ pressed }) => [
                    styles.fontButton,
                    { opacity: preset === 'extraLarge' ? 0.35 : pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text variant="label" align="center" color={colors.primary}>
                    A+
                  </Text>
                </Pressable>
              </View>
            }
          />
          <View style={styles.divider} />
          <Text variant="body">{t('settings.language')}</Text>
          <View style={styles.languageRow}>
            <LanguageOption
              code="en-US"
              label="English"
              selected={primaryLanguage === 'en-US'}
              onSelect={setPrimaryLanguage}
            />
            <LanguageOption
              code="zh-CN"
              label="中文"
              selected={primaryLanguage === 'zh-CN'}
              onSelect={setPrimaryLanguage}
            />
          </View>
          <View style={styles.divider} />
          <SettingRow
            label={t('settings.voiceSpeed')}
            description={`${speechRate.toFixed(1)}x — ${speedLabel}`}
            control={
              <Stepper
                value={speechRate}
                onDecrease={decreaseRate}
                onIncrease={increaseRate}
                min={0.5}
                max={1.5}
                label={`${speechRate.toFixed(1)}x`}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            label={t('settings.highContrast')}
            description={t('settings.highContrastDesc')}
            control={
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                accessibilityLabel={t('settings.highContrast')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={highContrast ? colors.textInverse : colors.textSecondary}
              />
            }
          />
        </View>
      </GlassCard>

      <GlassCard padding="md">
        <SectionHeader title={t('settings.reminders')} />
        <View style={styles.sectionContent}>
          <SettingRow
            label={t('settings.medicationReminders')}
            control={
              <Switch
                value={medicationReminders}
                onValueChange={setMedicationReminders}
                accessibilityLabel={t('settings.medicationReminders')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={medicationReminders ? colors.textInverse : colors.textSecondary}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            label={t('settings.dailyReminders')}
            control={
              <Switch
                value={dailyReminders}
                onValueChange={setDailyReminders}
                accessibilityLabel={t('settings.dailyReminders')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={dailyReminders ? colors.textInverse : colors.textSecondary}
              />
            }
          />
        </View>
      </GlassCard>

      <GlassCard padding="md">
        <SectionHeader title={t('settings.familyPrivacy')} />
        <View style={styles.sectionContent}>
          <NavRow
            label={t('settings.manageFamily')}
            icon="users-gear"
            onPress={() => router.push('/family/contacts')}
          />
          <View style={styles.divider} />
          <SettingRow
            label={t('settings.locationSharing')}
            description={t('fam.sharedWithFamily')}
            control={
              <Switch
                value={locationSharing}
                onValueChange={setLocationSharing}
                accessibilityLabel={t('settings.locationSharing')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={locationSharing ? colors.textInverse : colors.textSecondary}
              />
            }
          />
          <View style={styles.divider} />
          <NavRow
            label={t('settings.emergencyContact')}
            icon="phone-volume"
            onPress={() => router.push('/family/contacts')}
          />
        </View>
      </GlassCard>

      <GlassCard padding="md">
        <SectionHeader title={t('settings.app')} />
        <View style={styles.sectionContent}>
          <NavRow label={t('settings.profile')} icon="user" onPress={() => {}} />
          <View style={styles.divider} />
          <NavRow label={t('settings.help')} icon="circle-question" onPress={() => {}} />
          <View style={styles.divider} />
          <NavRow label={t('settings.aboutMyFam')} icon="circle-info" onPress={() => {}} />
        </View>
      </GlassCard>

      <View style={styles.footer}>
        <BigButton
          label={t('settings.reset')}
          variant="ghost"
          icon={<FontAwesome6 name="rotate-left" size={fontSize * 0.8} color={colors.primary} />}
          onPress={reset}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    gap: spacing.xs,
  },
  sectionContent: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  navRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fontSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  fontButton: {
    minWidth: 44,
    minHeight: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  languageButton: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 2,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: radii.round,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  footer: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
});
