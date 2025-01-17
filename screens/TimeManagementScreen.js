import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const STORAGE_KEY = '@time_management_tasks';

const TimeManagementScreen = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [taskInput, setTaskInput] = useState('');
    const [tasks, setTasks] = useState({});
    const [timer, setTimer] = useState(null);

    // Load saved tasks on mount
    useEffect(() => {
        loadTasks();
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timeInterval);
    }, []);

    // Load tasks from AsyncStorage
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

    // Save tasks to AsyncStorage
    const saveTasks = async (newTasks) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    // Generate time slots
    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        now.setMinutes(Math.floor(now.getMinutes() / 30) * 30);
        now.setSeconds(0);

        for (let i = 0; i < 8; i++) {
            const slotTime = new Date(now.getTime() + i * 30 * 60000);
            slots.push(slotTime);
        }
        return slots;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatTimeSlot = (startTime) => {
        const endTime = new Date(startTime.getTime() + 30 * 60000);
        return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    };

    const handleSlotSelect = (time) => {
        setSelectedSlot(time);
        setTaskInput(tasks[time.getTime()] || '');

        // If there's an existing timer, clear it
        if (timer) {
            clearInterval(timer);
        }
    };

    const handleSaveTask = async () => {
        if (selectedSlot && taskInput.trim()) {
            const newTasks = {
                ...tasks,
                [selectedSlot.getTime()]: taskInput.trim()
            };
            setTasks(newTasks);
            await saveTasks(newTasks);

            // Start 30-minute timer
            startTimer();

            // Clear input and selection
            setTaskInput('');
            setSelectedSlot(null);
        }
    };

    const startTimer = () => {
        let timeLeft = 30 * 60; // 30 minutes in seconds
        const newTimer = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft <= 0) {
                clearInterval(newTimer);
            }
        }, 1000);
        setTimer(newTimer);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Current Time Display */}
            <View style={styles.header}>
                <Icon name="clock-outline" size={24} color="#007AFF" />
                <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
            </View>

            <View style={styles.content}>
                {/* Time Slots */}
                <View style={styles.timeSlots}>
                    <Text style={styles.sectionTitle}>Time Slots</Text>
                    <ScrollView style={styles.scrollView}>
                        {generateTimeSlots().map((time) => (
                            <TouchableOpacity
                                key={time.getTime()}
                                style={[
                                    styles.timeSlot,
                                    selectedSlot?.getTime() === time.getTime() && styles.selectedSlot
                                ]}
                                onPress={() => handleSlotSelect(time)}
                            >
                                <Text style={styles.timeSlotText}>{formatTimeSlot(time)}</Text>
                                {tasks[time.getTime()] && (
                                    <View style={styles.taskIndicator}>
                                        <Text style={styles.taskText} numberOfLines={1}>
                                            {tasks[time.getTime()]}
                                        </Text>
                                        <Icon name="check" size={20} color="#4CAF50" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Task Input Section */}
                <View style={styles.taskInput}>
                    <Text style={styles.sectionTitle}>Task Details</Text>
                    <TextInput
                        style={styles.input}
                        value={taskInput}
                        onChangeText={setTaskInput}
                        placeholder="Enter task description..."
                        multiline
                        disabled={!selectedSlot}
                    />
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            (!selectedSlot || !taskInput.trim()) && styles.disabledButton
                        ]}
                        onPress={handleSaveTask}
                        disabled={!selectedSlot || !taskInput.trim()}
                    >
                        <Text style={styles.saveButtonText}>Save Task</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    currentTime: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 8,
        color: '#007AFF',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    timeSlots: {
        flex: 1,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333333',
    },
    scrollView: {
        flex: 1,
    },
    timeSlot: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedSlot: {
        borderColor: '#007AFF',
        backgroundColor: '#F0F8FF',
    },
    timeSlotText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
    },
    taskIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    taskText: {
        flex: 1,
        fontSize: 14,
        color: '#666666',
        marginRight: 8,
    },
    taskInput: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    input: {
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