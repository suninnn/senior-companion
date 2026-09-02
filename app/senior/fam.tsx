import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { BigButton, GlassCard, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/appStore';

export default function FamTab() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const { t } = useI18n();
  const familyMembers = useAppStore((s) => s.familyMembers);
  const threads = useAppStore((s) => s.threads);
  const location = useAppStore((s) => s.location);

  const topContacts = useMemo(() => familyMembers.slice(0, 2), [familyMembers]);
  const latestThread = useMemo(() => {
    const sorted = [...threads].sort((a, b) => {
      const aTime = a.messages.length ? new Date(a.messages[a.messages.length - 1].createdAt).getTime() : 0;
      const bTime = b.messages.length ? new Date(b.messages[b.messages.length - 1].createdAt).getTime() : 0;
      return bTime - aTime;
    });
    return sorted[0];
  }, [threads]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="heading" color={colors.primary}>
          {t('fam.title')}
        </Text>
        <Text variant="body" color={colors.textSecondary}>
          {t('fam.subtitle')}
        </Text>
      </View>

      {/* Call */}
      <GlassCard padding="md">
        <View style={styles.sectionHeader}>
          <FontAwesome6 name="phone" size={fontSize} color={colors.primary} />
          <Text variant="label">{t('fam.call')}</Text>
        </View>
        {topContacts.map((contact) => (
          <View key={contact.id} style={styles.contactRow}>
            <View style={styles.contactAvatar}>
              <FontAwesome6 name="user" size={fontSize * 0.8} color={colors.textInverse} />
            </View>
            <View style={styles.contactInfo}>
              <Text variant="body" style={styles.contactName}>{contact.name}</Text>
              <Text variant="caption" color={colors.textSecondary}>{contact.relationship}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/senior/family')}
              style={styles.callBtn}
            >
              <FontAwesome6 name="phone" size={fontSize * 0.7} color={colors.primary} />
            </Pressable>
          </View>
        ))}
        <BigButton
          label={t('fam.viewFamilyContacts')}
          variant="ghost"
          onPress={() => router.push('/senior/family')}
        />
      </GlassCard>

      {/* Messages */}
      <GlassCard padding="md">
        <View style={styles.sectionHeader}>
          <FontAwesome6 name="comments" size={fontSize} color={colors.primary} />
          <Text variant="label">{t('fam.messages')}</Text>
        </View>
        {latestThread ? (
          <View style={styles.messagePreview}>
            <Text variant="body" style={styles.contactName}>{latestThread.name}</Text>
            <Text variant="caption" color={colors.textSecondary} numberOfLines={1}>
              {latestThread.messages.length
                ? latestThread.messages[latestThread.messages.length - 1].text
                : ''}
            </Text>
          </View>
        ) : null}
        <BigButton
          label={t('fam.openMessages')}
          variant="glass"
          icon={<FontAwesome6 name="comments" size={fontSize} color={colors.primary} />}
          onPress={() => router.push('/senior/chats')}
        />
      </GlassCard>

      {/* Family Photos */}
      <GlassCard padding="md">
        <View style={styles.sectionHeader}>
          <FontAwesome6 name="images" size={fontSize} color={colors.primary} />
          <Text variant="label">{t('fam.photos')}</Text>
        </View>
        <View style={styles.photoButtons}>
          <BigButton
            label={t('fam.viewPhotos')}
            variant="glass"
            icon={<FontAwesome6 name="images" size={fontSize} color={colors.primary} />}
            onPress={() => router.push('/senior/photos')}
          />
          <BigButton
            label={t('fam.takePhoto')}
            variant="primary"
            icon={<FontAwesome6 name="camera" size={fontSize} color={colors.textInverse} />}
            onPress={() => router.push('/senior/photos')}
          />
        </View>
      </GlassCard>

      {/* Location */}
      <GlassCard padding="md">
        <View style={styles.sectionHeader}>
          <FontAwesome6 name="location-dot" size={fontSize} color={colors.success} />
          <Text variant="label">{t('fam.location')}</Text>
        </View>
        <Text variant="body">{location.address}</Text>
        <Text variant="caption" color={colors.success}>
          {t('fam.sharedWithFamily')}
        </Text>
        <BigButton
          label={t('fam.location')}
          variant="glass"
          icon={<FontAwesome6 name="map" size={fontSize} color={colors.primary} />}
          onPress={() => router.push('/senior/location')}
        />
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontWeight: '600',
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(244,125,85,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagePreview: {
    gap: 2,
    paddingVertical: spacing.sm,
  },
  photoButtons: {
    gap: spacing.sm,
  },
});
