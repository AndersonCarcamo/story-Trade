// BookDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SearchInput from '../components/searchInput';
import defaultImage from '../assets/default_image.jpg'; 

const fetchImage = async (imageName) => {
  try {
      const response = await fetch(`http://localhost:3000/get?mediaType=images&fileName=${imageName}`);
      if (response.ok) {
          return response.url;
      } else {
          return defaultImage; // Devuelve una imagen por defecto en caso de error
      }
  } catch (error) {
      console.error(`Failed to fetch image ${imageName}: `, error);
      return defaultImage; // Devuelve una imagen por defecto en caso de error
  }
};
  
const fetchUserAvatar = async (avatarName) => {
  try {
      const response = await fetch(`http://localhost:3000/get?user=avatars&mediaType=images&fileName=${avatarName}`);
      if (response.ok) {
          return response.url;
      } else {
          return defaultImage; // Devuelve una imagen por defecto en caso de error
      }
  } catch (error) {
      console.error(`Failed to fetch avatar ${avatarName}: `, error);
      return defaultImage; // Devuelve una imagen por defecto en caso de error
  }
};

const fetchUserInfo = async (userId) => {
  try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      if (response.ok) {
          return await response.json();
      } else {
          console.error(`Failed to fetch user info for user ${userId}`);
          return null;
      }
  } catch (error) {
      console.error(`Failed to fetch user info for user ${userId}: `, error);
      return null;
  }
};

const BookDetails = ({ book, goBack }) => {

  const [bookImage, setBookImage] = useState(defaultImage);
  const [user, setUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(defaultImage);

  useEffect(() => {
    const loadBookImage = async () => {
        const imageUrl = await fetchImage(book.book_info.image);
        setBookImage(imageUrl);
    };

    const loadUserInfo = async () => {
        const userInfo = await fetchUserInfo(book.user_id);
        if (userInfo) {
            setUser(userInfo);
            const avatarUrl = await fetchUserAvatar(userInfo.avatar);
            setUserAvatar(avatarUrl);
        }
    };

    loadBookImage();
    loadUserInfo();
}, [book]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#FFA500" />
      </TouchableOpacity>
      <SearchInput />
      <ScrollView>
          <View style={styles.bookDetails}>
              <Image source={{ uri: bookImage }} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.book_info.title}</Text>
                  <Text style={styles.bookAuthor}>{book.book_info.author}</Text>
                  <Text style={styles.bookDescription}>{book.book_info.description}</Text>
                  <Text style={styles.bookRating}>Goodreads rating: {book.book_info.rating}★</Text>
              </View>
          </View>
          <Text style={styles.exchangeTitle}>Intercambia con:</Text>
          <View style={styles.usersContainer}>
              {user && (
                  <View key={user.id} style={styles.user}>
                      <Image source={{ uri: userAvatar }} style={styles.userAvatar} />
                      <Text style={styles.userName}>{user.name}</Text>
                      <View style={styles.userRating}>
                          {[...Array(5)].map((_, i) => (
                              <FontAwesome key={i} name="star" size={16} color={i < user.rating ? "#FFD700" : "#DDD"} />
                          ))}
                      </View>
                      <Text style={styles.userExchanges}>{user.exchanges} intercambios</Text>
                  </View>
              )}
          </View>
          <Text style={styles.viewMore}>ver más...</Text>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    backButton: {
      padding: 16,
    },
    bookDetails: {
      flexDirection: 'row',
      padding: 16,
    },
    bookImage: {
      width: 120,
      height: 180,
    },
    bookInfo: {
      flex: 1,
      marginLeft: 16,
    },
    bookTitle: {
        fontFamily: 'Typewriter-Bold',
        fontSize: 24,
        fontWeight: 'bold',
    },
    bookAuthor: {
        fontFamily: 'Typewriter-Bold',
        fontSize: 18,
        marginVertical: 8,
    },
    bookDescription: {
        fontFamily: 'Typewriter-Bold',
        fontSize: 16,
    },
    bookRating: {
      marginTop: 8,
      fontSize: 16,
      fontWeight: 'bold',
    },
    exchangeTitle: {
      marginHorizontal: 16,
      marginTop: 16,
      fontSize: 18,
      fontWeight: 'bold',
    },
    usersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: 16,
    },
    user: {
      alignItems: 'center',
      margin: 8,
    },
    userAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    userName: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: 'bold',
    },
    userRating: {
      flexDirection: 'row',
      marginVertical: 4,
    },
    userExchanges: {
      fontSize: 12,
    },
    viewMore: {
      textAlign: 'center',
      color: '#FFA500',
      marginVertical: 16,
    },
  });
  
  export default BookDetails;