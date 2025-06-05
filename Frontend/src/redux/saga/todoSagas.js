import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAIL,
  ADD_TASK_REQUEST,
  ADD_TASK_SUCCESS,
  ADD_TASK_FAIL,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAIL
} from '../actions/todoAction';

// Worker: Fetch Tasks
function* fetchTasksWorker() {
  try {
    const res = yield call(axios.get, 'http://127.0.0.1:5000/api/v1/tasks/getAllTasks', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    yield put({ type: FETCH_TASKS_SUCCESS, payload: res.data.tasks || [] });
  } catch (err) {
    yield put({
      type: FETCH_TASKS_FAIL,
      payload: err.response ? err.response.data.error : 'Failed to fetch tasks'
    });
  }
}

// Worker: Add Task
function* addTaskWorker(action) {
  try {
    const res = yield call(axios.post, 'http://127.0.0.1:5000/api/v1/tasks/createTask', action.payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    yield put({ type: ADD_TASK_SUCCESS, payload: [] });
  } catch (err) {
    yield put({
      type: ADD_TASK_FAIL,
      payload: err.response ? err.response.data.error : 'Failed to add task'
    });
  }
}

// Worker: Update Task
function* updateTaskWorker(action) {
  try {
    const { taskId, ...rest } = action.payload;
    const res = yield call(
      axios.put,
      `http://127.0.0.1:5000/api/v1/tasks/updateTask/${taskId}`,
      rest,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    yield put({ type: UPDATE_TASK_SUCCESS, payload: res.data.task });
  } catch (err) {
    yield put({
      type: UPDATE_TASK_FAIL,
      payload: err.response ? err.response.data.error : 'Failed to update task'
    });
  }
}

// Worker: Delete Task
function* deleteTaskWorker(action) {
  try {
    yield call(
      axios.delete,
      `http://127.0.0.1:5000/api/v1/tasks/deleteTask/${action.payload}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    yield put({ type: DELETE_TASK_SUCCESS, payload: action.payload });
  } catch (err) {
    yield put({
      type: DELETE_TASK_FAIL,
      payload: err.response ? err.response.data.error : 'Failed to delete task'
    });
  }
}

// Watchers
export default function* todoSagas() {
  yield takeLatest(FETCH_TASKS_REQUEST, fetchTasksWorker);
  yield takeLatest(ADD_TASK_REQUEST, addTaskWorker);
  yield takeLatest(UPDATE_TASK_REQUEST, updateTaskWorker);
  yield takeLatest(DELETE_TASK_REQUEST, deleteTaskWorker);
}