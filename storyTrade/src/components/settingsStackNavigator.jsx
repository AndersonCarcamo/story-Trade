// SettingsStack.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from '../screens/settings';
import EditProfile from '../screens/editProfile';

const Stack = createStackNavigator();

export function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}

export default SettingsStack;