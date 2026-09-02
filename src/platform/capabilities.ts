import { Platform } from 'react-native';

export const canUseCamera = Platform.OS !== 'web';
export const canUseGps = Platform.OS !== 'web';
export const canUseTelLinks = Platform.OS !== 'web';

export const MOCK_LOCATION = {
  latitude: 37.3688,
  longitude: -122.0363,
  address: 'Sunnyvale, CA',
} as const;
