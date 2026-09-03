import { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { BigButton, BackHeader, GlassCard, Screen, Text } from '@/design';
import { colors, fontSizes, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import { LocationCard } from '@/components/LocationCard';
import { canUseGps, MOCK_LOCATION } from '@/platform/capabilities';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';

let LocationModule: typeof import('expo-location') | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- dynamic import of optional native module
  LocationModule = require('expo-location');
} catch {
  // expo-location not available
}

export default function LocationScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const { t } = useI18n();
  const location = useAppStore((s) => s.location);
  const updateLocation = useAppStore((s) => s.updateLocation);
  const [loading, setLoading] = useState(false);

  /* eslint-disable react-hooks/purity -- Date.now() for display-only time-ago label */
  const timeAgo = useMemo(
    () => Math.round((Date.now() - new Date(location.updatedAt).getTime()) / 60000),
    [location.updatedAt]
  );
  /* eslint-enable react-hooks/purity */

  const handleRefresh = useCallback(async () => {
    if (!canUseGps || !LocationModule) {
      updateLocation({
        latitude: MOCK_LOCATION.latitude,
        longitude: MOCK_LOCATION.longitude,
        address: MOCK_LOCATION.address,
        isMock: true,
      });
      return;
    }

    setLoading(true);
    try {
      const { status } = await LocationModule.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('location.denied'));
        updateLocation({
          ...MOCK_LOCATION,
          isMock: true,
        });
        return;
      }

      const pos = await LocationModule.getCurrentPositionAsync({});
      const geo = await LocationModule.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      const address = geo[0]
        ? [geo[0].streetNumber, geo[0].street, geo[0].city, geo[0].region]
            .filter(Boolean)
            .join(', ')
        : `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;

      updateLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        address,
        isMock: false,
      });
    } catch {
      Alert.alert(t('location.error'));
    } finally {
      setLoading(false);
    }
  }, [updateLocation, t]);

  const handleShare = useCallback(() => {
    Alert.alert(
      t('location.shared'),
      t('location.sharedMsg')
    );
  }, [t]);

  return (
    <Screen>
      <BackHeader title={t('location.title')} />
      <GlassCard padding="lg">
        <View style={styles.center}>
          <FontAwesome6 name="location-dot" size={fontSize * 1.5} color={colors.primary} />
          <Text variant="heading" align="center">
            {t('location.title')}
          </Text>
          <Text variant="body" align="center" color={colors.textSecondary}>
            {t('location.subtitle')}
          </Text>
        </View>
      </GlassCard>

      <LocationCard
        address={t('location.demoAddress')}
        updatedAt={`${timeAgo} ${t('location.updatedAgo')}`}
        showShare
      />

      <View style={styles.actions}>
        <BigButton
          label={loading ? t('location.refreshing') : t('location.refresh')}
          variant="glass"
          icon={
            <FontAwesome6
              name="arrows-rotate"
              size={fontSize}
              color={colors.primary}
            />
          }
          onPress={handleRefresh}
          disabled={loading}
        />
        <BigButton
          label={t('location.share')}
          variant="primary"
          icon={
            <FontAwesome6
              name="share-nodes"
              size={fontSize}
              color={colors.textInverse}
            />
          }
          onPress={handleShare}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    gap: spacing.md,
  },
  actions: {
    gap: spacing.md,
  },
});
