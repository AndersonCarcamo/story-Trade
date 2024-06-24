import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const categories = [
  {
    title: 'Romance',
    books: [
      { id: 1, title: 'Book 1', image: require('../assets/terror1.jpg') },
      { id: 2, title: 'Book 2', image: require('../assets/terror2.jpeg') },
    ],
  },
  {
    title: 'Terror',
    books: [
      { id: 3, title: 'Book 3', image: require('../assets/terror1.jpg') },
      { id: 4, title: 'Book 4', image: require('../assets/terror2.jpeg') },
    ],
  },
  {
    title: 'Fantasia',
    books: [
      { id: 5, title: 'Book 5', image: require('../assets/terror1.jpg') },
      { id: 6, title: 'Book 6', image: require('../assets/terror2.jpeg') },
    ],
  },
];

const SearchBook = () => {
    const [search, setSearch] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(categories);
  
    const handleSearch = (text) => {
        setSearch(text);
        if (text === '') {
          setFilteredCategories(categories);
        } else {
          const filtered = categories.map(category => {
            const filteredBooks = category.books.filter(book =>
              book.title.toLowerCase().includes(text.toLowerCase()) ||
              category.title.toLowerCase().includes(text.toLowerCase())
            );
            return { ...category, books: filteredBooks };
          }).filter(category => category.books.length > 0);
          setFilteredCategories(filtered);
        }
    };

    return (
        <View style={styles.container}>
          <TextInput
            style={styles.searchInput}
            placeholder="Busca libros"
            value={search}
            onChangeText={handleSearch}
          />
          <ScrollView>
            {filteredCategories.map((category) => (
              <View key={category.title} style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <View style={styles.bookRow}>
                  {category.books.map((book) => (
                    <Image key={book.id} source={book.image} style={styles.bookImage} />
                  ))}
                  <TouchableOpacity style={styles.addBookButton}>
                    <FontAwesome name="plus" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        searchInput: {
            fontFamily: 'Typewriter-Bold',
            backgroundColor: '#F0F0F0',
            margin: 16,
            padding: 10,
            borderRadius: 8,
            fontSize: 16,
        },
        categoryContainer: {
            marginBottom: 16,
        },
        categoryTitle: {
            fontFamily: 'Typewriter-Bold',
            fontSize: 18,
            fontWeight: 'bold',
            marginHorizontal: 16,
            marginVertical: 8,
        },
        bookRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 16,
        },
        bookImage: {
            width: 80,
            height: 120,
            marginRight: 10,
        },
        addBookButton: {
            width: 80,
            height: 120,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F0F0F0',
            borderRadius: 8,
        },
      });
export default SearchBook;
