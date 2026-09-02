import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useAccessibilityStore } from '@/accessibility';
import { BigButton, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import type { FamilyPhoto } from '@/models';
import { getDataRepository } from '@/services';

const repo = getDataRepository();

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function PhotoThumb({ photo }: { photo: FamilyPhoto }) {
  return (
    <View style={styles.thumb}>
      <Image source={typeof photo.uri === 'number' ? photo.uri : { uri: photo.uri }} style={styles.thumbImage} contentFit="cover" />
      <Text variant="caption" align="center" color={colors.textSecondary} numberOfLines={1}>
        {photo.caption || photo.senderName}
      </Text>
    </View>
  );
}

export default function FamilyPhotoUploaderScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const [uri, setUri] = useState<string>('');
  const [senderName, setSenderName] = useState('');
  const [caption, setCaption] = useState('');
  const [photos, setPhotos] = useState<FamilyPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert(
        'Photo Access Needed',
        'Please allow photo library access so you can share photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setUri(result.assets[0].uri);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!uri.trim()) {
      Alert.alert('Pick a Photo', 'Please choose a photo first.');
      return;
    }
    if (!senderName.trim()) {
      Alert.alert('Sender Name', 'Please enter your name so your loved one knows who sent this.');
      return;
    }

    setSaving(true);
    try {
      const photo: FamilyPhoto = {
        id: generateId(),
        uri: uri.trim(),
        senderName: senderName.trim(),
        caption: caption.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      await repo.addPhoto(photo);
      setPhotos((prev) => [photo, ...prev]);
      setUri('');
      setCaption('');
      Alert.alert('Sent!', 'Your photo has been shared.');
    } catch (err) {
      Alert.alert('Could Not Save', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  }, [uri, senderName, caption]);

  const inputStyle = [
    styles.input,
    {
      fontSize,
      borderColor: colors.border,
      color: colors.text,
    },
  ];

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="title" align="center">
          Send Photos
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          Choose a photo and add a message for your loved one.
        </Text>
      </View>

      <View style={styles.stage}>
        {uri ? (
          <Image source={{ uri }} style={styles.preview} contentFit="cover" transition={300} />
        ) : (
          <View style={[styles.preview, styles.previewPlaceholder]}>
            <FontAwesome6 name="image" size={fontSize * 2} color={colors.textSecondary} />
            <Text variant="body" color={colors.textSecondary}>
              No photo selected
            </Text>
          </View>
        )}

        <BigButton
          label={uri ? 'Change Photo' : 'Pick a Photo'}
          variant="secondary"
          icon={<FontAwesome6 name="images" size={fontSize} color={colors.text} />}
          onPress={pickImage}
          disabled={saving}
        />
      </View>

      <View style={styles.form}>
        <TextInput
          value={senderName}
          onChangeText={setSenderName}
          placeholder="Your name"
          placeholderTextColor={colors.textSecondary}
          style={inputStyle}
          accessibilityLabel="Your name"
        />
        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Caption or short message"
          placeholderTextColor={colors.textSecondary}
          style={inputStyle}
          accessibilityLabel="Caption"
        />
      </View>

      <BigButton
        label={saving ? 'Sending...' : 'Send Photo'}
        icon={<FontAwesome6 name="paper-plane" size={fontSize} color={colors.textInverse} />}
        onPress={handleSave}
        disabled={!uri.trim() || !senderName.trim() || saving}
      />

      <View style={styles.recentHeader}>
        <Text variant="heading">Recently Shared</Text>
        {loading ? (
          <Text variant="body" color={colors.textSecondary}>
            Loading...
          </Text>
        ) : null}
        {!loading && photos.length === 0 ? (
          <Text variant="body" color={colors.textSecondary}>
            No photos shared yet.
          </Text>
        ) : null}
      </View>

      <View style={styles.thumbs}>
        {photos.slice(0, 6).map((photo) => (
          <PhotoThumb key={photo.id} photo={photo} />
        ))}
      </View>

      <View style={styles.footer}>
        <BigButton
          label="Back"
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
  stage: {
    gap: spacing.md,
  },
  preview: {
    width: '100%',
    height: 240,
    borderRadius: radii.lg,
    alignSelf: 'center',
  },
  previewPlaceholder: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    borderWidth: 2,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  recentHeader: {
    gap: spacing.xs,
  },
  thumbs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  thumb: {
    width: '30%',
    flexGrow: 1,
    gap: spacing.xs,
  },
  thumbImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radii.md,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.md,
  },
});
