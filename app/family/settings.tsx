import { useCallback } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { presetLabel } from '@/accessibility/scale';
import { BigButton, Screen, Text } from '@/design';
import { colors, fontSizes, hitSlop, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useI18n } from '@/i18n';
import type { LanguageCode } from '@/models';

const SPEECH_RATE_STEP = 0.1;

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
        <Text variant="heading">{label}</Text>
        {description ? (
          <Text variant="body" color={colors.textSecondary}>
            {description}
          </Text>
        ) : null}
      </View>
      {control}
    </View>
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
        <FontAwesome6 name="minus" size={fontSize} color={colors.primary} />
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
        <FontAwesome6 name="plus" size={fontSize} color={colors.primary} />
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

export default function FamilySettingsScreen() {
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

  const decreaseRate = useCallback(() => {
    setSpeechRate(Math.round((speechRate - SPEECH_RATE_STEP) * 10) / 10);
  }, [speechRate, setSpeechRate]);

  const increaseRate = useCallback(() => {
    setSpeechRate(Math.round((speechRate + SPEECH_RATE_STEP) * 10) / 10);
  }, [speechRate, setSpeechRate]);

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="title" align="center">
          {t('settings.title')}
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          {t('settings.subtitle')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="heading" color={colors.primary}>
          {t('settings.textSize')}
        </Text>
        <View style={styles.fontSizeRow}>
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
          <View style={styles.fontLabel}>
            <Text variant="label" align="center" color={colors.textSecondary}>
              {presetLabel(preset)}
            </Text>
          </View>
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
      </View>

      <View style={styles.section}>
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
        <SettingRow
          label={t('settings.readAloud')}
          description={t('settings.readAloudDesc')}
          control={
            <Switch
              value={ttsEnabled}
              onValueChange={setTtsEnabled}
              accessibilityLabel={t('settings.readAloud')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={ttsEnabled ? colors.textInverse : colors.textSecondary}
            />
          }
        />
      </View>

      <View style={styles.section}>
        <Text variant="heading" color={colors.primary}>
          {t('settings.speechSpeed')}
        </Text>
        <Stepper
          value={speechRate}
          onDecrease={decreaseRate}
          onIncrease={increaseRate}
          min={0.5}
          max={1.5}
          label={`${speechRate.toFixed(1)}x`}
        />
      </View>

      <View style={styles.section}>
        <Text variant="heading" color={colors.primary}>
          {t('settings.language')}
        </Text>
        <View style={styles.languageRow}>
          <LanguageOption
            code="zh-CN"
            label="中文"
            selected={primaryLanguage === 'zh-CN'}
            onSelect={setPrimaryLanguage}
          />
          <LanguageOption
            code="en-US"
            label="English"
            selected={primaryLanguage === 'en-US'}
            onSelect={setPrimaryLanguage}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <BigButton
          label={t('settings.reset')}
          variant="ghost"
          icon={<FontAwesome6 name="rotate-left" size={fontSize} color={colors.primary} />}
          onPress={reset}
        />
        <BigButton
          label={t('common.back')}
          variant="ghost"
          icon={<FontAwesome6 name="arrow-left" size={fontSize} color={colors.primary} />}
          onPress={() => router.back()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  section: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  fontSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  fontButton: {
    minWidth: 56,
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  fontLabel: {
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: radii.round,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  languageButton: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 2,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.md,
  },
});
