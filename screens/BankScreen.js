import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function BanksScreen() {
  const [amount, setAmount] = useState('');

  const handleTransfer = (recipient) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }
    
    Alert.alert(
      'Confirm Transfer',
      `Are you sure you want to transfer $${amount} to ${recipient}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', `Successfully transferred $${amount} to ${recipient}`);
            setAmount('');
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&q=80',
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Bank Transfer</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.transferButton}
            onPress={() => handleTransfer('Wenhui')}
          >
            <MaterialIcons name="account-circle" size={40} color="#fff" />
            <Text style={styles.buttonText}>Wenhui</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.transferButton, styles.buttonSecondary]}
            onPress={() => handleTransfer('Lei')}
          >
            <MaterialIcons name="account-circle" size={40} color="#fff" />
            <Text style={styles.buttonText}>Lei</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={24} color="#007BFF" />
          <Text style={styles.infoText}>
            Select a recipient and enter the amount to make a transfer
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  transferButton: {
    backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonSecondary: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});

export default BanksScreen;