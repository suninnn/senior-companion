import { useCallback } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { GlassCard, Text } from '@/design';
import { colors, fontSizes, hitSlop, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import { canUseTelLinks } from '@/platform/capabilities';
import { FamilyAvatar } from './FamilyAvatar';
import { SpeakerButton } from './SpeakerButton';
import type { FamilyStatus } from './StatusBadge';

interface FamilyMemberCardProps {
  name: string;
  relationship: string;
  phone: string;
  avatarUri?: string;
  status?: FamilyStatus;
}

export function FamilyMemberCard({
  name,
  relationship,
  phone,
  avatarUri,
  status,
}: FamilyMemberCardProps) {
  const fontSize = useAccessibilityStore((s) => scaledFontSize(s.fontSize, fontSizes.md));
  const iconSize = fontSize * 0.85;

  const handleCall = useCallback(() => {
    Alert.alert(
      `Call ${name}?`,
      phone,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            if (canUseTelLinks) {
              Linking.openURL(`tel:${phone.replace(/[^\d+]/g, '')}`);
            } else {
              Alert.alert('Calling', `Would call ${name} at ${phone}`);
            }
          },
        },
      ]
    );
  }, [name, phone]);

  const handleVideo = useCallback(() => {
    Alert.alert('Video Call', `Would start a video call with ${name}`);
  }, [name]);

  return (
    <GlassCard intensity="regular" padding="md">
      <View style={styles.top}>
        <FamilyAvatar uri={avatarUri} name={name} size={fontSize * 2.8} status={status} showBadge />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text variant="label">{name}</Text>
            <SpeakerButton text={`${name}, ${relationship}`} size={36} />
          </View>
          <Text variant="body" color={colors.textSecondary}>
            {relationship}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Call ${name}`}
          hitSlop={hitSlop}
          onPress={handleCall}
          style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <FontAwesome6 name="phone" size={iconSize} color={colors.primary} />
          <Text variant="caption" style={{ color: colors.primary }}>Call</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Video call ${name}`}
          hitSlop={hitSlop}
          onPress={handleVideo}
          style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <FontAwesome6 name="video" size={iconSize} color={colors.primary} />
          <Text variant="caption" style={{ color: colors.primary }}>Video</Text>
        </Pressable>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.35)',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.round,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
