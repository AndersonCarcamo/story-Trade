// App.js
// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';

import Header from '../components/headerH';
// import Content from './searchBook';
import Footer from '../components/footerH';
import Menu from './navH';
import SearchBook from '../components/searchBook';
import BookDetails from './bookDetails';

// import booksData from '../assets/jsons/books.json';

const fetchBooks = async () => {
  try {
    const response = await fetch('http://localhost:5000/books');
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
    // let normalizedBook = book;

    // if (!book.book_info) {
    //   console.log('entra aqui')
    //   normalizedBook = {
    //     book_info: {
    //       author: book.author,
    //       category: book.category,
    //       description: book.description,
    //       id: book.id,
    //       image: book.image,
    //       rating: book.rating,
    //       release_year: book.release_year,
    //       title: book.title
    //     },
    //     antiquity: book.antiquity,
    //     book_info_id: book.id,
    //     editorial: book.editorial,
    //     id: book.id,
    //     imageUri: book.imageUri,
    //     user_id: book.user_id,
    //     video: book.video
    //   };
    // }
    // console.log('book_Info: ', normalizedBook);
    // setSelectedBook(normalizedBook);
    console.log('book_Info: ', book);
    setSelectedBook(book);
  };

  const goBack = () => {
      setSelectedBook(null);
  };

  if (!fontsLoaded) {
    return null; // or some kind of loading spinner
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
        {/* <Footer /> */}
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