import type { Contact } from './contact';
import type { FamilyStatus } from '@/components/StatusBadge';

export interface FamilyMember extends Contact {
  status: FamilyStatus;
  avatarUri?: string;
}
