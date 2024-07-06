import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, Dimensions, FlatList, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { Haptic } from 'expo';

const UserProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [markedBooks, setMarkedBooks] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [starRating, setStarRating] = useState(0);
  const [trades, setTrades] = useState(0);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [userGenres, setUserGenres] = useState([]);
  const [photoUrl, setPhotoUrl] = useState('https://via.placeholder.com/150');
  const [bookImages, setBookImages] = useState({});

  const hapticSensor = async () => {
    await Haptic.selectionAsync();
    Haptic.impactAsync('medium');
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAddGenre = async () => {
    if (!selectedGenre) {
      Alert.alert('Error', 'Selecciona un género');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/genres`, { genre: selectedGenre }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Alert.alert('Género agregado');
        setUserGenres((prevGenres) => [...prevGenres, selectedGenre]);
        setSelectedGenre(null);
        closeModal();
      } else {
        Alert.alert('Error', 'No se pudo agregar el género');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    }
  };

  const handleDeleteGenre = async (genreToDelete) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.delete(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/genres`, {
        data: { genre: genreToDelete },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Alert.alert('Género eliminado');
        setUserGenres((prevGenres) => prevGenres.filter((genre) => genre !== genreToDelete));
      } else {
        Alert.alert('Error', 'No se pudo eliminar el género');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf')
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
            Authorization: `Bearer ${token}`
          }
        });

        const userData = response.data;
        setUser(userData);

        const loggedInUserId = await AsyncStorage.getItem('userId');
        setIsOwnProfile(userId == loggedInUserId);

        setStarRating(Math.floor(userData.rating));
        setTrades(userData.exchanges);
        setUserGenres(userData.genres);

        if (userData.avatar) {
          const avatarUrl = await fetchUserAvatar(userData.avatar);
          setPhotoUrl(avatarUrl);
        }

        if (userData.books) {
          await loadBookImages(userData.books);
        }

        if (userId != loggedInUserId) {
          const markedResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/like/${userId}/check`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setMarkedBooks(markedResponse.data.markedBooks);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar el perfil');
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const availableGenresResponse = await axios.get('https://dbstorytrada-b5fcff8487d7.herokuapp.com/genres', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAvailableGenres(availableGenresResponse.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar los Géneros');
      }
    };
    getGenres();
  }, []);

  const handleBookLongPress = async (bookId) => {
    try {
      const markerUserId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `https://dbstorytrada-b5fcff8487d7.herokuapp.com/like/${userId}`,
        {
          userId: markerUserId,
          bookId: bookId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMarkedBooks([...markedBooks, bookId]);
      Alert.alert('Libro marcado', 'El libro ha sido marcado exitosamente.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo marcar el libro.');
    }
  };

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
          color={i < starRating ? '#ffbd59' : '#d3d3d3'}
        />
      );
    }
    return stars;
  };

  const { width } = Dimensions.get('window');
  const genreWidth = width * 0.2;
  const genresPerRow = Math.floor(width * 0.8 / genreWidth);
  const genreRows = chunkGenres(userGenres, genresPerRow);

  const renderBookItem = ({ item }) => {
    const bookImage = bookImages[item.id] || 'https://via.placeholder.com/150';
    return isOwnProfile ? (
      <View
        style={[
          styles.bookItem,
          markedBooks.includes(item.id) && { borderColor: 'green', borderWidth: 2 }
        ]}
      >
        <Image source={{ uri: bookImage }} style={styles.bookImage} />
      </View>
    ) : (
      <TouchableOpacity
        style={[
          styles.bookItem,
          markedBooks.includes(item.id) && { borderColor: 'green', borderWidth: 2 }
        ]}
        onLongPress={() => {
          handleBookLongPress(item.id);
          hapticSensor();
        }}
      >
        <Image source={{ uri: bookImage }} style={styles.bookImage} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={require('../assets/logo_blanco.png')} style={styles.header_image}/>
            <Text style={styles.headerText}>PERFIL</Text>
          </View>
          <View style={styles.profile_presentation}>
            <Image style={styles.photo} source={{ uri: photoUrl }}/>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.stars_trades}>
              <View style={styles.starsContainer}>{renderStars()}</View>
              <View style={styles.tradesContainer}>
                <Text style={styles.tradesText}>{trades}</Text>
                <Icon name="swap-horizontal" size={20} color="#ffbd59" />
              </View>
            </View>
            <View style={styles.generos}>
              <Text style={styles.generos_titulo}>Géneros de Interés: </Text>
              {genreRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.genreRow}>
                  {row.map((genre, index) => (
                    <Text key={index} style={styles.genreItem}>{genre}</Text>
                  ))}
                </View>
              ))}
              {isOwnProfile && (
                <TouchableOpacity style={styles.add_genero} onPress={openModal}>
                  <Text style={styles.add_genero_text}>+</Text>
                </TouchableOpacity>
              )}
              <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={closeModal}
              >
                <TouchableWithoutFeedback onPress={closeModal}>
                  <View style={styles.modalBackground}>
                    <TouchableWithoutFeedback>
                      <View style={styles.modal_container}>
                        <Text style={styles.modal_title}>Agregar Género</Text>
                        {availableGenres.length > 0 ? (
                          <FlatList
                            data={availableGenres}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                style={[
                                  styles.modal_genreItem,
                                  selectedGenre === item.name && styles.selectedGenreItem,
                                ]}
                                onPress={() => setSelectedGenre(item.name)}
                              >
                                <Text style={styles.genreText}>{item.name}</Text>
                              </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                          />
                        ) : (
                          <Text style={styles.noGenresText}>No hay géneros disponibles</Text>
                        )}
                        <TouchableOpacity style={styles.addButton} onPress={handleAddGenre}>
                          <Text style={styles.addButtonText}>Agregar</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          </View>
          <View style={styles.libros}>
            <Text style={styles.libros_titulo}>Lista de libros:</Text>
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
      {isOwnProfile && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddBook', { userId })}>
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};