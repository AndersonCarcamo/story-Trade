// BookDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SearchInput from '../components/searchInput';

const fetchImage = async (imageName) => {
    try {
        const response = await fetch(`http://localhost:3000/get?user=bookinfo&mediaType=images&fileName=${imageName}`);
        if (response.ok) {
        return response.url;
        } else {
        return null; // o una imagen por defecto
        }
    } catch (error) {
        console.error(`Failed to fetch image ${imageName}: `, error);
        return null; // o una imagen por defecto
    }
};
  
const fetchUserAvatar = async (avatarName) => {
    try {
        const response = await fetch(`http://localhost:3000/get?user=avatars&mediaType=images&fileName=${avatarName}`);
        if (response.ok) {
        return response.url;
        } else {
        return null; // o una imagen por defecto
        }
    } catch (error) {
        console.error(`Failed to fetch avatar ${avatarName}: `, error);
        return null; // o una imagen por defecto
    }
};

const BookDetails = ({ book, goBack }) => {

    const [bookImage, setBookImage] = useState(null);
    const [userAvatars, setUserAvatars] = useState({});

    useEffect(() => {
        const loadBookImage = async () => {
          const imageUrl = await fetchImage(book.image);
          setBookImage(imageUrl);
        };
    
        const loadUserAvatars = async () => {
          const avatars = {};
          for (const user of book.users) {
            const avatarUrl = await fetchUserAvatar(user.avatar);
            avatars[user.id] = avatarUrl;
          }
          setUserAvatars(avatars);
        };
    
        loadBookImage();
        loadUserAvatars();
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
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <Text style={styles.bookDescription}>{book.description}</Text>
                <Text style={styles.bookRating}>Goodreads rating: {book.rating}★</Text>
                </View>
            </View>
            <Text style={styles.exchangeTitle}>Intercambia con:</Text>
            <View style={styles.usersContainer}>
                {book.users.map((user, index) => (
                <View key={index} style={styles.user}>
                    <Image source={{ uri: userAvatars[user.id] }} style={styles.userAvatar} />
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.userRating}>
                    {[...Array(5)].map((_, i) => (
                        <FontAwesome key={i} name="star" size={16} color={i < user.rating ? "#FFD700" : "#DDD"} />
                    ))}
                    </View>
                    <Text style={styles.userExchanges}>{user.exchanges}</Text>
                </View>
                ))}
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