import * as React from 'react';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// import { TabNavigator } from "./tabNavigator";
import LoginScreen from "../screens/login";
import RegisterSceen from "../screens/register";
import CompleteProfile from "../screens/completeProfile";

const Stack = createStackNavigator();

export function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Complete Profile">
        {/*<Stack.Screen name="Login" component={LoginScreen}/>*/}
        {/* <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }}/> */}
        {/*<Stack.Screen name="Register" component={RegisterSceen}/>*/}
        <Stack.Screen name="Complete Profile" component={CompleteProfile}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}