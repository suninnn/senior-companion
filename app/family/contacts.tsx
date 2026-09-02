import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/accessibility';
import { BigButton, Screen, Text } from '@/design';
import { colors, fontSizes, radii, scaledFontSize, spacing } from '@/design/tokens';
import type { Contact } from '@/models';
import { getDataRepository } from '@/services';

const repo = getDataRepository();

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyContact(): Contact {
  return {
    id: generateId(),
    name: '',
    relationship: '',
    phone: '',
    photoUri: '',
    isPrimaryEmergency: false,
  };
}

function ContactRow({
  contact,
  onEdit,
  onDelete,
  onSetPrimary,
}: {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onSetPrimary: (contact: Contact) => void;
}) {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: contact.isPrimaryEmergency ? colors.dangerLight : colors.surface,
          borderColor: contact.isPrimaryEmergency ? colors.danger : colors.border,
        },
      ]}
    >
      <View style={styles.rowInfo}>
        <Text variant="heading">{contact.name}</Text>
        <Text variant="body" color={colors.textSecondary}>
          {contact.relationship}
        </Text>
        <Text variant="label" color={contact.isPrimaryEmergency ? colors.danger : colors.primary}>
          {contact.phone}
          {contact.isPrimaryEmergency ? ' • Emergency' : ''}
        </Text>
      </View>

      <View style={styles.rowActions}>
        {!contact.isPrimaryEmergency ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Set ${contact.name} as primary emergency contact`}
            hitSlop={hitSlop}
            onPress={() => onSetPrimary(contact)}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: pressed ? colors.surfaceDark : colors.primaryLight },
            ]}
          >
            <FontAwesome6 name="star" size={fontSize} color={colors.primary} />
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${contact.name}`}
          hitSlop={hitSlop}
          onPress={() => onEdit(contact)}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: pressed ? colors.surfaceDark : colors.surfaceDark },
          ]}
        >
          <FontAwesome6 name="pen" size={fontSize} color={colors.text} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${contact.name}`}
          hitSlop={hitSlop}
          onPress={() => onDelete(contact)}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: pressed ? '#9B1C1C' : colors.danger },
          ]}
        >
          <FontAwesome6 name="trash" size={fontSize} color={colors.textInverse} />
        </Pressable>
      </View>
    </View>
  );
}

function ContactForm({
  contact,
  onChange,
}: {
  contact: Contact;
  onChange: (contact: Contact) => void;
}) {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );

  const inputStyle = [
    styles.input,
    {
      fontSize,
      borderColor: colors.border,
      color: colors.text,
    },
  ];

  return (
    <View style={styles.form}>
      <TextInput
        value={contact.name}
        onChangeText={(name) => onChange({ ...contact, name })}
        placeholder="Name"
        placeholderTextColor={colors.textSecondary}
        style={inputStyle}
        accessibilityLabel="Contact name"
      />
      <TextInput
        value={contact.relationship}
        onChangeText={(relationship) => onChange({ ...contact, relationship })}
        placeholder="Relationship (e.g., Daughter)"
        placeholderTextColor={colors.textSecondary}
        style={inputStyle}
        accessibilityLabel="Relationship"
      />
      <TextInput
        value={contact.phone}
        onChangeText={(phone) => onChange({ ...contact, phone })}
        placeholder="Phone number"
        placeholderTextColor={colors.textSecondary}
        keyboardType="phone-pad"
        style={inputStyle}
        accessibilityLabel="Phone number"
      />
      <TextInput
        value={contact.photoUri}
        onChangeText={(photoUri) => onChange({ ...contact, photoUri })}
        placeholder="Photo URL (optional)"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        keyboardType="url"
        style={inputStyle}
        accessibilityLabel="Photo URL"
      />
      <View style={styles.switchRow}>
        <Text variant="body">Primary emergency contact</Text>
        <Switch
          value={contact.isPrimaryEmergency}
          onValueChange={(isPrimaryEmergency) =>
            onChange({ ...contact, isPrimaryEmergency })
          }
          accessibilityLabel="Primary emergency contact"
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={contact.isPrimaryEmergency ? colors.textInverse : colors.textSecondary}
        />
      </View>
    </View>
  );
}

export default function FamilyContactsManagerScreen() {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, fontSizes.md)
  );
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Contact | null>(null);

  const loadContacts = useCallback(async () => {
    try {
      const data = await repo.getContacts();
      setContacts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const saveContacts = useCallback(async (next: Contact[]) => {
    await repo.setContacts(next);
    setContacts(next);
  }, []);

  const handleAdd = useCallback(() => {
    setDraft(emptyContact());
  }, []);

  const handleEdit = useCallback((contact: Contact) => {
    setDraft({ ...contact });
  }, []);

  const handleDelete = useCallback(
    (contact: Contact) => {
      Alert.alert('Delete Contact', `Remove ${contact.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const next = contacts.filter((c) => c.id !== contact.id);
            saveContacts(next);
          },
        },
      ]);
    },
    [contacts, saveContacts]
  );

  const handleSetPrimary = useCallback(
    (contact: Contact) => {
      const next = contacts.map((c) => ({
        ...c,
        isPrimaryEmergency: c.id === contact.id,
      }));
      saveContacts(next);
    },
    [contacts, saveContacts]
  );

  const handleSaveDraft = useCallback(() => {
    if (!draft) return;

    const name = draft.name.trim();
    const relationship = draft.relationship.trim();
    const phone = draft.phone.trim();

    if (!name || !relationship || !phone) {
      Alert.alert('Missing Info', 'Please fill in name, relationship, and phone.');
      return;
    }

    const photoUri = draft.photoUri?.trim() || undefined;
    const normalized = { ...draft, name, relationship, phone, photoUri };

    let next: Contact[];
    if (contacts.some((c) => c.id === normalized.id)) {
      next = contacts.map((c) => (c.id === normalized.id ? normalized : c));
    } else {
      next = [normalized, ...contacts];
    }

    if (normalized.isPrimaryEmergency) {
      next = next.map((c) => ({
        ...c,
        isPrimaryEmergency: c.id === normalized.id,
      }));
    }

    saveContacts(next);
    setDraft(null);
  }, [contacts, draft, saveContacts]);

  const handleCancelDraft = useCallback(() => {
    setDraft(null);
  }, []);

  if (draft) {
    return (
      <Screen contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="title" align="center">
            {contacts.some((c) => c.id === draft.id) ? 'Edit Contact' : 'Add Contact'}
          </Text>
        </View>

        <ContactForm contact={draft} onChange={setDraft} />

        <View style={styles.buttonGroup}>
          <BigButton
            label="Save Contact"
            icon={<FontAwesome6 name="check" size={fontSize} color={colors.textInverse} />}
            onPress={handleSaveDraft}
          />
          <BigButton
            label="Cancel"
            variant="ghost"
            icon={<FontAwesome6 name="xmark" size={fontSize} color={colors.primary} />}
            onPress={handleCancelDraft}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="title" align="center">
          Manage Contacts
        </Text>
        <Text variant="body" align="center" color={colors.textSecondary}>
          Add or edit the contacts your loved one sees.
        </Text>
      </View>

      {loading ? (
        <Text variant="body" align="center" color={colors.textSecondary}>
          Loading contacts...
        </Text>
      ) : null}

      {!loading && contacts.length === 0 ? (
        <Text variant="body" align="center" color={colors.textSecondary}>
          No contacts yet. Add one below.
        </Text>
      ) : null}

      <View style={styles.list}>
        {contacts.map((contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetPrimary={handleSetPrimary}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <BigButton
          label="Add Contact"
          icon={<FontAwesome6 name="plus" size={fontSize} color={colors.textInverse} />}
          onPress={handleAdd}
        />
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

const hitSlop = { top: 12, bottom: 12, left: 12, right: 12 };

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 2,
    padding: spacing.md,
    gap: spacing.md,
  },
  rowInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: radii.round,
    alignItems: 'center',
    justifyContent: 'center',
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  buttonGroup: {
    gap: spacing.md,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.md,
  },
});
