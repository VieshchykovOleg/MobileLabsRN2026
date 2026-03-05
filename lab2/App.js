import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import MainScreen from './screens/MainScreen';
import DetailsScreen from './screens/DetailsScreen';
import ContactsScreen from './screens/ContactsScreen';
import CustomDrawer from './components/CustomDrawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator для новин (Main + Details)
function NewsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Вимикаємо вбудований header щоб уникнути подвійного
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          // Header тільки на екрані деталей
          headerShown: true,
          headerStyle: { backgroundColor: '#1565C0' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          headerBackTitle: 'Назад',
        }}
      />
    </Stack.Navigator>
  );
}

// Головний Drawer Navigator
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 280,
          },
        }}
      >
        <Drawer.Screen name="NewsStack" component={NewsStack} />
        <Drawer.Screen name="Contacts" component={ContactsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
