// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, Dimensions, FlatList, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import * as Font from 'expo-font';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Haptic } from 'expo';

// const UserProfile = ({ route, navigation }) => {
//   const { userId } = route.params;
//   const [user, setUser] = useState(null);
//   const [isOwnProfile, setIsOwnProfile] = useState(false);
//   const [markedBooks, setMarkedBooks] = useState([]);
//   const [fontsLoaded, setFontsLoaded] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedGenre, setSelectedGenre] = useState(null);
//   const [starRating, setStarRating] = useState(0); // Estado para la calificación de las estrellas
//   const [trades, setTrades] = useState(0); // Estado para el número de trades
//   const [availableGenres, setAvailableGenres] = useState([]); // Estado para los géneros disponibles
//   const [userGenres, setUserGenres] = useState([]); // Estado para los géneros del usuario
//   const [photoUrl, setPhotoUrl] = useState('https://via.placeholder.com/150'); // Estado para la URL de la foto

//   const hapticSensor = async () => {
//     await Haptic.selectionAsync();
//     Haptic.impactAsync('medium');
//   };

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const handleAddGenre = async () => {
//     if (!selectedGenre) {
//       Alert.alert('Error', 'Selecciona un género');
//       return;
//     }
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/genres`, { genre: selectedGenre }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (response.status === 200) {
//         Alert.alert('Género agregado');
//         setUserGenres((prevGenres) => [...prevGenres, selectedGenre]);
//         setSelectedGenre(null);
//         closeModal();
//       } else {
//         Alert.alert('Error', 'No se pudo agregar el género');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
//     }
//   };

//   const handleDeleteGenre = async (genreToDelete) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.delete(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/genres`, {
//         data: { genre: genreToDelete },
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (response.status === 200) {
//         Alert.alert('Género eliminado');
//         setUserGenres((prevGenres) => prevGenres.filter((genre) => genre !== genreToDelete));
//       } else {
//         Alert.alert('Error', 'No se pudo eliminar el género');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
//     }
//   };

//   useEffect(() => {
//     const loadFonts = async () => {
//       await Font.loadAsync({
//         'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf')
//       });
//       setFontsLoaded(true);
//     };

//     loadFonts();
//   }, []);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         console.log(userId)
//         const response = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setUser(response.data);

//         const loggedInUserId = await AsyncStorage.getItem('userId');
//         setIsOwnProfile(userId == loggedInUserId);

//         // Obtener la calificación de las estrellas
//         const ratingResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/rating`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setStarRating(Math.floor(ratingResponse.data.rating)); // Redondear hacia abajo la calificación

//         // Obtener el número de trades
//         const tradesResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/rating`, {
//           headers: {
//             Authorization: `Bearer {token}`
//           }
//         });
//         setTrades(tradesResponse.data.trades);

//         // Obtener los géneros del usuario
//         const userGenresResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/genres`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setUserGenres(userGenresResponse.data.genres);

//         // Obtener los géneros disponibles
//         const availableGenresResponse = await axios.get('https://dbstorytrada-b5fcff8487d7.herokuapp.com/genres', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setAvailableGenres(availableGenresResponse.data.genres);

//         // Obtener la foto del usuario
//         const photoResponse = await axios.get(`API_FOTO`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         if (photoResponse.data.photo) {
//           setPhotoUrl(photoResponse.data.photo);
//         }

//         if (userId != loggedInUserId) {
//           const markedResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/like/${userId}/check`, {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//           setMarkedBooks(markedResponse.data.markedBooks);
//         }
//       } catch (error) {
//         console.error(error);
//         Alert.alert('Error', 'No se pudo cargar el perfil');
//       }
//     };

//     fetchUser();
//   }, [userId, route.params?.refresh]);

//   const handleBookLongPress = async (bookId) => {
//     try {
//       const markerUserId = await AsyncStorage.getItem('userId');
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `https://dbstorytrada-b5fcff8487d7.herokuapp.com/like/${userId}`,
//         {
//           userId: markerUserId,
//           bookId: bookId
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setMarkedBooks([...markedBooks, bookId]);
//       Alert.alert('Libro marcado', 'El libro ha sido marcado exitosamente.');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'No se pudo marcar el libro.');
//     }
//   };

//   if (!user || !fontsLoaded) {
//     return <Text>Cargando...</Text>;
//   }

//   const chunkGenres = (genres, chunkSize) => {
//     const chunks = [];
//     for (let i = 0; i < genres.length; i += chunkSize) {
//       chunks.push(genres.slice(i, i + chunkSize));
//     }
//     return chunks;
//   };

//   const renderStars = () => {
//     let stars = [];
//     for (let i = 0; i < 5; i++) {
//       stars.push(
//         <Icon
//           key={i}
//           name="star"
//           size={20}
//           color={i < starRating ? '#ffbd59' : '#d3d3d3'}
//         />
//       );
//     }
//     return stars;
//   };

//   const { width } = Dimensions.get('window');
//   const genreWidth = width * 0.2;
//   const genresPerRow = Math.floor(width * 0.8 / genreWidth);
//   const genreRows = chunkGenres(userGenres, genresPerRow);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <Image source={require('../assets/logo_blanco.png')} style={styles.header_image}/>
//             <Text style={styles.headerText}>PERFIL</Text>
//           </View>
//           <View style={styles.profile_presentation}>
//             <Image style={styles.photo} source={{ uri: photoUrl }}/>
//             <Text style={styles.name}>{user.name}</Text>
//             <View style={styles.stars_trades}>
//               <View style={styles.starsContainer}>{renderStars()}</View>
//               <View style={styles.tradesContainer}>
//                 <Text style={styles.tradeNumber}>{trades}</Text>
//                 <Icon name="swap-horizontal" size={20} color="#ffbd59" />
//               </View>
//             </View>
//           </View>
//           <View style={styles.profile_info}>
//             <Text style={styles.profile_info_title}>Géneros favoritos:</Text>
//             <View style={styles.genreList}>
//               {genreRows.map((row, rowIndex) => (
//                 <View key={rowIndex} style={styles.genreRow}>
//                   {row.map((genre, genreIndex) => (
//                     <View key={genreIndex} style={styles.genreContainer}>
//                       <Text style={styles.genre}>{genre}</Text>
//                       {isOwnProfile && (
//                         <TouchableOpacity onPress={() => handleDeleteGenre(genre)} style={styles.deleteGenreButton}>
//                           <Icon name="close-circle" size={20} color="red"/>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   ))}
//                 </View>
//               ))}
//             </View>
//             {isOwnProfile && (
//               <>
//                 <TouchableOpacity style={styles.addGenreButton} onPress={openModal}>
//                   <Text style={styles.addGenreButtonText}>Añadir Género</Text>
//                 </TouchableOpacity>
//                 <Modal visible={modalVisible} animationType="slide" transparent={true}>
//                   <TouchableWithoutFeedback onPress={closeModal}>
//                     <View style={styles.modalOverlay}/>
//                   </TouchableWithoutFeedback>
//                   <View style={styles.modalContent}>
//                     <Text style={styles.modalTitle}>Selecciona un género:</Text>
//                     <ScrollView>
//                       {availableGenres.map((genre, index) => (
//                         <TouchableOpacity key={index} onPress={() => setSelectedGenre(genre)}>
//                           <Text style={[styles.genre, selectedGenre === genre && styles.selectedGenre]}>{genre}</Text>
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                     <TouchableOpacity style={styles.modalButton} onPress={handleAddGenre}>
//                       <Text style={styles.modalButtonText}>Añadir</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
//                       <Text style={styles.modalButtonText}>Cancelar</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </Modal>
//               </>
//             )}
//           </View>
//           <View style={styles.booksList}>
//             <Text style={styles.profile_info_title}>Libros:</Text>
//             {user.books.map((book, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onLongPress={() => {
//                   if (!isOwnProfile && !markedBooks.includes(book.bookId)) {
//                     hapticSensor();
//                     handleBookLongPress(book.bookId);
//                   }
//                 }}
//                 style={[
//                   styles.book,
//                   !isOwnProfile && markedBooks.includes(book.bookId) && styles.markedBook
//                 ]}
//               >
//                 <Image style={styles.bookImage} source={{ uri: book.imageUrl }} />
//                 <Text style={styles.bookTitle}>{book.title}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#00A7E1'
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     padding: 10
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#00A7E1'
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   backButton: {
//     padding: 10
//   },
//   header_image: {
//     width: 40,
//     height: 40,
//     resizeMode: 'contain'
//   },
//   headerText: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     fontFamily: 'Typewriter-Bold'
//   },
//   profile_presentation: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 10
//   },
//   photo: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#fff'
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 10
//   },
//   stars_trades: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10
//   },
//   starsContainer: {
//     flexDirection: 'row',
//     marginRight: 20
//   },
//   tradesContainer: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   tradeNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginRight: 5
//   },
//   tradeIcon: {
//     width: 32,
//     height: 32
//   },
//   profile_info: {
//     marginTop: 20
//   },
//   profile_info_title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10
//   },
//   genreList: {
//     flexDirection: 'row',
//     flexWrap: 'wrap'
//   },
//   genreRow: {
//     flexDirection: 'row',
//     marginBottom: 10
//   },
//   genreContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10,
//     marginBottom: 10
//   },
//   genre: {
//     fontSize: 16,
//     color: '#fff',
//     padding: 10,
//     backgroundColor: '#005f8e',
//     borderRadius: 5,
//     overflow: 'hidden'
//   },
//   deleteGenreButton: {
//     marginLeft: 5
//   },
//   addGenreButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#007ba8',
//     borderRadius: 5,
//     alignItems: 'center'
//   },
//   addGenreButtonText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: 'bold'
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)'
//   },
//   modalContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     margin: 20,
//     padding: 20,
//     borderRadius: 10
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20
//   },
//   selectedGenre: {
//     backgroundColor: '#007ba8'
//   },
//   modalButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#007ba8',
//     borderRadius: 5,
//     alignItems: 'center',
//     width: '100%'
//   },
//   modalButtonText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: 'bold'
//   },
//   booksList: {
//     marginTop: 20
//   },
//   book: {
//     padding: 10,
//     backgroundColor: '#007ba8',
//     borderRadius: 5,
//     marginBottom: 10,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   markedBook: {
//     borderColor: 'green',
//     borderWidth: 2
//   },
//   bookTitle: {
//     fontSize: 16,
//     color: '#fff'
//   },
//   bookImage: {
//     width: 100,
//     height: 150,
//     marginBottom: 10
//   }
// });

// export default UserProfile;



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
  const [starRating, setStarRating] = useState(0); // Estado para la calificación de las estrellas
  const [trades, setTrades] = useState(0); // Estado para el número de trades
  const [availableGenres, setAvailableGenres] = useState([]); // Estado para los géneros disponibles
  const [userGenres, setUserGenres] = useState([]); // Estado para los géneros del usuario
  const [photoUrl, setPhotoUrl] = useState('https://via.placeholder.com/150'); // Estado para la URL de la foto

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);

        const loggedInUserId = await AsyncStorage.getItem('userId');
        setIsOwnProfile(userId == loggedInUserId);

        // Obtener la calificación de las estrellas
        const ratingResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/rating`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStarRating(Math.floor(ratingResponse.data.rating)); // Redondear hacia abajo la calificación

        // Obtener el número de trades
        const tradesResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/rating`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTrades(tradesResponse.data.trades);

        // Obtener los géneros del usuario
        const userGenresResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/genres`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserGenres(userGenresResponse.data.genres);

        // Obtener los géneros disponibles
        const availableGenresResponse = await axios.get('https://dbstorytrada-b5fcff8487d7.herokuapp.com/genres', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAvailableGenres(availableGenresResponse.data.genres);

        // Obtener la foto del usuario
        const photoResponse = await axios.get(`API_FOTO`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (photoResponse.data.photo) {
          setPhotoUrl(photoResponse.data.photo);
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
  }, [userId, route.params?.refresh]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
              <Icon name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <Image source={require('../assets/logo_blanco.png')} style={styles.header_image}/>
            <Text style={styles.headerText}>PERFIL</Text>
          </View>
          <View style={styles.profile_presentation}>
            <Image style={styles.photo} source={{ uri: photoUrl }}/>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.stars_trades}>
              <View style={styles.starsContainer}>{renderStars()}</View>
              <View style={styles.tradesContainer}>
                <Text style={styles.tradeNumber}>{trades}</Text>
                <Icon name="swap-horizontal" size={20} color="#ffbd59" />
              </View>
            </View>
          </View>
          <View style={styles.profile_info}>
            <Text style={styles.profile_info_title}>Géneros favoritos:</Text>
            <View style={styles.genreList}>
              {genreRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.genreRow}>
                  {row.map((genre, genreIndex) => (
                    <View key={genreIndex} style={styles.genreContainer}>
                      <Text style={styles.genre}>{genre}</Text>
                      {isOwnProfile && (
                        <TouchableOpacity onPress={() => handleDeleteGenre(genre)} style={styles.deleteGenreButton}>
                          <Icon name="close-circle" size={20} color="red"/>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
            {isOwnProfile && (
              <>
                <TouchableOpacity style={styles.addGenreButton} onPress={openModal}>
                  <Text style={styles.addGenreButtonText}>Añadir Género</Text>
                </TouchableOpacity>
                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                  <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}/>
                  </TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Selecciona un género:</Text>
                    <ScrollView>
                      {availableGenres.map((genre, index) => (
                        <TouchableOpacity key={index} onPress={() => setSelectedGenre(genre)}>
                          <Text style={[styles.genre, selectedGenre === genre && styles.selectedGenre]}>{genre}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.modalButton} onPress={handleAddGenre}>
                      <Text style={styles.modalButtonText}>Añadir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </>
            )}
          </View>
          <View style={styles.booksList}>
            <Text style={styles.profile_info_title}>Libros:</Text>
            {user.books.map((book, index) => (
              <TouchableOpacity
                key={index}
                onLongPress={() => {
                  if (!isOwnProfile && !markedBooks.includes(book.bookId)) {
                    hapticSensor();
                    handleBookLongPress(book.bookId);
                  }
                }}
                style={[
                  styles.book,
                  !isOwnProfile && markedBooks.includes(book.bookId) && styles.markedBook
                ]}
              >
                <Text style={styles.bookTitle}>{book.title}</Text>
              </TouchableOpacity>
            ))}
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
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
  modal_title: {
    fontSize: 20,
    marginBottom: 20,
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
});

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#00A7E1'
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     padding: 10
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#00A7E1'
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   backButton: {
//     padding: 10
//   },
//   header_image: {
//     width: 40,
//     height: 40,
//     resizeMode: 'contain'
//   },
//   headerText: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     fontFamily: 'Typewriter-Bold'
//   },
//   profile_presentation: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 10
//   },
//   photo: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#fff'
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 10
//   },
//   stars_trades: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10
//   },
//   starsContainer: {
//     flexDirection: 'row',
//     marginRight: 20
//   },
//   tradesContainer: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   tradeNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginRight: 5
//   },
//   tradeIcon: {
//     width: 32,
//     height: 32
//   },
//   profile_info: {
//     marginTop: 20
//   },
//   profile_info_title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10
//   },
//   genreList: {
//     flexDirection: 'row',
//     flexWrap: 'wrap'
//   },
//   genreRow: {
//     flexDirection: 'row',
//     marginBottom: 10
//   },
//   genreContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10,
//     marginBottom: 10
//   },
//   genre: {
//     fontSize: 16,
//     color: '#fff',
//     padding: 10,
//     backgroundColor: '#005f8e',
//     borderRadius: 5,
//     overflow: 'hidden'
//   },
//   deleteGenreButton: {
//     marginLeft: 5
//   },
//   addGenreButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#007ba8',
//     borderRadius: 5,
//     alignItems: 'center'
//   },
//   addGenreButtonText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: 'bold'
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)'
//   },
//   modalContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     margin: 20,
//     padding: 20,
//     borderRadius: 10
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20
//   },
//   selectedGenre: {
//     backgroundColor: '#007ba8'
//   },
//   modalButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#007ba8',
//     borderRadius: 5,
//     alignItems: 'center',
//     width: '100%'
//   },
//   modalButtonText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: 'bold'
//   },
//   booksList: {
//     marginTop: 20
//   },
//   book: {
//     padding: 10,
//     backgroundColor: '#007ba8',
//     borderRadius: 5,
//     marginBottom: 10,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   markedBook: {
//     borderColor: 'green',
//     borderWidth: 2
//   },
//   bookTitle: {
//     fontSize: 16,
//     color: '#fff'
//   }
// });

export default UserProfile;




// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, Dimensions, FlatList, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import * as Font from 'expo-font';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Haptic } from 'expo';

// const UserProfile = ({ route, navigation }) => {
//   const { userId } = route.params;
//   const [user, setUser] = useState(null);
//   const [isOwnProfile, setIsOwnProfile] = useState(false);
//   const [markedBooks, setMarkedBooks] = useState([]);
//   const [fontsLoaded, setFontsLoaded] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedGenre, setSelectedGenre] = useState(null);
//   const [starRating, setStarRating] = useState(0); // Estado para la calificación de las estrellas
//   const [trades, setTrades] = useState(0); // Estado para el número de trades
//   const [availableGenres, setAvailableGenres] = useState([]); // Estado para los géneros disponibles
//   const [userGenres, setUserGenres] = useState([]); // Estado para los géneros del usuario
//   const [photoUrl, setPhotoUrl] = useState('https://via.placeholder.com/150'); // Estado para la URL de la foto

//   const hapticSensor = async () => {
//     await Haptic.selectionAsync();
//     Haptic.impactAsync('medium');
//   };

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const handleAddGenre = async () => {
//     if (!selectedGenre) {
//       Alert.alert('Error', 'Selecciona un género');
//       return;
//     }
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/genres`, { genre: selectedGenre }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (response.status === 200) {
//         Alert.alert('Género agregado');
//         setUserGenres((prevGenres) => [...prevGenres, selectedGenre]);
//         setSelectedGenre(null);
//         closeModal();
//       } else {
//         Alert.alert('Error', 'No se pudo agregar el género');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
//     }
//   };

//   const handleDeleteGenre = async (genreToDelete) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.delete(`http://10.0.2.2:5000/users/${userId}/genres`, {
//         data: { genre: genreToDelete },
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (response.status === 200) {
//         Alert.alert('Género eliminado');
//         setUserGenres((prevGenres) => prevGenres.filter((genre) => genre !== genreToDelete));
//       } else {
//         Alert.alert('Error', 'No se pudo eliminar el género');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
//     }
//   };

//   useEffect(() => {
//     const loadFonts = async () => {
//       await Font.loadAsync({
//         'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf')
//       });
//       setFontsLoaded(true);
//     };

//     loadFonts();
//   }, []);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const response = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setUser(response.data);

//         const loggedInUserId = await AsyncStorage.getItem('userId');
//         setIsOwnProfile(userId == loggedInUserId);

//         // Obtener la calificación de las estrellas
//         const ratingResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/rating`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setStarRating(Math.floor(ratingResponse.data.rating)); // Redondear hacia abajo la calificación

//         // Obtener el número de trades
//         const tradesResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/rating`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setTrades(tradesResponse.data.trades);

//         // Obtener los géneros del usuario
//         const userGenresResponse = await axios.get(`http://10.0.2.2:5000/users/${userId}/genres`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setUserGenres(userGenresResponse.data.genres);

//         // Obtener los géneros disponibles
//         const availableGenresResponse = await axios.get('http://10.0.2.2:5000/genres', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setAvailableGenres(availableGenresResponse.data.genres);

//         // Obtener la foto del usuario
//         const photoResponse = await axios.get(`http://10.0.2.2:5000/users/${userId}/photo`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         if (photoResponse.data.photo) {
//           setPhotoUrl(photoResponse.data.photo);
//         }

//         if (userId != loggedInUserId) {
//           const markedResponse = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/like/${userId}/check`, {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//           setMarkedBooks(markedResponse.data.markedBooks);
//         }
//       } catch (error) {
//         console.error(error);
//         Alert.alert('Error', 'No se pudo cargar el perfil');
//       }
//     };

//     fetchUser();
//   }, [userId, route.params?.refresh]);

//   const handleBookLongPress = async (bookId) => {
//     try {
//       const markerUserId = await AsyncStorage.getItem('userId');
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `https://dbstorytrada-b5fcff8487d7.herokuapp.com/like/${userId}`,
//         {
//           userId: markerUserId,
//           bookId: bookId
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setMarkedBooks([...markedBooks, bookId]);
//       Alert.alert('Libro marcado', 'El libro ha sido marcado exitosamente.');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'No se pudo marcar el libro.');
//     }
//   };

//   if (!user || !fontsLoaded) {
//     return <Text>Cargando...</Text>;
//   }

//   const chunkGenres = (genres, chunkSize) => {
//     const chunks = [];
//     for (let i = 0; i < genres.length; i += chunkSize) {
//       chunks.push(genres.slice(i, i + chunkSize));
//     }
//     return chunks;
//   };

//   const renderStars = () => {
//     let stars = [];
//     for (let i = 0; i < 5; i++) {
//       stars.push(
//         <Icon
//           key={i}
//           name="star"
//           size={20}
//           color={i < starRating ? '#ffbd59' : '#d3d3d3'}
//         />
//       );
//     }
//     return stars;
//   };

//   const { width } = Dimensions.get('window');
//   const genreWidth = width * 0.2;
//   const genresPerRow = Math.floor(width * 0.8 / genreWidth);
//   const genreRows = chunkGenres(userGenres, genresPerRow);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
//               <Icon name="arrow-back" size={30} color="#fff" />
//             </TouchableOpacity>
//             <Image source={require('../assets/logo_blanco.png')} style={styles.header_image}/>
//             <Text style={styles.headerText}>PERFIL</Text>
//           </View>
//           <View style={styles.profile_presentation}>
//             <Image style={styles.photo} source={{ uri: photoUrl }}/>
//             <Text style={styles.name}>{user.name}</Text>
//             <View style={styles.stars_trades}>
//               <View style={styles.starsContainer}>{renderStars()}</View>
//               <View style={styles.tradesContainer}>
//                 <Text style={styles.tradesText}>{trades}</Text>
//                 <Icon name="swap-horizontal" size={20} color="#ffbd59" />
//               </View>
//             </View>
//             <View style={styles.generos}>
//               <Text style={styles.generos_titulo}>Géneros de Interés: </Text>
//               {genreRows.map((row, rowIndex) => (
//                 <View key={rowIndex} style={styles.genreRow}>
//                   {row.map((genre, index) => (
//                     <Text key={index} style={styles.genreItem}>{genre}</Text>
//                   ))}
//                 </View>
//               ))}
//               {isOwnProfile && (
//                 <TouchableOpacity style={styles.add_genero} onPress={openModal}>
//                   <Text style={styles.add_genero_text}>+</Text>
//                 </TouchableOpacity>
//               )}
//               <Modal
//                 visible={modalVisible}
//                 animationType="fade"
//                 transparent={true}
//                 onRequestClose={closeModal}
//               >
//                 <TouchableWithoutFeedback onPress={closeModal}>
//                   <View style={styles.modalBackground}>
//                     <TouchableWithoutFeedback>
//                       <View style={styles.modal_container}>
//                         <Text style={styles.modal_title}>Agregar Género</Text>
//                         <FlatList
//                           data={availableGenres}
//                           renderItem={({ item }) => (
//                             <TouchableOpacity
//                               style={[
//                                 styles.modal_genreItem,
//                                 selectedGenre === item && styles.selectedGenreItem,
//                               ]}
//                               onPress={() => setSelectedGenre(item)}
//                             >
//                               <Text style={styles.genreText}>{item}</Text>
//                             </TouchableOpacity>
//                           )}
//                           keyExtractor={(item) => item}
//                         />
//                         <TouchableOpacity style={styles.addButton} onPress={handleAddGenre}>
//                           <Text style={styles.addButtonText}>Agregar</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </TouchableWithoutFeedback>
//                   </View>
//                 </TouchableWithoutFeedback>
//               </Modal>
//             </View>
//           </View>
//           <View style={styles.libros}>
//             <Text style={styles.libros_titulo}>Lista de libros:</Text>
//             <FlatList
//               data={user.books}
//               renderItem={({ item }) => (
//                 isOwnProfile ? (
//                   <View
//                     style={[
//                       styles.bookItem,
//                       markedBooks.includes(item.id) && { borderColor: 'green', borderWidth: 2 }
//                     ]}
//                   >
//                     <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.bookImage} />
//                   </View>
//                 ) : (
//                   <TouchableOpacity
//                     style={[
//                       styles.bookItem,
//                       markedBooks.includes(item.id) && { borderColor: 'green', borderWidth: 2 }
//                     ]}
//                     onLongPress={() => {
//                       handleBookLongPress(item.id);
//                       hapticSensor();
//                     }}
//                   >
//                     <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.bookImage} />
//                   </TouchableOpacity>
//                 )
//               )}
//               keyExtractor={(item, index) => index.toString()}
//               numColumns={2}
//               columnWrapperStyle={styles.bookRow}
//               showsVerticalScrollIndicator={false}
//               key={2}
//             />
//           </View>
//         </View>
//       </ScrollView>
//       {isOwnProfile && (
//         <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddBook', { userId })}>
//           <Icon name="add" size={30} color="#fff" />
//         </TouchableOpacity>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#efefef',
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   header: {
//     backgroundColor: '#ffbd59',
//     height: 250,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//   },
//   header_image: {
//     height: 100,
//     width: 130,
//     marginBottom: 10,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//   },
//   headerText: {
//     fontFamily: 'Typewriter-Bold',
//     fontSize: 30,
//     color: '#fff',
//     textShadowColor: '#949494',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 10,
//   },
//   profile_presentation: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 20,
//   },
//   photo: {
//     marginTop: 20,
//     borderRadius: 100,
//     height: 120,
//     width: 120,
//   },
//   name: {
//     fontSize: 40,
//     color: '#ffbd59',
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   stars_trades: {
//     flexDirection: 'row',
//     width: '40%',
//     justifyContent: 'space-between',
//   },
//   starsContainer: {
//     flexDirection: 'row',
//   },
//   tradesContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   tradesText: {
//     fontSize: 16,
//     color: '#000',
//     marginRight: 5,
//   },
//   generos: {
//     alignItems: 'center',
//     width: '90%',
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   generos_titulo: { 
//     margin: 5,
//     marginBottom: 10,
//     fontSize: 20,
//   },
//   genreRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     width: '100%',
//     marginBottom: 10,
//   },
//   genreItem: {
//     backgroundColor: '#fff',
//     padding: 5,
//     paddingHorizontal: 20,
//     marginRight: 10,
//     borderRadius: 15,
//   },
//   add_genero: {
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   add_genero_text: {
//     color: '#000',
//     fontSize: 15,
//     fontWeight: 'bold',
//   },
//   libros: {
//     flex: 1,
//     alignItems: 'center',
//     width: '100%', 
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   libros_titulo: {
//     margin: 5,
//     marginBottom: 10,
//     fontSize: 20, 
//   },
//   bookRow: {
//     justifyContent: 'space-between', 
//   },
//   bookItem: {
//     margin: 5,
//     padding: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//     width: Dimensions.get('window').width / 2 - 30,
//   },
//   bookImage: {
//     width: 150,
//     height: 200,
//     marginBottom: 10,
//   },
//   fab: {
//     position: 'absolute',
//     width: 60,
//     height: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//     right: 30,
//     bottom: 30,
//     backgroundColor: '#ffbd59',
//     borderRadius: 30,
//     elevation: 8,
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modal_container: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modal_title: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   modal_genreItem: {
//     padding: 15,
//     marginVertical: 5,
//     width: '100%',
//     backgroundColor: '#e6e1e1',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   selectedGenreItem: {
//     backgroundColor: '#ffbd59',
//   },
//   genreText: {
//     fontSize: 16,
//   },
//   addButton: {
//     backgroundColor: '#ffbd59',
//     borderRadius: 25,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default UserProfile;