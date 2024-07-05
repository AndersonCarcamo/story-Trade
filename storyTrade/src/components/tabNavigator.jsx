import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ChatList from '../screens/chatsList';
import Settings from '../screens/settings';
import Home from '../screens/home';
import UserProfile from '../screens/profile';
import AddBook from '../screens/addBook';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };

    fetchUserId();
  }, []);

  if (!userId) {
    return null; // O mostrar un indicador de carga mientras se obtiene el userId
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else if (route.name === 'ChatList') {
            iconName = 'chatbubbles-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#FFBD59',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          paddingVertical: 10,
          paddingBottom: 10,
          height: 60,
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={UserProfile} initialParams={{ userId }} options={{ headerShown: false }} />
      <Tab.Screen name="ChatList" component={ChatList} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}




// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';

// import ChatList from '../screens/chatsList';
// import Settings from '../screens/settings';
// import Home from '../screens/home';
// import UserProfile from '../screens/profile';
// import AddBook from '../screens/addBook';

// const Tab = createBottomTabNavigator();

// export function TabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = 'home-outline';
//           } else if (route.name === 'Profile') {
//             iconName = 'person-outline';
//           } else if (route.name === 'ChatList') {
//             iconName = 'chatbubbles-outline';
//           } else if (route.name === 'Settings') {
//             iconName = 'settings-outline';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: 'white',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: {
//           display: 'flex',
//           backgroundColor: '#FFBD59',
//           borderTopWidth: 1,
//           borderTopColor: '#ccc',
//           paddingVertical: 10,
//           paddingBottom: 10,
//           height: 60,
//         }
//       })}
//     >
//       <Tab.Screen name="Home" component={Home} options={{ headerShown: false }}/>
//       <Tab.Screen name="Profile" component={UserProfile} options={{ headerShown: false }} />
//       <Tab.Screen name="ChatList" component={ChatList} options={{ headerShown: false }} />
//       <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
//     </Tab.Navigator>
//   );
// }
