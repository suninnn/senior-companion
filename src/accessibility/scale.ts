import type { FontSizePreset } from '@/models';

export const FONT_MULTIPLIERS: Record<FontSizePreset, number> = {
  normal: 1,
  large: 1.3,
  extraLarge: 1.65,
};

export function scaleForPreset(preset: FontSizePreset): number {
  return FONT_MULTIPLIERS[preset];
}

export function nextPreset(preset: FontSizePreset): FontSizePreset | null {
  const order: FontSizePreset[] = ['normal', 'large', 'extraLarge'];
  const idx = order.indexOf(preset);
  return order[idx + 1] ?? null;
}

export function previousPreset(preset: FontSizePreset): FontSizePreset | null {
  const order: FontSizePreset[] = ['normal', 'large', 'extraLarge'];
  const idx = order.indexOf(preset);
  return order[idx - 1] ?? null;
}

export function presetLabel(preset: FontSizePreset): string {
  switch (preset) {
    case 'normal':
      return 'Normal';
    case 'large':
      return 'Large';
    case 'extraLarge':
      return 'Extra Large';
    default:
      return 'Normal';
  }
}
