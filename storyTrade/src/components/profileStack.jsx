// ProfileStack.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from '../screens/profile';
import AddBook from '../screens/addBook';

const Stack = createStackNavigator();

const ProfileStack = ({ userId }) => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false, 
      }}
    >
      <Stack.Screen 
        name="Profile"
      >
        {(props) => <UserProfile {...props} userId={userId} />}
      </Stack.Screen>
      <Stack.Screen 
        name="AddBook"
      >
        {(props) => <AddBook {...props} userId={userId} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default ProfileStack;
