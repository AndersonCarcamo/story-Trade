// EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import Header from '../components/headerH';
import defaultAvatar from '../assets/default_image.jpg';

const EditProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [avatarName, setAvatarName] = useState('');
  const [avatarType, setAvatarType] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await axios.get(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}`);
        const userData = response.data;
        setUser(userData);
        setName(userData.name);
        setUsername(userData.username);
        setEmail(userData.email);
        setPhone(userData.phone);
        setAge(userData.age);

        // Fetch avatar
        const avatarUri = await fetchUserAvatar(userData.avatar);
        setAvatar(avatarUri);
      }
    };
    loadUserData();
  }, []);

  const fetchUserAvatar = async (avatarName) => {
    try {
      const response = await axios.get(`https://opqwurrut9.execute-api.us-east-2.amazonaws.com/dev/get`, {
        params: {
          fileName: `avatars/${avatarName}`
        }
      });
      if (response.data) {
        return `data:${response.headers['content-type']};base64,${response.data}`;
      } else {
        return defaultAvatar;
      }
    } catch (error) {
      console.error(`Failed to fetch avatar ${avatarName}: `, error);
      return defaultAvatar;
    }
  };

  const handleChooseAvatar = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Selected avatar:', result.uri);
      if (result.uri) {
        setAvatar(result.uri);
        const filename = `${email}_avatar.${result.uri.split('.').pop()}`;
        setAvatarName(filename);
        setAvatarType(result.type || 'image/jpeg');
        console.log('Avatar type:', result.type || 'image/jpeg');
      }
    } else {
      console.log('User cancelled image picker');
    }
  };

  const handleSave = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const updatedData = {
      name,
      username,
      email,
      phone,
      age,
      avatar: avatarName || user.avatar,
    };

    if (avatar) {
      const base64Content = await FileSystem.readAsStringAsync(avatar, { encoding: 'base64' });
      const formData = {
        fileName: avatarName,
        type: 'avatars',
        fileContent: base64Content
      };
      console.log('Uploading avatar with formData:', formData);
      try {
        const response = await axios.post('https://1h2tipwe92.execute-api.us-east-2.amazonaws.com/deploy-st1/upload', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Upload response:', response.data);
      } catch (error) {
        console.error('Failed to upload avatar: ', error);
        Alert.alert('Error', 'No se pudo subir la imagen del perfil');
        return;
      }
    }

    try {
      await axios.put(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}`, updatedData);
      Alert.alert('Perfil actualizado con éxito');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error al actualizar el perfil', error.message);
    }
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View >
      <Header/>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Perfil</Text>
        <TouchableOpacity onPress={handleChooseAvatar}>
          <Image source={avatar ? { uri: avatar } : defaultAvatar} style={styles.avatar} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
        />
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
