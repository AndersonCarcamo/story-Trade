import * as React from 'react';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// import { TabNavigator } from "./tabNavigator";
import LoginScreen from "../screens/login";
import AddBook from '../screens/addBook';

const Stack = createStackNavigator();

export function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Add Book">
        {/* <Stack.Screen name="Login" component={LoginScreen}/> */}
        {/* <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }}/> */}
        <Stack.Screen name="Add Book" component={AddBook}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}