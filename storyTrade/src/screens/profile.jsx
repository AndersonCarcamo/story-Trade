import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const UserProfile = ({ route, navigation }) => {
  const { userId } = route.params; // Obtenemos el ID del usuario desde la ruta
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`poner-API/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);

        // Comprobamos si es el perfil del propio usuario
        const loggedInUserId = await AsyncStorage.getItem('userId');
        setIsOwnProfile(userId === loggedInUserId);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar el perfil');
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>

      {isOwnProfile && (
        <View>
          <Text>Géneros de interés:</Text>
          <FlatList
            data={user.genres}
            renderItem={({ item }) => <Text>{item}</Text>}
          />
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddGenre')}>
            <Text style={styles.addButtonText}>Agregar género</Text>
          </TouchableOpacity>

          <Text>Lista de libros:</Text>
          <FlatList
            data={user.books}
            renderItem={({ item }) => <Text>{item.title}</Text>}
          />
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddBook')}>
            <Text style={styles.addButtonText}>Agregar libro</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#ffbd59',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserProfile;
