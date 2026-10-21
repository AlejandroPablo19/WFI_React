import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: '#F3F8F7' },
          headerStyle: { backgroundColor: '#F3F8F7' },
          headerTintColor: '#173F4A',
          headerTitleStyle: { fontWeight: '700' },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="inventory/add" options={{ title: 'Agregar fruta' }} />
        <Stack.Screen name="inventory/[id]" options={{ title: 'Editar fruta' }} />
      </Stack>
    </ThemeProvider>
  );
}
