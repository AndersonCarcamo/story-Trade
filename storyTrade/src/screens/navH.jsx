// Menu.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Menu = ({ closeMenu }) => {
  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={closeMenu}>
        <Text style={styles.closeButton}>X</Text>
      </TouchableOpacity>
      <Text style={styles.menuItem}>Home</Text>
      <Text style={styles.menuItem}>Categories</Text>
      <Text style={styles.menuItem}>Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    padding: 16,
    zIndex: 1000,
  },
  closeButton: {
    alignSelf: 'flex-end',
    fontSize: 24,
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default Menu;