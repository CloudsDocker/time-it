import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback, ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const STORAGE_KEY = '@time_management_tasks';

const TimeManagementScreen = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    // Store the selected time as a timestamp for reliable comparison
    const [selectedTimeStamp, setSelectedTimeStamp] = useState(null);
    const [taskInput, setTaskInput] = useState('');
    const [tasks, setTasks] = useState({});
    const [timer, setTimer] = useState(null);

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

    // Update the handler to work with timestamps
    const handleSlotSelect = (time) => {
        const timeStamp = time.getTime();
        setSelectedTimeStamp(timeStamp);
        setTaskInput(tasks[timeStamp] || '');
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
            startTimer();
            setTaskInput('');
            setSelectedSlot(null);
        }
    };

    const startTimer = () => {
        let timeLeft = 30 * 60;
        const newTimer = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft <= 0) {
                clearInterval(newTimer);
            }
        }, 1000);
        setTimer(newTimer);
    };

    // In the render section, we'll use the timestamp for comparison
    const renderTimeSlots = () => {
        return generateTimeSlots().map((time) => {
            const timeStamp = time.getTime();
            const isSelected = selectedTimeStamp === timeStamp;
            const hasTask = Boolean(tasks[timeStamp]);

            return (
                <TouchableOpacity
                    key={timeStamp}
                    activeOpacity={0.9} // Reduce the default opacity change on press
                    style={[
                        styles.timeSlot,
                        hasTask && styles.filledSlot,
                        isSelected && styles.selectedSlot,
                    ]}
                    onPress={() => handleSlotSelect(time)}
                >
                    <Text style={[
                        styles.timeSlotText,
                        isSelected && styles.selectedText
                    ]}>
                        {formatTimeSlot(time)}
                    </Text>
                    {hasTask && (
                        <View style={styles.taskIndicator}>
                            <Text style={[
                                styles.taskText,
                                isSelected && styles.selectedText
                            ]} numberOfLines={1}>
                                {tasks[timeStamp]}
                            </Text>
                            <Icon
                                name="check"
                                size={20}
                                color={isSelected ? "#FFFFFF" : "#4CAF50"}
                            />
                        </View>
                    )}
                </TouchableOpacity>
            );
        });
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
                            <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
                        </View>

                        <View style={styles.content}>
                            <View style={styles.timeSlots}>
                                <Text style={styles.sectionTitle}>Time Slots</Text>
                                <ScrollView style={styles.scrollView}>
                                    {renderTimeSlots()}
                                </ScrollView>
                            </View>

                            <View style={styles.taskInput}>
                                <Text style={styles.sectionTitle}>Task Details</Text>
                                <TextInput
                                    style={styles.input}
                                    value={taskInput}
                                    onChangeText={setTaskInput}
                                    placeholder="Enter task description..."
                                    multiline
                                    editable={!!selectedTimeStamp}
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.saveButton,
                                        (!selectedTimeStamp || !taskInput.trim()) && styles.disabledButton
                                    ]}
                                    onPress={handleSaveTask}
                                    disabled={!selectedTimeStamp || !taskInput.trim()}
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for readability
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
    timeSlot: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedSlot: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
        // Add subtle elevation for better visual feedback
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    filledSlot: {
        borderColor: '#4CAF50',
    },
    timeSlotText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
    },
    selectedText: {
        color: '#FFFFFF',
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
