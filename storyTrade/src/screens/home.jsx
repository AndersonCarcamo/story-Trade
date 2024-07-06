import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/headerH';

import Footer from '../components/footerH';
import Menu from './navH';
import SearchBook from '../components/searchBook';
import BookDetails from './bookDetails';


const fetchBooks = async () => {
  try {
    const response = await fetch('https://dbstorytrada-b5fcff8487d7.herokuapp.com/books');
    if (response.ok) {
      const books = await response.json();
      return books;
    } else {
      console.error('Failed to fetch books: ', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch books: ', error);
    return [];
  }
};


const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const fetchedBooks = await fetchBooks();
        setBooks(fetchedBooks);
      } catch (error) {
        console.error('Failed to fetch books: ', error);
        Alert.alert('Error', 'Failed to load books.');
      }
    };
    loadBooks();
    const loadFonts = async () => {
        await Font.loadAsync({
            'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf')
        });
        setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
      setIsMenuOpen(false);
  };
  const handleSearch = (text) => {
      setSearch(text);
  };
  const viewDetails = (book) => {
    console.log('book_Info: ', book);
    setSelectedBook(book);
  };
  const goBack = () => {
      setSelectedBook(null);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
        <Header toggleMenu={toggleMenu} />
        {isMenuOpen && <Menu closeMenu={closeMenu} />}
        {selectedBook ? (
            <BookDetails book={selectedBook} goBack={goBack} />
        ) : (
            <SearchBook
            books={books}
            search={search}
            handleSearch={handleSearch}
            viewDetails={viewDetails}
            />
        )}
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Home;