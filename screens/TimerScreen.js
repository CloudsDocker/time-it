import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addPomodoro } from '../reducers/taskReducer';
export default function TimerScreen({ route, navigation }) {
    const { category = 'General' } = route.params || {}; // Default to 'General' if route.params is undefined
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            dispatch(addPomodoro({ category, duration: 25 }));
            navigation.navigate('Dashboard');
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    return (
        <View style={styles.container}>
            <Text style={styles.category}>Category: {category}</Text>
            <Text style={styles.timer}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Text>
            <Button title={isActive ? "Pause" : "Start"} onPress={() => setIsActive(!isActive)} />
        </View>
    );
}
// Add this at the bottom of your component file
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    timer: {
        fontSize: 48,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    category: {
        fontSize: 18,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    summary: {
        marginTop: 20,
        fontSize: 16,
        lineHeight: 24,
    }
});