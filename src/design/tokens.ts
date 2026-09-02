import { scaleForPreset } from '@/accessibility';
import type { FontSizePreset } from '@/models';

export const colors = {
  background: '#FFF7F2',
  surface: '#FFFFFF',
  surfaceDark: '#FFF0E8',
  primary: '#F47C55',
  primaryDark: '#D4603B',
  primaryLight: '#FFE5D9',
  text: '#202124',
  textSecondary: '#8D8D95',
  textInverse: '#FFFFFF',
  danger: '#C95A57',
  dangerLight: '#FDE8E8',
  caution: '#B87B68',
  cautionLight: '#FEF0E4',
  success: '#66AE91',
  successLight: '#E4F5ED',
  border: 'rgba(30,30,30,0.05)',
  shadow: 'rgba(50,40,35,0.06)',
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const fonts = {
  regular: 'Georgia',
  medium: 'Georgia',
  semiBold: 'Georgia',
  bold: 'Georgia',
};

export const fontSizes = {
  xs: 14,
  sm: 16,
  body: 17,
  md: 22,
  lg: 26,
  xl: 30,
  xxl: 40,
};

export function scaledFontSize(
  preset: FontSizePreset,
  base: number
): number {
  return Math.round(base * scaleForPreset(preset));
}

export const hitSlop = {
  top: 12,
  bottom: 12,
  left: 12,
  right: 12,
};

export const gradients = {
  appBackground: ['#FFF0E6', '#FFF7F2', '#FFFFFF', '#FFF5EE'] as const,
  appBackgroundLocations: [0, 0.3, 0.65, 1] as const,
};

export const glass = {
  fill: 'rgba(255,255,255,0.82)',
  fillStrong: 'rgba(255,255,255,0.95)',
  fillSubtle: 'rgba(255,255,255,0.6)',
  border: 'rgba(30,30,30,0.05)',
  shadow: 'rgba(50,40,35,0.06)',
};

export const elevation = {
  card: {
    shadowColor: 'rgba(50,40,35,0.06)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  floating: {
    shadowColor: 'rgba(50,40,35,0.10)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 8,
  },
} as const;
