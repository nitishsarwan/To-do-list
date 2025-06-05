import axios from 'axios';

// Action Types
export const FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAIL = 'FETCH_TASKS_FAIL';

export const ADD_TASK_REQUEST = 'ADD_TASK_REQUEST';
export const ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS';
export const ADD_TASK_FAIL = 'ADD_TASK_FAIL';

export const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_FAIL = 'UPDATE_TASK_FAIL';

export const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAIL = 'DELETE_TASK_FAIL';

// Fetch all tasks (for saga)
export const fetchTasks = () => ({
  type: FETCH_TASKS_REQUEST
});

// Add a new task (for saga)
export const addTask = (title, description) => ({
  type: ADD_TASK_REQUEST,
  payload: { title, description }
});

// Update a task (for saga)
export const updateTask = (taskId, title, description, completed) => ({
  type: UPDATE_TASK_REQUEST,
  payload: { taskId, title, description, completed }
});

// Delete a task (for saga)
export const deleteTask = (taskId) => ({
  type: DELETE_TASK_REQUEST,
  payload: taskId
});