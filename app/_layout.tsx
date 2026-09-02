import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { seedIfNeeded } from '@/data/seed';
import { useAppStore } from '@/store/appStore';

export default function RootLayout() {
  useEffect(() => {
    seedIfNeeded().catch(() => {});
    useAppStore.getState().seedStore().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="senior" />
        <Stack.Screen name="family" />
      </Stack>
    </SafeAreaProvider>
  );
}
