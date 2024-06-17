import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
//import login_styles from '../styles/login_style';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={login_styles.container}>
      <Image source={require('../assets/logo.png')} style={login_styles.logo} />
      <Text style={login_styles.subtitle}>¡Compra, vende e intercambia!</Text>
      <View style={login_styles.yellowSquare} />
      <View style={login_styles.square}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={login_styles.inputEmail}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={login_styles.inputPassword}
        />
        <View style={login_styles.rememberForgotContainer}>
          <TouchableOpacity>
            <Text style={login_styles.rememberText}>Recuérdame</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={login_styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={login_styles.loginButton}>
          <Text style={login_styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={login_styles.googleButton}>
          <Text style={login_styles.googleButtonText}>Continua con Google</Text>
        </TouchableOpacity>
        <View style={login_styles.crearCuenta}>
          <TouchableOpacity>
            <Text style={login_styles.signupText}>No tienes cuenta? <Text style={login_styles.signupLink}>Crea tu cuenta</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const login_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    marginBottom: 5,
    height: 250,
    width: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
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
    width: '100%',
    marginLeft: 20,
    marginRight: 20,
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
