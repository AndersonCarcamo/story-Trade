import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, FlatList, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';

const UserProfileView = ({ route }) => {
    const { userId } = route.params;
    const [user, setUser] = useState(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('https://via.placeholder.com/150');
    const [bookImages, setBookImages] = useState({});

    useEffect(() => {
      const loadFonts = async () => {
        await Font.loadAsync({
          'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf'),
        });
        setFontsLoaded(true);
      };

      loadFonts();
    }, []);

    const fetchUserAvatar = async (avatarName) => {
      const defaultImage = 'https://via.placeholder.com/150';
      try {
        const response = await fetch(`https://opqwurrut9.execute-api.us-east-2.amazonaws.com/dev/get?fileName=avatars/${avatarName}`);
        if (response.ok) {
          const base64Data = await response.text();
          return `data:${response.headers.get('content-type')};base64,${base64Data}`;
        } else {
          return defaultImage;
        }
      } catch (error) {
        console.error(`Failed to fetch avatar ${avatarName}: `, error);
        return defaultImage;
      }
    };

    const fetchBookImage = async (imageName) => {
      const defaultImage = 'https://via.placeholder.com/150';
      try {
        const response = await fetch(`https://opqwurrut9.execute-api.us-east-2.amazonaws.com/dev/get?fileName=images/${imageName}`);
        if (response.ok) {
          const base64Data = await response.text();
          return `data:${response.headers.get('content-type')};base64,${base64Data}`;
        } else {
          return defaultImage;
        }
      } catch (error) {
        console.error(`Failed to fetch book image ${imageName}: `, error);
        return defaultImage;
      }
    };

    const loadBookImages = async (books) => {
      const images = {};
      for (const book of books) {
        const imageUrl = await fetchBookImage(book.book_info.image);
        images[book.id] = imageUrl;
      }
      setBookImages(images);
    };

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = response.data;
          setUser(userData);

          if (userData.avatar) {
            const avatarUrl = await fetchUserAvatar(userData.avatar);
            setPhotoUrl(avatarUrl);
          }

          if (userData.books) {
            await loadBookImages(userData.books);
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'No se pudo cargar el perfil');
        }
      };

      if (userId) {
        fetchUser();
      }
    }, [userId]);

    if (!user || !fontsLoaded) {
      return <Text>Cargando...</Text>;
    }

    const chunkGenres = (genres, chunkSize) => {
      const chunks = [];
      for (let i = 0; i < genres.length; i += chunkSize) {
        chunks.push(genres.slice(i, i + chunkSize));
      }
      return chunks;
    };

    const renderStars = () => {
      let stars = [];
      for (let i = 0; i < 5; i++) {
        stars.push(
          <Icon
            key={i}
            name="star"
            size={20}
            color={i < Math.floor(user.rating) ? '#ffbd59' : '#d3d3d3'}
          />
        );
      }
      return stars;
    };

    const { width } = Dimensions.get('window');
    const genreWidth = width * 0.2;
    const genresPerRow = Math.floor(width * 0.8 / genreWidth);
    const genreRows = chunkGenres(user.genres, genresPerRow);

    const renderBookItem = ({ item }) => {
      const bookImage = bookImages[item.id] || 'https://via.placeholder.com/150';
      return (
        <View style={styles.bookItem}>
          <Image source={{ uri: bookImage }} style={styles.bookImage} />
        </View>
      );
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Image source={require('../assets/logo_blanco.png')} style={styles.header_image} />
              <Text style={styles.headerText}>PERFIL</Text>
            </View>
            <View style={styles.profilePresentation}>
              <Image style={styles.photo} source={{ uri: photoUrl }} />
              <Text style={styles.name}>{user.name}</Text>
              <View style={styles.starsTrades}>
                <View style={styles.starsContainer}>{renderStars()}</View>
                <View style={styles.tradesContainer}>
                  <Text style={styles.tradesText}>{user.exchanges}</Text>
                  <Icon name="swap-horizontal" size={20} color="#ffbd59" />
                </View>
              </View>
              <View style={styles.generos}>
                <Text style={styles.generosTitulo}>Géneros de Interés: </Text>
                {genreRows.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.genreRow}>
                    {row.map((genre, index) => (
                      <Text key={index} style={styles.genreItem}>{genre}</Text>
                    ))}
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.libros}>
              <Text style={styles.librosTitulo}>Lista de libros:</Text>
              <FlatList
                data={user.books}
                renderItem={renderBookItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={styles.bookRow}
                showsVerticalScrollIndicator={false}
                key={2}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffbd59',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  header_image: {
    height: 100,
    width: 130,
    marginBottom: 10,
  },
  headerText: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 30,
    color: '#fff',
    textShadowColor: '#949494',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  profilePresentation: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  photo: {
    marginTop: 20,
    borderRadius: 100,
    height: 120,
    width: 120,
  },
  name: {
    fontSize: 40,
    color: '#ffbd59',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  starsTrades: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  tradesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tradesText: {
    fontSize: 16,
    color: '#000',
    marginRight: 5,
  },
  libros: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  librosTitulo: {
    margin: 5,
    marginBottom: 10,
    fontSize: 20,
  },
  bookRow: {
    justifyContent: 'space-between',
  },
  bookItem: {
    margin: 5,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    width: Dimensions.get('window').width / 2 - 30,
  },
  bookImage: {
    width: 150,
    height: 200,
    marginBottom: 10,
  },
  generos: {
    alignItems: 'center',
    marginVertical: 20,
  },
  generosTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  genreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  genreItem: {
    marginHorizontal: 5,
    padding: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
});

export default UserProfileView;
