// App.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from './headerH';
import Content from './searchBook';
import Footer from './footerH';
import Menu from './navH';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header toggleMenu={toggleMenu} />
      {isMenuOpen && <Menu closeMenu={closeMenu} />}
      <Content />
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
