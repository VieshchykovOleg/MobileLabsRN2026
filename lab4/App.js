import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import FileManagerScreen from './screens/FileManagerScreen';
import ViewerScreen      from './screens/ViewerScreen';
import StorageScreen     from './screens/StorageScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ name, focused }) {
  const map = { 'Файли': focused ? '📁' : '🗂️', 'Пам\'ять': focused ? '💾' : '🖴' };
  return <Text style={{ fontSize: 22 }}>{map[name] || '📄'}</Text>;
}

// Stack для вкладки Файли (FileManager + Viewer)
function FilesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:     { backgroundColor: '#4F6EF7' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: 'Назад',
      }}
    >
      <Stack.Screen
        name="FileManager"
        component={FileManagerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Viewer"
        component={ViewerScreen}
        options={{ title: 'Файл' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
          tabBarActiveTintColor: '#4F6EF7',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#E0E4F0',
            height: 62,
            paddingBottom: 10,
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        })}
      >
        <Tab.Screen name="Файли"   component={FilesStack} />
        <Tab.Screen name="Пам'ять" component={StorageScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
