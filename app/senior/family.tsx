import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { FamilyMemberCard } from '@/components/FamilyMemberCard';
import { Screen, Text, BigButton, BackHeader } from '@/design';
import { colors, fontSizes, scaledFontSize, spacing } from '@/design/tokens';
import { useAccessibilityStore } from '@/accessibility';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/appStore';

export default function FamilyContactsScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const { t } = useI18n();
  const familyMembers = useAppStore((s) => s.familyMembers);

  return (
    <Screen>
      <BackHeader title={t('callFamily.title')} />
      <View style={styles.header}>
        <Text variant="title" align="center">
          {t('callFamily.title')}
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          {t('callFamily.subtitle')}
        </Text>
      </View>

      {familyMembers.length === 0 ? (
        <Text variant="body" align="center" color={colors.textSecondary}>
          {t('callFamily.loading')}
        </Text>
      ) : null}

      <View style={styles.list}>
        {familyMembers.map((member) => (
          <FamilyMemberCard
            key={member.id}
            name={member.name}
            relationship={member.relationship}
            phone={member.phone}
            avatarUri={member.avatarUri ?? member.photoUri}
            status={member.status}
          />
        ))}
      </View>

      <View style={styles.chatEntry}>
        <BigButton
          label={t('callFamily.openMessages')}
          variant="glass"
          icon={
            <FontAwesome6
              name="comments"
              size={fontSize}
              color={colors.primary}
            />
          }
          onPress={() => router.push('/senior/chats')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  chatEntry: {
    marginTop: 'auto',
    paddingTop: spacing.md,
  },
});
