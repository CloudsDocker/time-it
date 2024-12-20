import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './reducers/taskReducer';
import JobEntryScreen from './screens/JobEntryScreen';
import TimerScreen from './screens/TimerScreen';
import DashboardScreen from './screens/DashboardScreen';
import StandupScreen from './screens/StandupScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

function HomeScreen() {
  const [apiStatus, setApiStatus] = useState('');
  const [statusColor, setStatusColor] = useState('gray');
  const [host, setHost] = useState('http://localhost:8123/ls');

  useEffect(() => {
    const fetchApiStatus = async () => {
      try {
        const response = await axios.get(host);
        if (response.status === 200) {
          setApiStatus('API is healthy');
          setStatusColor('green');
        } else {
          setApiStatus('API warning');
          setStatusColor('yellow');
        }
      } catch (error) {
        setApiStatus('API error');
        setStatusColor('red');
      }
    };

    fetchApiStatus();
  }, [host]);

  return (
    <View style={styles.container}>
      <View style={styles.apiStatusSection}>
        <Text style={[styles.apiStatusText, { color: statusColor }]}>{apiStatus}</Text>
      </View>
      <View style={styles.contentSection}>
        <Text>Welcome to the Home Screen!</Text>
      </View>
    </View>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'JobEntry') {
            iconName = 'work';
          } else if (route.name === 'Timer') {
            iconName = 'timer';
          } else if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Standup') {
            iconName = 'notes';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="JobEntry" component={JobEntryScreen} options={{ title: 'Enter Job' }} />
      <Tab.Screen name="Timer" component={TimerScreen} options={{ title: 'Pomodoro Timer' }} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Standup" component={StandupScreen} options={{ title: 'Standup Notes' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppTabs />
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
  apiStatusSection: {
    marginBottom: 20,
  },
  apiStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
