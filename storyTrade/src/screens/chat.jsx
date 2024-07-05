import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import defaultAvatar from '../assets/default_image.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const messages = [
    { id: 1, text: 'Hola! Donde nos podemos encontrar para el intercambio', sender: 'Jose Sáenz' },
    { id: 2, text: 'En el jockey plaza te parece bien?', sender: 'Me' },
    { id: 3, text: 'Si, perfecto. Estaria bien el lunes a las 4pm?', sender: 'Jose Sáenz' },
    { id: 4, text: 'Si', sender: 'Me' },
];
  
const Chat = ({ navigation, route }) => {
    const { chatId, bookId, paymentOption } = route.params;
    const [ratingExchange, setRatingExchange] = useState(4);
    const [ratingUser, setRatingUser] = useState(5);
    const [userId, setUserId] = useState(null);
        
    useEffect(() => {
        const getUserId = async () => {
          const id = await AsyncStorage.getItem('userId');
          setUserId(id);
        };
        getUserId();
    }, []);

    const goBack = () => {
        navigation.goBack();
    };

    const handleRatingExchange = (rating) => {
        setRatingExchange(rating);
    };

    const handleRatingUser = (rating) => {
        setRatingUser(rating);
    };


    const confirmDelivery = async () => {
        try {
            console.log(`user_id: ${userId}, book_id: ${bookId}, rating: ${ratingExchange}`)
          const transactionResponse = await axios.post('http://127.0.0.1:5000/transactions', {
            user_id: userId,
            book_id: bookId,
            rating: ratingExchange,
          });
    
          const transactionId = transactionResponse.data.id;
    
          await axios.post(`http://127.0.0.1:5000/transactions/${transactionId}/rate`, {
            user_rating: ratingUser,
            transaction_rating: ratingExchange,
          });
          
          alert('Entrega confirmada y calificación registrada.');
        } catch (error) {
          console.error('Error al confirmar la entrega: ', error);
          alert('Error al confirmar la entrega.');
        }
      };
  return (
<View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image source={defaultAvatar} style={styles.avatar} />
          <Text style={styles.headerTitle}>Jose Sáenz</Text>
        </View>
        <View style={styles.menuButton}></View>
      </View>
      <ScrollView style={styles.chatContainer}>
        {messages.map((message) => (
          <View key={message.id} style={message.sender === 'Me' ? styles.myMessage : styles.theirMessage}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.ratingContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={confirmDelivery}>
          <Text style={styles.confirmButtonText}>CONFIRMAR LA ENTREGA</Text>
        </TouchableOpacity>
        <Text style={styles.ratingText}>¿Qué tan satisfecho estás con el intercambio?</Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleRatingExchange(index + 1)}>
              <FontAwesome name="star" size={24} color={index < ratingExchange ? "#FFD700" : "#DDD"} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>¿Cómo puntuarías a <Text style={styles.boldText}>Jose Sáenz</Text>?</Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleRatingUser(index + 1)}>
              <FontAwesome name="star" size={24} color={index < ratingUser ? "#FFD700" : "#DDD"} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" size={24} color="#FFA500" />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={24} color="#666" />
          <Text style={styles.footerButtonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AddBook')}>
          <FontAwesome name="plus-circle" size={24} color="#666" />
          <Text style={styles.footerButtonText}>Add Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AddGenre')}>
          <FontAwesome name="tags" size={24} color="#666" />
          <Text style={styles.footerButtonText}>Add Genre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      backgroundColor: '#FFBD59',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 20,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    backButton: {
      padding: 8,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    menuButton: {
      width: 32,
    },
    chatContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#D1F5FF',
      borderRadius: 15,
      padding: 10,
      marginVertical: 5,
      maxWidth: '80%',
    },
    theirMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#F0F0F0',
      borderRadius: 15,
      padding: 10,
      marginVertical: 5,
      maxWidth: '80%',
    },
    messageText: {
      fontSize: 16,
    },
    ratingContainer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      backgroundColor: '#f8f8f8',
    },
    confirmButton: {
      backgroundColor: '#FFBD59',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 16,
    },
    confirmButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
    ratingText: {
      fontSize: 16,
      marginBottom: 10,
    },
    boldText: {
      fontWeight: 'bold',
    },
    starsContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    footer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      backgroundColor: '#FFBD59',
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

export default Chat;
