// App.js
// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

import Header from './headerH';
// import Content from './searchBook';
import Footer from './footerH';
import Menu from './navH';
import SearchBook from './searchBook';
import BookDetails from './bookDetails';

import booksData from '../assets/jsons/books.json';

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [books, setBooks] = useState([]);
    const [fotsLoaded, setFontsLoaded] = useState(false);


    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Typewriter-Bold': require('../assets/Fonts/TrueTypewriter/Typewriter-Bold.ttf')
            });
            setFontsLoaded(True);
        }
        setBooks(booksData);
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
        setSelectedBook(book);
    };

    const goBack = () => {
        setSelectedBook(null);
    };


    return (
        <SafeAreaView style={styles.container}>
            <Header toggleMenu={toggleMenu} />
            {/* {isMenuOpen && <Menu closeMenu={closeMenu} />}
            <Content />
             */}
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
            <Footer />
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
