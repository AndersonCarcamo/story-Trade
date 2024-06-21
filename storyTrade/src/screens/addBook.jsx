import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Font from 'expo-font';

const AddBook = ({ navigation }) => {
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
            <Text style={styles.title_text}>CREA TU CUENTA</Text>
        </View>
        <View style={styles.add_book_text}>
            <Text style={styles.add_book_text_text}>Agrega tu libro:</Text>
        </View>
        <View style={styles.inputs}>
            <TextInput
                placeholder="Title"
                placeholderTextColor="#aaa"
                style={styles.input_text}
            />
            <TextInput
                placeholder="Author"
                placeholderTextColor="#aaa"
                style={styles.input_text}
            />
            <TextInput
                placeholder="Editorial"
                placeholderTextColor="#aaa"
                style={styles.input_text}
            />
            <TextInput
                placeholder="Antiguedad"
                placeholderTextColor="#aaa"
                style={styles.input_text}
            />
        </View>
        <View style={styles.add_video_text}>
            <Text style={styles.add_video_text_text}>Adjunta un video del estado de tu libro:</Text>
        </View>
        <View style={styles.register_button_container}>
            <TouchableOpacity style={styles.register_button}>
                <Text style={styles.register_button_Text}>Submit</Text>
            </TouchableOpacity>
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
        textShadowColor: '#949494',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
    },
    add_book_text:{
        marginTop: 20,
        width: '100%',
        height: 30,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    add_book_text_text:{
        fontSize: 20,
    },
    inputs: {
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: 30,
        paddingHorizontal: 40,
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
    add_video_text: {
        width: '100%',
        height: 30,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    add_video_text_text: {
        fontSize: 20,
    },
    register_button_container: {
        width: '100%',
        paddingHorizontal: 40,
        marginBottom: 60,
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

export default AddBook;