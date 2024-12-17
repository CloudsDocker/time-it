import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function DashboardScreen({ navigation }) {
    const completedPomodoros = useSelector(state => state.tasks.completedPomodoros);

    const pomodorosByDay = completedPomodoros.reduce((acc, pomodoro) => {
        const date = new Date(pomodoro.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pomodoros Completed</Text>
            <FlatList
                data={Object.entries(pomodorosByDay)}
                keyExtractor={item => item[0]}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text>Date: {item[0]}</Text>
                        <Text>Count: {item[1]}</Text>
                    </View>
                )}
            />
            <Button title="Generate Standup Notes" onPress={() => navigation.navigate('Standup')} />
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