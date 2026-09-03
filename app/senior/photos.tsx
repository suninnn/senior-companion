import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { useAccessibilityStore } from '@/accessibility';
import { PhotoCard } from '@/components/PhotoCard';
import { Screen, Text, BackHeader } from '@/design';
import { colors, fontSizes, scaledFontSize, spacing } from '@/design/tokens';
import { useI18n } from '@/i18n';
import type { FamilyPhoto, PhotoComment } from '@/models';
import { getDataRepository } from '@/services';

const repo = getDataRepository();

export default function FamilyPhotosScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.sm)
  );
  const { t } = useI18n();
  const [photos, setPhotos] = useState<FamilyPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - spacing.md * 2;

  const loadPhotos = useCallback(async () => {
    try {
      const data = await repo.getPhotos();
      setPhotos(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleAddComment = useCallback(
    (photoId: string, comment: PhotoComment) => {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? { ...p, comments: [...(p.comments ?? []), comment] }
            : p
        )
      );
    },
    []
  );

  if (loading) {
    return (
      <Screen>
        <BackHeader title={t('photos.title')} />
        <Text variant="body" align="center" color={colors.textSecondary}>
          Loading photos...
        </Text>
      </Screen>
    );
  }

  if (photos.length === 0) {
    return (
      <Screen>
        <BackHeader title={t('photos.title')} />
        <Text variant="body" align="center" color={colors.textSecondary}>
          No photos yet. Ask your family to share some!
        </Text>
      </Screen>
    );
  }

  return (
    <Screen gradient={false}>
      <BackHeader title={t('photos.title')} />
      <View style={styles.header}>
        <Text variant="title" align="center">
          Family Photos
        </Text>
        <Text
          variant="caption"
          align="center"
          color={colors.textSecondary}
          style={{ fontSize }}
        >
          Swipe to browse · Leave a voice or text comment
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={photos}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + spacing.sm}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <PhotoCard
              uri={item.uri}
              senderName={item.senderName}
              caption={item.caption}
              createdAt={item.createdAt}
              comments={item.comments}
              onAddComment={(comment) => handleAddComment(item.id, comment)}
            />
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  listContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});
