import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatStackNavigator from './chatStackNavigator';
import SettingsStack from './settingsStackNavigator'
import ProfileStack from './profileStack';
import HomeStack from './homeStack';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };

    fetchUserId();
  }, []);

  if (!userId) {
    return null; // O mostrar un indicador de carga mientras se obtiene el userId
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else if (route.name === 'ChatList') {
            iconName = 'chatbubbles-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#FFBD59',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          paddingVertical: 10,
          paddingBottom: 10,
          height: 60,
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" options={{ headerShown: false }}>
        {() => <ProfileStack userId={userId} />}
      </Tab.Screen>
      <Tab.Screen name="ChatList" component={ChatStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
