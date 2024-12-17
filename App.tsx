import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './reducers/taskReducer';
import JobEntryScreen from './screens/JobEntryScreen';
import TimerScreen from './screens/TimerScreen';
import DashboardScreen from './screens/DashboardScreen';
import StandupScreen from './screens/StandupScreen';

const Stack = createNativeStackNavigator();
const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

export default function App() {
  return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="JobEntry" component={JobEntryScreen} options={{ title: 'Enter Job' }} />
            <Stack.Screen name="Timer" component={TimerScreen} options={{ title: 'Pomodoro Timer' }} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
            <Stack.Screen name="Standup" component={StandupScreen} options={{ title: 'Standup Notes' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
  );
}