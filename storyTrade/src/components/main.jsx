import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from "../screens/login";
import RegisterScreen from "../screens/register";
import CompleteProfile from "../screens/completeProfile";
import UserProfile from "../screens/profile";

import AddBook from '../screens/addBook';
import { TabNavigator } from './tabNavigator';

import Home from '../screens/home';
import SearchBook from './searchBook';
import BookDetails from '../screens/bookDetails';
import ChatList from '../screens/chatsList';
import PaymentOptions from '../screens/vista_pagos';
import Chat from '../screens/chat';
import Settings from '../screens/settings';
import SettingsStack from './settingsStackNavigator'
import ProfileStack from './profileStack'; // Importa el nuevo stack

 
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
      <Stack.Navigator 
        initialRouteName={isLoggedIn ? "Home" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="Complete Profile" component={CompleteProfile}/>
        <Stack.Screen name="Profile" component={UserProfile}/>
        <Stack.Screen name="AddBook" component={AddBook}/>
        {/* <Stack.Screen name="SearchBook" component={SearchBook} options={{ headerShown: false }}/> */}
        <Stack.Screen name="BookDetails" component={BookDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="ChatList" component={ChatList} options={{ headerShown: false }}/>
        <Stack.Screen name="Pagos" component={PaymentOptions} options={{ headerShown: false }}/>
        <Stack.Screen name="SettingsStack" component={SettingsStack} options={{ headerShown: false }}/>
        <Stack.Screen name="ProfileStack" component={ProfileStack} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
