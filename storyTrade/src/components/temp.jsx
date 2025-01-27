import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, Button, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Font from 'expo-font';
import * as ImagePicker from 'expo-image-picker';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const [avatarName, setAvatarName] = useState('');

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

      if (!pickerResult.canceled) {
        const filename = `${email}_avatar`;
        setAvatarName(filename);
        setImageSource({ uri: pickerResult.assets[0].uri });
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const uploadImage = async () => {
    if (!imageSource) {
      return null;
    }

    try {
      const response = await fetch(imageSource.uri);
      const blob = await response.blob();
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64Content = reader.result.split(',')[1];
          const formData = {
            fileName: avatarName,
            type: 'avatars',
            fileContent: base64Content,
          };
          console.log(formData);
          axios.post('https://1h2tipwe92.execute-api.us-east-2.amazonaws.com/deploy-st1/upload', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((res) => {
            resolve(res.data.imageUrl); // Suponiendo que la API devuelve la URL de la imagen subida
          })
          .catch((err) => {
            console.error('Image upload error:', err);
            Alert.alert('Error', 'Failed to upload image.');
            reject(err);
          });
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          Alert.alert('Error', 'Failed to read file.');
          reject(error);
        };

        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload image.');
      throw error; // Lanza el error para manejarlo en handleRegister
    }
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const handleRegister = async () => {
    if (password !== passwordConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    let profileImageUrl = null;
    if (imageSource) {
      try {
        profileImageUrl = await uploadImage();
      } catch (error) {
        console.error('Error uploading image during registration:', error);
        return; // Sale de la función si hay un error al subir la imagen
      }
    }

    try {
      const response = await axios.post(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users`, {
        email,
        name,
        username,
        password,
        avatar: profileImageUrl, // Agregar la URL de la imagen al registro
      });

      if (response.status === 201) {
        // Añadir un pequeño retardo antes de intentar iniciar sesión
        setTimeout(() => {
          handleLogin();
        }, 500); // Retardo de 500ms
      } else {
        Alert.alert('Error', 'Error en las credenciales');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo');
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Intentando iniciar sesión con:', email, password);
      const response = await axios.post('https://dbstorytrada-b5fcff8487d7.herokuapp.com/login', {
        email,
        password,
      });
      console.log('respondio');
      if (response.status === 200) {
        const user = response.data;
        await AsyncStorage.setItem('userToken', user.id.toString());
        await AsyncStorage.setItem('userId', user.id.toString());
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Error en las credenciales');
      }
    } catch (error) {
      console.log('No respondio');
      console.error(error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    }
  };

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Cargando...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
            <Icon name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../assets/logo_blanco.png')} style={styles.header_image}/>
          <Text style={styles.headerText}>CREA TU CUENTA</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre Completo"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <Icon name="eye-off" size={20} color="#aaa" />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Repetir Contraseña"
                placeholderTextColor="#aaa"
                secureTextEntry={true}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                autoCapitalize="none"
              />
              <Icon name="eye-off" size={20} color="#aaa" />
            </View>
            <View style={styles.media_section}>
              <Button title="Seleccionar Imagen" onPress={selectImage} style={styles.upload_Media} />
              {imageSource && (
                <Image
                  source={{ uri: imageSource.uri }}
                  style={styles.imagePreview}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ffbd59',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
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
  header_image: {
    height: 100,
    width: 130,
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    margin: 20,
    marginTop: 30,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  inputPassword: {
    flex: 1,
    height: 55,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ffbd59',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 30,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
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
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default RegisterScreen;
