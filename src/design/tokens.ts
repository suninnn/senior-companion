import { scaleForPreset } from '@/accessibility';
import type { FontSizePreset } from '@/models';

export const colors = {
  background: '#FFF8F3',
  surface: 'rgba(255,255,255,0.68)',
  surfaceDark: '#FFF0E8',
  primary: '#F47D55',
  primaryDark: '#D4603B',
  primaryLight: '#FFE5D9',
  text: '#242220',
  textSecondary: '#77716D',
  textInverse: '#FFFFFF',
  danger: '#C95A57',
  dangerLight: '#FDE8E8',
  caution: '#B87B68',
  cautionLight: '#FEF0E4',
  success: '#6EA68D',
  successLight: '#E4F5ED',
  sage: '#6EA68D',
  mutedRose: '#C8879D',
  border: 'rgba(255,255,255,0.45)',
  shadow: 'rgba(80,50,30,0.08)',
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
  lg: 28,
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
  appBackground: ['#FFFFFF', '#FFF8F3', '#FFD7C5', '#FF9365'] as const,
  appBackgroundLocations: [0, 0.25, 0.6, 1] as const,
};

export const glass = {
  fill: 'rgba(255,255,255,0.68)',
  fillStrong: 'rgba(255,255,255,0.85)',
  fillSubtle: 'rgba(255,255,255,0.45)',
  border: 'rgba(255,255,255,0.45)',
  shadow: 'rgba(80,50,30,0.08)',
};

export const elevation = {
  card: {
    shadowColor: 'rgba(80,50,30,0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  floating: {
    shadowColor: 'rgba(80,50,30,0.12)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 8,
  },
} as const;
