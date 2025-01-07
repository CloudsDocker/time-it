import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import axios from 'axios';

// Import your screens
import DashboardScreen from './screens/DashboardScreen';
import TimerScreen from './screens/TimerScreen';
import JobEntryScreen from './screens/JobEntryScreen';
import StandupScreen from './screens/StandupScreen';
import BanksScreen from './screens/BankScreen';
import { Provider } from 'react-redux'; // Import Provider
import store from './store'; // Import the Redux store

const Tab = createBottomTabNavigator();

// Move your existing HomeScreen content to a separate component
function StatusScreen() {
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
    setBaseURL(inputURL);
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Base URL"
            value={inputURL}
            onChangeText={(text) => setInputURL(text)}
          />
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>

        <View style={styles.statusSection}>
          <MaterialIcons name={apiStatusIcon} size={50} color={apiStatusColor} />
          <Text style={[styles.statusText, { color: apiStatusColor }]}>{apiStatus}</Text>
        </View>

        <View style={styles.statusSection}>
          <MaterialIcons name={busyStatusIcon} size={50} color={busyStatusColor} />
          <Text style={[styles.statusText, { color: busyStatusColor }]}>{busyStatus}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

// // Create a placeholder Banks screen
// function BanksScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Banks</Text>
//     </View>
//   );
// }

// Main App component with navigation
// function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ focused, color, size }) => {
//             let iconName;

//             switch (route.name) {
//               case 'Status':
//                 iconName = 'dashboard';
//                 break;
//               case 'Dashboard':
//                 iconName = 'analytics';
//                 break;
//               case 'Timer':
//                 iconName = 'timer';
//                 break;
//               case 'Job Entry':
//                 iconName = 'work';
//                 break;
//               case 'Standup':
//                 iconName = 'groups';
//                 break;
//               case 'Banks':
//                 iconName = 'account-balance';
//                 break;
//               default:
//                 iconName = 'help-outline';
//             }

//             return <MaterialIcons name={iconName} size={size} color={color} />;
//           },
//           tabBarActiveTintColor: '#007BFF',
//           tabBarInactiveTintColor: 'gray',
//         })}
//       >
//         <Tab.Screen name="Status" component={StatusScreen} />
//         <Tab.Screen name="Dashboard" component={DashboardScreen} />
//         <Tab.Screen name="Timer" component={TimerScreen} />
//         <Tab.Screen name="Job Entry" component={JobEntryScreen} />
//         <Tab.Screen name="Standup" component={StandupScreen} />
//         <Tab.Screen name="Banks" component={BanksScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case 'Status':
                  iconName = 'dashboard';
                  break;
                case 'Dashboard':
                  iconName = 'analytics';
                  break;
                case 'Timer':
                  iconName = 'timer';
                  break;
                case 'Job Entry':
                  iconName = 'work';
                  break;
                case 'Standup':
                  iconName = 'groups';
                  break;
                case 'Banks':
                  iconName = 'account-balance';
                  break;
                default:
                  iconName = 'help-outline';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007BFF',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Status" component={StatusScreen} />
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Timer" component={TimerScreen} />
          <Tab.Screen name="Job Entry" component={JobEntryScreen} />
          <Tab.Screen name="Standup" component={StandupScreen} />
          <Tab.Screen name="Banks" component={BanksScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default App;