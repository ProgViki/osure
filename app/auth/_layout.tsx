import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false,
          animation: 'fade'
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }} 
      />
    </Stack>
  );
}