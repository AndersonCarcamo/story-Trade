import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import defaultAvatar from '../assets/default_image.jpg';
import yapeLogo from '../assets/yape_logo.png';
import visaLogo from '../assets/visa_logo.jpg';

const PaymentOptions = ({ navigation, route  }) => {
  const { chatId, bookId } = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const handlePaymentOption = (option) => {
    navigation.navigate('Chat', { chatId, bookId, paymentOption: option });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image source={defaultAvatar} style={styles.avatar} />
          <Text style={styles.headerTitle}>Jose Sáenz</Text>
        </View>
        <View style={styles.menuButton}></View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>¿Listos para intercambiar?</Text>
        <Text style={styles.subtitle}>Escoge un método de pago</Text>
        <View style={styles.paymentOptions}>
          <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOption('Yape')}>
            <Image source={yapeLogo} style={styles.paymentLogo} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOption('Visa')}>
            <Image source={visaLogo} style={styles.paymentLogo} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" size={24} color="#FFA500" />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={24} color="#666" />
          <Text style={styles.footerButtonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AddBook')}>
          <FontAwesome name="plus-circle" size={24} color="#666" />
          <Text style={styles.footerButtonText}>Add Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AddGenre')}>
          <FontAwesome name="tags" size={24} color="#666" />
          <Text style={styles.footerButtonText}>Add Genre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      backgroundColor: '#FFBD59',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 20,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    backButton: {
      padding: 8,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    menuButton: {
      width: 32,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginVertical: 10,
      color: '#666',
    },
    paymentOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    paymentOption: {
      alignItems: 'center',
      marginHorizontal: 20,
    },
    paymentLogo: {
      width: 100,
      height: 100,
    },
    footer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      backgroundColor: '#f8f8f8',
      justifyContent: 'space-around',
      paddingVertical: 10,
    },
    footerButton: {
      alignItems: 'center',
    },
    footerButtonText: {
      fontSize: 12,
      color: '#666',
    },
  });
  

export default PaymentOptions;
