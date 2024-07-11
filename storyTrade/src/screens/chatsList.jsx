import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultAvatar from '../assets/default_image.jpg';
import Header from '../components/headerH';

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchMatches = async () => {
        try {
          const response = await fetch(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/matches/${userId}`);
          const data = await response.json();

          const fetchedChats = await Promise.all(data.map(async match => {
            const matchedUserId = match.user1_id === parseInt(userId) ? match.user2_id : match.user1_id;
            const userDetailsResponse = await fetch(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${matchedUserId}`);
            const userDetails = await userDetailsResponse.json();
            return {
              id: match.id,
              name: userDetails.name,
              avatar: defaultAvatar,
            };
          }));

          setChats(fetchedChats);
        } catch (error) {
          console.error(error);
        }
      };

      fetchMatches();
    }
  }, [userId]);

  const openChat = (chat) => {
    navigation.navigate('PaymentOptions', { chatId: chat.id, bookId: chat.bookId });
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.chatList}>
        <Text style={styles.chatListTitle}>Lista de Chats</Text>
        {chats.map((chat) => (
          <TouchableOpacity key={chat.id} style={styles.chatItem} onPress={() => openChat(chat)}>
            <Image source={chat.avatar} style={styles.avatar} />
            <View style={styles.chatDetails}>
              <Text style={styles.chatName}>{chat.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FFA500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    padding: 8,
  },
  chatList: {
    flex: 1,
  },
  chatListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatMessage: {
    color: '#666',
  },
  chatTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  chatTimeText: {
    marginLeft: 4,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f8f8f8',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#666',
  },
});

export default ChatList;


// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import SearchInput from '../components/searchInput';
// import defaultAvatar from '../assets/default_image.jpg';

// import Header from '../components/headerH';

// const chats = [
//   {
//     id: 1,
//     name: 'Jose Sáenz',
//     message: 'Empieza un chat...',
//     time: '2hrs',
//     avatar: defaultAvatar,
//     bookId: 1
//   },
//   {
//     id: 2,
//     name: 'Carla Castro',
//     message: 'Gracias! Me encantó el libro.',
//     avatar: defaultAvatar,
//     bookId: 2
//   },
// ];

// const ChatList = ({ navigation }) => {

//   const openChat = (chat) => {
//     navigation.navigate('PaymentOptions', { chatId: chat.id, bookId: chat.bookId });
//   };


//   return (
//     <View style={styles.container}>
//       <Header />
//       <ScrollView style={styles.chatList}>
//         <Text style={styles.chatListTitle}>Lista de Chats</Text>
//         {chats.map((chat) => (
//           <TouchableOpacity key={chat.id} style={styles.chatItem} onPress={() => openChat(chat)}>
//             <Image source={chat.avatar} style={styles.avatar} />
//             <View style={styles.chatDetails}>
//               <Text style={styles.chatName}>{chat.name}</Text>
//               <Text style={styles.chatMessage}>{chat.message}</Text>
//               {chat.time && (
//                 <View style={styles.chatTime}>
//                   <FontAwesome name="clock-o" size={12} color="#666" />
//                   <Text style={styles.chatTimeText}>{chat.time}</Text>
//                 </View>
//               )}
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     backgroundColor: '#FFA500',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   menuButton: {
//     padding: 8,
//   },
//   chatList: {
//     flex: 1,
//   },
//   chatListTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginHorizontal: 16,
//     marginVertical: 8,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 16,
//   },
//   chatDetails: {
//     flex: 1,
//   },
//   chatName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   chatMessage: {
//     color: '#666',
//   },
//   chatTime: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   chatTimeText: {
//     marginLeft: 4,
//     color: '#666',
//   },
//   footer: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     backgroundColor: '#f8f8f8',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//   },
//   footerButton: {
//     alignItems: 'center',
//   },
//   footerButtonText: {
//     fontSize: 12,
//     color: '#666',
//   },
// });

// export default ChatList;
