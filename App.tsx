import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

function HomeScreen() {
  const [apiStatus, setApiStatus] = useState('');
  const [apiStatusColor, setApiStatusColor] = useState('gray');
  const [apiStatusIcon, setApiStatusIcon] = useState('help-outline');

  const [busyStatus, setBusyStatus] = useState('');
  const [busyStatusColor, setBusyStatusColor] = useState('gray');
  const [busyStatusIcon, setBusyStatusIcon] = useState('help-outline');

  const [baseURL, setBaseURL] = useState('http://121.209.162.226:8123');
  const [inputURL, setInputURL] = useState(baseURL);

  const checkApiStatus = async (url) => {
    try {
      const response = await axios.get(`${url}/ls`);
      if (response.status === 200) {
        setApiStatus('API is healthy');
        setApiStatusColor('green');
        setApiStatusIcon('check-circle');
      } else {
        setApiStatus('API warning');
        setApiStatusColor('orange');
        setApiStatusIcon('warning');
      }
    } catch (error) {
      setApiStatus('API error');
      setApiStatusColor('red');
      setApiStatusIcon('error');
    }
  };

  const checkBusyStatus = async (url) => {
    try {
      const response = await axios.get(`${url}/ai/busy/status`);
      console.log("======busy status:", response.data);
      if (response.data === 1) {
        setBusyStatus('Busy is running');
        setBusyStatusColor('green');
        setBusyStatusIcon('check-circle');
      } else {
        setBusyStatus('NOT running');
        setBusyStatusColor('red');
        setBusyStatusIcon('cancel');
      }
    } catch (error) {
      setBusyStatus('Error fetching status');
      setBusyStatusColor('red');
      setBusyStatusIcon('error');
    }
  };

  const handleRefresh = () => {
    console.log("======handleRefresh");
    setBaseURL(inputURL); // Update base URL
  };

  useEffect(() => {
    if (baseURL) {
      checkApiStatus(baseURL);
      checkBusyStatus(baseURL);
    }
  }, [baseURL]);

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&q=80',
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>API and Busy Status Monitor</Text>

        {/* Input Box for Base URL */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Base URL"
            value={inputURL}
            onChangeText={(text) => setInputURL(text)}
          />
        </View>

        {/* Refresh Button */}
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>

        {/* API Status Section */}
        <View style={styles.statusSection}>
          <MaterialIcons name={apiStatusIcon} size={50} color={apiStatusColor} />
          <Text style={[styles.statusText, { color: apiStatusColor }]}>{apiStatus}</Text>
        </View>

        {/* Busy Status Section */}
        <View style={styles.statusSection}>
          <MaterialIcons name={busyStatusIcon} size={50} color={busyStatusColor} />
          <Text style={[styles.statusText, { color: busyStatusColor }]}>{busyStatus}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for text readability
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  refreshButton: {
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusSection: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});
