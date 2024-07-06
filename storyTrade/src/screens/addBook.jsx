import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import UserProfile from './profile';

const AddBook = ({ route, navigation }) => {
  const { userId } = route.params;
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [release_year, setReleaseYear] = useState('');
  const [antiquity, setAntiquity] = useState('');
  const [editorial, setEditorial] = useState('');
  const [categorias, setCategorias] = useState([]);
  const ref = useRef();

  const callExternal = () => {
    if (ref.current) {
      ref.current.fetchUser();
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found');
          return;
        }
        const response = await axios.get('https://dbstorytrada-b5fcff8487d7.herokuapp.com/genres', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Categorias fetched', response.data);
        setCategorias(response.data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  const handleAddBook = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found');
        return;
      }
      const bookData = { 
        title: title, 
        author: author,
        description: description,
        category: category,
        rating: parseFloat(rating),
        release_year: parseInt(release_year, 10),
        antiquity: antiquity,
        editorial: editorial
      };

      console.log('Adding book with data:', bookData);

      const response = await axios.post(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/books`, bookData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      if (response.status === 200) {
        Alert.alert('Libro agregado');
        callExternal();
        navigation.navigate('Profile', { userId, refresh: true });
      } else {
        Alert.alert('Error', 'No se pudo agregar el libro');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.saveArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Profile', { userId })}>
            <Icon name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../assets/logo_blanco.png')} style={styles.header_image} />
          <Text style={styles.headerText}>PERFIL</Text>
        </View>
        <View style={styles.title_box}>
          <Text style={styles.title}>Agregar Libro</Text>
        </View>
        <ScrollView style={styles.inputs}>
          <TextInput
            placeholder="Título del libro"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Autor"
            value={author}
            onChangeText={setAuthor}
            style={styles.input}
          />
          <TextInput
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Selecciona una categoría" value="" />
              {categorias.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
              ))}
            </Picker>
          </View>
          <TextInput
            placeholder="Rating"
            value={rating}
            onChangeText={setRating} 
            style={styles.input}
          />
          <TextInput
            placeholder="Año de salida"
            value={release_year}
            onChangeText={setReleaseYear}
            style={styles.input}
          />
          <TextInput
            placeholder="Antiguedad"
            value={antiquity}
            onChangeText={setAntiquity}
            style={styles.input}
          />
          <TextInput
            placeholder="Editorial"
            value={editorial}
            onChangeText={setEditorial}
            style={styles.input}
          />
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffbd59',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  header_image: {
    height: 100,
    width: 130,
    marginBottom: 10,
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
  title_box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
  title: {
    fontSize: 20,
  },
  inputs: {
    marginHorizontal: 30,
    flexGrow: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 25,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 25,
    paddingHorizontal: 15,
    justifyContent: 'center',
    height: 55,
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  picker: {
    height: 55,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    height: 55,
  },
  addButton: {
    backgroundColor: '#ffbd59',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  media_section: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  upload_Media: {
    borderRadius: 20,
  },
});

export default AddBook;




// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, Button, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/Ionicons';
// import * as ImagePicker from 'expo-image-picker';
// import { Picker } from '@react-native-picker/picker';

// const AddBook = ({ route, navigation }) => {
//   const { userId } = route.params;
//   const [title, setTitle] = useState('');
//   const [author, setAuthor] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');
//   const [rating, setRating] = useState('');
//   const [release_year, setReleaseYear] = useState('');
//   const [antiquity, setAntiquity] = useState('');
//   const [editorial, setEditorial] = useState('');
//   const [categorias, setCategorias] = useState([]);

//   useEffect(() => {
//     const fetchCategorias = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const response = await axios.get('https://dbstorytrada-b5fcff8487d7.herokuapp.com/genres', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setCategorias(response.data);
//       } catch (error) {
//         console.error(error);
//         setCategorias([]);
//       }
//     };
//     fetchCategorias();
//   }, []);

//   const handleAddBook = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const bookData = { 
//         title: title, 
//         author: author,
//         description: description,
//         category: category,
//         rating: parseFloat(rating),
//         release_year: parseInt(release_year, 10),
//         antiquity: antiquity,
//         editorial: editorial
//       };

//       const response = await axios.post(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/users/${userId}/books`, bookData, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (response.status === 201) {
//         Alert.alert('Libro agregado');
//         navigation.navigate('Profile', { userId, refresh: true });
//       } else {
//         Alert.alert('Error', 'No se pudo agregar el libro');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.saveArea}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Profile', { userId })}>
//             <Icon name="arrow-back" size={30} color="#fff" />
//           </TouchableOpacity>
//           <Image source={require('../assets/logo_blanco.png')} style={styles.header_image} />
//           <Text style={styles.headerText}>PERFIL</Text>
//         </View>
//         <View style={styles.title_box}>
//           <Text style={styles.title}>Agregar Libro</Text>
//         </View>
//         <ScrollView style={styles.inputs}>
//           <TextInput
//             placeholder="Título del libro"
//             value={title}
//             onChangeText={setTitle}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Autor"
//             value={author}
//             onChangeText={setAuthor}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Descripción"
//             value={description}
//             onChangeText={setDescription}
//             style={styles.input}
//           />
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={category}
//               onValueChange={(itemValue) => setCategory(itemValue)}
//               style={styles.picker}
//               itemStyle={styles.pickerItem}
//             >
//               <Picker.Item label="Selecciona una categoría" value="" />
//               {categorias.map((cat) => (
//                 <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
//               ))}
//             </Picker>
//           </View>
//           <TextInput
//             placeholder="Rating"
//             value={rating}
//             onChangeText={setRating} 
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Año de salida"
//             value={release_year}
//             onChangeText={setReleaseYear}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Antiguedad"
//             value={antiquity}
//             onChangeText={setAntiquity}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Editorial"
//             value={editorial}
//             onChangeText={setEditorial}
//             style={styles.input}
//           />
//         </ScrollView>
//         <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
//           <Text style={styles.addButtonText}>Agregar</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   saveArea: {
//     flex: 1,
//     backgroundColor: '#efefef',
//   },
//   container: {
//     flex: 1,
//   },
//   header: {
//     backgroundColor: '#ffbd59',
//     height: 250,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//   },
//   header_image: {
//     height: 100,
//     width: 130,
//     marginBottom: 10,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//   },
//   headerText: {
//     fontFamily: 'Typewriter-Bold',
//     fontSize: 30,
//     color: '#fff',
//     textShadowColor: '#949494',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 10,
//   },
//   title_box: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 25,
//   },
//   title: {
//     fontSize: 20,
//   },
//   inputs: {
//     marginHorizontal: 30,
//     flexGrow: 1,
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     marginBottom: 25,
//     paddingHorizontal: 15,
//     height: 55,
//     fontSize: 16,
//   },
//   pickerContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     marginBottom: 25,
//     paddingHorizontal: 15,
//     justifyContent: 'center',
//     height: 55,
//     borderWidth: 1,
//     borderColor: '#dcdcdc',
//   },
//   picker: {
//     height: 55,
//     width: '100%',
//   },
//   pickerItem: {
//     fontSize: 16,
//     height: 55,
//   },
//   addButton: {
//     backgroundColor: '#ffbd59',
//     borderRadius: 25,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     marginVertical: 20,
//     marginHorizontal: 30,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   media_section: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//   },
//   upload_Media: {
//     borderRadius: 20,
//   },
// });

// export default AddBook;
