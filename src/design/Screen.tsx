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
const TAB_BAR_HEIGHT = 72;

interface ScreenProps extends ScrollViewProps {
  children: ReactNode;
  gradient?: boolean;
  /** Extra bottom padding to clear the tab bar. Defaults to TAB_BAR_HEIGHT. */
  bottomPadding?: number;
}

export function Screen({ children, style, gradient = true, bottomPadding = TAB_BAR_HEIGHT, ...rest }: ScreenProps) {
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
            paddingBottom: Math.max(insets.bottom, spacing.xl) + bottomPadding,
            paddingLeft: 16,
            paddingRight: 16,
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
    maxWidth: '100%',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
    maxWidth: '100%',
  },
  container: {
    gap: spacing.lg,
    flexGrow: 1,
    maxWidth: '100%',
  },
});
