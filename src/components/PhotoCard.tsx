import { useState } from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { GlassCard, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import { VoiceCommentButton } from './VoiceCommentButton';
import type { PhotoComment } from '@/models';

interface PhotoCardProps {
  uri: string | number;
  senderName: string;
  caption?: string;
  createdAt: string;
  comments?: PhotoComment[];
  onAddComment?: (comment: PhotoComment) => void;
}

export function PhotoCard({
  uri,
  senderName,
  caption,
  createdAt,
  comments = [],
  onAddComment,
}: PhotoCardProps) {
  const fontSize = useAccessibilityStore((s) => scaledFontSize(s.fontSize, fontSizes.sm));
  const [textComment, setTextComment] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const imageHeight = Math.min(screenWidth - spacing.md * 4, 320);
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleVoiceFinish = (text: string) => {
    onAddComment?.({
      id: `c-${Date.now()}`,
      authorName: 'Margaret',
      text,
      kind: 'voice',
      createdAt: new Date().toISOString(),
    });
  };

  const handleTextComment = () => {
    if (!textComment.trim()) return;
    onAddComment?.({
      id: `c-${Date.now()}`,
      authorName: 'Margaret',
      text: textComment.trim(),
      kind: 'text',
      createdAt: new Date().toISOString(),
    });
    setTextComment('');
  };

  return (
    <GlassCard intensity="subtle" padding="sm">
      <Image
        source={typeof uri === 'number' ? uri : { uri }}
        style={[styles.image, { height: imageHeight }]}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.meta}>
        <Text variant="body">{caption || senderName}</Text>
        <Text variant="caption" color={colors.textSecondary}>
          From {senderName} · {date}
        </Text>
      </View>

      {comments.length > 0 && (
        <View style={styles.commentsSection}>
          {comments.map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <FontAwesome6
                name={c.kind === 'voice' ? 'microphone' : 'comment'}
                size={fontSize * 0.75}
                color={colors.primary}
              />
              <Text variant="caption" style={{ flex: 1 }}>
                {c.authorName}: {c.text}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.commentInput}>
        <VoiceCommentButton onFinish={handleVoiceFinish} />
        <View style={styles.textRow}>
          <TextInput
            value={textComment}
            onChangeText={setTextComment}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.textInput, { fontSize }]}
            accessibilityLabel="Add text comment"
            onSubmitEditing={handleTextComment}
            returnKeyType="send"
          />
          {textComment.trim() ? (
            <FontAwesome6
              name="paper-plane"
              size={fontSize}
              color={colors.primary}
              onPress={handleTextComment}
            />
          ) : null}
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
  },
  meta: {
    gap: 2,
    paddingHorizontal: spacing.xs,
  },
  commentsSection: {
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  commentInput: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: radii.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFF9F5',
  },
});
