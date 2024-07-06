import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import defaultAvatar from '../assets/default_image.jpg';
import yapeLogo from '../assets/yape_logo.png';
import visaLogo from '../assets/visa_logo.jpg';

const PaymentOptions = ({ navigation, route }) => {
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
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  menuButton: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  paymentOption: {
    alignItems: 'center',
    padding: 16,
  },
  paymentLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});

export default PaymentOptions;
