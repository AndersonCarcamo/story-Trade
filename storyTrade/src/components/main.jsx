import * as React from 'react';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// import { TabNavigator } from "./tabNavigator";
import LoginScreen from "../screens/login";
import RegisterSceen from "../screens/register";
import CompleteProfile from "../screens/completeProfile";
import UserProfile from "../screens/profile";
import AddBook from '../screens/addBook';
import Home from '../screens/home';


const Stack = createStackNavigator();

export function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterSceen}/>
        <Stack.Screen name="Complete Profile" component={CompleteProfile}/>
        <Stack.Screen name="Home" component={Home}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
