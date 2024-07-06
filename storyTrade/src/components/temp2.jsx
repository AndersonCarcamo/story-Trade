import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

import defaultImage from '../assets/default_image.jpg';
import SearchInput from './searchInput';

const groupBooksByCategory = (books) => {
  const groupedBooks = books.reduce((acc, book) => {
    const category = book.book_info && book.book_info.category ? book.book_info.category : 'Unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(book);
    return acc;
  }, {});
  return groupedBooks;
};

const fetchBookImages = async (books) => {
  const updatedBooks = await Promise.all(
    books.map(async (book) => {
      const imageFileName = book.book_info?.image;
      if (!imageFileName) {
        book.imageUri = null; // No image case
      } else {
        try {
          const fileName = `images/${imageFileName}`;
          const response = await axios.get('https://opqwurrut9.execute-api.us-east-2.amazonaws.com/dev/get', {
            params: { fileName: fileName },
          });

          if (response.status === 200) {
            const base64Data = response.data;
            const imageUrl = `data:${response.headers['content-type']};base64,${base64Data}`;
            book.imageUri = imageUrl;
          } else {
            book.imageUri = null; // No image case
          }
        } catch (error) {
          console.error(`Failed to fetch image for book ${book.book_info ? book.book_info.title : book.title}: `, error);
          book.imageUri = null; // No image case
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

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const updatedBooks = await fetchBookImages(books);
        setBooksWithImages(updatedBooks);
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
          const updatedResults = await fetchBookImages(results);
          setFilteredBooks(updatedResults);
        } catch (error) {
          console.error('Failed to perform search: ', error);
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
      <ScrollView>
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
});

export default SearchBook;
