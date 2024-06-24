import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SearchInput from './SearchInput';

const BookList = ({ books, search, handleSearch, viewDetails }) => {
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SearchInput search={search} handleSearch={handleSearch} />
      <ScrollView>
        {filteredBooks.map((book) => (
          <View key={book.id} style={styles.bookContainer}>
            <TouchableOpacity onPress={() => viewDetails(book)}>
              <Image source={{ uri: book.image }} style={styles.bookImage} />
            </TouchableOpacity>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
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
  bookContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  bookImage: {
    width: 80,
    height: 120,
    marginBottom: 8,
  },
  bookTitle: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#555',
  },
});

export default BookList;
