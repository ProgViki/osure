import 'react-native-reanimated'; // MUST be first
import { Stack } from 'expo-router';



export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create-qr"  />
      <Stack.Screen name="favorites"  />
      <Stack.Screen name="history"  />

      {/* <Drawer /> */}
    </Stack>
  );
}
