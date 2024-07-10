import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Header = ({ toggleMenu }) => {
  return (
    <View style={styles.header}>
      <View style={styles.centerContainer}>
        <Image source={require('../assets/logo_blanco.png')} style={styles.logo} />
        <Text style={styles.title}>STORY TRADE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFBD59',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  centerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  title: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  menuIcon: {
    position: 'absolute',
    right: 16,
  },
});

export default Header;