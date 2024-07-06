import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import BookDetails from '../screens/bookDetails';
import UserProfileView from '../screens/userProfileView';
import Home from '../screens/home';

const Stack = createStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home" options={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="BookDetails" component={BookDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="UserProfileView" component={UserProfileView} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default HomeStack;