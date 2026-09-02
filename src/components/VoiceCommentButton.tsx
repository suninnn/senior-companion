import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Text } from '@/design';
import { colors, fontSizes, hitSlop, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';

interface VoiceCommentButtonProps {
  onFinish?: (text: string) => void;
}

const MOCK_COMMENTS = [
  'That looks wonderful!',
  'Love this photo so much.',
  'Miss you all!',
  'Beautiful day for a walk.',
  'Can\'t wait to see you next week!',
];

export function VoiceCommentButton({ onFinish }: VoiceCommentButtonProps) {
  const fontSize = useAccessibilityStore((s) => scaledFontSize(s.fontSize, fontSizes.sm));
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(() => {
    setResult(null);
    setSeconds(0);
    setRecording(true);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
    const mockText = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
    setResult(mockText);
    onFinish?.(mockText);
  }, [onFinish]);

  if (result) {
    return (
      <View style={styles.resultRow}>
        <FontAwesome6 name="microphone" size={fontSize * 0.8} color={colors.success} />
        <Text variant="caption" style={{ flex: 1, color: colors.textSecondary }}>
          {result}
        </Text>
        <Pressable onPress={startRecording} hitSlop={hitSlop} accessibilityRole="button" accessibilityLabel="Record again">
          <FontAwesome6 name="rotate-right" size={fontSize * 0.8} color={colors.primary} />
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={recording ? 'Stop recording' : 'Record voice comment'}
      hitSlop={hitSlop}
      onPress={recording ? stopRecording : startRecording}
      style={({ pressed }) => [
        styles.button,
        recording && styles.recording,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <FontAwesome6
        name={recording ? 'stop' : 'microphone'}
        size={fontSize}
        color={recording ? colors.textInverse : colors.primary}
      />
      <Text variant="caption" style={{ color: recording ? colors.textInverse : colors.primary }}>
        {recording ? `Recording ${seconds}s...` : 'Voice Comment'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.round,
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: 'flex-start',
  },
  recording: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
