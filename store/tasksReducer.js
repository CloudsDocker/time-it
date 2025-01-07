const initialState = {
    completedPomodoros: [], // Example initial state
};

const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_POMODORO':
            return {
                ...state,
                completedPomodoros: [...state.completedPomodoros, action.payload],
            };
        default:
            return state;
    }
};

export default tasksReducer;
