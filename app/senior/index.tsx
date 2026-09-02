import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FontSizeController } from '@/components/FontSizeController';
import { LargeActionButton } from '@/components/LargeActionButton';
import { ModeSwitch } from '@/components/ModeSwitch';
import { Screen, Text } from '@/design';
import { colors, spacing } from '@/design/tokens';
import { useAppStore } from '@/store/appStore';

export default function SeniorHomeScreen() {
  const seniorName = useAppStore((s) => s.seniorName);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="heading" color={colors.primary} align="center">
          {greeting}, {seniorName}
        </Text>
        <ModeSwitch current="senior" />
        <FontSizeController />
      </View>

      <View style={styles.grid}>
        <LargeActionButton
          label="Talk to AI"
          icon="microphone"
          iconColor={colors.primary}
          layout="vertical"
          onPress={() => router.push('/senior/talk')}
        />
        <LargeActionButton
          label="Call Family"
          icon="phone"
          iconColor={colors.primary}
          layout="vertical"
          onPress={() => router.push('/senior/family')}
        />
        <LargeActionButton
          label="Family Photos"
          icon="images"
          iconColor={colors.primary}
          layout="vertical"
          onPress={() => router.push('/senior/photos')}
        />
        <LargeActionButton
          label="Take a Photo"
          icon="camera"
          iconColor={colors.primary}
          layout="vertical"
          onPress={() => router.push('/senior/camera')}
        />
        <LargeActionButton
          label="News & Stories"
          icon="headphones"
          iconColor={colors.primary}
          layout="vertical"
          onPress={() => router.push('/senior/news')}
        />
        <LargeActionButton
          label="Translate"
          icon="language"
          iconColor={colors.primary}
          layout="vertical"
          onPress={() => router.push('/senior/translate')}
        />
        <LargeActionButton
          label="Messages"
          icon="comments"
          iconColor={colors.primary}
          layout="vertical"
          onPress={() => router.push('/senior/chats')}
        />
        <LargeActionButton
          label="My Location"
          icon="location-dot"
          iconColor={colors.success}
          layout="vertical"
          onPress={() => router.push('/senior/location')}
        />
        <LargeActionButton
          label="Safety Help"
          icon="shield-heart"
          iconColor={colors.danger}
          layout="vertical"
          onPress={() => router.push('/senior/safety')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
