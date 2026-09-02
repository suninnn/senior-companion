import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@/design';
import { colors, fontSizes, scaledFontSize } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import type { FamilyStatus } from './StatusBadge';
import { StatusBadge } from './StatusBadge';

interface FamilyAvatarProps {
  uri?: string;
  name: string;
  size?: number;
  status?: FamilyStatus;
  showBadge?: boolean;
}

export function FamilyAvatar({ uri, name, size: sizeProp, status, showBadge }: FamilyAvatarProps) {
  const fontSize = useAccessibilityStore((s) => scaledFontSize(s.fontSize, fontSizes.md));
  const size = sizeProp ?? fontSize * 2.8;
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={{ width: size, alignItems: 'center' }}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        {uri ? (
          <Image
            source={{ uri }}
            style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <Text
            variant="label"
            align="center"
            style={{ color: colors.textInverse, fontSize: size * 0.38 }}
          >
            {initials}
          </Text>
        )}
      </View>
      {showBadge && status ? (
        <View style={styles.badgeWrap}>
          <StatusBadge status={status} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
  badgeWrap: {
    marginTop: 4,
  },
});
