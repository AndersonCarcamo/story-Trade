// chatStackNavigator.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatList from '../screens/chatsList';
import PaymentOptions from '../screens/vista_pagos';
import Chat from '../screens/chat';

const Stack = createStackNavigator();

const ChatStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

export default ChatStackNavigator;
