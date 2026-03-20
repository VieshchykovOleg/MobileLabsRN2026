import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { ThemeProvider, GameProvider, useTheme } from './context/AppContext';
import HomeScreen       from './screens/HomeScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import SettingsScreen   from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    'Гра':         focused ? '🎮' : '🕹️',
    'Завдання':    focused ? '🏆' : '🎯',
    'Налаштування': focused ? '⚙️' : '🔧',
  };
  return <Text style={{ fontSize: 22 }}>{icons[label] || '●'}</Text>;
}

function AppNavigator() {
  const { theme, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.bg,
      card: theme.tabBar,
      text: theme.text,
      border: theme.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.subtext,
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopColor: theme.border,
            height: 62,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Гра"          component={HomeScreen} />
        <Tab.Screen name="Завдання"     component={ChallengesScreen} />
        <Tab.Screen name="Налаштування" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppNavigator />
      </GameProvider>
    </ThemeProvider>
  );
}
