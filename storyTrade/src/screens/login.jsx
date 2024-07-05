import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      
      console.log('Intentando iniciar sesión con:', email, password);
      
      const response = await axios.post('http://127.0.0.1:5000/login', {
        email,
        password,
      });
      console.log('Respuesta del servidor:', response.data);
      if (response.status === 200){
        const user = response.data;
        await AsyncStorage.setItem('userToken', user.id.toString());
        await AsyncStorage.setItem('userId', user.id.toString());
        // navigation.navigate('Profile', { userId: user.id });
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Error en las credenciales');
      }
    } catch (error) {
      console.log('Error al intentar iniciar sesión:', error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    }
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={login_styles.container}
    >
      <ScrollView contentContainerStyle={login_styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Image source={require('../assets/logo.png')} style={login_styles.logo} />
        <View style={login_styles.yellowSquare} />
        <View style={login_styles.square}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            style={login_styles.inputEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={login_styles.inputPassword}
            autoCapitalize='none'
          />
          <View style={login_styles.rememberForgotContainer}>
            <TouchableOpacity>
              <Text style={login_styles.rememberText}>Recuérdame</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={login_styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={login_styles.loginButton} onPress={handleLogin}>
            <Text style={login_styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={login_styles.googleButton}>
            <Text style={login_styles.googleButtonText}>Continua con Google</Text>
          </TouchableOpacity>
          <View style={login_styles.crearCuenta}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={login_styles.signupText}>¿No tienes cuenta? <Text style={login_styles.signupLink}>Crea tu cuenta</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const login_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    marginBottom: 5,
    height: 250,
    width: 400,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 30,
  },
  yellowSquare: {
    position: 'absolute',
    backgroundColor: '#ffbd59',
    width: '100%',
    height: '50%',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputEmail: {
    width: '80%',
    height: 50,
    backgroundColor: '#e6e1e1',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    marginTop: 30,
  },
  inputPassword: {
    width: '80%',
    height: 50,
    backgroundColor: '#e6e1e1',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginTop: 10,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  rememberText: {
    color: '#3685cd',
  },
  forgotText: {
    color: '#3685cd',
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#ffbd59',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#000',
    borderWidth: 1,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#aaa',
  },
  signupLink: {
    color: '#3685cd',
  },
  square: {
    width: '90%',
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 20,
  },
  crearCuenta: {
    marginBottom: 20,
  },
});

export default LoginScreen;
