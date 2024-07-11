import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

import defaultImage from '../assets/default_image.jpg';
import SearchInput from './searchInput';

const groupBooksByCategory = (books) => {
  return books.reduce((acc, book) => {
    const category = book.book_info?.category || 'Unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(book);
    return acc;
  }, {});
};

const fetchBookImages = async (books) => {
  const updatedBooks = await Promise.all(
    books.map(async (book) => {
      const imageFileName = book.book_info?.image;
      if (!imageFileName) {
        book.imageUri = null;
      } else {
        try {
          const fileName = `images/${imageFileName}`;
          const response = await axios.get('https://opqwurrut9.execute-api.us-east-2.amazonaws.com/dev/get', {
            params: {
              fileName: fileName,
            },
          });
          
          if (response.status === 200) {
            const base64Data = response.data;
            const imageUrl = `data:${response.headers['content-type']};base64,${base64Data}`;
            book.imageUri = imageUrl;
          } else {
            book.imageUri = null;
          }
        } catch (error) {
          console.error(`Failed to fetch image for book ${book.book_info ? book.book_info.title : book.title}: `, error);
          book.imageUri = null;
        }
      }
      return book;
    })
  );
  return updatedBooks;
};

const searchBooks = async (query) => {
  try {
    const response = await fetch(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/search?query=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const updatedBooks = await fetchBookImages(books);
        setBooksWithImages(updatedBooks);
      } catch (error) {
        console.error('Failed to load books with images: ', error);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [books]);

  useEffect(() => {
    const performSearch = async () => {
      if (search) {
        try {
          setLoading(true);
          const results = await searchBooks(search);
          const updatedResults = await fetchBookImages(results);
          setFilteredBooks(updatedResults);
        } catch (error) {
          console.error('Failed to perform search: ', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredBooks(booksWithImages);
      }
    };
    performSearch();
  }, [search, booksWithImages]);

  useEffect(() => {
    const grouped = groupBooksByCategory(filteredBooks);
    setGroupedBooks(grouped);
  }, [filteredBooks]);

  return (
    <View style={styles.container}>
      <SearchInput search={search} handleSearch={handleSearch} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando libros...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.keys(groupedBooks).map((category) => (
            <View key={category} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.bookRow}>
                  {groupedBooks[category].map((book) => (
                    <TouchableOpacity key={book.id} onPress={() => viewDetails(book)} style={styles.bookContainer}>
                      {book.imageUri ? (
                        <Image source={{ uri: book.imageUri }} style={styles.bookImage} />
                      ) : (
                        <View style={styles.noImageContainer}>
                          <Text style={styles.noImageText}>{book.book_info.title}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  bookContainer: {
    marginRight: 8,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  noImageContainer: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  noImageText: {
    textAlign: 'center',
    fontSize: 14,
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
