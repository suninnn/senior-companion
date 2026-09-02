import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useAccessibilityStore } from '@/accessibility';
import { colors, fontSizes, scaledFontSize } from './tokens';

type TextVariant = 'body' | 'title' | 'heading' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

const variantBaseSize: Record<TextVariant, number> = {
  caption: fontSizes.xs,
  body: fontSizes.body,
  label: fontSizes.md,
  title: fontSizes.xl,
  heading: fontSizes.xxl,
};

const variantWeight: Record<TextVariant, '400' | '500' | '600' | '700'> = {
  caption: '400',
  body: '400',
  label: '600',
  title: '700',
  heading: '700',
};

export function Text({
  variant = 'body',
  color = colors.text,
  align = 'left',
  style,
  ...rest
}: TextProps) {
  const fontSize = useAccessibilityStore((s) =>
    scaledFontSize(s.fontSize, variantBaseSize[variant])
  );

  return (
    <RNText
      style={[
        {
          fontFamily: 'Georgia',
          fontSize,
          fontWeight: variantWeight[variant],
          color,
          textAlign: align,
          lineHeight: fontSize * 1.5,
          letterSpacing: 0,
        },
        style,
      ]}
      allowFontScaling={false}
      {...rest}
    />
  );
}
