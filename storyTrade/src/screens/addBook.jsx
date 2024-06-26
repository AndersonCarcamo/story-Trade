import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AddBook = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleAddBook = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post('http://127.0.0.1:5000/users/${userId}/books', { title, author }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Alert.alert('Libro agregado');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo agregar el libro');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Libro</Text>
      <TextInput
        placeholder="Título del libro"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Autor"
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
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
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#e6e1e1',
    borderRadius: 10,
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

export default AddBook;
