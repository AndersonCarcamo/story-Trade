import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const Settings = () => {
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState(null);
  const [customFileName, setCustomFileName] = useState('');
  const [uploadPath, setUploadPath] = useState('images');

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  const uploadFile = async (mediaType) => {
    const options = {
      mediaType: mediaType === 'photo' ? 'photo' : 'video',
      includeBase64: true,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const file = response.assets[0];
        const fileExtension = file.type ? file.type.split('/')[1] : 'jpg';
        const fileName = customFileName ? `${uploadPath}/${customFileName}.${fileExtension}` : `${uploadPath}/${file.fileName}`;

        try {
          const url = `https://opqwurrut9.execute-api.us-east-2.amazonaws.com/dev/upload`;
          const uploadResponse = await axios.post(url, {
            fileName: fileName,
            fileContent: file.base64,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          Alert.alert('Éxito', `Archivo subido con éxito: ${uploadResponse.data.message}`);
        } catch (error) {
          console.log('Error al subir el archivo:', error);
          Alert.alert('Error', 'No se pudo subir el archivo');
        }
      }
    });
  };


  const fetchImage = async () => {
    try {
      console.log('entra a fetchear');
      const response = await axios.get('https://opqwurrut9.execute-api.us-east-2.amazonaws.com/dev/get', {
        params: {
          fileName: 'images/book12.jpg',
        },
      });
      
      console.log(response);
      if (response.data) {
        const imageUrl = `data:${response.headers['content-type']};base64,${response.data}`;
        setImageUrl(imageUrl);
        Alert.alert('Éxito', 'Imagen obtenida con éxito');
      } else {
        Alert.alert('Error', 'No se pudo obtener la imagen');
      }
    } catch (error) {
      console.error('Error al obtener la URL de la imagen:', error);
      Alert.alert('Error', 'No se pudo obtener la URL de la imagen');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter custom file name"
        value={customFileName}
        onChangeText={setCustomFileName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter upload path (images, videos, avatars)"
        value={uploadPath}
        onChangeText={setUploadPath}
      />
      <Button title="Edit Profile" onPress={() => navigation.navigate('Complete Profile')} />
      <Button title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
      <Button title="Logout" onPress={handleLogout} color="red" />
      <Button title="Subir Imagen" onPress={() => uploadFile('photo')} />
      <Button title="Subir Video" onPress={() => uploadFile('video')} />
      <Button title="Obtener Imagen" onPress={fetchImage} />
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default Settings;
