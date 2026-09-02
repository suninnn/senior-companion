import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { FamilyAvatar } from '@/components/FamilyAvatar';
import { Screen, Text } from '@/design';
import { colors, fontSizes, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/appStore';

export default function ChatsListScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.sm)
  );
  const { t } = useI18n();
  const threads = useAppStore((s) => s.threads);
  const familyMembers = useAppStore((s) => s.familyMembers);

  const getMember = (threadId: string) => {
    const thread = threads.find((t) => t.id === threadId);
    if (!thread || thread.isGroup) return undefined;
    const otherId = thread.participantIds.find((id) => id !== 'self');
    return familyMembers.find((m) => m.id === otherId);
  };

  const sortedThreads = [...threads].sort((a, b) => {
    const aLast = a.messages[a.messages.length - 1]?.createdAt ?? '';
    const bLast = b.messages[b.messages.length - 1]?.createdAt ?? '';
    return bLast.localeCompare(aLast);
  });

  const groupThread = sortedThreads.find((t) => t.isGroup);
  const directThreads = sortedThreads.filter((t) => !t.isGroup);

  return (
    <Screen>
      <View style={styles.list}>
        {groupThread ? (
          <Pressable
            onPress={() =>
              router.push({ pathname: '/senior/chat', params: { threadId: groupThread.id } })
            }
            style={({ pressed }) => [styles.threadRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.groupAvatar}>
              <FontAwesome6 name="users" size={fontSize * 1.2} color={colors.textInverse} />
            </View>
            <View style={styles.threadInfo}>
              <Text variant="label">{groupThread.name}</Text>
              <Text variant="caption" color={colors.textSecondary} numberOfLines={1}>
                {groupThread.messages[groupThread.messages.length - 1]?.text ?? ''}
              </Text>
            </View>
          </Pressable>
        ) : null}

        {directThreads.map((thread) => {
          const member = getMember(thread.id);
          const lastMsg = thread.messages[thread.messages.length - 1];
          return (
            <Pressable
              key={thread.id}
              onPress={() =>
                router.push({ pathname: '/senior/chat', params: { threadId: thread.id } })
              }
              style={({ pressed }) => [styles.threadRow, { opacity: pressed ? 0.7 : 1 }]}
            >
              <FamilyAvatar
                uri={member?.avatarUri ?? thread.avatarUri}
                name={thread.name}
                size={fontSize * 2.5}
                status={member?.status}
                showBadge
              />
              <View style={styles.threadInfo}>
                <Text variant="label">{thread.name}</Text>
                <Text variant="caption" color={colors.textSecondary} numberOfLines={1}>
                  {lastMsg?.text ?? t('chat.noMessages')}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadInfo: {
    flex: 1,
    gap: 2,
  },
});
