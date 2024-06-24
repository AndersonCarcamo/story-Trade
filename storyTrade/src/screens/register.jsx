import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as Font from 'expo-font';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf')
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

    try {
      const response = await axios.post('poner-API', {
        email,
        nombre,
        username,
        password,
      });

      if (response.status === 200) {
        navigation.navigate('Home', { user: response.data.user });
      } else {
        Alert.alert('Error', 'Error en las credenciales');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo');
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
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre Completo"
              placeholderTextColor="#aaa"
              value={nombre}
              onChangeText={setNombre}
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
    height: 150,
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
});

export default RegisterScreen;
