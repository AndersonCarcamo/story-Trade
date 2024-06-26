import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const UserProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`http://10.0.2.2:5000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Se leyo el perfil');
        setUser(response.data);

        // Comprobamos si es el perfil del propio usuario
        const loggedInUserId = await AsyncStorage.getItem('userId');
        setIsOwnProfile(userId == loggedInUserId);
        console.log();
        console.log(userId);
        console.log(loggedInUserId);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar el perfil');
      }
    };

    fetchUser();
    console.log('Se corrio el codigo anterior');
  }, [userId]);

  if (!user) {
    return <Text>Cargando...</Text>;
  }
  console.log('se leyoo la pantalla');
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {console.log('aqui si funciona')}
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
