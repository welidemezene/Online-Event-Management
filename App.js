import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';

import { AuthProvider } from './src/context/AuthContext';
import { EventProvider } from './src/context/EventContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return null; // Show splash screen or loading state here
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <EventProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </EventProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
