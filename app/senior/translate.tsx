import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { MicButton } from '@/components/MicButton';
import { BigButton, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useTranslationSession } from '@/hooks/useTranslationSession';

const LANGUAGE_LABELS: Record<string, string> = {
  'zh-CN': 'Chinese',
  'en-US': 'English',
};

export default function TranslateScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const ttsEnabled = useAccessibilityStore((s) => s.ttsEnabled);
  const speechRate = useAccessibilityStore((s) => s.speechRate);

  const {
    sourceLanguage,
    targetLanguage,
    status,
    currentText,
    history,
    error,
    startListening,
    stopListening,
    stopSpeaking,
    swapLanguages,
    clearHistory,
    isActive,
  } = useTranslationSession({ ttsEnabled, speechRate });

  const micStatus = status === 'translating' ? 'thinking' : status;

  const handleMicPress = (language: 'zh-CN' | 'en-US') => {
    if (status === 'idle') {
      startListening(language);
    } else if (status === 'listening') {
      stopListening();
    } else if (status === 'speaking') {
      stopSpeaking();
    }
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="title" align="center">
          Translation
        </Text>
        <View style={styles.languageRow}>
          <View style={[styles.languagePill, { backgroundColor: colors.primaryLight }]}>
            <Text variant="label" color={colors.primary} align="center">
              {LANGUAGE_LABELS[sourceLanguage]}
            </Text>
          </View>
          <BigButton
            label="Swap"
            variant="ghost"
            icon={<FontAwesome6 name="arrow-right-arrow-left" size={fontSize} color={colors.primary} />}
            onPress={swapLanguages}
            fullWidth={false}
            style={styles.swapButton}
          />
          <View style={[styles.languagePill, { backgroundColor: colors.successLight }]}>
            <Text variant="label" color={colors.success} align="center">
              {LANGUAGE_LABELS[targetLanguage]}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <MicButton
          status={micStatus === 'listening' && sourceLanguage === 'zh-CN' ? 'listening' : micStatus}
          label="Speak Chinese"
          onPress={() => handleMicPress('zh-CN')}
          disabled={Boolean(isActive && sourceLanguage !== 'zh-CN')}
        />
        <MicButton
          status={micStatus === 'listening' && sourceLanguage === 'en-US' ? 'listening' : micStatus}
          label="Speak English"
          onPress={() => handleMicPress('en-US')}
          disabled={Boolean(isActive && sourceLanguage !== 'en-US')}
        />
      </View>

      {currentText ? (
        <View style={styles.liveBox}>
          <Text variant="caption" align="center" color={colors.textSecondary}>
            {status === 'listening' ? 'Listening...' : 'Translating...'}
          </Text>
          <Text variant="heading" align="center">
            {currentText}
          </Text>
        </View>
      ) : null}

      {history.length > 0 ? (
        <View style={styles.history}>
          <View style={styles.historyHeader}>
            <Text variant="label" color={colors.textSecondary}>
              Conversation
            </Text>
            <BigButton
              label="Clear"
              variant="ghost"
              onPress={clearHistory}
              fullWidth={false}
            />
          </View>
          {history.map((turn, index) => (
            <View
              key={`${turn.originalText}-${index}`}
              style={[
                styles.turn,
                {
                  backgroundColor:
                    turn.sourceLanguage === 'zh-CN' ? colors.primaryLight : colors.successLight,
                },
              ]}
            >
              <Text variant="caption" color={colors.textSecondary}>
                {LANGUAGE_LABELS[turn.sourceLanguage]} → {LANGUAGE_LABELS[turn.targetLanguage]}
              </Text>
              <Text variant="body">{turn.originalText}</Text>
              <Text variant="heading" color={turn.sourceLanguage === 'zh-CN' ? colors.primary : colors.success}>
                {turn.translatedText}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {error ? (
        <Text variant="caption" align="center" color={colors.danger}>
          {error}
        </Text>
      ) : null}

      <View style={styles.footer}>
        {isActive && status !== 'idle' ? (
          <BigButton
            label={status === 'speaking' ? 'Stop Speaking' : 'Stop'}
            variant="secondary"
            icon={
              <FontAwesome6
                name={status === 'speaking' ? 'volume-xmark' : 'stop'}
                size={fontSize}
                color={colors.text}
              />
            }
            onPress={status === 'speaking' ? stopSpeaking : stopListening}
          />
        ) : null}
        <BigButton label="Go Back" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.md,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  languagePill: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.round,
  },
  swapButton: {
    paddingHorizontal: spacing.sm,
    minHeight: 44,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.md,
  },
  liveBox: {
    minHeight: 80,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  history: {
    gap: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  turn: {
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  footer: {
    gap: spacing.md,
    marginTop: 'auto',
  },
});
