import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { MicButton } from '@/components/MicButton';
import { BigButton, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useVoiceSession } from '@/hooks/useVoiceSession';

export default function TalkToAIScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const primaryLanguage = useAccessibilityStore((s) => s.primaryLanguage);
  const ttsEnabled = useAccessibilityStore((s) => s.ttsEnabled);
  const speechRate = useAccessibilityStore((s) => s.speechRate);

  const onError = useCallback((message: string) => {
    // In a real app this could show a toast; kept simple for MVP.
    console.warn('Voice session error:', message);
  }, []);

  const {
    status,
    transcript,
    responseText,
    error,
    startListening,
    stopListening,
    stopSpeaking,
    reset,
    isActive,
  } = useVoiceSession({
    language: primaryLanguage,
    ttsEnabled,
    speechRate,
    onError,
  });

  const handleMicPress = () => {
    if (status === 'idle') {
      startListening();
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
          Talk to AI
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          Tap the microphone and speak naturally.
        </Text>
      </View>

      <View style={styles.stage}>
        <MicButton
          status={status}
          onPress={handleMicPress}
          disabled={status === 'thinking'}
        />

        {status === 'thinking' && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: spacing.lg }}
          />
        )}
      </View>

      <View style={styles.transcriptBox}>
        {transcript ? (
          <Text variant="body" align="center" color={colors.textSecondary}>
            You said:
          </Text>
        ) : null}
        {transcript ? (
          <Text variant="heading" align="center">
            {transcript}
          </Text>
        ) : (
          <Text variant="body" align="center" color={colors.textSecondary}>
            {status === 'idle' ? 'Your words will appear here.' : ''}
          </Text>
        )}
      </View>

      {responseText ? (
        <View style={[styles.responseBox, { backgroundColor: colors.primaryLight }]}>
          <FontAwesome6
            name="robot"
            size={fontSize}
            color={colors.primary}
            style={styles.responseIcon}
          />
          <Text variant="body" align="center">
            {responseText}
          </Text>
        </View>
      ) : null}

      {error ? (
        <Text variant="caption" align="center" color={colors.danger}>
          {error}
        </Text>
      ) : null}

      <View style={styles.footer}>
        {isActive ? (
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
        ) : (
          <BigButton
            label={responseText ? 'Talk Again' : 'Start Talking'}
            variant="primary"
            icon={
              <FontAwesome6
                name="microphone"
                size={fontSize}
                color={colors.textInverse}
              />
            }
            onPress={startListening}
          />
        )}

        <BigButton
          label="Go Back"
          variant="ghost"
          onPress={() => {
            reset();
            router.back();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  header: {
    gap: spacing.sm,
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  transcriptBox: {
    minHeight: 80,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  responseBox: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  responseIcon: {
    alignSelf: 'center',
  },
  footer: {
    gap: spacing.md,
    marginTop: 'auto',
  },
});
