import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addCategory } from '../reducers/taskReducer';

export default function JobEntryScreen({ navigation }) {
    const [category, setCategory] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = () => {
        if (category.trim()) {
            dispatch(addCategory(category));
            navigation.navigate('Timer', { category });
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter job category"
                value={category}
                onChangeText={setCategory}
            />
            <Button title="Start Timer" onPress={handleSubmit} />
            <Button title="View Dashboard" onPress={() => navigation.navigate('Dashboard')} />
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