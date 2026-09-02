export interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  photoUri?: string;
  isPrimaryEmergency: boolean;
}
