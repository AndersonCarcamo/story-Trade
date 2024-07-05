import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import Header from '../components/headerH';

const Settings = ({ navigate }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      const id = await AsyncStorage.getItem('userToken');
      setUserEmail(email);
      setUserId(id);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userEmail');
    navigation.replace('Login');
  };

  const handleChangePassword = async () => {
    setErrorMessage(''); // Clear previous error messages
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Las contraseñas nuevas no coinciden');
      return;
    }

    try {
      console.log(userEmail)
      console.log(currentPassword)
      const response = await axios.post('https://dbstorytrada-b5fcff8487d7.herokuapp.com/login', {
        email: userEmail,
        password: currentPassword,
      });

      if (response.status === 200) {
        await axios.put(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}`, {
          password: newPassword,
        });
        Alert.alert('Success', 'Password changed successfully');
        handleModalClose();
      } else {
        setErrorMessage('Contraseña actual incorrecta');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Contraseña actual incorrecta');
      } else {
        console.error(error);
        setErrorMessage('Ocurrió un error al cambiar la contraseña');
      }
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorMessage('');
  };

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Complete Profile')}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Cambiar Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña Actual"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          {errorMessage === 'Contraseña actual incorrecta' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Nueva Contraseña"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar Nueva Contraseña"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          {errorMessage && errorMessage !== 'Contraseña actual incorrecta' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
            <Text style={styles.modalButtonText}>Cambiar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.closeButton]}
            onPress={handleModalClose}
          >
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E1', // Background color matching the image's style
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#FFAF65', // Button color matching the image's style
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B', // Red color for logout button
  },
  logoutButtonText: {
    color: '#FFFFFF',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 300, // Ensures minimum height to prevent shifting
    justifyContent: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#FFAF65',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: '60%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: '#FF6B6B',
  },
});

export default Settings;
