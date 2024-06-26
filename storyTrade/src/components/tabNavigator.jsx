import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens here
import UserProfile from '../screens/profile';
import AddBook from '../screens/AddBook';
import AddGenre from '../screens/AddGenre';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = 'ios-person';
          } else if (route.name === 'AddBook') {
            iconName = 'ios-book';
          } else if (route.name === 'AddGenre') {
            iconName = 'ios-list';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Profile" component={UserProfile} />
      <Tab.Screen name="AddBook" component={AddBook} />
      <Tab.Screen name="AddGenre" component={AddGenre} />
    </Tab.Navigator>
  );
}
