import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { getTtsProvider } from '@/services';
import { colors, hitSlop } from '@/design/tokens';

interface SpeakerButtonProps {
  text: string;
  size?: number;
}

const ttsProvider = getTtsProvider();

export function SpeakerButton({ text, size = 36 }: SpeakerButtonProps) {
  const speakingRef = useRef(false);

  const handlePress = useCallback(async () => {
    if (speakingRef.current) {
      await ttsProvider.stop();
      speakingRef.current = false;
      return;
    }
    speakingRef.current = true;
    try {
      await ttsProvider.stop();
      await ttsProvider.speak(text, { language: 'en-US', rate: 0.9 });
    } finally {
      speakingRef.current = false;
    }
  }, [text]);

  const iconSize = Math.round(size * 0.45);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Read aloud: ${text}`}
      hitSlop={hitSlop}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <FontAwesome6 name="volume-high" size={iconSize} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,124,85,0.10)',
  },
});
