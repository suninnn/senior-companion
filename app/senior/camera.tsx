import { useCallback, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { BigButton, BackHeader, GlassCard, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import { canUseCamera } from '@/platform/capabilities';

let CameraModule: typeof import('expo-camera') | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- dynamic import of optional native module
  CameraModule = require('expo-camera');
} catch {
  // expo-camera not available on this platform
}

export default function CameraScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<any>(null);

  const requestPermission = useCallback(async () => {
    if (!CameraModule?.Camera) return;
    const { status } = await CameraModule.Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }, []);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        setCapturedUri(photo.uri);
      }
    } catch {
      Alert.alert('Camera Error', 'Could not take a photo.');
    }
  }, []);

  const handleShare = useCallback(() => {
    Alert.alert('Photo Shared!', 'Your selfie has been shared with your family.');
    setCapturedUri(null);
  }, []);

  // Web fallback
  if (!canUseCamera || !CameraModule?.Camera) {
    return (
      <Screen>
        <BackHeader title="Camera" />
        <GlassCard padding="lg">
          <View style={styles.center}>
            <FontAwesome6 name="camera" size={fontSize * 2} color={colors.primary} />
            <Text variant="heading" align="center">
              Take a Selfie
            </Text>
            <Text variant="body" align="center" color={colors.textSecondary}>
              Camera is not available on web. On a phone, you would see a live camera to take a selfie and share it with your family.
            </Text>
            <BigButton
              label="Simulate Selfie"
              variant="glass"
              icon={
                <FontAwesome6 name="camera-retro" size={fontSize} color={colors.primary} />
              }
              onPress={() => {
                setCapturedUri(
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop'
                );
              }}
            />
            {capturedUri ? (
              <View style={styles.previewWrap}>
                <Image
                  source={{ uri: capturedUri }}
                  style={styles.previewImage}
                  contentFit="cover"
                />
                <BigButton label="Share with Family" variant="primary" onPress={handleShare} />
              </View>
            ) : null}
          </View>
        </GlassCard>
      </Screen>
    );
  }

  // Permission not yet requested
  if (hasPermission === null) {
    return (
      <Screen>
        <BackHeader title="Camera" />
        <GlassCard padding="lg">
          <View style={styles.center}>
            <FontAwesome6 name="camera" size={fontSize * 2} color={colors.primary} />
            <Text variant="heading" align="center">
              Camera Access
            </Text>
            <Text variant="body" align="center" color={colors.textSecondary}>
              Allow camera access so you can take selfies to share with family.
            </Text>
            <BigButton label="Allow Camera" variant="primary" onPress={requestPermission} />
          </View>
        </GlassCard>
      </Screen>
    );
  }

  if (hasPermission === false) {
    return (
      <Screen>
        <BackHeader title="Camera" />
        <GlassCard padding="lg">
          <View style={styles.center}>
            <FontAwesome6 name="camera" size={fontSize * 2} color={colors.textSecondary} />
            <Text variant="heading" align="center">
              Camera Not Available
            </Text>
            <Text variant="body" align="center" color={colors.textSecondary}>
              Camera permission was denied. You can enable it in your device settings.
            </Text>
          </View>
        </GlassCard>
      </Screen>
    );
  }

  const CameraView = CameraModule.CameraView ?? CameraModule.Camera;

  if (capturedUri) {
    return (
      <Screen gradient={false}>
        <BackHeader title="Camera" />
        <Image
          source={{ uri: capturedUri }}
          style={styles.fullPreview}
          contentFit="contain"
        />
        <View style={styles.previewActions}>
          <BigButton label="Retake" variant="secondary" onPress={() => setCapturedUri(null)} />
          <BigButton label="Share with Family" variant="primary" onPress={handleShare} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen gradient={false}>
      <CameraView ref={cameraRef} style={styles.camera} facing="front">
        <View style={styles.backOverlay}>
          <BackHeader light />
        </View>
        <View style={styles.shutterRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Take a photo"
            onPress={handleCapture}
            style={({ pressed }) => [
              styles.shutter,
              { transform: [{ scale: pressed ? 0.9 : 1 }] },
            ]}
          >
            <View style={styles.shutterInner} />
          </Pressable>
        </View>
      </CameraView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    gap: spacing.md,
  },
  camera: {
    flex: 1,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  backOverlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  shutterRow: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  shutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  fullPreview: {
    flex: 1,
    borderRadius: radii.xl,
  },
  previewActions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  previewWrap: {
    gap: spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: radii.lg,
  },
});
