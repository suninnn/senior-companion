import { type ReactNode } from 'react';
import {
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gradients, spacing } from './tokens';

const HEADER_OFFSET = 56;

interface ScreenProps extends ScrollViewProps {
  children: ReactNode;
  gradient?: boolean;
}

export function Screen({ children, style, gradient = true, ...rest }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrapper}>
      {gradient ? (
        <LinearGradient
          colors={[...gradients.appBackground]}
          locations={[...gradients.appBackgroundLocations]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + HEADER_OFFSET,
            paddingBottom: Math.max(insets.bottom, spacing.xl),
            paddingLeft: Math.max(insets.left, spacing.lg),
            paddingRight: Math.max(insets.right, spacing.lg),
          },
        ]}
        style={[styles.scroll, style]}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    gap: spacing.lg,
    flexGrow: 1,
  },
});
