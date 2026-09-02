import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { NudgeButton } from '@/components/NudgeButton';
import { VoiceCommentButton } from '@/components/VoiceCommentButton';
import { Screen, Text } from '@/design';
import { colors, fontSizes, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import { useAppStore } from '@/store/appStore';
import type { ChatMessage } from '@/models';

export default function ChatScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.sm)
  );
  const threads = useAppStore((s) => s.threads);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const sendNudge = useAppStore((s) => s.sendNudge);
  const seniorName = useAppStore((s) => s.seniorName);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const thread = threads.find((t) => t.id === threadId);

  const handleSend = useCallback(() => {
    if (!text.trim() || !threadId) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'self',
      senderName: seniorName,
      kind: 'text',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    sendMessage(threadId, msg);
    setText('');
  }, [text, threadId, seniorName, sendMessage]);

  const handleVoiceFinish = useCallback(
    (voiceText: string) => {
      if (!threadId) return;
      const msg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: 'self',
        senderName: seniorName,
        kind: 'voice',
        text: voiceText,
        durationSec: 5,
        createdAt: new Date().toISOString(),
      };
      sendMessage(threadId, msg);
    },
    [threadId, seniorName, sendMessage]
  );

  const handleNudge = useCallback(() => {
    if (!threadId) return;
    sendNudge(threadId, seniorName);
  }, [threadId, seniorName, sendNudge]);

  if (!thread) {
    return (
      <Screen>
        <Text variant="body" align="center" color={colors.textSecondary}>
          Chat not found.
        </Text>
      </Screen>
    );
  }

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isSelf = item.senderId === 'self';

    if (item.kind === 'nudge') {
      return (
        <View style={styles.nudgeBubble}>
          <Text variant="caption" align="center" color={colors.primary}>
            {item.text}
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.bubble, isSelf && styles.selfBubble]}>
        {!isSelf && (
          <Text variant="caption" color={colors.textSecondary}>
            {item.senderName}
          </Text>
        )}
        {item.kind === 'voice' && (
          <View style={styles.voiceRow}>
            <FontAwesome6 name="microphone" size={fontSize * 0.8} color={colors.primary} />
            <Text variant="caption" color={colors.primary}>
              Voice message ({item.durationSec ?? 0}s)
            </Text>
          </View>
        )}
        <Text variant="body">{item.text}</Text>
      </View>
    );
  };

  return (
    <Screen gradient={false}>
      <FlatList
        ref={listRef}
        data={thread.messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: false })
        }
      />

      <View style={styles.inputBar}>
        <VoiceCommentButton onFinish={handleVoiceFinish} />
        <NudgeButton onNudge={handleNudge} />
        <View style={styles.textRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.textInput, { fontSize }]}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          {text.trim() ? (
            <Pressable onPress={handleSend} hitSlop={12}>
              <FontAwesome6
                name="paper-plane"
                size={fontSize}
                color={colors.primary}
              />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  bubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignSelf: 'flex-start',
    gap: 2,
  },
  selfBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(244,125,85,0.15)',
  },
  nudgeBubble: {
    alignSelf: 'center',
    padding: spacing.sm,
    borderRadius: 999,
    backgroundColor: 'rgba(110,166,141,0.15)',
    paddingHorizontal: spacing.md,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  textRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
