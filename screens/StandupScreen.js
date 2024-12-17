import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function StandupScreen() {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const completedPomodoros = useSelector(state => state.tasks.completedPomodoros);

    const generateSummary = async () => {
        setLoading(true);
        try {
            const response = await fetch('YOUR_PYTHON_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tasks: completedPomodoros,
                }),
            });
            const data = await response.json();
            setSummary(data.summary);
        } catch (error) {
            console.error('Error generating summary:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Generate Summary" onPress={generateSummary} />
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Text style={styles.summary}>{summary}</Text>
            )}
        </View>
    );
}

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
    },
});