import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, Dimensions, FlatList, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { Haptic } from 'expo';
import { useFocusEffect } from '@react-navigation/native';

const UserProfile = ({ userId, navigation }) => {
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [markedBooks, setMarkedBooks] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
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

  const openSubscriptionModal = () => {
    setSubscriptionModalVisible(true);
  };

  const closeSubscriptionModal = () => {
    setSubscriptionModalVisible(false);
  };

  const openConfirmationModal = () => {
    setConfirmationModalVisible(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  const handleSubscribe = () => {
    closeSubscriptionModal();
    openConfirmationModal();
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

  useFocusEffect(
    React.useCallback(() => {
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

      if (userId) {
        fetchUser();
      }
    }, [userId])
  );

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
    //const bookImage = bookImages[item.id] ? { uri: bookImages[item.id] } : require('path/to/placeholder/image.png');

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
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity style={styles.subscribeButton} onPress={openSubscriptionModal}>
              <Text style={styles.subscribeButtonText}>Afiliarse a Suscripción</Text>
            </TouchableOpacity>
            <Modal
              visible={subscriptionModalVisible}
              animationType="fade"
              transparent={true}
              onRequestClose={closeSubscriptionModal}
            >
              <TouchableWithoutFeedback onPress={closeSubscriptionModal}>
                <View style={styles.modalBackground}>
                  <TouchableWithoutFeedback>
                  <View style={styles.subscriptionModalContainer}>
                      <Text style={styles.modal_title}>Información de Suscripción</Text>
                      <Text style={styles.modal_text}>Suscripción: Elimina la comisión por cada intercambio</Text>
                      <Text style={styles.modal_text}>Precio: 4.99 soles/mensuales</Text>
                      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                        <Text style={styles.subscribeButtonText}>Suscribirse</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.closeButton} onPress={closeSubscriptionModal}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              visible={confirmationModalVisible}
              animationType="fade"
              transparent={true}
              onRequestClose={closeConfirmationModal}
            >
              <TouchableWithoutFeedback onPress={closeConfirmationModal}>
                <View style={styles.modalBackground}>
                  <TouchableWithoutFeedback>
                    <View style={styles.confirmationModalContainer}>
                      <Icon name="checkmark-circle" size={80} color="#4BB543" />
                      <Text style={styles.confirmationText}>Se ha suscrito</Text>
                      <TouchableOpacity style={styles.closeButton} onPress={closeConfirmationModal}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
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
  backButton: {
    position: 'absolute',
    top: '5%',
    left: '5%',
  },
  headerText: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 30,
    color: '#fff',
    textShadowColor: '#949494',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  profile_presentation: {
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
  stars_trades: {
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
  generos: {
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  generos_titulo: { 
    margin: 5,
    marginBottom: 10,
    fontSize: 20,
  },
  genreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  genreItem: {
    backgroundColor: '#fff',
    padding: 5,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 15,
  },
  add_genero: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  add_genero_text: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  libros: {
    flex: 1,
    alignItems: 'center',
    width: '100%', 
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  libros_titulo: {
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
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#ffbd59',
    borderRadius: 30,
    elevation: 8,
  },
  subscribeButton: {
    backgroundColor: '#ffbd59',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal_container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  subscriptionModalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modal_title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modal_text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#555',
  },
  closeButton: {
    backgroundColor: '#ffbd59',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modal_genreItem: {
    padding: 15,
    marginVertical: 5,
    width: '100%',
    backgroundColor: '#e6e1e1',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedGenreItem: {
    backgroundColor: '#ffbd59',
  },
  genreText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#ffbd59',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmationModalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#4BB543',
  },
});

export default UserProfile;

