import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useAccessibilityStore } from '@/accessibility';
import { BigButton, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import type { AudioItem, NewsCategory } from '@/models';
import { getDataRepository } from '@/services';

const repo = getDataRepository();

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  dailyNews: 'Daily News',
  health: 'Health',
  localNews: 'Local News',
  stories: 'Stories',
  podcasts: 'Podcasts',
  weather: 'Weather',
  finance: 'Finance',
};

const CATEGORY_ICONS: Record<NewsCategory, string> = {
  dailyNews: 'newspaper',
  health: 'heart-pulse',
  localNews: 'location-dot',
  stories: 'book-open',
  podcasts: 'podcast',
  weather: 'cloud-sun',
  finance: 'wallet',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatTime(seconds: number): string {
  return formatDuration(Math.max(0, Math.floor(seconds)));
}

export default function NewsScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const [items, setItems] = useState<AudioItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentItem = items[currentIndex];
  const player = useAudioPlayer(currentItem?.audioSource ?? null);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    repo.getAudioItems()
      .then((data) => {
        setItems(data);
        setCurrentIndex(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentItem) return;
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [currentItem, player, status.playing]);

  const playNext = useCallback(() => {
    setCurrentIndex((i) => {
      const next = i < items.length - 1 ? i + 1 : 0;
      return next;
    });
    setTimeout(() => player.play(), 100);
  }, [items.length, player]);

  const playPrevious = useCallback(() => {
    setCurrentIndex((i) => {
      const prev = i > 0 ? i - 1 : items.length - 1;
      return prev;
    });
    setTimeout(() => player.play(), 100);
  }, [items.length, player]);

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="title" align="center">
          News & Podcasts
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          Listen to news, health tips, and stories.
        </Text>
      </View>

      {loading ? (
        <Text variant="body" align="center" color={colors.textSecondary}>
          Loading audio...
        </Text>
      ) : null}

      {currentItem ? (
        <View style={[styles.playerCard, { backgroundColor: colors.surface }]}>
          <View style={styles.playerHeader}>
            <FontAwesome6
              name={CATEGORY_ICONS[currentItem.category]}
              size={fontSize * 1.2}
              color={colors.primary}
            />
            <Text variant="caption" color={colors.primary}>
              {CATEGORY_LABELS[currentItem.category]}
            </Text>
          </View>

          <Text variant="heading" align="center">
            {currentItem.title}
          </Text>

          {currentItem.summary ? (
            <Text variant="body" align="center" color={colors.textSecondary}>
              {currentItem.summary}
            </Text>
          ) : null}

          <View style={styles.progressRow}>
            <Text variant="caption" color={colors.textSecondary}>
              {formatTime(status.currentTime)}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      100,
                      status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text variant="caption" color={colors.textSecondary}>
              {formatTime(status.duration || currentItem.durationSec)}
            </Text>
          </View>

          <View style={styles.playerControls}>
            <Pressable
              onPress={playPrevious}
              style={({ pressed }) => [styles.controlBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <FontAwesome6 name="backward-step" size={fontSize * 1.1} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={togglePlay}
              style={({ pressed }) => [
                styles.playBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <FontAwesome6
                name={status.playing ? 'pause' : 'play'}
                size={fontSize * 1.2}
                color={colors.textInverse}
              />
            </Pressable>
            <Pressable
              onPress={playNext}
              style={({ pressed }) => [styles.controlBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <FontAwesome6 name="forward-step" size={fontSize * 1.1} color={colors.text} />
            </Pressable>
          </View>
        </View>
      ) : !loading ? (
        <Text variant="body" align="center" color={colors.textSecondary}>
          No audio items yet.
        </Text>
      ) : null}

      <View style={styles.list}>
        <Text variant="label" color={colors.textSecondary}>
          All Episodes
        </Text>
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                setCurrentIndex(index);
                player.replace(item.audioSource);
                setTimeout(() => player.play(), 100);
              }}
              style={({ pressed }) => [
                styles.episodeRow,
                isActive && styles.episodeRowActive,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={[styles.episodeIcon, isActive && { backgroundColor: colors.primary }]}>
                <FontAwesome6
                  name={CATEGORY_ICONS[item.category]}
                  size={fontSize * 0.75}
                  color={isActive ? colors.textInverse : colors.primary}
                />
              </View>
              <View style={styles.episodeInfo}>
                <Text variant="body" style={isActive && { color: colors.primary, fontWeight: '600' }}>
                  {item.title}
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {CATEGORY_LABELS[item.category]}
                </Text>
              </View>
              <Text variant="caption" color={colors.textSecondary}>
                {formatDuration(item.durationSec)}
              </Text>
            </Pressable>
          );
        })}
      </View>

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
  playerCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radii.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  controlBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: spacing.xs,
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
  },
  episodeRowActive: {
    backgroundColor: 'rgba(244,125,85,0.08)',
  },
  episodeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(244,125,85,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeInfo: {
    flex: 1,
    gap: 2,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.md,
  },
});
