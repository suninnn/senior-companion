import type { SharedLocation } from '@/models';

export const SEED_LOCATION: SharedLocation = {
  latitude: 37.3688,
  longitude: -122.0363,
  address: '123 Oak Lane, Sunnyvale, CA 94085',
  updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  isMock: true,
};
