import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import * as Font from 'expo-font';

const imageList = [
    { id: '1', uri: 'https://via.placeholder.com/150' },
    { id: '2', uri: 'https://via.placeholder.com/150' },
    { id: '3', uri: 'https://via.placeholder.com/150' },
    { id: '4', uri: 'https://via.placeholder.com/150' },
    { id: '5', uri: 'https://via.placeholder.com/150' },
    { id: '6', uri: 'https://via.placeholder.com/150' },
    // Agrega más imágenes según sea necesario
];

const numColumns = 2; // Número de columnas

const UserProfile = () => {
  const [rating, setRating] = useState(4);
  
  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={24}
          color="gold"
          onPress={() => setRating(i)}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf')
      });
    };

    loadFonts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.image} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PERFIL</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Reemplazar con la URL de la imagen del perfil
          style={styles.profileImage}
        />
        <Text style={styles.userName}>Jose Sáenz</Text>
        <View style={styles.stars_rating}>
          <View style={styles.starsContainer}>{renderStars()}</View>
          <Text style={styles.ratingText}>12</Text>
        </View>
        <View style={styles.genresContainer}>
          <Text style={styles.genre}>Romance</Text>
          <Text style={styles.genre}>Acción</Text>
          <Text style={styles.genre}>Sci-fi</Text>
        </View>
        <Text style={styles.bookListTitle}>Lista de libros:</Text>
        <FlatList
          data={imageList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.flatListContainer}
          nestedScrollEnabled
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: '25%',
    backgroundColor: '#ffbd59',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 30,
    color: '#fff',
    textShadowColor: '#949494',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  profileContainer: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    //marginTop: -40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ff9900',
    marginBottom: 5,
  },
  stars_rating: {
    flexDirection: 'row',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  star: {
    marginHorizontal: 5,
  },
  ratingText: {
    fontSize: 18,
    color: '#000',
    marginVertical: 10,
    marginLeft: 25,
  },
  genresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  genre: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: (Dimensions.get('window').width - (numColumns + 1) * 10) / numColumns,
    height: 150,
    resizeMode: 'cover',
  },
});

export default UserProfile;
