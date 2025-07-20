import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
// import { AuthProvider } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreenNative from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreenNative.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Inter-Regular': require('@/assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter_18pt-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreenNative.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
     <>
    {/* // <AuthProvider> */}
      <StatusBar style="light" />
      <Slot />
    {/* // </AuthProvider> */}
    </>
  );
}