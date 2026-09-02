import type { Contact } from '@/models';

export const SEED_CONTACTS: Contact[] = [
  {
    id: 'contact-amy',
    name: 'Amy',
    relationship: 'Daughter',
    phone: '+1-415-555-0201',
    photoUri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    isPrimaryEmergency: true,
  },
  {
    id: 'contact-brendon',
    name: 'Brendon',
    relationship: 'Son',
    phone: '+1-415-555-0202',
    photoUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    isPrimaryEmergency: false,
  },
  {
    id: 'contact-anne',
    name: 'Anne',
    relationship: 'Sister',
    phone: '+1-415-555-0203',
    photoUri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    isPrimaryEmergency: false,
  },
  {
    id: 'contact-joe',
    name: 'Joe',
    relationship: 'Brother',
    phone: '+1-415-555-0204',
    photoUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    isPrimaryEmergency: false,
  },
  {
    id: 'contact-jack',
    name: 'Jack',
    relationship: 'Cousin',
    phone: '+1-415-555-0205',
    photoUri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    isPrimaryEmergency: false,
  },
];
