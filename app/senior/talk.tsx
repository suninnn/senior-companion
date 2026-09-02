import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useAccessibilityStore } from '@/accessibility';
import { MicButton } from '@/components/MicButton';
import { BigButton, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useVoiceSession } from '@/hooks/useVoiceSession';
import {
  AI_CONVERSATION_TOPICS,
  type AiConversationTopic,
} from '@/data/aiConversations';

type DemoPhase = 'question' | 'thinking' | 'answer' | 'done';

function DemoConversationPlayer({
  topic,
  onDone,
}: {
  topic: AiConversationTopic;
  onDone: () => void;
}) {
  const language = useAccessibilityStore((s) => s.primaryLanguage);
  const isZh = language.startsWith('zh');
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.sm)
  );

  const [phase, setPhase] = useState<DemoPhase>('question');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const qSource = isZh ? topic.questionAudioZh : topic.questionAudioEn;
  const aSource = isZh ? topic.answerAudioZh : topic.answerAudioEn;

  const qPlayer = useAudioPlayer(qSource);
  const aPlayer = useAudioPlayer(qSource);
  const qStatus = useAudioPlayerStatus(qPlayer);
  const aStatus = useAudioPlayerStatus(aPlayer);

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  useEffect(() => {
    if (phase === 'question' && qStatus.isLoaded && !qStatus.playing && qStatus.currentTime > 0) {
      const t = setTimeout(() => {
        setTranscript(isZh ? topic.questionZh : topic.questionEn);
        setPhase('thinking');
      }, 200);
      timerRef.current.push(t);
    }
    if (phase === 'answer' && aStatus.isLoaded && !aStatus.playing && aStatus.currentTime > 0) {
      const t = setTimeout(() => {
        setResponse(isZh ? topic.answerZh : topic.answerEn);
        setPhase('done');
      }, 200);
      timerRef.current.push(t);
    }
  }, [phase, qStatus.isLoaded, qStatus.playing, qStatus.currentTime, aStatus.isLoaded, aStatus.playing, aStatus.currentTime, isZh, topic]);

  useEffect(() => {
    if (phase === 'thinking') {
      const t = setTimeout(() => {
        setResponse(isZh ? topic.answerZh : topic.answerEn);
        aPlayer.replace(aSource);
        const t2 = setTimeout(() => aPlayer.play(), 200);
        timerRef.current.push(t2);
        setPhase('answer');
      }, 1500);
      timerRef.current.push(t);
    }
  }, [phase, aPlayer, aSource, isZh, topic]);

  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(onDone, 2500);
      timerRef.current.push(t);
    }
  }, [phase, onDone]);

  useEffect(() => {
    qPlayer.pause();
    aPlayer.pause();
    clearTimers();

    setTranscript('');
    setResponse('');
    setPhase('question');

    qPlayer.replace(qSource);
    aPlayer.replace(aSource);

    const t = setTimeout(() => qPlayer.play(), 300);
    timerRef.current.push(t);

    return clearTimers;
  }, [topic.id, language]);

  useEffect(() => {
    return () => {
      try { qPlayer.pause(); } catch {}
      try { aPlayer.pause(); } catch {}
    };
  }, []);

  const stop = useCallback(() => {
    clearTimers();
    try { qPlayer.pause(); } catch {}
    try { aPlayer.pause(); } catch {}
    setPhase('done');
  }, [qPlayer, aPlayer, clearTimers]);

  const questionText = isZh ? topic.questionZh : topic.questionEn;
  const answerText = isZh ? topic.answerZh : topic.answerEn;

  return (
    <View style={demoStyles.container}>
      <View style={demoStyles.header}>
        <FontAwesome6 name={topic.icon} size={fontSize * 1.2} color={colors.primary} />
        <Text variant="label" color={colors.primary}>
          {isZh ? topic.labelZh : topic.labelEn}
        </Text>
      </View>

      <View style={demoStyles.stage}>
        {phase === 'thinking' && (
          <ActivityIndicator size="large" color={colors.primary} />
        )}
      </View>

      <View style={demoStyles.transcriptBox}>
        {transcript || phase === 'question' ? (
          <>
            <Text variant="caption" color={colors.textSecondary} align="center">
              {isZh ? '你说：' : 'You said:'}
            </Text>
            <Text
              variant="body"
              align="center"
              style={{ opacity: transcript ? 1 : 0.5 }}
            >
              {transcript || questionText}
            </Text>
          </>
        ) : null}
      </View>

      {response || phase === 'answer' ? (
        <View style={[demoStyles.responseBox, { backgroundColor: colors.primaryLight }]}>
          <FontAwesome6 name="robot" size={fontSize} color={colors.primary} />
          <Text
            variant="body"
            align="center"
            style={{ opacity: response ? 1 : 0.5 }}
          >
            {response || answerText}
          </Text>
        </View>
      ) : null}

      {phase !== 'done' ? (
        <BigButton
          label={isZh ? '停止演示' : 'Stop Demo'}
          variant="ghost"
          icon={
            <FontAwesome6 name="stop" size={fontSize} color={colors.textSecondary} />
          }
          onPress={stop}
        />
      ) : null}
    </View>
  );
}

const demoStyles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  stage: {
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  transcriptBox: {
    gap: spacing.xs,
    minHeight: 60,
    justifyContent: 'center',
  },
  responseBox: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
});

export default function TalkToAIScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const primaryLanguage = useAccessibilityStore((s) => s.primaryLanguage);
  const ttsEnabled = useAccessibilityStore((s) => s.ttsEnabled);
  const speechRate = useAccessibilityStore((s) => s.speechRate);
  const isZh = primaryLanguage.startsWith('zh');

  const [selectedTopic, setSelectedTopic] = useState<AiConversationTopic | null>(null);

  const onError = useCallback((message: string) => {
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
    if (selectedTopic) setSelectedTopic(null);
    if (status === 'idle') {
      startListening();
    } else if (status === 'listening') {
      stopListening();
    } else if (status === 'speaking') {
      stopSpeaking();
    }
  };

  const handleDemoDone = useCallback(() => {
    setSelectedTopic(null);
  }, []);

  const handleTopicPress = (topic: AiConversationTopic) => {
    reset();
    setSelectedTopic(topic);
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="title" align="center">
          {isZh ? 'AI 助手' : 'Talk to AI'}
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          {isZh
            ? '点击麦克风说话，或选择话题试听对话'
            : 'Tap the mic to talk, or try a demo topic'}
        </Text>
      </View>

      {selectedTopic ? (
        <DemoConversationPlayer
          key={`${selectedTopic.id}-${primaryLanguage}`}
          topic={selectedTopic}
          onDone={handleDemoDone}
        />
      ) : (
        <>
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
                {isZh ? '你说：' : 'You said:'}
              </Text>
            ) : null}
            {transcript ? (
              <Text variant="heading" align="center">
                {transcript}
              </Text>
            ) : (
              <Text variant="body" align="center" color={colors.textSecondary}>
                {status === 'idle'
                  ? isZh
                    ? '你的话会显示在这里'
                    : 'Your words will appear here.'
                  : ''}
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
        </>
      )}

      <View style={styles.topicsSection}>
        <Text variant="label" color={colors.textSecondary}>
          {isZh ? '试试这些话题' : 'Try these topics'}
        </Text>
        <View style={styles.topicGrid}>
          {AI_CONVERSATION_TOPICS.map((topic) => (
            <Pressable
              key={topic.id}
              onPress={() => handleTopicPress(topic)}
              style={({ pressed }) => [
                styles.topicCard,
                {
                  backgroundColor: pressed ? colors.surfaceDark : colors.surface,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <FontAwesome6
                name={topic.icon}
                size={fontSize * 0.9}
                color={colors.primary}
              />
              <Text variant="label" align="center">
                {isZh ? topic.labelZh : topic.labelEn}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {!selectedTopic && isActive ? (
          <BigButton
            label={status === 'speaking' ? (isZh ? '停止播放' : 'Stop Speaking') : isZh ? '停止' : 'Stop'}
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

        {!selectedTopic && !isActive ? (
          <BigButton
            label={responseText ? (isZh ? '再说一次' : 'Talk Again') : isZh ? '开始说话' : 'Start Talking'}
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
        ) : null}

        <BigButton
          label={isZh ? '返回' : 'Go Back'}
          variant="ghost"
          onPress={() => {
            reset();
            setSelectedTopic(null);
            router.back();
          }}
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
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  transcriptBox: {
    minHeight: 60,
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
  topicsSection: {
    gap: spacing.md,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  topicCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  footer: {
    gap: spacing.md,
    marginTop: 'auto',
  },
});
