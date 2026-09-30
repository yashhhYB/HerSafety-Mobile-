import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { initializeRevenueCat } from '../lib/revenuecat';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      initializeRevenueCat();
    }
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal"  options={{ presentation: 'modal' }} />
        <Stack.Screen name="sos"    options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="safe-route" options={{ headerShown: false }} />
        <Stack.Screen name="paywall"    options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="guardian-grid" options={{ headerShown: false }} />
        <Stack.Screen name="radar"  options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
