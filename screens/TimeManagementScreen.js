import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';

const STORAGE_KEY = '@time_management_tasks';

const TimeManagementScreen = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [taskInput, setTaskInput] = useState('');
    const [tasks, setTasks] = useState({});

    // Generate time slots once and memoize them to prevent regeneration on each render
    const timeSlots = useMemo(() => {
        const slots = [];
        const now = new Date();
        now.setMinutes(Math.floor(now.getMinutes() / 30) * 30);
        now.setSeconds(0);

        for (let i = 0; i < 8; i++) {
            const slotTime = new Date(now.getTime() + i * 30 * 60000);
            slots.push({
                timestamp: slotTime.getTime().toString(),
                label: formatTimeSlot(slotTime)
            });
        }
        return slots;
    }, [currentTime]); // Only regenerate when currentTime changes

    useEffect(() => {
        loadTasks();
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timeInterval);
    }, []);

    const loadTasks = async () => {
        try {
            const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks));
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const saveTasks = async (newTasks) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    // Format time consistently for display
    const formatTime = (date) => {
        return new Date(parseInt(date)).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Format time slot range with proper handling of date objects
    const formatTimeSlot = (startTime) => {
        const endTime = new Date(startTime.getTime() + 30 * 60000);
        return `${formatTime(startTime.getTime().toString())} - ${formatTime(endTime.getTime().toString())}`;
    };

    // Handle time slot selection with proper state updates
    const handleTimeSlotChange = (timestamp) => {
        // Prevent the picker from resetting by checking if the value is valid
        if (timestamp) {
            setSelectedTimeSlot(timestamp);
            setTaskInput(tasks[parseInt(timestamp)] || '');
        }
    };

    // Save task with proper state cleanup
    const handleSaveTask = async () => {
        if (selectedTimeSlot && taskInput.trim()) {
            const timeStamp = parseInt(selectedTimeSlot);
            const newTasks = {
                ...tasks,
                [timeStamp]: taskInput.trim()
            };
            setTasks(newTasks);
            await saveTasks(newTasks);
            // Don't reset selectedTimeSlot here to maintain picker selection
            setTaskInput('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/busan_capsule.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    enableOnAndroid={true}
                    extraScrollHeight={100}
                >
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Icon name="clock-outline" size={24} color="#007AFF" />
                            <Text style={styles.currentTime}>
                                {formatTime(currentTime.getTime().toString())}
                            </Text>
                        </View>

                        <View style={styles.content}>
                            <View style={styles.pickerContainer}>
                                <Text style={styles.sectionTitle}>Select Time Slot</Text>
                                <View style={styles.picker}>
                                    <Picker
                                        selectedValue={selectedTimeSlot}
                                        onValueChange={handleTimeSlotChange}
                                        mode="dropdown"
                                    >
                                        <Picker.Item 
                                            label="Select a time slot" 
                                            value="" 
                                            enabled={!selectedTimeSlot} // Disable default option once a selection is made
                                        />
                                        {timeSlots.map((slot) => (
                                            <Picker.Item
                                                key={slot.timestamp}
                                                label={`${slot.label}${tasks[parseInt(slot.timestamp)] ? ' (Task Added)' : ''}`}
                                                value={slot.timestamp}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.taskInput}>
                                <Text style={styles.sectionTitle}>Task Details</Text>
                                <TextInput
                                    style={styles.input}
                                    value={taskInput}
                                    onChangeText={setTaskInput}
                                    placeholder="What did you work on during this time?"
                                    multiline
                                    editable={!!selectedTimeSlot}
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.saveButton,
                                        (!selectedTimeSlot || !taskInput.trim()) && styles.disabledButton
                                    ]}
                                    onPress={handleSaveTask}
                                    disabled={!selectedTimeSlot || !taskInput.trim()}
                                >
                                    <Text style={styles.saveButtonText}>Save Task</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        marginBottom: 16,
    },
    currentTime: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 8,
        color: '#007AFF',
    },
    content: {
        flex: 1,
        gap: 16,
    },
    pickerContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 16,
        borderRadius: 8,
    },
    picker: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333333',
    },
    taskInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 16,
        borderRadius: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TimeManagementScreen;