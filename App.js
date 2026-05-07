import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';

const imagens = [
  require('./assets/banners/conexao.png'),
  require('./assets/banners/versiculo.png'),
  require('./assets/banners/devocional.png'),
  require('./assets/banners/oracao-guiada.png'),
  require('./assets/icons/logo.png'),
];

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [fontsLoaded, fontError] = useFonts(Ionicons.font);
  const [forceReady, setForceReady] = useState(false);

  useEffect(() => {
    Asset.loadAsync(imagens).finally(() => setAssetsLoaded(true));
    // Garante que o app nunca fica preso na splash por mais de 5 segundos
    const timer = setTimeout(() => setForceReady(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const pronto = forceReady || (assetsLoaded && (fontsLoaded || !!fontError));

  if (!pronto) return (
    <>
      <StatusBar style="light" />
      <SplashScreen />
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F2EB' }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </View>
  );
}
