import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme/colors';

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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
  OracoesTab: 'Oracoes',
  PerfilTab: 'Perfil',
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HojeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
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
        tabBarLabel: TAB_LABELS[route.name],
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
      <Tab.Screen name="PerfilTab" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
