import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens here
import UserProfile from '../screens/profile';
import AddBook from '../screens/addBook';
import AddGenre from '../screens/AddGenre';
import Home from '../screens/home';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'AddBook') {
            iconName = 'book';
          } else if (route.name === 'AddGenre') {
            iconName = 'list';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={UserProfile} />
      <Tab.Screen name="AddBook" component={AddBook} />
      <Tab.Screen name="AddGenre" component={AddGenre} />
    </Tab.Navigator>
  );
}
