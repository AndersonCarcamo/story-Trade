import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as Font from 'expo-font';

const CompleteProfile = ({ navigation }) => {
  
  const [celular, setCelular] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf')
      });
    };

    loadFonts();
  }, []);

  const handleCompleteProfile = async () => {
    try {
      const response = await axios.post('poner-API', {
        celular,
        edad,
        genero,
      });
      if (response.status === 200){
        Alert.alert('Se completo el registro');
      } else {
        Alert.alert('Error', 'Error para validar la informacion');
      }
    } catch (error) {
        console.error(error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Register')}>
            <Icon name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>COMPLETA TU PERFIL</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Calular"
              placeholderTextColor="#aaa"
              value={celular}
              onChangeText={setCelular}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Edad"
              placeholderTextColor="#aaa"
              value={edad}
              onChangeText={setEdad}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Genero"
              placeholderTextColor="#aaa"
              value={genero}
              onChangeText={setGenero}
              autoCapitalize="none"
            />
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleCompleteProfile}>
          <Text style={styles.buttonText}>Confirmar</Text>
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
export default CompleteProfile;
