import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#208827' }, // Verde Urna
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Urna Eletrônica' }} />
      <Stack.Screen name="resultado" options={{ title: 'Resultado da Apuração' }} />
    </Stack>
  );
}
