import { Stack } from 'expo-router';
import { BarcodeProvider } from '../Context/BarcodeContext';

export default function RootLayout() {
  return (
    <BarcodeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="scanner" options={{ headerShown: false }} />
        <Stack.Screen
          name="library"
          options={{
            title: 'Biblioteca',
            headerStyle: { backgroundColor: '#598E8A' },
            headerTintColor: '#fff',
          }}
        />
      </Stack>
    </BarcodeProvider>
  );
}