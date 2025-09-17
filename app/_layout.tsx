import { Redirect, Slot, Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
// import * as SplashScreenNative from 'expo-splash-screen';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Keep the splash screen visible while we fetch resources
// SplashScreenNative.preventAutoHideAsync();
SplashScreen.preventAutoHideAsync();

export function AppLayout() {
   const { user, loading } = useAuth();
  const segments = useSegments();
  const [fontsLoaded, error] = useFonts({
    'Inter-Regular': require('@/assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter_18pt-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  // Check if the user is in the auth group
  const inAuthGroup = segments[0] === 'auth';

  if (!user && !inAuthGroup) {
    return <Redirect href="/auth/login" />;
  }

  if (user && inAuthGroup) {
    return <Redirect href="./(tabs)" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack>
         <Stack.Screen 
        name="auth" 
        options={{ 
          headerShown: false,
          animation: 'fade'
        }} 
      />
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="camera" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
            animation: 'fade',
          }} 
        />
         <Stack.Screen 
        name="active-call" 
        options={{ 
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} 
      />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}