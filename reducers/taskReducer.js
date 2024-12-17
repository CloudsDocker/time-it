import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        completedPomodoros: [],
        categories: [],
    },
    reducers: {
        addPomodoro: (state, action) => {
            state.completedPomodoros.push({
                ...action.payload,
                timestamp: new Date().toISOString(),
            });
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
    },
});

export const { addPomodoro, addCategory } = taskSlice.actions;
export default taskSlice.reducer;