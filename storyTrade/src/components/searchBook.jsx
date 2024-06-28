import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

import defaultImage from '../assets/default_image.jpg'
import SearchInput from './searchInput';

const groupBooksByCategory = (books) => {
  console.log('Grouping books by category:', books);
  const groupedBooks = books.reduce((acc, book) => {
    const category = book.book_info && book.book_info.category ? book.book_info.category : (book.category ? book.category : 'Unknown');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(book);
    return acc;
  }, {});

  console.log('Result of groupBooksByCategory function:', groupedBooks);
  return groupedBooks;
};


// conexion con la api de media para obtener la imagen del libro
const fetchBookImages = async (books) => {
  const updatedBooks = await Promise.all(
    books.map(async (book) => {
      const imageFileName = book.book_info ? book.book_info.image : book.image;
      if (!imageFileName) {
        book.imageUri = defaultImage;
      } else {
        try {
          const imageUrl = `http://localhost:3000/get?mediaType=images&fileName=${imageFileName}`;
          console.log(`Fetching image from: ${imageUrl}`); // Debugging line
          const response = await fetch(imageUrl);
          if (response.ok) {
            book.imageUri = response.url;
          } else {
            book.imageUri = defaultImage;
          }
        } catch (error) {
          console.error(`Failed to fetch image for book ${book.book_info ? book.book_info.title : book.title}: `, error);
          book.imageUri = defaultImage;
        }
      }
      return book;
    })
  );
  return updatedBooks;
};

const searchBooks = async (query) => {
  try {
    const response = await fetch(`http://localhost:5000/search?query=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Search results from API:', data);
    return data;
  } catch (error) {
    console.error('Failed to search books: ', error);
    throw error;
  }
};

const SearchBook = ({ books, search, handleSearch, viewDetails }) => {
  const [booksWithImages, setBooksWithImages] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [groupedBooks, setGroupedBooks] = useState({});

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const updatedBooks = await fetchBookImages(books);
        setBooksWithImages(updatedBooks);
        console.log('Loaded books with images:', updatedBooks);
      } catch (error) {
        console.error('Failed to load books with images: ', error);
      }
    };
    loadBooks();
  }, [books]);

  useEffect(() => {
    const performSearch = async () => {
      if (search) {
        try {
          const results = await searchBooks(search);
          console.log('Search results:', results);
          const updatedResults = await fetchBookImages(results);
          console.log('Updated results with images:', updatedResults);
          setFilteredBooks(updatedResults);
          console.log('datos guardado en filteredbook', filteredBooks);
        } catch (error) {
          console.error('Failed to perform search: ', error);
          // Alert.alert('Error', 'Failed to perform search.');
        }
      } else {
        setFilteredBooks(booksWithImages);
        console.log('Using books with images for display:', booksWithImages);
      }
    };
    performSearch();
  }, [search, booksWithImages]);

  useEffect(() => {
    const grouped = groupBooksByCategory(filteredBooks);
    setGroupedBooks(grouped);
    console.log('Grouped books:', grouped);
  }, [filteredBooks]);

  // console.log('datos filtrados sin busqueda', filteredBooks);
  // const groupedBooks = groupBooksByCategory(filteredBooks);
  // console.log('Grouped books final:', groupedBooks);

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
                  <Image source={{ uri: book.imageUri || defaultImage }} style={styles.bookImage} />
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