import { type ComponentProps } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { radii, elevation, spacing } from './tokens';

type Intensity = 'subtle' | 'regular' | 'strong';

interface GlassCardProps extends Omit<ComponentProps<typeof View>, 'style'> {
  intensity?: Intensity;
  padding?: keyof typeof spacing;
  style?: ViewStyle;
}

const fills: Record<Intensity, string> = {
  subtle: '#FFFFFF',
  regular: '#FFFFFF',
  strong: '#FFF9F5',
};

export function GlassCard({
  intensity = 'regular',
  padding = 'lg',
  style,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: fills[intensity], padding: spacing[padding] },
        elevation.card,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(30,30,30,0.04)',
    overflow: 'hidden',
  },
});
