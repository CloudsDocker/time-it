import { createStore } from 'redux';
import { combineReducers } from 'redux';
import tasksReducer from './store/tasksReducer';

// Example reducer
const initialState = {};
const exampleReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  example: exampleReducer,
  tasks: tasksReducer,
});

const store = createStore(rootReducer);

export default store;
