import React from 'react';
import { Image, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import PlanoConcluidoAnimacao from '../components/PlanoConcluidoAnimacao';
import OracoesConcluidasAnimacao from '../components/OracoesConcluidasAnimacao';
import SplashScreen from '../components/SplashScreen';

const logoIcon = require('../../assets/icons/logo.png');

import GuiaInicialScreen from '../screens/GuiaInicialScreen';
import JejumScreen from '../screens/JejumScreen';
import HojeScreen from '../screens/HojeScreen';
import OracoesScreen from '../screens/OracoesScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ConexaoDiariaScreen from '../screens/ConexaoDiariaScreen';
import VersiculoScreen from '../screens/VersiculoScreen';
import DevocionalScreen from '../screens/DevocionalScreen';
import OracaoGuiadaScreen from '../screens/OracaoGuiadaScreen';
import OracaoDetalheScreen from '../screens/OracaoDetalheScreen';
import JejumDetalheScreen from '../screens/JejumDetalheScreen';
import JejumNivelScreen from '../screens/JejumNivelScreen';
import VideoOracaoScreen from '../screens/VideoOracaoScreen';
import JejumDanielScreen from '../screens/JejumDanielScreen';
import JejumEsterScreen from '../screens/JejumEsterScreen';
import JejumNormalScreen from '../screens/JejumNormalScreen';
import JejumParcialScreen from '../screens/JejumParcialScreen';
import PaywallScreen from '../screens/PaywallScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Root = createNativeStackNavigator();

function HojeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HojeMain" component={HojeScreen} />
      <Stack.Screen name="ConexaoDiaria" component={ConexaoDiariaScreen} />
      <Stack.Screen name="Versiculo" component={VersiculoScreen} />
      <Stack.Screen name="Devocional" component={DevocionalScreen} />
      <Stack.Screen name="OracaoGuiada" component={OracaoGuiadaScreen} />
    </Stack.Navigator>
  );
}

function OracoesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OracoesMain" component={OracoesScreen} />
      <Stack.Screen name="OracaoDetalhe" component={OracaoDetalheScreen} />
    </Stack.Navigator>
  );
}

function JejumStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JejumMain" component={JejumScreen} />
      <Stack.Screen name="JejumNivel" component={JejumNivelScreen} />
      <Stack.Screen name="JejumDetalhe" component={JejumDetalheScreen} />
      <Stack.Screen name="VideoOracao" component={VideoOracaoScreen} />
      <Stack.Screen name="JejumDaniel" component={JejumDanielScreen} />
      <Stack.Screen name="JejumEster" component={JejumEsterScreen} />
      <Stack.Screen name="JejumNormal" component={JejumNormalScreen} />
      <Stack.Screen name="JejumParcial" component={JejumParcialScreen} />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilMain" component={PerfilScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
    </Stack.Navigator>
  );
}

function GuiaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GuiaMain" component={GuiaInicialScreen} />
    </Stack.Navigator>
  );
}

const TAB_ICONS = {
  GuiaTab: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  JejumTab: { active: 'book', inactive: 'book-outline' },
  HojeTab: { active: 'checkmark-circle', inactive: 'checkmark-circle-outline' },
  OracoesTab: { active: 'people', inactive: 'people-outline' },
  PerfilTab: { active: 'person', inactive: 'person-outline' },
};

const TAB_LABELS = {
  GuiaTab: 'Guia',
  JejumTab: 'Jejum',
  HojeTab: 'Hoje',
  OracoesTab: 'Orações',
  PerfilTab: 'Perfil',
};

function MainNavigator() {
  const { planoConcluido, clearPlanoConcluido, todasOracoesCompletas, clearTodasOracoesCompletas } = useApp();

  return (
    <>
    <Tab.Navigator
      initialRouteName="HojeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'HojeTab') {
            return (
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -36,
                shadowColor: '#0D1B3E',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 10,
                borderWidth: 2,
                borderColor: '#EBE6DC',
              }}>
                <Image
                  source={logoIcon}
                  style={{ width: 76, height: 76, opacity: focused ? 1 : 0.65 }}
                  resizeMode="cover"
                />
              </View>
            );
          }
          const icons = TAB_ICONS[route.name];
          return (
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={24}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarLabel: route.name === 'HojeTab' ? () => null : TAB_LABELS[route.name],
        tabBarLabelStyle: {
          fontSize: 11,
          ...FONTS.semibold,
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
          height: 85,
          paddingTop: 8,
          paddingBottom: 28,
        },
      })}
    >
      <Tab.Screen name="GuiaTab" component={GuiaStack} />
      <Tab.Screen name="JejumTab" component={JejumStack} />
      <Tab.Screen name="HojeTab" component={HojeStack} />
      <Tab.Screen name="OracoesTab" component={OracoesStack} />
      <Tab.Screen name="PerfilTab" component={PerfilStack} />
    </Tab.Navigator>
    <PlanoConcluidoAnimacao visible={planoConcluido} onClose={clearPlanoConcluido} />
    <OracoesConcluidasAnimacao visible={todasOracoesCompletas} onClose={clearTodasOracoesCompletas} />
    </>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, authLoading } = useApp();

  if (authLoading) return <SplashScreen />;

  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {isAuthenticated ? (
        <Root.Screen name="Main" component={MainNavigator} />
      ) : (
        <>
          <Root.Screen name="Paywall" component={PaywallScreen} />
          <Root.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Root.Navigator>
  );
}
