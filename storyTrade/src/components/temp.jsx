import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, ScrollView, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import defaultImage from '../assets/default_image.jpg';

const AddBook = ({ route, navigation }) => {
  const { userId } = route.params;
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [release_year, setReleaseYear] = useState('');
  const [antiquity, setAntiquity] = useState('');
  const [editorial, setEditorial] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [bookImage, setBookImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageType, setImageType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef();

  const callExternal = () => {
    if (ref.current) {
      ref.current.fetchUser();
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found');
          return;
        }
        const response = await axios.get('https://dbstorytrada-b5fcff8487d7.herokuapp.com/genres', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Categorias fetched', response.data);
        setCategorias(response.data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);
  
  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Selected image:', result.assets[0].uri);
      if (result.assets[0].uri) {
        setBookImage(result.assets[0].uri);
        const filename = `${userId}_book_${Date.now()}`;
        setImageName(filename);
        setImageType(result.assets[0].type || 'image/jpeg');
        console.log('Image type:', result.assets[0].type || 'image/jpeg');
      }
    } else {
        console.log('User cancelled image picker');
    }
  };

  const handleAddBook = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found');
        return;
      }

      setIsModalVisible(true);
      setIsLoading(true);

      if (bookImage) {
        const base64Content = bookImage.split(',')[1];
        const formData = {
          fileName: imageName,
          type: 'images',
          fileContent: base64Content
        };
        console.log('Uploading book image with formData:', formData);
        try {
          const response = await axios.post('https://1h2tipwe92.execute-api.us-east-2.amazonaws.com/deploy-st1/upload', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Upload response:', response.data);
        } catch (error) {
          console.error('Failed to upload book image: ', error);
          Alert.alert('Error', 'No se pudo subir la imagen del libro');
          setIsLoading(false);
          return;
        }
      }
      
      const bookData = { 
        title, 
        author,
        description,
        category,
        rating: parseFloat(rating),
        release_year: parseInt(release_year, 10),
        antiquity,
        editorial,
        image: imageName
      };

      console.log('Adding book with data:', bookData);

      const response = await axios.post(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/books`, bookData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      if (response.status === 200) {
        setIsLoading(false);
        Alert.alert('Libro agregado');
        callExternal();
        navigation.navigate('Profile', { userId, refresh: true });
      } else {
        setIsLoading(false);
        Alert.alert('Error', 'No se pudo agregar el libro');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error adding book:', error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Profile', { userId })}>
            <Icon name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../assets/logo_blanco.png')} style={styles.header_image} />
          <Text style={styles.headerText}>PERFIL</Text>
        </View>
        <View style={styles.title_box}>
          <Text style={styles.title}>Agregar Libro</Text>
        </View>
        <ScrollView style={styles.inputs}>
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
          <TextInput
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Selecciona una categoría" value="" />
              {categorias.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
              ))}
            </Picker>
          </View>
          <TextInput
            placeholder="Rating"
            value={rating}
            onChangeText={setRating} 
            style={styles.input}
          />
          <TextInput
            placeholder="Año de salida"
            value={release_year}
            onChangeText={setReleaseYear}
            style={styles.input}
          />
          <TextInput
            placeholder="Antiguedad"
            value={antiquity}
            onChangeText={setAntiquity}
            style={styles.input}
          />
          <TextInput
            placeholder="Editorial"
            value={editorial}
            onChangeText={setEditorial}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleChooseImage} style={styles.chooseImageButton}>
            <Text style={styles.chooseImageButtonText}>{bookImage ? "Imagen seleccionada" : "Seleccionar Imagen"}</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {bookImage ? (
              <Image source={{ uri: bookImage }} style={styles.bookImage} />
            ) : (
              <Text style={styles.placeholderText}>Subir imagen</Text>
            )}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffbd59" />
                <Text style={styles.loadingText}>Cargando...</Text>
              </View>
            ) : (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>Libro creado</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#efefef',
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
  title_box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
  title: {
    fontSize: 20,
  },
  inputs: {
    marginHorizontal: 30,
    flexGrow: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 25,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 25,
    paddingHorizontal: 15,
    justifyContent: 'center',
    height: 55,
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  picker: {
    height: 55,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    height: 55,
  },
  chooseImageButton: {
    backgroundColor: '#ffbd59',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  chooseImageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: '#dcdcdc',
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#ffbd59',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#ffbd59',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddBook;
