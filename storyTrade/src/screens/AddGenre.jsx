import React, { useState } from 'react';
import { View, Text, Button, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const genres = ['Romance', 'Fantasía', 'Terror', 'Policial', 'Ciencia Ficción'];

const AddGenre = ({ navigation }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleAddGenre = async () => {
    if (!selectedGenre) {
      Alert.alert('Error', 'Selecciona un género');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post('http://127.0.0.1:5000/users/${userId}/genres', { genre: selectedGenre }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Alert.alert('Género agregado');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo agregar el género');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Género</Text>
      <FlatList
        data={genres}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.genreItem,
              selectedGenre === item && styles.selectedGenreItem,
            ]}
            onPress={() => setSelectedGenre(item)}
          >
            <Text style={styles.genreText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddGenre}>
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  genreItem: {
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

export default AddGenre;
