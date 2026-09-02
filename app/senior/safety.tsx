import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { MicButton } from '@/components/MicButton';
import { BigButton, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import type { ScamAssessment } from '@/models';
import { getScamProvider, getSttProvider, getTtsProvider } from '@/services';

const scamProvider = getScamProvider();
const sttProvider = getSttProvider();
const ttsProvider = getTtsProvider();

const RISK_COLORS: Record<ScamAssessment['riskLevel'], string> = {
  high: colors.danger,
  caution: colors.caution,
  likelySafe: colors.success,
};

const RISK_BG: Record<ScamAssessment['riskLevel'], string> = {
  high: colors.dangerLight,
  caution: colors.cautionLight,
  likelySafe: colors.successLight,
};

export default function SafetyScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'analyzing'>('idle');
  const [result, setResult] = useState<ScamAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setStatus('analyzing');
    setResult(null);
    setError(null);

    try {
      const assessment = await scamProvider.assess({ kind: 'text', text: text.trim() });
      setResult(assessment);
      await ttsProvider.speak(`${assessment.headline}. ${assessment.plainExplanation}`, {
        language: 'en-US',
        rate: 0.9,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not analyze');
    } finally {
      setStatus('idle');
    }
  }, []);

  const startVoice = useCallback(async () => {
    if (status !== 'idle') return;

    setStatus('listening');
    setInputText('');
    setResult(null);
    setError(null);

    try {
      await ttsProvider.stop();
      await sttProvider.start('en-US', (res) => {
        setInputText(res.text);
        if (res.isFinal) {
          analyze(res.text);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not listen');
      setStatus('idle');
    }
  }, [status, analyze]);

  const stopVoice = useCallback(async () => {
    if (status !== 'listening') return;
    const final = await sttProvider.stop();
    if (final?.trim()) {
      analyze(final);
    } else {
      setStatus('idle');
    }
  }, [status, analyze]);

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="title" align="center">
          Safety / Scam Help
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          Paste a message or tap the microphone to check it.
        </Text>
      </View>

      <View style={styles.inputSection}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Paste or type a suspicious message..."
          placeholderTextColor={colors.textSecondary}
          multiline
          style={[
            styles.input,
            {
              fontSize,
              minHeight: fontSize * 4,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          editable={status !== 'analyzing'}
          accessibilityLabel="Suspicious message input"
          accessibilityHint="Type or paste a message to check for scams"
        />

        <View style={styles.inputActions}>
          <MicButton
            status={status === 'listening' ? 'listening' : status === 'analyzing' ? 'thinking' : 'idle'}
            label={status === 'listening' ? 'Listening...' : 'Speak Message'}
            onPress={status === 'listening' ? stopVoice : startVoice}
            disabled={status === 'analyzing'}
          />
          <BigButton
            label="Check Message"
            variant="primary"
            icon={<FontAwesome6 name="shield-heart" size={fontSize} color={colors.textInverse} />}
            onPress={() => analyze(inputText)}
            disabled={!inputText.trim() || status !== 'idle'}
          />
        </View>
      </View>

      {status === 'analyzing' && (
        <ActivityIndicator size="large" color={colors.primary} />
      )}

      {result ? (
        <View style={[styles.resultCard, { backgroundColor: RISK_BG[result.riskLevel], borderColor: RISK_COLORS[result.riskLevel] }]}>
          <View style={styles.resultHeader}>
            <FontAwesome6
              name={result.riskLevel === 'likelySafe' ? 'check-circle' : 'triangle-exclamation'}
              size={fontSize * 1.5}
              color={RISK_COLORS[result.riskLevel]}
            />
            <Text variant="heading" color={RISK_COLORS[result.riskLevel]}>
              {result.headline}
            </Text>
          </View>
          <Text variant="body">{result.plainExplanation}</Text>
          <View style={styles.adviceList}>
            {result.advice.map((item, i) => (
              <View key={i} style={styles.adviceItem}>
                <FontAwesome6 name="circle-check" size={fontSize} color={RISK_COLORS[result.riskLevel]} />
                <Text variant="body" style={{ flex: 1 }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
          <Text variant="caption" color={colors.textSecondary}>
            {result.disclaimer}
          </Text>
        </View>
      ) : null}

      {error ? (
        <Text variant="caption" align="center" color={colors.danger}>
          {error}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <BigButton
          label="Go Back"
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
  inputSection: {
    gap: spacing.md,
  },
  input: {
    borderWidth: 2,
    borderRadius: radii.lg,
    padding: spacing.md,
    textAlignVertical: 'top',
    backgroundColor: colors.surface,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: spacing.md,
  },
  resultCard: {
    borderRadius: radii.lg,
    borderWidth: 2,
    padding: spacing.lg,
    gap: spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  adviceList: {
    gap: spacing.sm,
  },
  adviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.md,
  },
});
