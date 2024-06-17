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
        <View style={styles.complete}>
            <View style={styles.title}>
                <Text style={styles.title_text}>COMPLETA TU PERFIL</Text>
            </View>
            <View style={styles.inputs}>
                <TextInput
                    placeholder="Calular"
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
            <View style={styles.confirm_button_container}>
                <TouchableOpacity style={styles.confirm_button}>
                    <Text style={styles.confirm_button_Text}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    complete: {
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
        textShadowColor: '#949494',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
    },
    inputs: {
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: 45,
        paddingHorizontal: 40,
        paddingBottom: 200,
        alignItems: 'center',
        height: '100%',
    },
    input_text: {
        width: '100%',
        height: 60,
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 20,
    },
    confirm_button_container: {
        width: '100%',
        paddingHorizontal: 40,
        marginBottom: 60,
    },
    confirm_button: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffbd59',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    confirm_button_Text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default CompleteProfile;
