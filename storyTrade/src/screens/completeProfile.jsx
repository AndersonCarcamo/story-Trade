import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

const CompleteProfile = ({ navigation }) => {
    useEffect(() => {
        const loadFonts = async () => {
          await Font.loadAsync({
            'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf')
          });
        };
    
        loadFonts();
      }, []);
    
    return (
      <View style={styles.register}>
        <View style={styles.title}>
            <Text style={styles.title_text}>COMPLETA TU PERFIL</Text>
        </View>
        <View style={styles.inputs}>
            <TextInput
                placeholder="Phone"
                placeholderTextColor="#aaa"
                style={styles.input_text}
            />
            <TextInput
                placeholder="Edad"
                placeholderTextColor="#aaa"
                style={styles.input_text}
            />
            <TextInput
                placeholder="Genero"
                placeholderTextColor="#aaa"
                style={styles.input_text}
            />
        </View>
        <View style={styles.register_button_container}>
            <TouchableOpacity style={styles.register_button}>
                <Text style={styles.register_button_Text}>Crear Cuenta</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    register: {
        flex: 1,
        backgroundColor: '#e8e8e8',
        width: '100%',
        height: '100%',
    },
    title: {
        width: '100%',
        height: '25%',
        backgroundColor: '#ffbd59',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title_text: {
        fontFamily: 'Typewriter-Bold',
        fontSize: 30,
        color: '#fff',
        textShadowColor: '#949494', // color de la sombra
        textShadowOffset: { width: 1, height: 1 }, // offset de la sombra (horizontal y vertical)
        textShadowRadius: 10, // radio de la sombra
    },
    inputs: {
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: 45,
        paddingHorizontal: 40,
        height: '100%',
        //justifyContent: 'center',
        alignItems: 'center',
    },
    input_text: {
        width: '100%',
        height: 60,
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        //marginBottom: 15,
        //marginVertical: 15,
    },
    register_button_container: {
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 40,
        marginBottom: 60,
        bottom: 0,
    },
    register_button: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffbd59',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
      },
      register_button_Text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
})

export default CompleteProfile;
