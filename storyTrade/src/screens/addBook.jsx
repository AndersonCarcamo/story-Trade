import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, Button, ScrollView, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; // Importar Picker desde la nueva biblioteca

const AddBook = ({ route, navigation }) => {
  const { userId } = route.params; // Recibir userId
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [descripcion, setDescipcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [rating, setRating] = useState('');
  const [salida, setSalida] = useState('');
  const [antiguedad, setAntiguedad] = useState('');
  const [editorial, setEditorial] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [videoSource, setVideoSource] = useState(null);
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:5000/genres');
        setCategorias(response.data.genres);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategorias();
  }, []);

  const handleAddBook = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`http://10.0.2.2:5000/users/${userId}/books`, { 
        title, 
        author,
        descripcion,
        categoria,
        rating,
        salida,
        antiguedad,
        editorial
      }, {
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

  const selectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.cancelled) {
        setImageSource({ uri: pickerResult.uri });
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageSource.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await axios.post('https://tu-api.com/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Image uploaded successfully!');
      console.log('Image upload response:', response.data);
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  const selectVideo = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.cancelled) {
        setVideoSource({ uri: pickerResult.uri });
      }
    } catch (error) {
      console.error('Video picker error:', error);
    }
  };

  const uploadVideo = async () => {
    try {
      const formData = new FormData();
      formData.append('video', {
        uri: videoSource.uri,
        type: 'video/mp4',
        name: 'video.mp4',
      });

      const response = await axios.post('https://tu-api.com/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Video uploaded successfully!');
      console.log('Video upload response:', response.data);
    } catch (error) {
      console.error('Video upload error:', error);
      Alert.alert('Error', 'Failed to upload video.');
    }
  };

  return (
    <SafeAreaView style={styles.saveArea}>
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
            value={descripcion}
            onChangeText={setDescipcion}
            style={styles.input}
          />
          <View style={styles.input}>
            <Picker
              selectedValue={categoria}
              onValueChange={(itemValue) => setCategoria(itemValue)}
            >
              {categorias.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
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
            value={salida}
            onChangeText={setSalida}
            style={styles.input}
          />
          <TextInput
            placeholder="Antiguedad"
            value={antiguedad}
            onChangeText={setAntiguedad}
            style={styles.input}
          />
          <TextInput
            placeholder="Editorial"
            value={editorial}
            onChangeText={setEditorial}
            style={styles.input}
          />
          <View style={styles.media_section}>
            <Button title="Select Image" onPress={selectImage} style={styles.upload_Media} />
            <Button title="Select Video" onPress={selectVideo} style={styles.upload_Media} />
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  saveArea: {
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
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 25,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
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
  media_section: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  upload_Media: {
    borderRadius: 20,
  },
});

export default AddBook;
