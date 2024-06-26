import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from "../screens/login";
import RegisterScreen from "../screens/register";
import CompleteProfile from "../screens/completeProfile";
import UserProfile from "../screens/profile";
<<<<<<< Profile_Fix
import AddBook from '../screens/AddBook';
import AddGenre from '../screens/AddGenre';
import { TabNavigator } from './tabNavigator';
=======
import AddBook from '../screens/addBook';
import Home from '../screens/home';

>>>>>>> Register_Login_HotFix

const Stack = createStackNavigator();

export function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
<<<<<<< Profile_Fix
      <Stack.Navigator initialRouteName={isLoggedIn ? "Profile" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="Complete Profile" component={CompleteProfile}/>
        <Stack.Screen name="Profile" component={UserProfile}/>
        <Stack.Screen name="AddBook" component={AddBook}/>
        <Stack.Screen name="AddGenre" component={AddGenre}/>
=======
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
>>>>>>> Register_Login_HotFix
      </Stack.Navigator>
    </NavigationContainer>
  );
}
