import React from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

import SearchInput from './searchInput';

const images = {
  "book1.jpg": require('../assets/media/terror1.jpg'),
  "book2.jpeg": require('../assets/media/terror2.jpeg'),
  "terror1.jpg": require('../assets/media/terror1.jpg'),
  "terror2.jpeg": require('../assets/media/terror2.jpeg'),
  "avatar1.png": require('../assets/media/avatar1.png'),
  "avatar2.png": require('../assets/media/avatar1.png'),
  "avatar3.png": require('../assets/media/avatar1.png'),
  "avatar4.png": require('../assets/media/avatar1.png'),
  "avatar5.png": require('../assets/media/avatar1.png'),
  "avatar6.png": require('../assets/media/avatar1.png')
};

const groupBooksByCategory = (books) => {
  return books.reduce((acc, book) => {
    const category = book.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(book);
    return acc;
  }, {});
};

const SearchBook = ({ books, search, handleSearch, viewDetails }) => {
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.category.toLowerCase().includes(search.toLowerCase())
  );
  // para la agrupacion por categoria
  const groupedBooks = groupBooksByCategory(filteredBooks);

  return (
    <View style={styles.container}>
      <SearchInput search={search} handleSearch={handleSearch} />
      <ScrollView>
        {Object.keys(groupedBooks).map((category) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.bookRow}>
              {groupedBooks[category].map((book) => (
                <TouchableOpacity key={book.id} onPress={() => viewDetails(book)}>
                  <Image source={images[book.image]} style={styles.bookImage} />
                </TouchableOpacity>
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
  bookTitle: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 14,
    color: '#555',
  },
});

export default SearchBook;